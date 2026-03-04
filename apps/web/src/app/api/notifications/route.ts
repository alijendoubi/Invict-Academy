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

        const role = session.user.role;
        const notifications: any[] = [];

        if (role === 'STUDENT') {
            // Student: show their unread messages from advisors
            const studentProfile = await prisma.studentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true },
            });

            if (studentProfile) {
                const messages = await prisma.studentMessage.findMany({
                    where: { studentId: studentProfile.id, fromAdmin: true, readAt: null },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                });

                for (const msg of messages) {
                    notifications.push({
                        id: msg.id,
                        type: 'MESSAGE',
                        title: msg.subject || 'New message from your advisor',
                        body: msg.content.slice(0, 100) + (msg.content.length > 100 ? '…' : ''),
                        createdAt: msg.createdAt,
                        read: false,
                        href: '/dashboard/student',
                    });
                }

                // Docs that were reviewed
                const reviewedDocs = await prisma.document.findMany({
                    where: { studentId: studentProfile.id, status: { in: ['APPROVED', 'REJECTED'] } },
                    orderBy: { updatedAt: 'desc' },
                    take: 5,
                });

                for (const doc of reviewedDocs) {
                    notifications.push({
                        id: `doc-${doc.id}`,
                        type: doc.status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
                        title: doc.status === 'APPROVED'
                            ? `Document approved: ${doc.type}`
                            : `Document needs attention: ${doc.type}`,
                        body: doc.status === 'REJECTED' ? (doc.rejectionReason || 'Please re-upload.') : 'Your document has been verified.',
                        createdAt: doc.updatedAt,
                        read: true,
                        href: '/dashboard/student',
                    });
                }
            }
        } else {
            // Admin/Staff: new leads, pending documents, new students
            const [newLeads, pendingDocs, newStudents] = await Promise.all([
                prisma.lead.findMany({
                    where: { status: 'NEW' },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: { id: true, firstName: true, lastName: true, createdAt: true },
                }),
                prisma.document.findMany({
                    where: { status: 'PENDING' },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        student: { include: { user: { select: { firstName: true, lastName: true } } } }
                    },
                }),
                prisma.studentProfile.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    include: { user: { select: { firstName: true, lastName: true, createdAt: true } } },
                }),
            ]);

            for (const lead of newLeads) {
                notifications.push({
                    id: `lead-${lead.id}`,
                    type: 'LEAD',
                    title: `New lead: ${lead.firstName} ${lead.lastName}`,
                    body: 'New inquiry received — assign and follow up.',
                    createdAt: lead.createdAt,
                    read: false,
                    href: '/dashboard/leads',
                });
            }

            for (const doc of pendingDocs) {
                notifications.push({
                    id: `doc-${doc.id}`,
                    type: 'DOCUMENT',
                    title: `Document review needed`,
                    body: `${doc.student.user.firstName} ${doc.student.user.lastName} uploaded: ${doc.type}`,
                    createdAt: doc.createdAt,
                    read: false,
                    href: '/dashboard/students',
                });
            }

            for (const s of newStudents) {
                notifications.push({
                    id: `student-${s.id}`,
                    type: 'STUDENT',
                    title: `New student: ${s.user.firstName} ${s.user.lastName}`,
                    body: 'A new student account has been created.',
                    createdAt: s.user.createdAt,
                    read: true,
                    href: '/dashboard/students',
                });
            }
        }

        // Sort by date desc and return top 10
        notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(notifications.slice(0, 10));
    } catch (error) {
        console.error('Notifications GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
