import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2024-12-18.acacia',
});

export interface CreatePaymentIntentParams {
    amount: number; // in cents
    currency?: string;
    metadata?: Record<string, string>;
    description?: string;
}

export interface CreateCheckoutSessionParams {
    priceId?: string;
    amount?: number;
    currency?: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail: string;
    metadata?: Record<string, string>;
}

export const paymentService = {
    /**
     * Create a payment intent for one-time payments
     */
    async createPaymentIntent(params: CreatePaymentIntentParams) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: params.amount,
                currency: params.currency || 'eur',
                metadata: params.metadata || {},
                description: params.description,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return { success: true, clientSecret: paymentIntent.client_secret };
        } catch (error: any) {
            console.error('Payment intent creation error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Create a checkout session for hosted payment page
     */
    async createCheckoutSession(params: CreateCheckoutSessionParams) {
        try {
            const sessionParams: Stripe.Checkout.SessionCreateParams = {
                mode: 'payment',
                success_url: params.successUrl,
                cancel_url: params.cancelUrl,
                customer_email: params.customerEmail,
                metadata: params.metadata || {},
                line_items: [],
            };

            if (params.priceId) {
                sessionParams.line_items = [
                    {
                        price: params.priceId,
                        quantity: 1,
                    },
                ];
            } else if (params.amount) {
                sessionParams.line_items = [
                    {
                        price_data: {
                            currency: params.currency || 'eur',
                            product_data: {
                                name: 'Invict Academy Service',
                            },
                            unit_amount: params.amount,
                        },
                        quantity: 1,
                    },
                ];
            }

            const session = await stripe.checkout.sessions.create(sessionParams);

            return { success: true, sessionId: session.id, url: session.url };
        } catch (error: any) {
            console.error('Checkout session creation error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Retrieve payment intent details
     */
    async getPaymentIntent(paymentIntentId: string) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            return { success: true, paymentIntent };
        } catch (error: any) {
            console.error('Payment intent retrieval error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Create a customer in Stripe
     */
    async createCustomer(email: string, name: string, metadata?: Record<string, string>) {
        try {
            const customer = await stripe.customers.create({
                email,
                name,
                metadata: metadata || {},
            });

            return { success: true, customerId: customer.id };
        } catch (error: any) {
            console.error('Customer creation error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string | Buffer, signature: string) {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
            );
            return { success: true, event };
        } catch (error: any) {
            console.error('Webhook verification error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Create a refund
     */
    async createRefund(paymentIntentId: string, amount?: number) {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount,
            });

            return { success: true, refund };
        } catch (error: any) {
            console.error('Refund creation error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default stripe;
