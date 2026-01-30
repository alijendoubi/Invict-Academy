import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRole = session.user.role;

        if (userRole === 'STUDENT') {
            const student = await prisma.studentProfile.findUnique({
                where: { userId: session.user.id },
                include: {
                    applications: {
                        select: { status: true }
                    },
                    documents: {
                        select: { status: true }
                    }
                }
            });

            if (!student) {
                return NextResponse.json({ stats: [], role: 'STUDENT' });
            }

            return NextResponse.json({
                role: 'STUDENT',
                stats: [
                    {
                        name: "Application Status",
                        value: student.status.replace(/_/g, ' '),
                        change: "Live Tracking",
                        status: "up"
                    },
                    {
                        name: "Readiness Score",
                        value: `${student.readinessScore}%`,
                        change: "Based on docs",
                        status: "up"
                    },
                    {
                        name: "Applications",
                        value: student.applications.length.toString(),
                        change: "Total active",
                        status: "up"
                    },
                    {
                        name: "Documents",
                        value: `${student.documents.filter(d => d.status === 'APPROVED').length}/${student.documents.length}`,
                        change: "Approved",
                        status: "up"
                    },
                ],
                progress: {
                    status: student.status,
                    score: student.readinessScore
                }
            });
        }

        // Admin/Staff logic - Fetch counts in parallel
        const [leadsCount, studentsCount, applicationsCount, revenueData] = await Promise.all([
            prisma.lead.count(),
            prisma.studentProfile.count(),
            prisma.application.count(),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'SUCCESS' },
            }),
        ]);

        return NextResponse.json({
            role: userRole,
            stats: [
                {
                    name: "Total Leads",
                    value: leadsCount.toString(),
                    change: "+5%",
                    status: "up"
                },
                {
                    name: "Active Students",
                    value: studentsCount.toString(),
                    change: "+2%",
                    status: "up"
                },
                {
                    name: "Applications",
                    value: applicationsCount.toString(),
                    change: "+12%",
                    status: "up"
                },
                {
                    name: "Revenue (MTD)",
                    value: `€${(revenueData._sum.amount || 0).toLocaleString()}`,
                    change: "+8%",
                    status: "up"
                },
            ],
            recentActivity: []
        });

    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
