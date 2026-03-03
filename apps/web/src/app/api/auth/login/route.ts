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

            const response = NextResponse.json({ success: true, user: { id: user.id, role: user.role, email: user.email } });
            response.cookies.set('session', session, {
                maxAge: 7 * 24 * 60 * 60,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            return response;

        } catch (dbError: any) {
            // DB not configured — reject non-demo credentials
            console.error('DB login failed:', dbError?.message || dbError);
            return NextResponse.json(
                { error: 'Cannot verify credentials — database not configured. Use demo accounts.' },
                { status: 503 }
            );
        }

    } catch (error) {
        console.error('Login route error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
