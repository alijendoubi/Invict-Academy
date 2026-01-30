import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { DocumentStatus } from '@invict/db';

@Injectable()
export class DocumentsService {
    constructor(
        private prisma: PrismaService,
        private storage: StorageService
    ) { }

    async initializeUpload(studentId: string, filename: string, mimeType: string) {
        const key = `students/${studentId}/${Date.now()}-${filename}`;
        const uploadUrl = await this.storage.getUploadUrl(key, mimeType);

        // We don't create the DB record yet, or we create it as PENDING_UPLOAD?
        // Simplified: Create as PENDING
        const doc = await this.prisma.document.create({
            data: {
                studentId,
                filename,
                mimeType,
                s3Key: key,
                size: 0, // Updated after upload confirmation
                type: 'GENERAL',
                status: DocumentStatus.PENDING,
            }
        });

        return { uploadUrl, document: doc };
    }

    async getDocumentUrl(id: string) {
        const doc = await this.prisma.document.findUnique({ where: { id } });
        if (!doc) throw new Error('Document not found');
        return this.storage.getDownloadUrl(doc.s3Key);
    }
}
