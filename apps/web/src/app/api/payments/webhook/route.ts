import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        const result = paymentService.verifyWebhookSignature(body, signature);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = result.event!;

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('Payment succeeded:', paymentIntent.id);

                // TODO: Update database with payment status
                // await prisma.payment.create({
                //   data: {
                //     userId: paymentIntent.metadata.userId,
                //     amount: paymentIntent.amount,
                //     status: 'COMPLETED',
                //     stripePaymentIntentId: paymentIntent.id,
                //   },
                // });
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id);
                break;

            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Checkout completed:', session.id);

                // TODO: Fulfill the order, send confirmation email
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
