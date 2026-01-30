import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard'];

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

    if (isProtectedRoute) {
        const cookie = request.cookies.get('session')?.value;
        if (!cookie) {
            return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
        }

        try {
            await decrypt(cookie);
        } catch (err) {
            return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
