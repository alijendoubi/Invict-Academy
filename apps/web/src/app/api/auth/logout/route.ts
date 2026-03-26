import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (token) {
        await prisma.session.deleteMany({ where: { refreshToken: token } }).catch(() => {});
    }
    cookieStore.delete('session');

    return NextResponse.json({ success: true });
}
