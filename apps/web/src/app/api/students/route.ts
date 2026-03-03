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
        if (!session || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
            return NextResponse.json({ error: 'Unauthorized to create students' }, { status: 401 });
        }

        const body = await request.json();
        const { firstName, lastName, email, universityInterest, degreeLevel, status } = body;

        if (!email || !firstName || !lastName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // Generate a secure temporary password (e.g., Invict-X9K2P!)
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const temporaryPassword = `Invict-${randomPart}!`;

        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Create the user and their student profile in one transaction
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword,
                role: 'STUDENT',
                requiresPasswordChange: true, // Force reset on first login
                studentProfile: {
                    create: {
                        universityInterest,
                        degreeLevel,
                        status: status || 'ACTIVE',
                    }
                }
            },
            include: {
                studentProfile: true,
            }
        });

        // We return the temporary password ONLY this one time so the admin can copy it
        return NextResponse.json({
            success: true,
            student: user.studentProfile,
            user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
            temporaryPassword
        });

    } catch (error) {
        console.error('Student POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
