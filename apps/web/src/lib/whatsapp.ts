const apiKey = process.env.DIALOG360_API_KEY;
const whatsappNumber = process.env.DIALOG360_PHONE_NUMBER_ID;

const BASE_URL = 'https://waba.360dialog.io/v1/messages';

// ─── Template Names ───────────────────────────────────────────────────────────
// These must match the template names approved in your 360dialog / Meta account
export const TEMPLATES = {
    CONSULTATION_REMINDER: 'consultation_reminder',
    APPLICATION_RECEIVED:  'application_received',
    APPLICATION_ACCEPTED:  'application_accepted',
    DOCUMENTS_NEEDED:      'documents_needed',
} as const;

function formatPhone(to: string): string {
    // 360dialog expects plain E.164 without any prefix
    return to.replace(/^whatsapp:\+?/, '').replace(/^\+/, '');
}

function isConfigured(): boolean {
    if (!apiKey || !whatsappNumber) {
        console.warn('⚠️ 360dialog not initialised — check DIALOG360_API_KEY / DIALOG360_PHONE_NUMBER_ID');
        return false;
    }
    return true;
}

async function post(body: object): Promise<{ success: boolean; sid?: string; error?: string }> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'D360-API-KEY': apiKey!,
        },
        body: JSON.stringify(body),
    });

    const json = await res.json() as any;

    if (!res.ok) {
        const msg = json?.meta?.developer_message || json?.error?.message || `HTTP ${res.status}`;
        return { success: false, error: msg };
    }

    const sid = json?.messages?.[0]?.id;
    return { success: true, sid };
}

export const whatsappService = {
    /**
     * Send a free-form WhatsApp message (plain text).
     * Only works within the 24-hour customer-initiated session window.
     */
    async sendWhatsApp(to: string, message: string) {
        if (!isConfigured()) return { success: false, error: '360dialog not configured' };

        try {
            const phone = formatPhone(to);
            const result = await post({
                messaging_product: 'whatsapp',
                to: phone,
                type: 'text',
                text: { body: message },
            });
            if (result.success) {
                console.log(`✅ WhatsApp (text) sent to ${phone}: ${result.sid}`);
            } else {
                console.error('❌ 360dialog WhatsApp (text) error:', result.error);
            }
            return result;
        } catch (error: any) {
            const msg = error?.message ?? String(error);
            console.error('❌ 360dialog WhatsApp (text) error:', msg);
            return { success: false, error: msg };
        }
    },

    /**
     * Send a pre-approved WhatsApp template message.
     * variables: numbered keys matching the template placeholders, e.g. { '1': 'John', '2': 'March 25' }
     */
    async sendTemplate(to: string, templateName: string, variables: Record<string, string>) {
        if (!isConfigured()) return { success: false, error: '360dialog not configured' };

        try {
            const phone = formatPhone(to);
            const parameters = Object.values(variables).map((text) => ({ type: 'text', text }));

            const result = await post({
                messaging_product: 'whatsapp',
                to: phone,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'en' },
                    components: parameters.length
                        ? [{ type: 'body', parameters }]
                        : [],
                },
            });

            if (result.success) {
                console.log(`✅ WhatsApp template "${templateName}" sent to ${phone}: ${result.sid}`);
            } else {
                console.error(`❌ 360dialog template "${templateName}" error:`, result.error);
            }
            return result;
        } catch (error: any) {
            const msg = error?.message ?? String(error);
            console.error(`❌ 360dialog template "${templateName}" error:`, msg);
            return { success: false, error: msg };
        }
    },
};
