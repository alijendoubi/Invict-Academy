import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import * as bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName, role } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with profile based on role
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: role || 'STUDENT',
                studentProfile: role === 'STUDENT' ? { create: {} } : undefined,
                associateProfile: role === 'ASSOCIATE' ? {
                    create: {
                        referralCode: Math.random().toString(36).substring(2, 10).toUpperCase()
                    }
                } : undefined,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Account created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
