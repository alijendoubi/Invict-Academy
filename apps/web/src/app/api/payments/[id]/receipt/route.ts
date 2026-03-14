import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true } },
                    },
                },
                package: { select: { name: true } },
                payments: {
                    where: { status: 'SUCCESS' },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Students can only access their own receipts
        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin && invoice.student.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (invoice.status !== 'PAID') {
            return NextResponse.json({ error: 'Invoice is not paid' }, { status: 400 });
        }

        const payment = invoice.payments[0];
        const studentName = `${invoice.student.user.firstName} ${invoice.student.user.lastName}`;
        const paidDate = payment?.createdAt
            ? new Date(payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payment Receipt - ${invoice.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; padding: 48px; max-width: 680px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #0891b2; padding-bottom: 24px; }
    .logo { font-size: 22px; font-weight: 900; color: #0891b2; letter-spacing: -0.5px; }
    .logo span { color: #1a1a1a; }
    .receipt-badge { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
    .subtitle { color: #6b7280; font-size: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 32px 0; }
    .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #9ca3af; margin-bottom: 8px; }
    .section-value { font-size: 15px; font-weight: 600; line-height: 1.5; }
    .section-sub { font-size: 13px; color: #6b7280; }
    .amount-box { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
    .amount-label { font-size: 12px; color: #0f766e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .amount-value { font-size: 42px; font-weight: 900; color: #0f766e; margin: 4px 0; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; }
    .ref { font-family: monospace; font-size: 12px; color: #6b7280; background: #f9fafb; padding: 2px 6px; border-radius: 4px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Invict <span>Academy</span></div>
      <div class="subtitle" style="margin-top:4px">Education Consulting</div>
    </div>
    <div class="receipt-badge">✓ Payment Confirmed</div>
  </div>

  <h1>Payment Receipt</h1>
  <div class="subtitle">Receipt #${invoice.id.slice(0, 8).toUpperCase()}</div>

  <div class="grid">
    <div>
      <div class="section-label">Billed To</div>
      <div class="section-value">${studentName}</div>
      <div class="section-sub">${invoice.student.user.email}</div>
    </div>
    <div>
      <div class="section-label">Payment Date</div>
      <div class="section-value">${paidDate}</div>
      ${payment?.method ? `<div class="section-sub">${payment.method.replace('_', ' ')}</div>` : ''}
    </div>
    <div>
      <div class="section-label">Service</div>
      <div class="section-value">${invoice.package?.name ?? 'Invict Academy Service'}</div>
    </div>
    <div>
      <div class="section-label">Reference</div>
      <div class="section-value"><span class="ref">${payment?.reference ?? invoice.id}</span></div>
    </div>
  </div>

  <div class="amount-box">
    <div class="amount-label">Total Paid</div>
    <div class="amount-value">€${Number(invoice.paidAmount || invoice.amount).toLocaleString('en-EU', { minimumFractionDigits: 2 })}</div>
  </div>

  <hr class="divider" />

  <div class="footer">
    <p>Invict Academy · staff@invictacademy.com · invictacademy.com</p>
    <p style="margin-top:6px">This is an official payment receipt. Thank you for your trust.</p>
  </div>

  <script>window.print();</script>
</body>
</html>`;

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Disposition': `inline; filename="receipt-${invoice.id.slice(0, 8)}.html"`,
            },
        });
    } catch (error) {
        console.error('Receipt generation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
