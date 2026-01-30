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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const students = await prisma.studentProfile.findMany({
            where,
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true }
                },
                applications: true,
            },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error('Students GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { userId, universityInterest, degreeLevel, status } = body;

        const student = await prisma.studentProfile.create({
            data: {
                userId,
                universityInterest,
                degreeLevel,
                status: status || 'ACTIVE',
            },
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error('Student POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
