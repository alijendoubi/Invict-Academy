import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyStudentAccess } from '@/lib/auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const document = await prisma.document.findUnique({
            where: { id },
            select: {
                id: true,
                studentId: true,
                filename: true,
                s3Key: true,
                mimeType: true
            }
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        // Access Control: Only student owner or assigned Admin/Staff
        const hasAccess = await verifyStudentAccess(document.studentId);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Production implementation: Generate a presigned URL for S3/Supabase Storage
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

        // URL expires in 1 hour (3600 seconds)
        const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return NextResponse.json({
            ...document,
            downloadUrl
        });
    } catch (error) {
        console.error('Document GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
