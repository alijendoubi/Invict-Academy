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
                package: { select: { name: true, features: true } },
                payments: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Students can only access their own invoices
        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin && invoice.student.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const studentName = `${invoice.student.user.firstName} ${invoice.student.user.lastName}`;
        const issuedDate = new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const dueDate = invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Upon receipt';

        const statusColor = invoice.status === 'PAID' ? '#166534' : invoice.status === 'PARTIAL' ? '#92400e' : '#991b1b';
        const statusBg = invoice.status === 'PAID' ? '#dcfce7' : invoice.status === 'PARTIAL' ? '#fef3c7' : '#fee2e2';

        const paymentsRows = invoice.payments.length > 0
            ? invoice.payments.map(p => `
          <tr>
            <td>${new Date(p.createdAt).toLocaleDateString('en-GB')}</td>
            <td>${p.method.replace('_', ' ')}</td>
            <td>${p.reference ? `<span style="font-family:monospace;font-size:12px">${p.reference}</span>` : '—'}</td>
            <td style="color:${p.status === 'SUCCESS' ? '#166534' : '#991b1b'};font-weight:600">${p.status}</td>
            <td style="text-align:right;font-weight:700">€${Number(p.amount).toFixed(2)}</td>
          </tr>`).join('')
            : '<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:16px">No payments recorded yet</td></tr>';

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice #${invoice.id.slice(0, 8).toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; padding: 48px; max-width: 720px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #0891b2; padding-bottom: 24px; }
    .logo { font-size: 22px; font-weight: 900; color: #0891b2; }
    .logo span { color: #1a1a1a; }
    .status-badge { font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; background: ${statusBg}; color: ${statusColor}; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
    .meta { color: #6b7280; font-size: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin: 32px 0; }
    .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #9ca3af; margin-bottom: 6px; }
    .section-value { font-size: 14px; font-weight: 600; line-height: 1.5; }
    .section-sub { font-size: 12px; color: #6b7280; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; background: #f9fafb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
    td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .summary-row.total { font-size: 18px; font-weight: 800; border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 4px; }
    .summary-row.paid { color: #166534; }
    .summary-row.due { color: #991b1b; font-weight: 700; }
    .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Invict <span>Academy</span></div>
      <div class="meta" style="margin-top:4px">Education Consulting</div>
    </div>
    <div class="status-badge">${invoice.status}</div>
  </div>

  <h1>Invoice</h1>
  <div class="meta">#${invoice.id.slice(0, 8).toUpperCase()}</div>

  <div class="grid">
    <div>
      <div class="section-label">Billed To</div>
      <div class="section-value">${studentName}</div>
      <div class="section-sub">${invoice.student.user.email}</div>
    </div>
    <div>
      <div class="section-label">Issue Date</div>
      <div class="section-value">${issuedDate}</div>
    </div>
    <div>
      <div class="section-label">Due Date</div>
      <div class="section-value">${dueDate}</div>
    </div>
  </div>

  <div class="section-label" style="margin-bottom:8px">Service</div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div style="font-weight:600">${invoice.package?.name ?? 'Invict Academy Service'}</div>
          ${invoice.package?.features?.length ? `<div style="color:#6b7280;font-size:12px;margin-top:4px">${invoice.package.features.slice(0, 3).join(' · ')}</div>` : ''}
        </td>
        <td style="text-align:right;font-weight:700">€${Number(invoice.amount).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div style="max-width:280px;margin-left:auto;margin-top:16px">
    <div class="summary-row"><span>Subtotal</span><span>€${Number(invoice.amount).toFixed(2)}</span></div>
    ${invoice.paidAmount > 0 ? `<div class="summary-row paid"><span>Paid</span><span>−€${Number(invoice.paidAmount).toFixed(2)}</span></div>` : ''}
    <div class="summary-row total ${invoice.status !== 'PAID' ? 'due' : ''}">
      <span>${invoice.status === 'PAID' ? 'Paid in Full' : 'Balance Due'}</span>
      <span>€${Number(invoice.amount - (invoice.paidAmount ?? 0)).toFixed(2)}</span>
    </div>
  </div>

  ${invoice.payments.length > 0 ? `
  <div style="margin-top:32px">
    <div class="section-label" style="margin-bottom:8px">Payment History</div>
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Method</th><th>Reference</th><th>Status</th><th style="text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>${paymentsRows}</tbody>
    </table>
  </div>` : ''}

  <div class="footer">
    <p>Invict Academy · staff@invictacademy.com · invictacademy.com</p>
    <p style="margin-top:6px">Questions? Contact us via WhatsApp or email. Thank you for choosing Invict Academy.</p>
  </div>

  <script>window.print();</script>
</body>
</html>`;

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Disposition': `inline; filename="invoice-${invoice.id.slice(0, 8)}.html"`,
            },
        });
    } catch (error) {
        console.error('Invoice generation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
