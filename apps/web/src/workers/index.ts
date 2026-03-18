import { Worker } from 'bullmq';
import { connection, EmailJob, DocumentJob, NotificationJob } from '../lib/queue';
import { emailService } from '../lib/email';

// Prevent workers from starting during build phase
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

let emailWorker: Worker | null = null;
let documentWorker: Worker | null = null;
let notificationWorker: Worker | null = null;

if (!isBuildPhase) {
    const redisConn = connection();

    if (redisConn) {
        // ─── Email worker ──────────────────────────────────────────────────────
        emailWorker = new Worker(
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
                    throw error;
                }
            },
            { connection: redisConn as any }
        );

        // ─── Document worker ───────────────────────────────────────────────────
        documentWorker = new Worker(
            'document-processing',
            async (job) => {
                console.log(`Processing document job ${job.id}:`, job.data);

                try {
                    const { type } = job.data;

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
            { connection: redisConn as any }
        );

        // ─── Notification worker ───────────────────────────────────────────────
        notificationWorker = new Worker(
            'notifications',
            async (job) => {
                console.log(`Processing notification job ${job.id}:`, job.data);

                try {
                    const { type, data } = job.data;

                    switch (type) {
                        case 'email':
                            // Handled by email worker
                            break;

                        case 'sms':
                            throw new Error('SMS notifications are not yet implemented');

                        case 'push':
                            throw new Error('Push notifications are not yet implemented');

                        case 'whatsapp': {
                            const {
                                phone,
                                studentName,
                                scheduledAt,
                                consultationId,
                                messageType,
                                contentSid,
                                variables,
                                message,
                            } = data;

                            if (!phone) {
                                console.warn('WhatsApp job has no phone number — skipping');
                                break;
                            }

                            const { twilioService, TEMPLATES } = await import('../lib/twilio');

                            if (messageType === 'meeting_reminder') {
                                // ── Consultation Reminder template ──
                                const formattedTime = new Date(scheduledAt).toLocaleString('en-GB', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'Europe/Rome',
                                });

                                const res = await twilioService.sendTemplate(
                                    phone,
                                    TEMPLATES.CONSULTATION_REMINDER,
                                    {
                                        '1': studentName || 'Student',
                                        '2': formattedTime,
                                    }
                                );

                                if (res.success && consultationId) {
                                    const { prisma } = await import('../lib/db');
                                    await prisma.consultation.update({
                                        where: { id: consultationId },
                                        data: { reminderSent: true },
                                    });
                                }
                            } else if (contentSid && variables) {
                                // ── Generic template call ──
                                await twilioService.sendTemplate(phone, contentSid, variables);
                            } else if (message) {
                                // ── Plain text fallback ──
                                await twilioService.sendWhatsApp(phone, message);
                            } else {
                                console.warn('WhatsApp job has no message body or template — skipping');
                            }
                            break;
                        }

                        default:
                            console.warn(`Unknown notification type: ${type}`);
                    }

                    return { success: true };
                } catch (error) {
                    console.error('Notification worker error:', error);
                    throw error;
                }
            },
            { connection: redisConn as any }
        );

        // ─── Worker event listeners ────────────────────────────────────────────
        [emailWorker, documentWorker, notificationWorker].forEach((worker) => {
            worker.on('completed', (job) => {
                console.log(`✅ Job ${job.id} completed`);
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
    console.log('⏭️ Skipping worker initialisation during build phase');
}

export { emailWorker, documentWorker, notificationWorker };
