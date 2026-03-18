import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { twilioService } from '@/lib/twilio';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { to, message, contentSid, variables } = body;

        if (!to) {
            return NextResponse.json({ error: 'Missing recipient phone number' }, { status: 400 });
        }

        let res;

        if (contentSid) {
            // ── Template message (works regardless of 24h session window) ──
            res = await twilioService.sendTemplate(to, contentSid, variables || {});
        } else {
            // ── Free-form message (requires active 24h session window) ──
            if (!message) {
                return NextResponse.json({ error: 'Missing message body' }, { status: 400 });
            }
            res = await twilioService.sendWhatsApp(to, message);
        }

        if (!res.success) {
            return NextResponse.json({ error: res.error || 'Failed to send WhatsApp' }, { status: 500 });
        }

        return NextResponse.json({ success: true, sid: res.sid });
    } catch (error: any) {
        console.error('Manual WhatsApp send error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
