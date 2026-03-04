import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

function generatePassword(length = 12) {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isSuperAdmin = session.user.role === 'SUPER_ADMIN';
        if (!isSuperAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { firstName, lastName, email, role } = body;

        if (!firstName || !lastName || !email || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
        }

        const tempPassword = generatePassword();
        const hashedPassword = await hash(tempPassword, 10);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role as any,
            },
            select: {
                id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true,
            },
        });

        return NextResponse.json({ user, tempPassword });
    } catch (error) {
        console.error('User invite error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
