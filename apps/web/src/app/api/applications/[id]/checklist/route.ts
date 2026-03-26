import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess } from '@/lib/auth';

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

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden — only admins can add checklist items' }, { status: 403 });
        }

        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== 'string' || !text.trim()) {
            return NextResponse.json({ error: 'text is required' }, { status: 400 });
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { id: true, studentId: true },
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const hasAccess = await verifyStudentAccess(application.studentId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const item = await prisma.checklistItem.create({
            data: {
                applicationId,
                text: text.trim(),
                isCompleted: false,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error('Checklist POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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

        const items = await prisma.checklistItem.findMany({
            where: { applicationId },
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error('Checklist GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
