import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any, expiresIn = '15m') {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function getSession() {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    try {
        const payload = await decrypt(session);
        const userId = payload?.user?.id;
        return { ...payload, userId };
    } catch (error) {
        return null;
    }
}

export async function login(formData: FormData) {
    // Logic moved to API route for better handling but helper exists
}

export async function logout() {
    cookies().delete('session');
    cookies().delete('refresh_token');
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;
    // Refresh logic here if needed
}
