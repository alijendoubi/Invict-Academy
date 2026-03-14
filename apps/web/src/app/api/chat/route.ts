import { NextRequest, NextResponse } from 'next/server';
import { chatService } from '@/lib/chat';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const rl = rateLimit(`chat:${ip}`, { limit: 30, windowSecs: 60 });
    if (!rl.allowed) {
        return NextResponse.json(
            { error: 'Too many messages. Please slow down.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
        );
    }

    try {
        const body = await request.json();
        const { messages, conversationId } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Get session (optional - chatbot can work for non-logged-in users)
        const session = await getSession();

        // Generate AI response
        const result = await chatService.generateResponse(messages);

        // Store conversation if user is logged in
        if (session && conversationId) {
            try {
                await prisma.chatConversation.upsert({
                    where: { id: conversationId },
                    create: {
                        id: conversationId,
                        userId: session.user.id,
                        messages: messages,
                    },
                    update: {
                        messages: messages,
                        updatedAt: new Date(),
                    },
                });
            } catch (dbError) {
                console.error('Failed to store conversation:', dbError);
                // Continue even if storage fails
            }
        }

        return NextResponse.json({
            message: result.message,
            success: result.success,
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        );
    }
}
