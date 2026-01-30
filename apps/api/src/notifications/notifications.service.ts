import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Lead } from "@invict/db";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue("notifications") private notificationsQueue: Queue,
  ) {}

  async sendLeadWelcome(lead: Lead) {
    await this.notificationsQueue.add("send-lead-welcome", {
      email: lead.email,
      name: lead.firstName,
      leadId: lead.id,
    });
  }

  async sendStaffNewLeadNotification(lead: Lead) {
    const staffEmail = "staff@invictacademy.com"; // In real app, fetch from config or DB
    await this.notificationsQueue.add("send-staff-notification", {
      email: staffEmail,
      leadId: lead.id,
      leadName: `${lead.firstName} ${lead.lastName}`,
    });
  }
}
