// DEMO MODE: Mock chat service
// To restore OpenAI, uncomment the code below

/*
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});
*/

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `You are a helpful assistant for Invict Academy, an education consulting agency specializing in helping students study in Italy. 

Your role is to:
- Answer questions about studying in Italy
- Provide information about Italian universities (Politecnico di Milano, Bologna, Sapienza, etc.)
- Explain the application process
- Discuss visa requirements
- Talk about scholarships and funding
- Help with housing and arrival information

Be friendly, professional, and concise. If you don't know something, admit it and suggest contacting a human advisor.

Key facts:
- Tuition: €2,000-€8,000/year at public universities
- Main intakes: September and February
- Study permit allows travel in Schengen zone
- Work rights included with study permit
- We offer services: Admissions, Scholarships, Visa Support, Housing`;

export const chatService = {
    async generateResponse(messages: ChatMessage[]) {
        // DEMO MODE: Always use fallback responses
        console.log('[DEMO] Mock chat response generated');
        
        const userMessage = messages[messages.length - 1]?.content || '';
        const response = chatService.getFallbackResponse(userMessage);
        
        // Simulate API delay for realism
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            success: true,
            message: response,
        };
        
        /* Original OpenAI implementation
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                temperature: 0.7,
                max_tokens: 500,
            });

            return {
                success: true,
                message: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
            };
        } catch (error: any) {
            console.error('OpenAI API error:', error);

            // Fallback to predefined responses if API fails
            return {
                success: false,
                message: chatService.getFallbackResponse(messages[messages.length - 1]?.content || ''),
            };
        }
        */
    },

    getFallbackResponse(userMessage: string) {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('cost') || lowerMessage.includes('tuition') || lowerMessage.includes('price')) {
            return 'Tuition fees at Italian public universities typically range from €2,000 to €8,000 per year, which is significantly more affordable than UK or US universities. Would you like to know more about specific universities or scholarship opportunities?';
        }

        if (lowerMessage.includes('visa') || lowerMessage.includes('permit')) {
            return 'To study in Italy, you\'ll need a student visa (Type D). The process includes: admission letter, proof of funds, health insurance, and accommodation proof. We provide complete visa support to ensure your application is error-free. Would you like to schedule a consultation?';
        }

        if (lowerMessage.includes('university') || lowerMessage.includes('universities')) {
            return 'Italy has many excellent universities! Top choices include Politecnico di Milano (engineering), University of Bologna (oldest university in the world), and Sapienza University of Rome. What field are you interested in studying?';
        }

        if (lowerMessage.includes('scholarship') || lowerMessage.includes('funding')) {
            return 'There are several scholarship opportunities for international students in Italy, including regional scholarships, university-specific grants, and the Italian Government Scholarship. We can help you identify and apply for scholarships that match your profile. Interested?';
        }

        if (lowerMessage.includes('housing') || lowerMessage.includes('accommodation')) {
            return 'We offer housing assistance as part of our services! We help you find student residences, shared apartments, or private accommodation near your university. Costs typically range from €300-€600/month depending on the city.';
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! 👋 Welcome to Invict Academy. I\'m here to help you with any questions about studying in Italy. What would you like to know?';
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('services')) {
            return 'We offer comprehensive services for studying in Italy:\n\n✅ University Admissions\n✅ Scholarship Applications\n✅ Visa Support\n✅ Housing & Arrival Assistance\n\nWhich service would you like to learn more about?';
        }

        return 'Thank you for your question! For detailed information about this topic, I recommend booking a free consultation with one of our expert advisors. Would you like me to help you schedule one?';
    },
};

