import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
                try {
                    // The invoiceId should be stored in Stripe metadata when the intent is created
                    const invoiceId = paymentIntent.metadata?.invoiceId;
                    if (invoiceId) {
                        const existingPayment = await prisma.payment.findFirst({
                            where: { reference: paymentIntent.id },
                        });
                        if (existingPayment) {
                            console.log(`Webhook duplicate: payment ${paymentIntent.id} already processed. Skipping.`);
                            break;
                        }
                        await prisma.payment.create({
                            data: {
                                invoiceId,
                                amount: paymentIntent.amount / 100, // Stripe amounts are in cents
                                method: 'STRIPE',
                                status: 'SUCCESS',
                                reference: paymentIntent.id,
                            },
                        });
                        // Update the invoice paidAmount
                        await prisma.invoice.update({
                            where: { id: invoiceId },
                            data: {
                                status: 'PAID',
                                paidAmount: paymentIntent.amount / 100,
                            },
                        });
                        console.log(`Invoice ${invoiceId} marked as PAID`);
                    } else {
                        console.warn('Stripe webhook: payment_intent.succeeded has no invoiceId in metadata. Skipping DB update.');
                    }
                } catch (dbErr) {
                    console.error('Webhook DB update error (payment_intent.succeeded):', dbErr);
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id);
                break;

            case 'checkout.session.completed':
                const checkoutSession = event.data.object;
                console.log('Checkout completed:', checkoutSession.id);
                // The payment_intent.succeeded event handles the actual DB update
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
