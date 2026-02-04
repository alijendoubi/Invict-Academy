// DEMO MODE: Mock email service
// To restore real email, uncomment the code below

/*
import { EmailService } from '@invict/email';

const emailServiceInstance = new EmailService(
  process.env.RESEND_API_KEY || 'placeholder-key',
  process.env.FROM_EMAIL,
  process.env.NEXT_PUBLIC_APP_URL
);

export const emailService = {
  sendWelcomeEmail: (to: string, firstName: string) =>
    emailServiceInstance.sendWelcomeEmail(to, firstName),

  sendStaffNewLeadNotification: (to: string, leadName: string, leadId: string) =>
    emailServiceInstance.sendStaffNewLeadNotification(to, leadName, leadId),

  sendApplicationStatusUpdate: (to: string, firstName: string, university: string, status: string) =>
    emailServiceInstance.sendApplicationStatusUpdate(to, firstName, university, status),

  sendTaskReminder: (to: string, firstName: string, taskTitle: string, dueDate: string) =>
    emailServiceInstance.sendTaskReminder(to, firstName, taskTitle, dueDate),
};
*/

// Mock email service for demo mode
export const emailService = {
  async sendWelcomeEmail(to: string, firstName: string) {
    console.log('[DEMO] Mock email sent: Welcome Email', { to, firstName });
    return { success: true, messageId: `mock_${Date.now()}` };
  },

  async sendStaffNewLeadNotification(to: string, leadName: string, leadId: string) {
    console.log('[DEMO] Mock email sent: New Lead Notification', { to, leadName, leadId });
    return { success: true, messageId: `mock_${Date.now()}` };
  },

  async sendApplicationStatusUpdate(to: string, firstName: string, university: string, status: string) {
    console.log('[DEMO] Mock email sent: Application Status Update', { to, firstName, university, status });
    return { success: true, messageId: `mock_${Date.now()}` };
  },

  async sendTaskReminder(to: string, firstName: string, taskTitle: string, dueDate: string) {
    console.log('[DEMO] Mock email sent: Task Reminder', { to, firstName, taskTitle, dueDate });
    return { success: true, messageId: `mock_${Date.now()}` };
  },
};

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

