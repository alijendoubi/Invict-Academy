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

        console.log(`[DEBUG] Applications GET - User: ${session.user.email}, Role: ${role}, isManagement: ${isManagement}`);

        const where: any = {};

        if (isStaff) {
            // Staff only sees assigned students' applications
            where.student = { assignedToId: session.user.id };
        } else if (!isManagement) {
            // Student only sees their own
            const userId = session.user.id || session.user?.id;
            if (!userId) {
                return NextResponse.json([]);
            }

            const profile = await prisma.studentProfile.findUnique({
                where: { userId },
                select: { id: true },
            });
            if (!profile) {
                return NextResponse.json([]);
            }
            where.studentId = profile.id;
        }

        const applications = await prisma.application.findMany({
            where,
            include: {
                student: {
                    include: {
                        user: {
                            select: { firstName: true, lastName: true }
                        }
                    }
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
        const {
            studentId,
            universityName,
            courseName,
            type,
            status,
            country,
            intakeTerm,
            deadline
        } = body;

        let finalStudentId = studentId;

        // If user is a student, securely infer their ID and ignore frontend payloads
        if (session.user.role === 'STUDENT') {
            const userId = session.user.id || session.user?.id;
            if (!userId) {
                return NextResponse.json({ error: 'User ID missing' }, { status: 401 });
            }

            const profile = await prisma.studentProfile.findUnique({
                where: { userId },
                select: { id: true },
            });
            if (!profile) {
                return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
            }
            finalStudentId = profile.id;
        } else {
            // Admins must explicitly provide the student ID
            if (!finalStudentId) {
                return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
            }
        }

        const application = await prisma.application.create({
            data: {
                studentId: finalStudentId,
                university: universityName,
                program: courseName,
                country: country || "Italy",
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
