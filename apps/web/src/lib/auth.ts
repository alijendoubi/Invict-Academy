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
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    try {
        const payload = await decrypt(session);
        const userId = payload?.user?.id;
        return { ...payload, userId };
    } catch (error) {
        return null;
    }
}

export async function hasRole(allowedRoles: string[]) {
    const session = await getSession();
    if (!session) return false;
    return allowedRoles.includes(session.user.role);
}

/**
 * Gets the student profile ID for the current authenticated user.
 */
export async function getStudentProfileId() {
    const session = await getSession();
    if (!session || session.user.role !== 'STUDENT') return null;

    const { prisma } = await import('@/lib/db');
    const profile = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
        select: { id: true }
    });
    return profile?.id || null;
}

/**
 * Verifies if the current user has access to a specific student's data.
 * - ADMIN/SUPER_ADMIN: Always true
 * - STAFF: True if the student is assigned to them (planned)
 * - STUDENT: True if it's their own ID
 */
export async function verifyStudentAccess(studentId: string) {
    const session = await getSession();
    if (!session) return false;

    const role = session.user.role;
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true;

    if (role === 'STUDENT') {
        const myProfileId = await getStudentProfileId();
        return myProfileId === studentId;
    }

    if (role === 'STAFF') {
        const { prisma } = await import('@/lib/db');
        const profile = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            select: { assignedToId: true }
        });

        // Staff has access if the student is assigned to them
        return profile?.assignedToId === session.userId;
    }

    return false;
}

export async function login(formData: FormData) {
    // Logic moved to API route for better handling but helper exists
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    cookieStore.delete('refresh_token');
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;
    // Refresh logic here if needed
}

/**
 * Utility to log audit events.
 */
export async function logAudit(action: string, entity: string, entityId: string, details?: string) {
    const session = await getSession();
    const { prisma } = await import('@/lib/db');

    try {
        await prisma.auditLog.create({
            data: {
                userId: session?.userId || null,
                action,
                entity,
                entityId,
                details
            }
        });
    } catch (error) {
        console.error('Audit Log failed:', error);
    }
}
