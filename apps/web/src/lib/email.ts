import { EmailService } from '@invict/email';

const emailServiceInstance = new EmailService(
  process.env.RESEND_API_KEY || 'placeholder-key',
  process.env.FROM_EMAIL,
  process.env.NEXT_PUBLIC_APP_URL
);

export const emailService = {
  sendWelcomeEmail: (to: string, firstName: string) =>
    emailServiceInstance.sendWelcomeEmail(to, firstName),

  sendApplicationStatusUpdate: (to: string, firstName: string, university: string, status: string) =>
    emailServiceInstance.sendApplicationStatusUpdate(to, firstName, university, status),

  sendTaskReminder: (to: string, firstName: string, taskTitle: string, dueDate: string) =>
    emailServiceInstance.sendTaskReminder(to, firstName, taskTitle, dueDate),
};

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}
