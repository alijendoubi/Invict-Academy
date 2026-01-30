import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import * as bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15m
        const session = await encrypt({ user: { id: user.id, email: user.email, role: user.role } }, '15m');
        const refreshToken = await encrypt({ user: { id: user.id } }, '7d');

        // Store refresh token in DB
        await prisma.session.create({
            data: {
                userId: user.id,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        const response = NextResponse.json({ success: true, user: { id: user.id, role: user.role } });

        response.cookies.set('session', session, { expires, httpOnly: true, secure: true, sameSite: 'lax' });
        response.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'lax' });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
