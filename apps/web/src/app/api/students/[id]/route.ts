import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess, logAudit } from '@/lib/auth';

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

        const hasAccess = await verifyStudentAccess(id);

        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const studentProfile = await prisma.studentProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                applications: {
                    orderBy: { updatedAt: 'desc' }
                },
                documents: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!studentProfile) {
            return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
        }

        return NextResponse.json(studentProfile);
    } catch (error) {
        console.error('Student Profile GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

const VALID_STUDENT_STATUSES = ['ACTIVE', 'APPLYING', 'ACCEPTED', 'VISA_IN_PROGRESS', 'DEPARTED', 'ARRIVED', 'COMPLETED'];

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

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status || !VALID_STUDENT_STATUSES.includes(status)) {
            return NextResponse.json({ error: `Status must be one of: ${VALID_STUDENT_STATUSES.join(', ')}` }, { status: 400 });
        }

        const student = await prisma.studentProfile.findUnique({ where: { id } });
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const updated = await prisma.studentProfile.update({
            where: { id },
            data: { status },
        });

        await logAudit('UPDATE_STUDENT_STATUS', 'StudentProfile', id, `Changed status from ${student.status} to ${status}`);

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Student PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: studentProfileId } = await params;
        const session = await getSession();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized. Only Super Admins can delete student accounts.' }, { status: 403 });
        }

        // Find the student profile to get the associated userId and invoices
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { id: studentProfileId },
            include: { invoices: { select: { id: true } } }
        });

        if (!studentProfile) {
            return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
        }

        const userId = studentProfile.userId;
        const invoiceIds = studentProfile.invoices.map(i => i.id);

        // Fetch application IDs for this student so we only delete their application-linked tasks
        const applicationIds = (await prisma.application.findMany({
            where: { studentId: studentProfileId },
            select: { id: true },
        })).map(a => a.id);

        await prisma.$transaction(async (tx) => {
            if (invoiceIds.length > 0) {
                await tx.payment.deleteMany({
                    where: { invoiceId: { in: invoiceIds } }
                });
            }

            await tx.invoice.deleteMany({
                where: { studentId: studentProfileId }
            });

            if (applicationIds.length > 0) {
                await tx.task.deleteMany({
                    where: { applicationId: { in: applicationIds } }
                });
            }

            await tx.notificationLog.deleteMany({
                where: { userId: userId }
            });

            await tx.auditLog.deleteMany({
                where: { userId: userId }
            });

            await tx.user.delete({
                where: { id: userId }
            });
        });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'DELETE_STUDENT',
                entity: 'User',
                entityId: userId,
                details: `Deleted student profile ${studentProfileId} and user ${userId}`
            }
        });

        return NextResponse.json({ success: true, message: 'Student deleted successfully' });

    } catch (error) {
        console.error('Delete student error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
