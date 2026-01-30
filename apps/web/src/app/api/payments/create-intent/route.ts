import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/stripe';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { amount, description, metadata } = body;

        if (!amount || amount < 50) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const result = await paymentService.createPaymentIntent({
            amount,
            currency: 'eur',
            description,
            metadata: {
                userId: session.userId,
                ...metadata,
            },
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ clientSecret: result.clientSecret });
    } catch (error) {
        console.error('Payment intent error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
