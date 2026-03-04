import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                checklistItems: {
                    orderBy: { text: 'asc' }
                },
                tasks: {
                    orderBy: { createdAt: 'desc' }
                },
                stepLogs: {
                    orderBy: { createdAt: 'desc' }
                }
            },
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // Access Control: Only the owner student or Admin/Staff roles
        const isStudent = session.user.role === 'STUDENT';
        if (isStudent) {
            const profile = await prisma.studentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true }
            });
            if (!profile || profile.id !== application.studentId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        return NextResponse.json(application);
    } catch (error) {
        console.error('Application details GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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
        const { status, intakeTerm, deadline, university, program, country } = body;

        // Fetch application for permission check
        const application = await prisma.application.findUnique({
            where: { id },
            select: { studentId: true }
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const isStudent = session.user.role === 'STUDENT';
        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

        if (isStudent) {
            const profile = await prisma.studentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true }
            });
            if (!profile || profile.id !== application.studentId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        // Only admins can change status? Or maybe students can change intake/etc?
        // Let's allow updates for now with proper checks.

        const updateData: any = {};
        if (status && isAdmin) updateData.status = status;
        if (intakeTerm) updateData.intakeTerm = intakeTerm;
        if (deadline) updateData.deadline = new Date(deadline);
        if (university) updateData.university = university;
        if (program) updateData.program = program;
        if (country) updateData.country = country;

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Application details PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
