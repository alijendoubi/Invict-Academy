import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ConfigService } from "@nestjs/config";
import { WhatsAppService } from "../whatsapp/whatsapp.service";
import { PrismaService } from "../prisma/prisma.service";
import { Resend } from "resend";

@Processor("notifications")
export class NotificationsProcessor extends WorkerHost {
  private resend: Resend;
  private fromEmail: string;
  private appUrl: string;

  constructor(
    private configService: ConfigService,
    private whatsapp: WhatsAppService,
    private prisma: PrismaService,
  ) {
    super();
    this.resend = new Resend(
      this.configService.get<string>("RESEND_API_KEY") || "re_placeholder",
    );
    this.fromEmail =
      this.configService.get<string>("FROM_EMAIL") ||
      "noreply@invictacademy.com";
    this.appUrl =
      this.configService.get<string>("APP_URL") || "http://localhost:3000";
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case "send-lead-welcome":
        try {
          await this.resend.emails.send({
            from: this.fromEmail,
            to: job.data.email,
            subject: "Welcome to Invict Academy! 🎓",
            html: `<h1>Welcome ${job.data.name}!</h1><p>Thank you for reaching out. We'll be in touch within 24 hours.</p><p><a href="${this.appUrl}">Visit Invict Academy</a></p>`,
          });
        } catch (err) {
          console.error("Welcome email failed:", err);
        }
        break;

      case "send-staff-notification":
        try {
          await this.resend.emails.send({
            from: this.fromEmail,
            to: job.data.email,
            subject: `New Lead: ${job.data.leadName}`,
            html: `<h2>New Lead Received</h2><p><strong>Name:</strong> ${job.data.leadName}</p><p><a href="${this.appUrl}/dashboard/leads/${job.data.leadId}">View Lead</a></p>`,
          });
        } catch (err) {
          console.error("Staff notification email failed:", err);
        }
        break;

      case "send-consultation-reminder":
        try {
          const { consultationId, phone, studentName, scheduledAt } = job.data;
          const dateStr = new Date(scheduledAt).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          await this.whatsapp.sendConsultationReminder(
            phone,
            studentName,
            dateStr,
          );
          await this.prisma.consultation.update({
            where: { id: consultationId },
            data: { reminderSent: true },
          });
        } catch (err) {
          console.error("Consultation reminder failed:", err);
        }
        break;

      default:
        console.warn(`Unknown job name: ${job.name}`);
    }
  }
}
