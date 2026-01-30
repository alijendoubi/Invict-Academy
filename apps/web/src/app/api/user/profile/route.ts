import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hash } from 'bcrypt';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                studentProfile: {
                    select: {
                        phone: true,
                        nationality: true,
                    }
                }
            }
        });

        // Flatten for frontend
        const profile = {
            ...user,
            phone: user?.studentProfile?.phone,
            nationality: user?.studentProfile?.nationality,
        };

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { firstName, lastName, email, phone, nationality, currentPassword, newPassword } = body;

        // If updating email, check if it's already taken
        if (email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser && existingUser.id !== session.userId) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }
        }

        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;

        if (newPassword) {
            updateData.password = await hash(newPassword, 10);
        }

        // Handle Student Profile updates
        if (phone || nationality) {
            updateData.studentProfile = {
                upsert: {
                    create: {
                        phone: phone || undefined,
                        nationality: nationality || undefined,
                    },
                    update: {
                        phone: phone || undefined,
                        nationality: nationality || undefined,
                    },
                },
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                studentProfile: {
                    select: {
                        phone: true,
                        nationality: true,
                    }
                }
            }
        });

        const profile = {
            ...updatedUser,
            phone: updatedUser?.studentProfile?.phone,
            nationality: updatedUser?.studentProfile?.nationality,
        };

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Profile PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
