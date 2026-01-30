import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

// Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// Define job types
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

// Create queues
export const emailQueue = new Queue<EmailJob>('email-notifications', { connection });
export const documentQueue = new Queue<DocumentJob>('document-processing', { connection });
export const notificationQueue = new Queue<NotificationJob>('notifications', { connection });

// Queue utilities
export const queueService = {
    /**
     * Add email job to queue
     */
    async sendEmail(job: EmailJob) {
        try {
            await emailQueue.add('send-email', job, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to queue email:', error);
            return { success: false, error };
        }
    },

    /**
     * Add document processing job
     */
    async processDocument(job: DocumentJob) {
        try {
            await documentQueue.add('process-document', job, {
                attempts: 2,
                backoff: {
                    type: 'fixed',
                    delay: 5000,
                },
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to queue document:', error);
            return { success: false, error };
        }
    },

    /**
     * Add notification job
     */
    async sendNotification(job: NotificationJob) {
        try {
            await notificationQueue.add('send-notification', job, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            });
            return { success: true };
        } catch (error) {
            console.error('Failed to queue notification:', error);
            return { success: false, error };
        }
    },

    /**
     * Get queue statistics
     */
    async getQueueStats(queueName: 'email' | 'document' | 'notification') {
        const queue = queueName === 'email' ? emailQueue :
            queueName === 'document' ? documentQueue :
                notificationQueue;

        const [waiting, active, completed, failed] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
        ]);

        return {
            waiting,
            active,
            completed,
            failed,
            total: waiting + active + completed + failed,
        };
    },

    /**
     * Clear completed jobs
     */
    async clearCompleted(queueName: 'email' | 'document' | 'notification') {
        const queue = queueName === 'email' ? emailQueue :
            queueName === 'document' ? documentQueue :
                notificationQueue;

        await queue.clean(24 * 60 * 60 * 1000, 100, 'completed'); // Clean jobs older than 24h
        return { success: true };
    },
};

// Export for worker setup
export { connection };
