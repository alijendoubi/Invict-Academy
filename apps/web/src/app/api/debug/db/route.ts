import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const studentCount = await prisma.studentProfile.count();
        const userCount = await prisma.user.count();
        const userRoles = await prisma.user.groupBy({
            by: ['role'],
            _count: { id: true }
        });

        const firstStudents = await prisma.studentProfile.findMany({
            take: 5,
            include: { user: { select: { email: true, role: true } } }
        });

        return NextResponse.json({
            studentCount,
            userCount,
            userRoles,
            firstStudents,
            dbUrlExists: !!process.env.DATABASE_URL,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
