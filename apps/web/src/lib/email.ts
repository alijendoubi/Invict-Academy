import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-key');

export interface EmailTemplate {
    to: string;
    subject: string;
    html: string;
}

export const emailService = {
    async sendWelcomeEmail(to: string, firstName: string) {
        try {
            const { data, error } = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'Invict Academy <noreply@invictacademy.com>',
                to,
                subject: 'Welcome to Invict Academy! 🎓',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #06B6D4 0%, #2563EB 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to Invict Academy!</h1>
            </div>
            <div style="padding: 40px; background: #f9fafb;">
              <h2 style="color: #1f2937;">Hello ${firstName},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for joining Invict Academy! We're excited to help you achieve your dream of studying in Italy.
              </p>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Our team of expert advisors is here to guide you through every step of your journey:
              </p>
              <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
                <li>University admissions assistance</li>
                <li>Scholarship applications</li>
                <li>Visa support</li>
                <li>Housing and arrival services</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: #06B6D4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Access Your Dashboard
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                If you have any questions, feel free to reach out to our support team.
              </p>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
              <p>© 2025 Invict Academy. All rights reserved.</p>
            </div>
          </div>
        `,
            });

            if (error) {
                console.error('Email send error:', error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Email service error:', error);
            return { success: false, error };
        }
    },

    async sendApplicationStatusUpdate(to: string, firstName: string, university: string, status: string) {
        const statusMessages: Record<string, { title: string; message: string; color: string }> = {
            SUBMITTED: {
                title: 'Application Submitted',
                message: `Your application to ${university} has been successfully submitted!`,
                color: '#06B6D4',
            },
            IN_REVIEW: {
                title: 'Application Under Review',
                message: `${university} is currently reviewing your application.`,
                color: '#8B5CF6',
            },
            ACCEPTED: {
                title: 'Congratulations! 🎉',
                message: `You've been accepted to ${university}!`,
                color: '#10B981',
            },
            REJECTED: {
                title: 'Application Update',
                message: `Unfortunately, your application to ${university} was not successful. Our team is here to help you explore other options.`,
                color: '#EF4444',
            },
        };

        const statusInfo = statusMessages[status] || statusMessages.SUBMITTED;

        try {
            const { data, error } = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'Invict Academy <noreply@invictacademy.com>',
                to,
                subject: `${statusInfo.title} - ${university}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: ${statusInfo.color}; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">${statusInfo.title}</h1>
            </div>
            <div style="padding: 40px; background: #f9fafb;">
              <h2 style="color: #1f2937;">Hello ${firstName},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${statusInfo.message}
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications" 
                   style="background: ${statusInfo.color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  View Application Details
                </a>
              </div>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
              <p>© 2025 Invict Academy. All rights reserved.</p>
            </div>
          </div>
        `,
            });

            if (error) {
                console.error('Email send error:', error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Email service error:', error);
            return { success: false, error };
        }
    },

    async sendTaskReminder(to: string, firstName: string, taskTitle: string, dueDate: string) {
        try {
            const { data, error } = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'Invict Academy <noreply@invictacademy.com>',
                to,
                subject: `Reminder: ${taskTitle} - Due ${dueDate}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #F59E0B; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">⏰ Task Reminder</h1>
            </div>
            <div style="padding: 40px; background: #f9fafb;">
              <h2 style="color: #1f2937;">Hello ${firstName},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                This is a friendly reminder about your upcoming task:
              </p>
              <div style="background: white; padding: 20px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">${taskTitle}</h3>
                <p style="margin: 0; color: #6b7280;">Due: ${dueDate}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Complete Task
                </a>
              </div>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
              <p>© 2025 Invict Academy. All rights reserved.</p>
            </div>
          </div>
        `,
            });

            if (error) {
                console.error('Email send error:', error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Email service error:', error);
            return { success: false, error };
        }
    },
};
