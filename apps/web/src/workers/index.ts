import { Worker } from 'bullmq';
import { connection, EmailJob, DocumentJob, NotificationJob } from '../lib/queue';
import { emailService } from '../lib/email';

// Email worker
const emailWorker = new Worker<EmailJob>(
    'email-notifications',
    async (job) => {
        console.log(`Processing email job ${job.id}:`, job.data);

        try {
            const { type, to, data } = job.data;

            switch (type) {
                case 'welcome':
                    await emailService.sendWelcomeEmail(to, data.firstName);
                    break;
                case 'application_status':
                    await emailService.sendApplicationStatusUpdate(
                        to,
                        data.firstName,
                        data.university,
                        data.status
                    );
                    break;
                case 'task_reminder':
                    await emailService.sendTaskReminder(
                        to,
                        data.firstName,
                        data.taskTitle,
                        data.dueDate
                    );
                    break;
                default:
                    console.warn(`Unknown email type: ${type}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Email worker error:', error);
            throw error; // Will trigger retry
        }
    },
    { connection }
);

// Document worker
const documentWorker = new Worker<DocumentJob>(
    'document-processing',
    async (job) => {
        console.log(`Processing document job ${job.id}:`, job.data);

        try {
            const { type, userId, data } = job.data;

            switch (type) {
                case 'generate_pdf':
                    // TODO: Implement PDF generation
                    console.log(`Generating PDF for user ${userId}`);
                    break;
                case 'process_upload':
                    // TODO: Implement file processing (virus scan, compression, etc.)
                    console.log(`Processing upload for user ${userId}`);
                    break;
                default:
                    console.warn(`Unknown document type: ${type}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Document worker error:', error);
            throw error;
        }
    },
    { connection }
);

// Notification worker
const notificationWorker = new Worker<NotificationJob>(
    'notifications',
    async (job) => {
        console.log(`Processing notification job ${job.id}:`, job.data);

        try {
            const { type, userId, data } = job.data;

            switch (type) {
                case 'email':
                    // Already handled by email worker
                    break;
                case 'sms':
                    // TODO: Implement SMS via Twilio
                    console.log(`Sending SMS to user ${userId}`);
                    break;
                case 'push':
                    // TODO: Implement push notifications
                    console.log(`Sending push notification to user ${userId}`);
                    break;
                default:
                    console.warn(`Unknown notification type: ${type}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Notification worker error:', error);
            throw error;
        }
    },
    { connection }
);

// Worker event listeners
[emailWorker, documentWorker, notificationWorker].forEach((worker) => {
    worker.on('completed', (job) => {
        console.log(`✅ Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job?.id} failed:`, err);
    });

    worker.on('error', (err) => {
        console.error('Worker error:', err);
    });
});

console.log('🚀 Workers started successfully');

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down workers...');
    await Promise.all([
        emailWorker.close(),
        documentWorker.close(),
        notificationWorker.close(),
    ]);
    process.exit(0);
});
