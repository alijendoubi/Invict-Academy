import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        const { status, title, description, priority, dueDate } = body;

        const task = await prisma.task.findUnique({
            where: { id },
            include: { application: true }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

        let updateData: any = {};
        if (isAdmin) {
            updateData = {
                status: status || undefined,
                title: title || undefined,
                description: description || undefined,
                priority: priority || undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
            };
        } else {
            // Students can only update status
            updateData = {
                status: status || undefined
            };
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Task PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
