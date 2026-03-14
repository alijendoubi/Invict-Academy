import { Worker } from 'bullmq';
import { connection, EmailJob, DocumentJob, NotificationJob } from '../lib/queue';
import { emailService } from '../lib/email';

// Prevent workers from starting during build phase
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

let emailWorker: Worker<EmailJob> | null = null;
let documentWorker: Worker<DocumentJob> | null = null;
let notificationWorker: Worker<NotificationJob> | null = null;

if (!isBuildPhase) {
    const redisConn = connection();

    if (redisConn) {
        // Email worker
        emailWorker = new Worker<EmailJob>(
            'email-notifications',
            async (job) => {
                console.log(`Processing email job ${job.id}:`, job.data);

                try {
                    const { type, to, data } = job.data;

                    switch (type) {
                        case 'welcome':
                            await emailService.sendWelcomeEmail(to, data.firstName);
                            break;
                        case 'staff_new_lead':
                            await emailService.sendStaffNewLeadNotification(
                                to,
                                data.leadName,
                                data.leadId
                            );
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
            { connection: redisConn }
        );

        // Document worker
        documentWorker = new Worker<DocumentJob>(
            'document-processing',
            async (job) => {
                console.log(`Processing document job ${job.id}:`, job.data);

                try {
                    const { type, userId, data } = job.data;

                    switch (type) {
                        case 'generate_pdf':
                            throw new Error('generate_pdf is not yet implemented');
                        case 'process_upload':
                            throw new Error('process_upload is not yet implemented');
                        default:
                            console.warn(`Unknown document type: ${type}`);
                    }

                    return { success: true };
                } catch (error) {
                    console.error('Document worker error:', error);
                    throw error;
                }
            },
            { connection: redisConn }
        );

        // Notification worker
        notificationWorker = new Worker<NotificationJob>(
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
                            throw new Error('sms notifications are not yet implemented');
                        case 'whatsapp':
                            const { phone, studentName, scheduledAt, consultationId, messageType, message } = data;
                            let msgBody = message;

                            if (messageType === 'meeting_reminder') {
                                msgBody = `Hi ${studentName}, this is a reminder for your consultation at Invict Academy scheduled for ${new Date(scheduledAt).toLocaleString()}. We look forward to seeing you!`;
                            }

                            if (phone && msgBody) {
                                const { twilioService } = await import('../lib/twilio');
                                const res = await twilioService.sendWhatsApp(phone, msgBody);

                                if (res.success && consultationId) {
                                    const { prisma } = await import('../lib/db');
                                    await prisma.consultation.update({
                                        where: { id: consultationId },
                                        data: { reminderSent: true }
                                    });
                                }
                            }
                            break;
                        case 'push':
                            throw new Error('push notifications are not yet implemented');
                        default:
                            console.warn(`Unknown notification type: ${type}`);
                    }

                    return { success: true };
                } catch (error) {
                    console.error('Notification worker error:', error);
                    throw error;
                }
            },
            { connection: redisConn }
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
    } else {
        console.warn('⚠️ Could not start workers: Redis connection not available');
    }

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        console.log('Shutting down workers...');
        await Promise.all([
            emailWorker?.close(),
            documentWorker?.close(),
            notificationWorker?.close(),
        ]);
        process.exit(0);
    });
} else {
    console.log('⏭️ Skipping worker initialization during build phase');
}

export { emailWorker, documentWorker, notificationWorker };

