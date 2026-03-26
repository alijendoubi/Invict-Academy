import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hash, compare } from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId: string = session.user.id;
        if (!userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }
        const email: string = session.user?.email || '';

        // Real DB lookup
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    requiresPasswordChange: true,
                    studentProfile: {
                        select: { phone: true, nationality: true, status: true }
                    }
                }
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            return NextResponse.json({
                ...user,
                phone: user?.studentProfile?.phone,
                nationality: user?.studentProfile?.nationality,
            });
        } catch (dbError) {
            console.error('Profile DB error:', dbError);
            return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
        }
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
        const { firstName, lastName, email, phone, nationality, currentPassword, newPassword, notificationPreferences } = body;

        // TODO: notificationPreferences updates are not yet implemented.
        // Silently accepting and ignoring this field would mask client bugs, so we log a warning instead.
        if (notificationPreferences !== undefined) {
            console.warn('Profile PATCH: notificationPreferences received but is not handled — field ignored.', {
                userId: session.user.id,
            });
        }

        // If updating email, check if it's already taken
        if (email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser && existingUser.id !== session.user.id) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }
        }

        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password required' }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { password: true },
            });

            if (!user || !(await compare(currentPassword, user.password))) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
            }

            updateData.password = await hash(newPassword, 10);
        }

        // Handle Student Profile updates
        if ((phone || nationality) && session.user.role === 'STUDENT') {
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
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                requiresPasswordChange: true,
                studentProfile: {
                    select: { phone: true, nationality: true, status: true }
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
