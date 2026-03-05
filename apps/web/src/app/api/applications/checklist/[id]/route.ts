import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { isCompleted } = await request.json();

        // Check permission: Checklist items belong to applications which belong to students.
        const item = await prisma.checklistItem.findUnique({
            where: { id },
            include: {
                application: {
                    select: { studentId: true }
                }
            }
        });

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        const isStudent = session.user.role === 'STUDENT';
        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

        if (isStudent) {
            const profile = await prisma.studentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true }
            });
            if (!profile || profile.id !== item.application.studentId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const updated = await prisma.checklistItem.update({
            where: { id },
            data: { isCompleted }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Checklist PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
