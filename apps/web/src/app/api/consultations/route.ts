import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

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

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        if (!student.phone?.trim()) {
            return NextResponse.json({ error: 'Student must have a phone number for consultation scheduling' }, { status: 400 });
        }

        const consultation = await prisma.consultation.create({
            data: {
                studentId,
                scheduledAt: new Date(scheduledAt),
                notes,
                whatsappPhone: student.phone.trim(),
            }
        });

        return NextResponse.json({ success: true, consultation });
    } catch (error) {
        console.error('Consultation creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
