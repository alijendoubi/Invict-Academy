import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

// Types
export interface EmailJob {
    type: 'welcome' | 'application_status' | 'task_reminder';
    to: string;
    data: Record<string, any>;
}

export interface DocumentJob {
    type: 'generate_pdf' | 'process_upload';
    userId: string;
    data: Record<string, any>;
}

export interface NotificationJob {
    type: 'email' | 'sms' | 'push';
    userId: string;
    data: Record<string, any>;
}

// Lazy-loaded Redis connection
let redisConnection: Redis | null = null;
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

export const getConnection = () => {
    if (typeof window !== 'undefined' || isBuildPhase) return null;

    if (!redisConnection) {
        console.log('🔌 Initializing Redis connection...');
        redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            maxRetriesPerRequest: null,
            // Add connection timeout and retry strategy for better stability
            connectTimeout: 10000,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        redisConnection.on('error', (err) => {
            if (isBuildPhase) {
                // Ignore Redis errors during build phase
                return;
            }
            console.error('Redis connection error:', err);
        });
    }
    return redisConnection;
};

// Lazy-loaded Queues
let _emailQueue: Queue<EmailJob> | null = null;
let _documentQueue: Queue<DocumentJob> | null = null;
let _notificationQueue: Queue<NotificationJob> | null = null;

export const getEmailQueue = () => {
    if (isBuildPhase) return null;
    if (!_emailQueue) {
        const conn = getConnection();
        if (!conn) return null;
        _emailQueue = new Queue<EmailJob>('email-notifications', { connection: conn });
    }
    return _emailQueue;
};

export const getDocumentQueue = () => {
    if (isBuildPhase) return null;
    if (!_documentQueue) {
        const conn = getConnection();
        if (!conn) return null;
        _documentQueue = new Queue<DocumentJob>('document-processing', { connection: conn });
    }
    return _documentQueue;
};

export const getNotificationQueue = () => {
    if (isBuildPhase) return null;
    if (!_notificationQueue) {
        const conn = getConnection();
        if (!conn) return null;
        _notificationQueue = new Queue<NotificationJob>('notifications', { connection: conn });
    }
    return _notificationQueue;
};

// Queue utilities using the lazy getters
export const queueService = {
    async sendEmail(job: EmailJob) {
        try {
            const queue = getEmailQueue();
            if (!queue) return { success: false, error: 'Queue not available during build' };
            await queue.add('send-email', job, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 2000 },
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to queue email:', error);
            return { success: false, error };
        }
    },

    async processDocument(job: DocumentJob) {
        try {
            const queue = getDocumentQueue();
            if (!queue) return { success: false, error: 'Queue not available during build' };
            await queue.add('process-document', job, {
                attempts: 2,
                backoff: { type: 'fixed', delay: 5000 },
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to queue document:', error);
            return { success: false, error };
        }
    },

    async sendNotification(job: NotificationJob) {
        try {
            const queue = getNotificationQueue();
            if (!queue) return { success: false, error: 'Queue not available during build' };
            await queue.add('send-notification', job, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to queue notification:', error);
            return { success: false, error };
        }
    },

    async getQueueStats(queueName: 'email' | 'document' | 'notification') {
        const queue = queueName === 'email' ? getEmailQueue() :
            queueName === 'document' ? getDocumentQueue() :
                getNotificationQueue();

        if (!queue) return null;

        const [waiting, active, completed, failed] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
        ]);

        return {
            waiting, active, completed, failed,
            total: waiting + active + completed + failed,
        };
    },

    async clearCompleted(queueName: 'email' | 'document' | 'notification') {
        const queue = queueName === 'email' ? getEmailQueue() :
            queueName === 'document' ? getDocumentQueue() :
                getNotificationQueue();

        if (!queue) return { success: false };
        await queue.clean(24 * 60 * 60 * 1000, 100, 'completed');
        return { success: true };
    },
};

// Export connection getter for workers
export const connection = getConnection;
