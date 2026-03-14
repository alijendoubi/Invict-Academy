import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'] as const;

const patchSchema = z.object({
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONSULT_BOOKED', 'WON', 'LOST']).optional(),
    assignedToId: z.string().uuid().nullable().optional(),
    notes: z.string().max(2000).optional(),
    score: z.number().int().min(0).max(100).optional(),
});

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || !STAFF_ROLES.includes(session.user.role as any)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: {
                assignedTo: { select: { firstName: true, lastName: true, email: true } },
                activities: { orderBy: { createdAt: 'desc' }, take: 20 },
                tasks: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Lead GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || !STAFF_ROLES.includes(session.user.role as any)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const parsed = patchSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const lead = await prisma.lead.update({
            where: { id },
            data: parsed.data,
        });

        return NextResponse.json(lead);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }
        console.error('Lead PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        await prisma.lead.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }
        console.error('Lead DELETE error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
