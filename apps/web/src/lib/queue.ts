// DEMO MODE: Mock queue service
// To restore Redis/BullMQ, uncomment the code below

/*
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

// ... Original Redis/BullMQ implementation
*/

// Types
export interface EmailJob {
    type: 'welcome' | 'application_status' | 'task_reminder' | 'staff_new_lead';
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

// Mock queue service for demo mode
export const queueService = {
    async sendEmail(job: EmailJob) {
        console.log('[DEMO] Mock email queued:', job);
        return { success: true };
    },

    async processDocument(job: DocumentJob) {
        console.log('[DEMO] Mock document queued:', job);
        return { success: true };
    },

    async sendNotification(job: NotificationJob) {
        console.log('[DEMO] Mock notification queued:', job);
        return { success: true };
    },

    async getQueueStats(queueName: 'email' | 'document' | 'notification') {
        console.log('[DEMO] Mock queue stats requested:', queueName);
        return {
            waiting: 0,
            active: 0,
            completed: 10,
            failed: 0,
            total: 10,
        };
    },

    async clearCompleted(queueName: 'email' | 'document' | 'notification') {
        console.log('[DEMO] Mock queue cleared:', queueName);
        return { success: true };
    },
};

// Mock connection getter
export const connection = () => null;
export const getConnection = () => null;
export const getEmailQueue = () => null;
export const getDocumentQueue = () => null;
export const getNotificationQueue = () => null;

