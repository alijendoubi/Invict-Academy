import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the student profile ID
        const profile = await prisma.studentProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json([]);
        }

        const applications = await prisma.application.findMany({
            where: { studentId: profile.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Applications/My GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
