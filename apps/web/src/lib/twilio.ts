import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// ─── Template SIDs ───────────────────────────────────────────────────────────
export const TEMPLATES = {
    CONSULTATION_REMINDER: 'HX6d76193beb1787850114c12c3b0f1eec',
    APPLICATION_RECEIVED:  'HX24d3d9d55906000550de51f14d29d029',
    APPLICATION_ACCEPTED:  'HXf1d51c9a0153a5a53bacfa2d31bcbaae',
    DOCUMENTS_NEEDED:      'HXfe3b8f8ee3f05010aa54fbe1a70ad20f',
} as const;

function formatPhone(to: string): string {
    if (to.startsWith('whatsapp:')) return to;
    const withPlus = to.startsWith('+') ? to : `+${to}`;
    return `whatsapp:${withPlus}`;
}

export const twilioService = {
    /**
     * Send a free-form WhatsApp message (plain text).
     * Only works within the 24-hour session window or for admin-initiated messages.
     */
    async sendWhatsApp(to: string, message: string) {
        if (!client) {
            console.warn('⚠️ Twilio not initialised — check TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN');
            return { success: false, error: 'Twilio not configured' };
        }

        try {
            const formattedTo = formatPhone(to);
            const response = await client.messages.create({
                body: message,
                from: whatsappNumber,
                to: formattedTo,
            });
            console.log(`✅ WhatsApp (text) sent to ${formattedTo}: ${response.sid}`);
            return { success: true, sid: response.sid };
        } catch (error: any) {
            console.error('❌ Twilio WhatsApp (text) error:', error?.message ?? error);
            return { success: false, error };
        }
    },

    /**
     * Send a pre-approved WhatsApp template message.
     * variables: numbered keys matching the template placeholders, e.g. { '1': 'John', '2': 'March 25' }
     */
    async sendTemplate(to: string, contentSid: string, variables: Record<string, string>) {
        if (!client) {
            console.warn('⚠️ Twilio not initialised — check TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN');
            return { success: false, error: 'Twilio not configured' };
        }

        try {
            const formattedTo = formatPhone(to);
            const response = await client.messages.create({
                from: whatsappNumber,
                to: formattedTo,
                contentSid,
                contentVariables: JSON.stringify(variables),
            });
            console.log(`✅ WhatsApp template ${contentSid} sent to ${formattedTo}: ${response.sid}`);
            return { success: true, sid: response.sid };
        } catch (error: any) {
            console.error(`❌ Twilio template ${contentSid} error:`, error?.message ?? error);
            return { success: false, error };
        }
    },
};
