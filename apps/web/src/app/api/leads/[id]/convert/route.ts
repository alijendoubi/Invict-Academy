import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, logAudit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: leadId } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        if (lead.status !== 'WON') {
            return NextResponse.json({ error: 'Only leads with status WON can be converted' }, { status: 400 });
        }

        // Check if this lead was already converted (user with same email exists)
        const existingUser = await prisma.user.findUnique({ where: { email: lead.email } });
        if (existingUser) {
            return NextResponse.json({ error: 'This lead has already been converted to a student account' }, { status: 409 });
        }

        // Generate temporary password (same pattern as students/route.ts)
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const temporaryPassword = `Invict-${randomPart}!`;

        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Create user + student profile and mark lead converted atomically
        const { user } = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    email: lead.email,
                    firstName: lead.firstName,
                    lastName: lead.lastName,
                    password: hashedPassword,
                    role: 'STUDENT',
                    requiresPasswordChange: true,
                    studentProfile: {
                        create: {
                            phone: lead.phone,
                            degreeLevel: lead.degreeLevel,
                            status: 'ACTIVE',
                            assignedToId: lead.assignedToId || (session.user.role === 'STAFF' ? session.user.id : null),
                        }
                    }
                } as any,
                include: {
                    studentProfile: true,
                }
            }) as any;

            // Mark lead as converted — keeps WON status for reporting; email uniqueness check above prevents double conversion
            await tx.lead.update({
                where: { id: leadId },
                data: {
                    notes: `${lead.notes ? lead.notes + '\n' : ''}[CONVERTED] Converted to student on ${new Date().toISOString().split('T')[0]} (User: ${createdUser.id})`,
                },
            });

            return { user: createdUser };
        });

        await logAudit(
            'CONVERT_LEAD',
            'Lead',
            leadId,
            `Converted lead "${lead.firstName} ${lead.lastName}" to student (User: ${user.id})`
        );

        return NextResponse.json({
            success: true,
            student: user.studentProfile,
            user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
            temporaryPassword,
        });
    } catch (error) {
        console.error('Lead convert error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
