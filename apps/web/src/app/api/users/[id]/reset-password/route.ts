import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

function generatePassword(length = 12) {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const tempPassword = generatePassword();
        await prisma.user.update({
            where: { id },
            data: { password: await hash(tempPassword, 10), requiresPasswordChange: true },
        });

        return NextResponse.json({ tempPassword });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
