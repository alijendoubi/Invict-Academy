import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getNotificationQueue } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const leads = await prisma.lead.findMany({
            where: {
                ...(status && status !== 'all' ? { status: status as any } : {}),
                ...(search ? {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ]
                } : {}),
            },
            orderBy: { createdAt: 'desc' },
            include: {
                assignedTo: {
                    select: { firstName: true, lastName: true }
                }
            }
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error('Leads GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const body = await request.json();
        const { firstName, lastName, email, phone, source, status } = body;

        const lead = await prisma.lead.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                source,
                status: status || 'NEW',
                ...(session?.userId ? { assignedToId: session.userId } : {}),
            },
        });

        // Trigger unified notification flow
        try {
            const queue = getNotificationQueue();
            if (queue) {
                await queue.add('send-lead-welcome', {
                    email: lead.email,
                    name: lead.firstName,
                    leadId: lead.id,
                });

                await queue.add('send-staff-notification', {
                    email: 'staff@invictacademy.com',
                    leadId: lead.id,
                    leadName: `${lead.firstName} ${lead.lastName}`,
                });
            }
        } catch (queueError) {
            console.error('Failed to queue notifications for new lead:', queueError);
            // Don't fail the request if notifications fail
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Lead POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
