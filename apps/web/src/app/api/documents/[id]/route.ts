import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess, logAudit } from '@/lib/auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { twilioService, TEMPLATES } from '@/lib/twilio';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const document = await prisma.document.findUnique({
            where: { id },
            select: {
                id: true,
                studentId: true,
                filename: true,
                s3Key: true,
                mimeType: true,
            },
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const hasAccess = await verifyStudentAccess(document.studentId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const s3 = new S3Client({
            region: process.env.S3_REGION || 'eu-north-1',
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || '',
                secretAccessKey: process.env.S3_SECRET_KEY || '',
            },
            forcePathStyle: true,
        });

        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: document.s3Key,
        });

        const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return NextResponse.json({ ...document, downloadUrl });
    } catch (error) {
        console.error('Document GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.user.role);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Only admins can verify documents' }, { status: 403 });
        }

        const body = await request.json();
        const { status, rejectionReason } = body;

        if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Status must be APPROVED or REJECTED' }, { status: 400 });
        }

        if (status === 'REJECTED' && !rejectionReason) {
            return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
        }

        const document = await prisma.document.findUnique({
            where: { id },
            select: { id: true, studentId: true, filename: true, type: true },
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const hasAccess = await verifyStudentAccess(document.studentId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updated = await prisma.document.update({
            where: { id },
            data: {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : null,
            },
        });

        await logAudit(
            status === 'APPROVED' ? 'APPROVE_DOCUMENT' : 'REJECT_DOCUMENT',
            'Document',
            id,
            `${status} document "${document.filename}"${rejectionReason ? `: ${rejectionReason}` : ''}`
        );

        // ── Send "Documents Needed" template when a document is rejected ───────
        if (status === 'REJECTED') {
            try {
                const student = await prisma.studentProfile.findUnique({
                    where: { id: document.studentId },
                    include: { user: { select: { firstName: true } } },
                });

                if (student?.phone) {
                    await twilioService.sendTemplate(
                        student.phone,
                        TEMPLATES.DOCUMENTS_NEEDED,
                        {
                            '1': student.user.firstName || 'Student',
                            '2': document.type || document.filename,
                        }
                    );
                }
            } catch (notifyError) {
                console.error('Document rejection notification failed (non-fatal):', notifyError);
            }
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Document PATCH error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
