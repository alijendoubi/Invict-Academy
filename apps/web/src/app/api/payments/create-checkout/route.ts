import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/stripe';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { amount, serviceType } = body;

        // Get user email
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { email: true, firstName: true, lastName: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const result = await paymentService.createCheckoutSession({
            amount,
            currency: 'eur',
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/cancel`,
            customerEmail: user.email,
            metadata: {
                userId: session.userId,
                serviceType: serviceType || 'general',
            },
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ sessionId: result.sessionId, url: result.url });
    } catch (error) {
        console.error('Checkout session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
