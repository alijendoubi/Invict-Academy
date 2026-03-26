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
        ]);

        // Monthly breakdown — last 6 months (4 queries total instead of 24)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const [allLeadsInRange, allStudentsInRange, allAppsInRange, allPaymentsInRange] = await Promise.all([
            prisma.lead.findMany({
                where: { createdAt: { gte: sixMonthsAgo } },
                select: { createdAt: true },
            }),
            prisma.studentProfile.findMany({
                where: { createdAt: { gte: sixMonthsAgo } },
                select: { createdAt: true },
            }),
            prisma.application.findMany({
                where: { createdAt: { gte: sixMonthsAgo } },
                select: { createdAt: true },
            }),
            prisma.payment.findMany({
                where: { createdAt: { gte: sixMonthsAgo }, status: 'SUCCESS' },
                select: { createdAt: true, amount: true },
            }),
        ]);

        const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        function getMonthKey(date: Date) {
            return `${date.getFullYear()}-${date.getMonth()}`;
        }

        const monthlyData = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return {
                month: MONTHS[d.getMonth()],
                year: d.getFullYear(),
                monthKey: `${d.getFullYear()}-${d.getMonth()}`,
                leads: 0,
                students: 0,
                applications: 0,
                revenue: 0,
                target: 5000,
            };
        });

        const monthKeyToIdx = Object.fromEntries(monthlyData.map((m, i) => [m.monthKey, i]));

        for (const lead of allLeadsInRange) {
            const key = getMonthKey(new Date(lead.createdAt));
            if (key in monthKeyToIdx) monthlyData[monthKeyToIdx[key]].leads++;
        }
        for (const student of allStudentsInRange) {
            const key = getMonthKey(new Date(student.createdAt));
            if (key in monthKeyToIdx) monthlyData[monthKeyToIdx[key]].students++;
        }
        for (const app of allAppsInRange) {
            const key = getMonthKey(new Date(app.createdAt));
            if (key in monthKeyToIdx) monthlyData[monthKeyToIdx[key]].applications++;
        }
        for (const payment of allPaymentsInRange) {
            const key = getMonthKey(new Date(payment.createdAt));
            if (key in monthKeyToIdx) monthlyData[monthKeyToIdx[key]].revenue += payment.amount;
        }

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
        // Keys must match ApplicationStatus enum exactly. IN_PROGRESS is not a valid status — removed.
        const APP_COLORS: Record<string, string> = {
            DRAFT: '#6B7280',
            DOCUMENTS_PENDING: '#F59E0B',
            SUBMITTED: '#3B82F6',
            UNDER_REVIEW: '#8B5CF6',
            APPROVED: '#10B981',
            REJECTED: '#EF4444',
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

        const response = NextResponse.json({
            kpis: {
                totalRevenue: totalRevenue._sum.amount || 0,
                conversionRate: `${conversionRate}%`,
                activeStudents: studentCount,
                totalApplications: applicationCount,
                acceptedApplications: applicationsByStatus.find(a => a.status === 'APPROVED')?._count._all || 0,
            },
            monthlyData,
            conversionFunnel,
            applicationStatusData,
            studentsByCountry,
        });
        response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=600');
        return response;
    } catch (error) {
        console.error('Analytics stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
