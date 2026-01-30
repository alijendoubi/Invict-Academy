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

export const getConnection = () => {
    if (typeof window !== 'undefined') return null; // Prevent client-side usage

    if (!redisConnection) {
        redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            maxRetriesPerRequest: null,
            // Add connection timeout and retry strategy for better stability
            connectTimeout: 10000,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });

        redisConnection.on('error', (err) => {
            if (process.env.NEXT_PHASE === 'phase-production-build') {
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
    if (!_emailQueue) {
        const conn = getConnection();
        if (!conn) throw new Error('Redis connection not available');
        _emailQueue = new Queue<EmailJob>('email-notifications', { connection: conn });
    }
    return _emailQueue;
};

export const getDocumentQueue = () => {
    if (!_documentQueue) {
        const conn = getConnection();
        if (!conn) throw new Error('Redis connection not available');
        _documentQueue = new Queue<DocumentJob>('document-processing', { connection: conn });
    }
    return _documentQueue;
};

export const getNotificationQueue = () => {
    if (!_notificationQueue) {
        const conn = getConnection();
        if (!conn) throw new Error('Redis connection not available');
        _notificationQueue = new Queue<NotificationJob>('notifications', { connection: conn });
    }
    return _notificationQueue;
};

// Maintain backward compatibility with existing imports by using proxies or getters
export const emailQueue = typeof Proxy !== 'undefined' ? new Proxy({} as Queue<EmailJob>, {
    get: (_, prop) => {
        const queue = getEmailQueue();
        const value = (queue as any)[prop];
        return typeof value === 'function' ? value.bind(queue) : value;
    }
}) : null as unknown as Queue<EmailJob>;

export const documentQueue = typeof Proxy !== 'undefined' ? new Proxy({} as Queue<DocumentJob>, {
    get: (_, prop) => {
        const queue = getDocumentQueue();
        const value = (queue as any)[prop];
        return typeof value === 'function' ? value.bind(queue) : value;
    }
}) : null as unknown as Queue<DocumentJob>;

export const notificationQueue = typeof Proxy !== 'undefined' ? new Proxy({} as Queue<NotificationJob>, {
    get: (_, prop) => {
        const queue = getNotificationQueue();
        const value = (queue as any)[prop];
        return typeof value === 'function' ? value.bind(queue) : value;
    }
}) : null as unknown as Queue<NotificationJob>;

// Queue utilities using the lazy getters
export const queueService = {
    async sendEmail(job: EmailJob) {
        try {
            await getEmailQueue().add('send-email', job, {
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
            await getDocumentQueue().add('process-document', job, {
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
            await getNotificationQueue().add('send-notification', job, {
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

        await queue.clean(24 * 60 * 60 * 1000, 100, 'completed');
        return { success: true };
    },
};

// Export connection getter and original connection variable (as a getter proxy) for workers
export const connection = typeof Proxy !== 'undefined' ? new Proxy({} as Redis, {
    get: (_, prop) => {
        const conn = getConnection();
        if (!conn) return undefined;
        const value = (conn as any)[prop];
        return typeof value === 'function' ? value.bind(conn) : value;
    }
}) : null as unknown as Redis;

