import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess, logAudit } from '@/lib/auth';
import { twilioService, TEMPLATES } from '@/lib/twilio';

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

        // ── WhatsApp template notifications on status change ──────────────────
        const statusChanged = status && isAdmin && status !== application.status;
        if (statusChanged) {
            try {
                const student = await prisma.studentProfile.findUnique({
                    where: { id: application.studentId },
                    include: { user: { select: { firstName: true } } },
                });

                const phone = student?.phone;
                const firstName = student?.user.firstName || 'Student';
                const uniName = university || application.university || 'your university';
                const progName = program || application.program || 'your programme';

                if (phone) {
                    if (status === 'APPROVED') {
                        // Application Accepted
                        await twilioService.sendTemplate(
                            phone,
                            TEMPLATES.APPLICATION_ACCEPTED,
                            {
                                '1': firstName,
                                '2': uniName,
                            }
                        );
                    } else if (status === 'DOCUMENTS_PENDING') {
                        // Documents Needed
                        await twilioService.sendTemplate(
                            phone,
                            TEMPLATES.DOCUMENTS_NEEDED,
                            {
                                '1': firstName,
                                '2': uniName,
                            }
                        );
                    }
                }
            } catch (notifyError) {
                console.error('Application status notification failed (non-fatal):', notifyError);
            }
        }

        await logAudit('UPDATE_APPLICATION', 'Application', id, `Updated application fields: ${Object.keys(updateData).join(', ')}`);

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Application details PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
