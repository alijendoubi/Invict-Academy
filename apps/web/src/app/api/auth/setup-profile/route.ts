import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { password, phone, nationality } = body;

        if (!password || password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        // Check if the user is forced to change password
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { requiresPasswordChange: true }
        });

        if (!currentUser || !currentUser.requiresPasswordChange) {
            return NextResponse.json({ error: 'Password change not required for this account' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const isStudent = session.user.role === 'STUDENT';

        // Update the user password and remove the flag
        // Only upsert the studentProfile if the user is a STUDENT
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                requiresPasswordChange: false,
                ...(isStudent && {
                    studentProfile: {
                        upsert: {
                            create: {
                                phone: phone || undefined,
                                nationality: nationality || undefined,
                            },
                            update: {
                                phone: phone || undefined,
                                nationality: nationality || undefined,
                            }
                        }
                    }
                }),
            }
        });

        return NextResponse.json({ success: true, message: 'Profile completed successfully' });

    } catch (error) {
        console.error('Setup Profile error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
