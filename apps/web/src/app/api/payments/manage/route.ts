import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function isAdmin(role: string) {
    return ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(role);
}

/**
 * POST /api/payments/manage
 * Admin/Staff: Create an invoice or record a payment against an existing invoice.
 *
 * Body (create invoice):
 *   { action: "create_invoice", studentId, packageId?, amount, dueDate?, description? }
 *
 * Body (record payment):
 *   { action: "record_payment", invoiceId, amount, method: "BANK_TRANSFER"|"MANUAL", reference? }
 *
 * Body (update invoice status):
 *   { action: "update_status", invoiceId, status: "PAID"|"PARTIAL"|"UNPAID" }
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!isAdmin(session.user.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'create_invoice': {
                const { studentId, packageId, amount, dueDate } = body;
                if (!studentId || !amount || amount <= 0) {
                    return NextResponse.json({ error: 'studentId and a positive amount are required' }, { status: 400 });
                }

                const student = await prisma.studentProfile.findUnique({ where: { id: studentId } });
                if (!student) {
                    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
                }

                const invoice = await prisma.invoice.create({
                    data: {
                        studentId,
                        packageId: packageId || null,
                        amount,
                        status: 'UNPAID',
                        dueDate: dueDate ? new Date(dueDate) : null,
                        paidAmount: 0,
                    },
                });

                return NextResponse.json({ success: true, invoice });
            }

            case 'record_payment': {
                const { invoiceId, amount: payAmount, method, reference } = body;
                if (!invoiceId || !payAmount || payAmount <= 0) {
                    return NextResponse.json({ error: 'invoiceId and a positive amount are required' }, { status: 400 });
                }

                const validMethods = ['BANK_TRANSFER', 'MANUAL'];
                if (!validMethods.includes(method)) {
                    return NextResponse.json({ error: `method must be one of: ${validMethods.join(', ')}` }, { status: 400 });
                }

                const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
                if (!invoice) {
                    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
                }

                const payment = await prisma.payment.create({
                    data: {
                        invoiceId,
                        amount: payAmount,
                        method,
                        status: 'SUCCESS',
                        reference: reference || null,
                    },
                });

                const newPaidAmount = invoice.paidAmount + payAmount;
                const newStatus = newPaidAmount >= invoice.amount ? 'PAID' : 'PARTIAL';

                await prisma.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        paidAmount: newPaidAmount,
                        status: newStatus,
                    },
                });

                return NextResponse.json({ success: true, payment, invoiceStatus: newStatus });
            }

            case 'update_status': {
                const { invoiceId: invId, status } = body;
                if (!invId || !status) {
                    return NextResponse.json({ error: 'invoiceId and status are required' }, { status: 400 });
                }

                const validStatuses = ['PAID', 'PARTIAL', 'UNPAID'];
                if (!validStatuses.includes(status)) {
                    return NextResponse.json({ error: `status must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
                }

                const inv = await prisma.invoice.findUnique({ where: { id: invId } });
                if (!inv) {
                    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
                }

                const updateData: any = { status };
                if (status === 'PAID') {
                    updateData.paidAmount = inv.amount;
                } else if (status === 'UNPAID') {
                    updateData.paidAmount = 0;
                }

                const updated = await prisma.invoice.update({
                    where: { id: invId },
                    data: updateData,
                });

                return NextResponse.json({ success: true, invoice: updated });
            }

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: create_invoice, record_payment, update_status' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Payment manage error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
