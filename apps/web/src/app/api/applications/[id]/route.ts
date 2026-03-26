import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess, logAudit } from '@/lib/auth';
import { emailService } from '@/lib/email';
export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                student: {
                    include: {
                        user: {
                            select: { firstName: true, lastName: true, email: true },
                        },
                    },
                },
                checklistItems: { orderBy: { text: 'asc' } },
                tasks: { orderBy: { createdAt: 'desc' } },
                stepLogs: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status, intakeTerm, deadline, university, program, country } = body;

        const application = await prisma.application.findUnique({
            where: { id },
            select: { studentId: true, status: true, university: true, program: true },
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const hasAccess = await verifyStudentAccess(application.studentId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (intakeTerm) updateData.intakeTerm = intakeTerm;
        if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
        if (university) updateData.university = university;
        if (program) updateData.program = program;
        if (country) updateData.country = country;

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: updateData,
            include: {
                student: {
                    include: {
                        user: { select: { email: true, firstName: true } },
                    },
                },
            },
        });

        // ── Auto-sync student profile status ──────────────────────────────────
        if (status && isAdmin) {
            const statusMap: Record<string, 'ACTIVE' | 'APPLYING' | 'ACCEPTED' | 'VISA_IN_PROGRESS' | 'DEPARTED' | 'ARRIVED' | 'COMPLETED'> = {
                DRAFT: 'ACTIVE',
                DOCUMENTS_PENDING: 'ACTIVE',
                SUBMITTED: 'APPLYING',
                UNDER_REVIEW: 'APPLYING',
                APPROVED: 'ACCEPTED',
                REJECTED: 'ACTIVE',
            };
            const newStudentStatus = statusMap[status];
            if (newStudentStatus) {
                await prisma.studentProfile.update({
                    where: { id: application.studentId },
                    data: { status: newStudentStatus },
                });
            }
        }

        // ── Send status update email to student ────────────────────────────────
        if (status) {
            try {
                const studentEmail = updatedApplication.student?.user?.email;
                const studentFirstName = updatedApplication.student?.user?.firstName || 'Student';
                const universityName = updatedApplication.university || 'your university';
                if (studentEmail) {
                    await emailService.sendApplicationStatusUpdate(studentEmail, studentFirstName, universityName, status);
                }
            } catch (emailError) {
                console.error('Failed to send application status email:', emailError);
            }
        }

        if (Object.keys(updateData).length > 0) {
            await logAudit('UPDATE_APPLICATION', 'Application', id, `Updated application fields: ${Object.keys(updateData).join(', ')}`);
        }

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Application details PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
