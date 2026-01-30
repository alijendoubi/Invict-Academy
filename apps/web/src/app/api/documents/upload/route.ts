import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;
        const studentId = formData.get('studentId') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // S3-like Path Structure: students/{studentId}/{type}/{uuid}-{filename}
        const fileName = `${uuidv4()}-${file.name}`;
        const s3Key = `students/${studentId}/${type}/${fileName}`;

        // For local development, save to public/uploads
        // In production, this would be: s3.putObject({ Bucket: process.env.S3_BUCKET, Key: s3Key, Body: buffer })
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'students', studentId, type);
        await mkdir(uploadDir, { recursive: true });
        const localPath = join(uploadDir, fileName);
        await writeFile(localPath, buffer);

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
            url: `/uploads/${s3Key}` // Mapped to public path for local dev
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
