import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { EmailService } from "@invict/email";
import { ConfigService } from "@nestjs/config";

@Processor("notifications")
export class NotificationsProcessor extends WorkerHost {
  private emailService: EmailService;

  constructor(private configService: ConfigService) {
    super();
    this.emailService = new EmailService(
      this.configService.get<string>("RESEND_API_KEY") || "placeholder",
      this.configService.get<string>("FROM_EMAIL"),
      this.configService.get<string>("APP_URL")
    );
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case "send-lead-welcome":
        return this.emailService.sendWelcomeEmail(
          job.data.email,
          job.data.name
        );
      case "send-staff-notification":
        return this.emailService.sendStaffNewLeadNotification(
          job.data.email,
          job.data.leadName,
          job.data.leadId
        );
      default:
        console.warn(`Unknown job name: ${job.name}`);
    }
  }
}
