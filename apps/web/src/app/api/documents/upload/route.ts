import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max duration for Vercel functions (seconds)

// No built-in Next.js body parser limits apply to route.ts when reading from request.formData() directly, 
// but in Pages router it would need config.api.bodyParser.
// S3 configuration directly handles the payload.

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = (formData.get('type') as string) || 'GENERAL';
        let studentId = formData.get('studentId') as string;

        // resolve studentId from session if missing (for students)
        if ((!studentId || studentId === "null" || studentId === "undefined") && session.user?.role === 'STUDENT') {
            const profile = await prisma.studentProfile.findUnique({
                where: { userId: session.userId || session.user?.id }
            });
            if (profile) studentId = profile.id;
        }

        if (!studentId || studentId === "null" || studentId === "undefined") {
            return NextResponse.json({
                error: 'Student ID missing',
                details: 'Please ensure you are logged in as a student or provide a valid student ID.'
            }, { status: 400 });
        }

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // S3-like Path Structure: students/{studentId}/{type}/{uuid}-{filename}
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${crypto.randomUUID()}-${sanitizedFilename}`;
        const s3Key = `students/${studentId}/${type}/${fileName}`;

        const s3Bucket = process.env.S3_BUCKET;

        if (!s3Bucket) {
            console.error("S3_BUCKET configuration missing from environment variables.");
            return NextResponse.json({ error: 'S3 configuration missing' }, { status: 500 });
        }

        try {
            const s3 = new S3Client({
                region: process.env.S3_REGION || 'eu-north-1',
                endpoint: process.env.S3_ENDPOINT,
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY || '',
                    secretAccessKey: process.env.S3_SECRET_KEY || '',
                },
                forcePathStyle: true,
            });

            await s3.send(
                new PutObjectCommand({
                    Bucket: s3Bucket,
                    Key: s3Key,
                    Body: buffer,
                    ContentType: file.type,
                })
            );
        } catch (s3Error) {
            console.error("S3 Upload Error:", s3Error);
            return NextResponse.json({ error: 'Failed to upload to S3', details: String(s3Error) }, { status: 500 });
        }

        // If it's the demo fallback studentId, skip DB creation to prevent Foreign Key constraint errors
        if (studentId === "demo-123") {
            return NextResponse.json({
                message: 'Demo mode: Document uploaded successfully to S3',
                document: { id: "demo-doc-123", s3Key, filename: file.name, status: 'PENDING' },
                url: `s3://${s3Bucket}/${s3Key}`
            });
        }

        // Save metadata to database
        const document = await prisma.document.create({
            data: {
                studentId,
                type,
                s3Key, // This is the identifier used by S3
                filename: file.name,
                mimeType: file.type,
                size: file.size,
                status: 'PENDING',
            }
        });

        return NextResponse.json({
            message: 'Document uploaded successfully',
            document,
            url: `s3://${s3Bucket}/${s3Key}`
        });

    } catch (error: any) {
        console.error('Document upload error:', error);
        return NextResponse.json({ error: error?.message || String(error), isInternalError: true }, { status: 500 });
    }
}

// GET route to list documents for a student
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');

        if (!studentId) {
            return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
        }

        const documents = await prisma.document.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(documents);
    } catch (error) {
        console.error('Documents GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
