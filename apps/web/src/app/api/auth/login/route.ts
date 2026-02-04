import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import * as bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const isDemoMode = process.env.DEMO_MODE === 'true';
        const isDemoCredentials =
            (password === 'demo123' || password === 'admin') &&
            (email === 'admin@invict.academy' || email === 'student@invict.academy');

        if (isDemoMode && isDemoCredentials) {
            // In demo mode with valid demo credentials, skip database and use mock data
            const role = email === 'admin@invict.academy' ? 'ADMIN' : 'STUDENT';
            const user = {
                id: email === 'admin@invict.academy' ? 'admin-demo-id-001' : 'student-demo-id-001',
                email: email,
                role: role,
            };

            const expires = new Date(Date.now() + 15 * 60 * 1000); // 15m
            const session = await encrypt({ user: { id: user.id, email: user.email, role: user.role } }, '15m');
            const refreshToken = await encrypt({ user: { id: user.id } }, '7d');

            try {
                await prisma.session.create({
                    data: {
                        userId: user.id,
                        refreshToken,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            } catch (sessionError) {
                console.warn('Could not store session in DB, continuing with cookie session only');
            }

            const response = NextResponse.json({ success: true, user: { id: user.id, role: user.role } });

            response.cookies.set('session', session, {
                expires,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            response.cookies.set('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });

            return response;
        }


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

        response.cookies.set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
