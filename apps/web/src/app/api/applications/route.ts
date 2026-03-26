import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.user.role?.toUpperCase();
        const isManagement = ['SUPER_ADMIN', 'ADMIN'].includes(role);
        const isStaff = role === 'STAFF';

        const where: any = {};

        if (isStaff) {
            where.student = { assignedToId: session.user.id };
        } else if (!isManagement) {
            const userId = session.user.id;
            if (!userId) return NextResponse.json([]);
            where.student = { userId };
        }

        const applications = await prisma.application.findMany({
            where,
            include: {
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Applications GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { studentId, university: universityField, universityName, program: programField, courseName, type, status, country, intakeTerm, deadline } = body;
        // The form submits `universityName` and `courseName`; the DB fields are `university` and `program`.
        // We accept both spellings so the API works from any caller. Do not remove the fallback.
        const university = universityField || universityName;
        const program = programField || courseName;

        let finalStudentId = studentId;

        if (session.user.role === 'STUDENT') {
            const userId = session.user.id;
            if (!userId) return NextResponse.json({ error: 'User ID missing' }, { status: 401 });

            const profile = await prisma.studentProfile.findUnique({
                where: { userId },
                select: { id: true },
            });
            if (!profile) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
            finalStudentId = profile.id;
        } else {
            if (!finalStudentId) return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
        }

        const application = await prisma.application.create({
            data: {
                studentId: finalStudentId,
                university: university,
                program: program,
                country: country || 'Italy',
                type: type || 'UNIVERSITY',
                status: status || 'DRAFT',
                intakeTerm: intakeTerm || null,
                deadline: deadline ? new Date(deadline) : null,
            },
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error('Application POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
