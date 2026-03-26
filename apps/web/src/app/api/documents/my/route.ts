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

        // Find the student profile for the current user
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!studentProfile) {
            return NextResponse.json([]);
        }

        const documents = await prisma.document.findMany({
            where: { studentId: studentProfile.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                type: true,
                status: true,
                filename: true,
                url: true,
                createdAt: true,
                updatedAt: true,
                rejectionReason: true,
            }
        });

        const response = NextResponse.json(documents);
        response.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=120');
        return response;
    } catch (error) {
        console.error('Documents/my GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
