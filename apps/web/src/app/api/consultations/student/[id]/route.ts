import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { verifyStudentAccess } = await import('@/lib/auth');
        const hasAccess = await verifyStudentAccess(id);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const consultations = await prisma.consultation.findMany({
            where: { studentId: id },
            orderBy: { scheduledAt: 'asc' },
        });

        return NextResponse.json(consultations);
    } catch (error) {
        console.error('Consultations GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
