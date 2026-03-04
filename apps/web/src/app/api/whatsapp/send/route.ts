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
        const { to, message } = body;

        if (!to || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const res = await twilioService.sendWhatsApp(to, message);

        if (!res.success) {
            return NextResponse.json({ error: typeof res.error === 'string' ? res.error : 'Failed to send WhatsApp' }, { status: 500 });
        }

        return NextResponse.json({ success: true, sid: res.sid });
    } catch (error) {
        console.error('Manual WhatsApp send error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
