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

        if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        const where: any = {};
        if (search) {
            where.user = {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            };
        }

        const associates = await prisma.associateProfile.findMany({
            where,
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true, createdAt: true },
                },
                leads: {
                    select: { id: true, status: true },
                },
                ledger: {
                    select: { amount: true, status: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Transform to frontend-friendly format
        const result = associates.map(a => {
            const wonLeads = a.leads.filter(l => l.status === 'WON').length;
            const totalCommission = a.ledger
                .filter(l => l.status === 'PAID')
                .reduce((sum, l) => sum + l.amount, 0);

            return {
                id: a.id,
                name: `${a.user.firstName} ${a.user.lastName}`,
                email: a.user.email,
                country: '',
                referrals: a.leads.length,
                converted: wonLeads,
                commission: totalCommission,
                status: 'ACTIVE',
                joinedAt: a.user.createdAt,
                referralCode: a.referralCode,
                commissionRate: a.commissionRate,
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Associates GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function generatePassword(length = 12) {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ') || 'Associate';

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
        }

        const { hash } = await import('bcryptjs');
        const tempPassword = generatePassword();
        const hashedPassword = await hash(tempPassword, 10);

        const referralCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: 'ASSOCIATE',
                associateProfile: {
                    create: {
                        referralCode,
                        commissionRate: 10.00, // Default 10%
                    }
                }
            },
            include: {
                associateProfile: true
            }
        });

        return NextResponse.json({ user, tempPassword });
    } catch (error) {
        console.error('Associate POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

