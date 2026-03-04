import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized. Only Super Admins can delete student accounts.' }, { status: 403 });
        }

        const studentProfileId = params.id;

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

        // Execute sequentially or in a transaction to handle Prisma constraints
        // Relations without onDelete: Cascade need to be deleted manually
        await prisma.$transaction(async (tx) => {
            // Delete payments tied to invoices
            if (invoiceIds.length > 0) {
                await tx.payment.deleteMany({
                    where: { invoiceId: { in: invoiceIds } }
                });
            }

            // Delete invoices
            await tx.invoice.deleteMany({
                where: { studentId: studentProfileId }
            });

            // Clean up user-related records
            await tx.task.deleteMany({
                where: { OR: [{ creatorId: userId }, { assignedToId: userId }] }
            });

            await tx.notificationLog.deleteMany({
                where: { userId: userId }
            });

            await tx.auditLog.deleteMany({
                where: { userId: userId }
            });

            // Due to schema cascade, deleting the user will automatically drop:
            // Session, StudentProfile, Application, Document, Consultation, StudentMessage
            await tx.user.delete({
                where: { id: userId }
            });
        });

        // Add to audit logs AFTER the transaction using the admin session
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
