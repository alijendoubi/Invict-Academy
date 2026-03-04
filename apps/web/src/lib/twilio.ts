import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const twilioService = {
    async sendWhatsApp(to: string, message: string) {
        if (!client) {
            console.warn('⚠️ Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
            return { success: false, error: 'Twilio not configured' };
        }

        try {
            // Ensure phone number starts with whatsapp:
            const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : `+${to}`}`;

            const response = await client.messages.create({
                body: message,
                from: whatsappNumber,
                to: formattedTo
            });

            console.log(`✅ WhatsApp sent to ${formattedTo}: ${response.sid}`);
            return { success: true, sid: response.sid };
        } catch (error) {
            console.error('❌ Twilio WhatsApp error:', error);
            return { success: false, error };
        }
    }
};
