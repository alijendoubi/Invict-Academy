import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: fetch all messages for the logged-in student (or for a specific student if admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const studentIdParam = searchParams.get('studentId');
        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

        let studentProfileId: string | null = null;

        if (isAdmin && studentIdParam) {
            studentProfileId = studentIdParam;
        } else {
            const profile = await prisma.studentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true },
            });
            studentProfileId = profile?.id ?? null;
        }

        if (!studentProfileId) {
            return NextResponse.json([]);
        }

        const messages = await prisma.studentMessage.findMany({
            where: { studentId: studentProfileId },
            orderBy: { createdAt: 'asc' },
        });

        // Mark unread admin messages as read when student fetches
        if (!isAdmin) {
            const unreadIds = messages
                .filter(m => m.fromAdmin && !m.readAt)
                .map(m => m.id);
            if (unreadIds.length > 0) {
                await prisma.studentMessage.updateMany({
                    where: { id: { in: unreadIds } },
                    data: { readAt: new Date() },
                });
            }
        }

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Messages GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: send a message
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, subject, studentId } = body;

        if (!content?.trim()) {
            return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

        let targetStudentId: string | null = null;

        if (isAdmin && studentId) {
            // Admin sending to a specific student
            targetStudentId = studentId;
        } else if (!isAdmin) {
            // Student sending their own message
            const profile = await prisma.studentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true },
            });
            targetStudentId = profile?.id ?? null;
        }

        if (!targetStudentId) {
            return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
        }

        const message = await prisma.studentMessage.create({
            data: {
                studentId: targetStudentId,
                fromAdmin: isAdmin,
                content: content.trim(),
                subject: subject || null,
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Messages POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
