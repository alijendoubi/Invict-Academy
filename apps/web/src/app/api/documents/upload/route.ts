import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = (formData.get('type') as string) || 'GENERAL';
        const studentId = formData.get('studentId') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // S3-like Path Structure: students/{studentId}/{type}/{uuid}-{filename}
        const fileName = `${crypto.randomUUID()}-${file.name}`;
        const s3Key = `students/${studentId}/${type}/${fileName}`;

        const isProduction = process.env.NODE_ENV === 'production';
        const s3Bucket = process.env.S3_BUCKET;

        if (s3Bucket) {
            const s3 = new S3Client({
                region: process.env.S3_REGION || 'us-east-1',
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
        } else if (!isProduction) {
            // Local development fallback
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'students', studentId, type);
            await mkdir(uploadDir, { recursive: true });
            const localPath = join(uploadDir, fileName);
            await writeFile(localPath, buffer);
        } else {
            return NextResponse.json({ error: 'S3 configuration missing' }, { status: 500 });
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
            url: s3Bucket ? `s3://${s3Bucket}/${s3Key}` : `/uploads/${s3Key}` // Local dev fallback
        });

    } catch (error) {
        console.error('Document upload error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
