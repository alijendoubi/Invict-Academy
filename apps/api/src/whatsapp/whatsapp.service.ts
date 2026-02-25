import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import twilio from "twilio";

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: ReturnType<typeof twilio> | null = null;
  private readonly from: string;
  private readonly enabled: boolean;

  constructor(private config: ConfigService) {
    const sid = config.get<string>("TWILIO_ACCOUNT_SID");
    const token = config.get<string>("TWILIO_AUTH_TOKEN");
    this.from =
      config.get<string>("TWILIO_WHATSAPP_FROM") || "whatsapp:+14155238886";
    this.enabled = !!(sid && token);

    if (this.enabled) {
      this.client = twilio(sid, token);
    } else {
      this.logger.warn(
        "Twilio not configured — WhatsApp messages will be logged only.",
      );
    }
  }

  async sendMessage(to: string, body: string): Promise<void> {
    const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    if (!this.enabled || !this.client) {
      this.logger.log(
        `[WHATSAPP SIMULATED] To: ${formattedTo} | Body: ${body}`,
      );
      return;
    }
    try {
      await this.client.messages.create({
        from: this.from,
        to: formattedTo,
        body,
      });
      this.logger.log(`WhatsApp sent to ${formattedTo}`);
    } catch (err) {
      this.logger.error(`WhatsApp failed to ${formattedTo}: ${err}`);
    }
  }

  async sendStatusUpdate(phone: string, studentName: string): Promise<void> {
    const body =
      `Hey dear ${studentName}, you have an update from Invict Academy admission team regarding your application. ` +
      `Please check your student portal on our website at https://invictacademy.com/dashboard/student`;
    return this.sendMessage(phone, body);
  }

  async sendConsultationReminder(
    phone: string,
    studentName: string,
    dateStr: string,
  ): Promise<void> {
    const body =
      `Hey ${studentName}, quick reminder: you have a consultation with Invict Academy consultation team tomorrow (${dateStr}). ` +
      `Please be on time, be punctual, and prepare your questions for the team. ` +
      `If you are not able to join, please let us know as soon as possible, as we have a waiting list for consultation.`;
    return this.sendMessage(phone, body);
  }

  async sendWelcome(phone: string, studentName: string): Promise<void> {
    const body =
      `Welcome to Invict Academy, ${studentName}! 🎓 Your student account is now active. ` +
      `Login to your portal to track your application: https://invictacademy.com/auth/login`;
    return this.sendMessage(phone, body);
  }
}
