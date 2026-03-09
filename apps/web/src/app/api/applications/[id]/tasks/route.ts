import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: applicationId } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const { title, description, priority, dueDate } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        // Permission check: only admin/staff or the student of the application can add tasks
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { studentId: true }
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        const isStudent = session.user.role === 'STUDENT';

        let hasAccess = false;
        if (isAdmin) {
            hasAccess = true;
        } else if (isStudent) {
            const profile = await prisma.studentProfile.findUnique({
                where: { userId: session.user.id },
                select: { id: true }
            });
            if (profile && profile.id === application.studentId) hasAccess = true;
        }

        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null,
                applicationId,
                creatorId: session.user.id,
                status: 'TODO'
            }
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Task POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
