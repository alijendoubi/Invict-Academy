import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';

// ─── Demo accounts — always active regardless of DB state ────────
const DEMO_ACCOUNTS: Record<string, { password: string; role: string; firstName: string; lastName: string }> = {
    'admin@invict.academy': { password: 'demo123', role: 'ADMIN', firstName: 'Demo', lastName: 'Administrator' },
    'student@invict.academy': { password: 'demo123', role: 'STUDENT', firstName: 'Demo', lastName: 'Student' },
    'admin': { password: 'admin', role: 'ADMIN', firstName: 'Demo', lastName: 'Administrator' },
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // ─── 1. Check demo credentials first (always works, no DB needed) ───
        const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()];
        if (demoAccount && demoAccount.password === password) {
            const userId = `demo-${email.replace(/[@.]/g, '-')}`;
            const user = { id: userId, email, role: demoAccount.role };

            const session = await encrypt({ user }, '7d');

            const response = NextResponse.json({
                success: true,
                user: { id: userId, role: demoAccount.role, email }
            });

            response.cookies.set('session', session, {
                maxAge: 7 * 24 * 60 * 60,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });

            return response;
        }

        // ─── 2. Real DB login (only when DB is configured) ──────────────────
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
