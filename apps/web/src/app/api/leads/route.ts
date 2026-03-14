import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { queueService } from '@/lib/queue';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const leadPostSchema = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().max(254),
    phone: z.string().max(30).optional(),
    source: z.string().max(100).optional(),
    interestedDegree: z.string().max(100).optional(),
    interestedCountry: z.string().max(100).optional(),
    destinationInterests: z.array(z.string().max(100)).optional(),
    budgetRange: z.string().max(100).optional(),
    timeline: z.string().max(100).optional(),
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const validStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONSULT_BOOKED', 'WON', 'LOST'];
        const safeStatus = status && status !== 'all' && validStatuses.includes(status) ? status : null;
        const safeSearch = search ? search.slice(0, 100) : null;

        const leads = await prisma.lead.findMany({
            where: {
                ...(safeStatus ? { status: safeStatus as any } : {}),
                ...(safeSearch ? {
                    OR: [
                        { firstName: { contains: safeSearch, mode: 'insensitive' } },
                        { lastName: { contains: safeSearch, mode: 'insensitive' } },
                        { email: { contains: safeSearch, mode: 'insensitive' } },
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
    const ip = getClientIp(request);
    const rl = rateLimit(`leads:${ip}`, { limit: 5, windowSecs: 60 });
    if (!rl.allowed) {
        return NextResponse.json(
            { error: 'Too many submissions. Please wait before trying again.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
        );
    }

    try {
        const session = await getSession();
        const body = await request.json();

        const parsed = leadPostSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            source,
            interestedDegree,
            interestedCountry,
            destinationInterests,
            budgetRange,
            timeline,
        } = parsed.data;

        const lead = await prisma.lead.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                source,
                status: 'NEW', // Always NEW for public submissions
                degreeLevel: interestedDegree,
                budgetRange,
                timeline,
                destinationInterests:
                    Array.isArray(destinationInterests) && destinationInterests.length > 0
                        ? destinationInterests
                        : interestedCountry
                            ? [interestedCountry]
                            : ['Italy'],
                ...(session?.user?.id ? { assignedToId: session.user.id } : {}),
            },
        });

        // Trigger unified notification flow
        try {
            await queueService.sendEmail({
                type: 'welcome',
                to: lead.email,
                data: { firstName: lead.firstName },
            });

            await queueService.sendEmail({
                type: 'staff_new_lead',
                to: process.env.STAFF_NOTIFICATION_EMAIL || 'staff@invictacademy.com',
                data: {
                    leadId: lead.id,
                    leadName: `${lead.firstName} ${lead.lastName}`,
                },
            });
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
