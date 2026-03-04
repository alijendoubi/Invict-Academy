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

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Run all queries in parallel
        const [
            totalRevenue,
            leadsByStatus,
            applicationsByStatus,
            studentCount,
            leadCount,
            applicationCount,
            monthlyData,
        ] = await Promise.all([
            // Total revenue from successful payments
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'SUCCESS' },
            }),
            // Leads grouped by status
            prisma.lead.groupBy({
                by: ['status'],
                _count: { _all: true },
            }),
            // Applications grouped by status
            prisma.application.groupBy({
                by: ['status'],
                _count: { _all: true },
            }),
            // Total students
            prisma.studentProfile.count(),
            // Total leads
            prisma.lead.count(),
            // Total applications
            prisma.application.count(),
            // Monthly breakdown — last 6 months
            Promise.all(
                Array.from({ length: 6 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (5 - i));
                    const start = new Date(date.getFullYear(), date.getMonth(), 1);
                    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
                    const month = start.toLocaleString('en-US', { month: 'short' });
                    return Promise.all([
                        prisma.lead.count({ where: { createdAt: { gte: start, lte: end } } }),
                        prisma.studentProfile.count({ where: { createdAt: { gte: start, lte: end } } }),
                        prisma.application.count({ where: { createdAt: { gte: start, lte: end } } }),
                        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'SUCCESS', createdAt: { gte: start, lte: end } } }),
                    ]).then(([leads, students, applications, revenue]) => ({
                        month,
                        leads,
                        students,
                        applications,
                        revenue: revenue._sum.amount || 0,
                        target: 5000, // static target per month — could be made configurable
                    }));
                })
            ),
        ]);

        // Build lead conversion funnel
        const leadStatusMap: Record<string, number> = {};
        leadsByStatus.forEach(l => { leadStatusMap[l.status] = l._count._all; });
        const conversionFunnel = [
            { stage: 'Total Leads', count: leadCount },
            { stage: 'Contacted', count: leadStatusMap['CONTACTED'] || 0 },
            { stage: 'Qualified', count: leadStatusMap['QUALIFIED'] || 0 },
            { stage: 'Converted', count: leadStatusMap['WON'] || 0 },
        ];

        // Build application status distribution
        const APP_COLORS: Record<string, string> = {
            DRAFT: '#6B7280',
            SUBMITTED: '#3B82F6',
            UNDER_REVIEW: '#8B5CF6',
            APPROVED: '#10B981',
            REJECTED: '#EF4444',
            IN_PROGRESS: '#F59E0B',
        };
        const applicationStatusData = applicationsByStatus.map(a => ({
            name: a.status.replace(/_/g, ' '),
            value: a._count._all,
            color: APP_COLORS[a.status] || '#6B7280',
        }));

        // Students by nationality
        const studentsByNationality = await prisma.studentProfile.groupBy({
            by: ['nationality'],
            _count: { _all: true },
            where: { nationality: { not: null } }
        });

        const studentsByCountry = studentsByNationality
            .map(s => ({
                country: s.nationality || 'Unknown',
                students: s._count._all
            }))
            .sort((a, b) => b.students - a.students)
            .slice(0, 5);

        // Conversion rate
        const wonLeads = leadStatusMap['WON'] || 0;
        const conversionRate = leadCount > 0 ? ((wonLeads / leadCount) * 100).toFixed(1) : '0.0';

        return NextResponse.json({
            kpis: {
                totalRevenue: totalRevenue._sum.amount || 0,
                conversionRate: `${conversionRate}%`,
                activeLetters: studentCount, // Fixed typo from earlier? Wait, it was activeStudents
                activeStudents: studentCount,
                totalApplications: applicationCount,
                acceptedApplications: applicationsByStatus.find(a => a.status === 'APPROVED')?._count._all || 0,
            },
            monthlyData,
            conversionFunnel,
            applicationStatusData,
            studentsByCountry,
        });
    } catch (error) {
        console.error('Analytics stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
