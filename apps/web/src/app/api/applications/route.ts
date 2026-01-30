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

        const applications = await prisma.application.findMany({
            include: {
                student: {
                    include: {
                        user: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Applications GET error:', error);
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
        const {
            studentId,
            universityName,
            courseName,
            type,
            status,
            submissionDate
        } = body;

        const application = await prisma.application.create({
            data: {
                studentId,
                university: universityName,
                program: courseName,
                country: "Italy", // Default for now
                type: type || 'UNIVERSITY',
                status: status || 'DRAFT',
            },
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error('Application POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
