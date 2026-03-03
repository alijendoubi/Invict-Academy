import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // ─── Real DB login ──────────────────
        try {
            const { prisma } = await import('@/lib/db');
            const bcrypt = await import('bcryptjs');

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
            }

            const session = await encrypt({ user: { id: user.id, email: user.email, role: user.role } }, '7d');

            try {
                await prisma.session.create({
                    data: {
                        userId: user.id,
                        refreshToken: session,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            } catch {
                // Session storage optional
            }

            const response = NextResponse.json({ success: true, user: { id: user.id, role: user.role, email: user.email, requiresPasswordChange: user.requiresPasswordChange } });
            response.cookies.set('session', session, {
                maxAge: 7 * 24 * 60 * 60,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            return response;

        } catch (dbError: any) {
            // Log the full error for Vercel function logs
            console.error('DB login failed:', dbError?.message || dbError);
            console.error('DB error code:', dbError?.code);
            console.error('DATABASE_URL set:', !!process.env.DATABASE_URL);
            console.error('DIRECT_URL set:', !!process.env.DIRECT_URL);
            return NextResponse.json(
                { error: `DB error: ${dbError?.message || 'unknown'}` },
                { status: 503 }
            );
        }

    } catch (error) {
        console.error('Login route error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
