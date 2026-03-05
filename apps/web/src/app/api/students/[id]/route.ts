import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess } from '@/lib/auth';

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

        await prisma.$transaction(async (tx) => {
            if (invoiceIds.length > 0) {
                await tx.payment.deleteMany({
                    where: { invoiceId: { in: invoiceIds } }
                });
            }

            await tx.invoice.deleteMany({
                where: { studentId: studentProfileId }
            });

            await tx.task.deleteMany({
                where: { OR: [{ creatorId: userId }, { assignedToId: userId }] }
            });

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
