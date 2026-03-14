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

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);

        // Admin: optionally get by studentId param; Student: only their own
        const { searchParams } = new URL(request.url);
        const studentIdParam = searchParams.get('studentId');

        let studentProfile: any = null;

        if (isAdmin && studentIdParam) {
            // Admin fetching a specific student's payments
            studentProfile = await prisma.studentProfile.findUnique({
                where: { id: studentIdParam },
                include: { user: { select: { firstName: true, lastName: true, email: true } } },
            });
        } else if (!isAdmin) {
            // Student fetching their own payments
            studentProfile = await prisma.studentProfile.findUnique({
                where: { userId: session.user.id },
                include: { user: { select: { firstName: true, lastName: true, email: true } } },
            });
        } else {
            // Admin with no specific student: return summary of all invoices
            const allInvoices = await prisma.invoice.findMany({
                include: {
                    student: {
                        include: { user: { select: { firstName: true, lastName: true, email: true } } },
                    },
                    package: { select: { name: true } },
                    payments: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            return NextResponse.json({
                invoices: allInvoices.map(inv => ({
                    id: inv.id,
                    description: inv.package?.name || 'Service Invoice',
                    amount: inv.amount,
                    status: inv.status === 'PAID' ? 'PAID' : inv.status === 'PARTIAL' ? 'PENDING' : 'UPCOMING',
                    dueDate: inv.dueDate?.toISOString() ?? null,
                    paidDate: inv.payments.find(p => p.status === 'SUCCESS')?.createdAt?.toISOString() ?? null,
                    studentName: `${inv.student.user.firstName} ${inv.student.user.lastName}`,
                    studentEmail: inv.student.user.email,
                    paidAmount: inv.paidAmount,
                })),
                summary: {
                    totalPaid: allInvoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0),
                    totalDue: allInvoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + i.amount, 0),
                }
            });
        }

        if (!studentProfile) {
            return NextResponse.json({ invoices: [], summary: null });
        }

        const invoices = await prisma.invoice.findMany({
            where: { studentId: studentProfile.id },
            include: {
                package: { select: { name: true } },
                payments: { orderBy: { createdAt: 'desc' } },
            },
            orderBy: { dueDate: 'asc' },
        });

        const paidTotal = invoices
            .filter(i => i.status === 'PAID')
            .reduce((s, i) => s + i.amount, 0);

        const pendingInvoice = invoices.find(i => i.status !== 'PAID');

        const firstUnpaidIdx = invoices.findIndex(i => i.status !== 'PAID');
        return NextResponse.json({
            invoices: invoices.map((inv, idx) => ({
                id: inv.id,
                description: inv.package?.name || `Service Invoice #${idx + 1}`,
                amount: inv.amount,
                // Map DB status to frontend display status
                status: inv.status === 'PAID' ? 'PAID' : idx === firstUnpaidIdx ? 'PENDING' : 'UPCOMING',
                dueDate: inv.dueDate?.toISOString() ?? null,
                paidDate: inv.payments.find(p => p.status === 'SUCCESS')?.createdAt?.toISOString() ?? null,
                receiptUrl: inv.status === 'PAID' ? `/api/payments/${inv.id}/receipt` : null,
            })),
            summary: {
                totalPaid: paidTotal,
                totalDue: invoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + i.amount, 0),
                nextPaymentDate: pendingInvoice?.dueDate?.toISOString() ?? null,
                nextPaymentAmount: pendingInvoice?.amount ?? 0,
                currency: 'EUR',
                packageName: invoices[0]?.package?.name ?? 'Service Package',
                startDate: studentProfile.createdAt?.toISOString() ?? null,
            },
        });
    } catch (error) {
        console.error('Payments GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
