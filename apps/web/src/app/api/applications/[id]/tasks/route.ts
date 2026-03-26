import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: applicationId } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tasks = await prisma.task.findMany({
            where: { applicationId },
            include: {
                assignedTo: {
                    select: { firstName: true, lastName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Tasks GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden — only admins can create tasks' }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, priority, assignedToId, dueDate } = body;

        if (!title || typeof title !== 'string' || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { id: true },
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description || undefined,
                priority: priority || 'MEDIUM',
                status: 'TODO',
                applicationId,
                creatorId: session.user.id,
                assignedToId: assignedToId || undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('Task POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
