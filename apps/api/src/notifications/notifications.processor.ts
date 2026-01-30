import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'send-lead-welcome':
                return this.sendEmail(job.data.email, 'Welcome to Invict Academy', `Hi ${job.data.name}, thanks for contacting us!`);
            case 'send-staff-notification':
                return this.sendEmail(job.data.email, 'New Lead Received', `Check dashboard for new lead: ${job.data.leadName}`);
            default:
                console.warn(`Unknown job name: ${job.name}`);
        }
    }

    private async sendEmail(to: string, subject: string, body: string) {
        // Mock email sending
        console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
        return Promise.resolve();
    }
}
