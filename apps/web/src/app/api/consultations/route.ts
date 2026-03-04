import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { queueService } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { studentId, scheduledAt, notes } = body;

        if (!studentId || !scheduledAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: { user: true }
        });

        if (!student || !student.phone) {
            return NextResponse.json({ error: 'Student or phone number not found' }, { status: 404 });
        }

        const consultation = await prisma.consultation.create({
            data: {
                studentId,
                scheduledAt: new Date(scheduledAt),
                notes,
                whatsappPhone: student.phone,
            }
        });

        // Queue reminder (24 hours before)
        const meetingTime = new Date(scheduledAt).getTime();
        const now = Date.now();
        const reminderTime = meetingTime - (24 * 60 * 60 * 1000);
        let delay = reminderTime - now;

        // If it's already less than 24 hours away, send it in 1 minute
        if (delay < 0) delay = 60 * 1000;

        await queueService.sendNotification({
            type: 'whatsapp',
            userId: student.userId,
            data: {
                consultationId: consultation.id,
                studentName: student.user.firstName,
                scheduledAt: scheduledAt,
                phone: student.phone,
                messageType: 'meeting_reminder'
            }
        }, delay);

        return NextResponse.json({ success: true, consultation });
    } catch (error) {
        console.error('Consultation creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
