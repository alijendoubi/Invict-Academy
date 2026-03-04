import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess, logAudit } from '@/lib/auth';

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

        // Access Control
        const hasAccess = await verifyStudentAccess(application.studentId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

        const hasAccess = await verifyStudentAccess(application.studentId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

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

        await logAudit('UPDATE_APPLICATION', 'Application', id, `Updated application fields: ${Object.keys(updateData).join(', ')}`);

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Application details PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
