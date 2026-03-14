import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard'];
const locales = ['en', 'fr', 'ar', 'tr', 'az'];
const defaultLocale = 'en';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function proxy(request: NextRequest) {
    const { pathname, host } = request.nextUrl;

    // Force non-www on production
    if (host.startsWith('www.')) {
        const nonWwwHost = host.replace('www.', '');
        const newUrl = new URL(pathname, `https://${nonWwwHost}`);
        request.nextUrl.searchParams.forEach((val, key) => newUrl.searchParams.set(key, val));
        return NextResponse.redirect(newUrl, 301);
    }

    // Explicitly bypass sitemaps and robots.txt
    if (pathname.includes('sitemap') || pathname === '/robots.txt') {
        return NextResponse.next();
    }

    // 1. Handle protected routes (Dashboards)
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    if (isProtectedRoute) {
        const cookie = request.cookies.get('session')?.value;
        if (!cookie) {
            return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
        }
        try {
            const payload = await decrypt(cookie);
            const userRole = payload?.user?.role;

            // Define management-only routes
            const managementRoutes = [
                '/dashboard/leads',
                '/dashboard/students',
                '/dashboard/users',
                '/dashboard/associates',
                '/dashboard/admin'
            ];

            const isManagementRoute = managementRoutes.some(route => pathname.startsWith(route));

            if (isManagementRoute && !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(userRole)) {
                // Redirect students to their own dashboard or root dashboard
                // Assuming students have their own specific page or just the overview
                return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
            }

        } catch (err) {
            return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
        }
    }

    // 2. Handle Locale Routing
    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        // Extract the locale from the path
        const locale = pathname.split('/')[1];

        // Remove the locale from the path to route internally
        const newPath = pathname.replace(`/${locale}`, '') || '/';

        // Rewrite to the internal route (e.g., /fr/explore -> /explore)
        const response = NextResponse.rewrite(new URL(newPath, request.nextUrl));

        // Set the locale cookie so the client knows what language to render
        response.cookies.set('invict-locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        return response;
    }

    // If the pathname doesn't have a locale, redirect to a locale-prefixed URL
    // First, try to get the locale from the cookie
    const savedLocale = request.cookies.get('invict-locale')?.value;

    // Fallback to reading Accept-Language header or defaultLocale
    let localeToRedirect = savedLocale || defaultLocale;

    // Ensure the saved cookie is a supported locale
    if (!locales.includes(localeToRedirect)) {
        localeToRedirect = defaultLocale;
    }

    // Redirect to the locale-prefixed path (e.g., /explore -> /en/explore)
    request.nextUrl.pathname = `/${localeToRedirect}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    // Match all request paths except api, _next, files with an extension (e.g. .png, .css), and sitemaps
    matcher: ['/((?!api|_next|sitemap.*\\.xml|.*\\..*).*)'],
};
