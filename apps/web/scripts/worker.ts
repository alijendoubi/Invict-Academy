import { Worker } from 'bullmq';
import { prisma } from '../src/lib/db'; // Ensure this path resolves or use module alias

// Redis Connection (Env variables in .invict-academy/.env)
// For local dev without Docker, assume local Redis or Upstash URL
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

async function sendEmail(to: string, subject: string, body: string) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
    // Implement Resend/SendGrid logic here
}

const worker = new Worker('notifications', async job => {
    console.log(`Processing job ${job.name} with data`, job.data);

    if (job.name === 'lead-welcome') {
        await sendEmail(job.data.email, 'Welcome to Invict Academy', 'Thank you for your interest...');

        // Update DB if needed
        await prisma.notificationLog.create({
            data: {
                userId: 'SYSTEM', // or link to lead if user created
                channel: 'EMAIL',
                type: 'LEAD_WELCOME',
                content: `Sent welcome email to ${job.data.email}`,
                user: { connect: { id: '...' } } // This would fail if no user. Schema might need loose linking or optional user.
            }
        }).catch(err => console.error("Log error", err));
    }
}, { connection });

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});

console.log("Worker started...");
