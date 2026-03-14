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
                        value: (student.status ?? 'Unknown').replace(/_/g, ' '),
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

        // Admin/Staff logic - Fetch counts and recent activity in parallel
        const [leadsCount, studentsCount, applicationsCount, revenueData, recentAuditLogs] = await Promise.all([
            prisma.lead.count(),
            prisma.studentProfile.count(),
            prisma.application.count(),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'SUCCESS' },
            }),
            prisma.auditLog.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { firstName: true, lastName: true } } }
            })
        ]);

        const recentActivity = recentAuditLogs.map(log => ({
            id: log.id,
            action: log.action.replace(/_/g, ' '),
            entity: log.entity,
            details: log.details,
            user: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System',
            timestamp: log.createdAt
        }));

        return NextResponse.json({
            role: userRole,
            stats: [
                {
                    name: "Total Leads",
                    value: leadsCount.toString(),
                    change: "All Time",
                    status: "up"
                },
                {
                    name: "Active Students",
                    value: studentsCount.toString(),
                    change: "Real-time",
                    status: "up"
                },
                {
                    name: "Applications",
                    value: applicationsCount.toString(),
                    change: "Across all states",
                    status: "up"
                },
                {
                    name: "Total Revenue",
                    value: `€${(revenueData._sum.amount || 0).toLocaleString()}`,
                    change: "Settled payments",
                    status: "up"
                },
            ],
            recentActivity
        });

    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
