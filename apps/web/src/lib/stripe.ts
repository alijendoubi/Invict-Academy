// DEMO MODE: Mock Stripe implementation
// To restore real Stripe, uncomment the code below

/*
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2024-12-18.acacia',
});
*/

// Mock Stripe for demo mode
const stripe = null as any;

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
     * Create a payment intent for one-time payments (MOCKED)
     */
    async createPaymentIntent(params: CreatePaymentIntentParams) {
        console.log('[DEMO] Mock payment intent created:', params);
        return { 
            success: true, 
            clientSecret: `pi_demo_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
        };
    },

    /**
     * Create a checkout session for hosted payment page (MOCKED)
     */
    async createCheckoutSession(params: CreateCheckoutSessionParams) {
        console.log('[DEMO] Mock checkout session created:', params);
        const sessionId = `cs_demo_${Date.now()}`;
        return { 
            success: true, 
            sessionId, 
            url: `${params.successUrl}?session_id=${sessionId}`
        };
    },

    /**
     * Retrieve payment intent details (MOCKED)
     */
    async getPaymentIntent(paymentIntentId: string) {
        console.log('[DEMO] Mock payment intent retrieved:', paymentIntentId);
        return { 
            success: true, 
            paymentIntent: {
                id: paymentIntentId,
                amount: 50000,
                currency: 'eur',
                status: 'succeeded'
            }
        };
    },

    /**
     * Create a customer in Stripe (MOCKED)
     */
    async createCustomer(email: string, name: string, metadata?: Record<string, string>) {
        console.log('[DEMO] Mock customer created:', { email, name, metadata });
        return { 
            success: true, 
            customerId: `cus_demo_${Date.now()}`
        };
    },

    /**
     * Verify webhook signature (MOCKED)
     */
    verifyWebhookSignature(payload: string | Buffer, signature: string) {
        console.log('[DEMO] Mock webhook signature verified');
        return { 
            success: true, 
            event: {
                id: `evt_demo_${Date.now()}`,
                type: 'payment_intent.succeeded',
                data: {
                    object: {
                        id: 'pi_demo_123',
                        amount: 50000,
                        currency: 'eur'
                    }
                }
            }
        };
    },

    /**
     * Create a refund (MOCKED)
     */
    async createRefund(paymentIntentId: string, amount?: number) {
        console.log('[DEMO] Mock refund created:', { paymentIntentId, amount });
        return { 
            success: true, 
            refund: {
                id: `re_demo_${Date.now()}`,
                amount: amount || 50000,
                status: 'succeeded'
            }
        };
    },
};

export default stripe;

