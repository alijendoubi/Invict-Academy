import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { WhatsAppService } from "../whatsapp/whatsapp.service";
import { CreateConsultationDto } from "./dto/consultation.dto";

@Injectable()
export class ConsultationsService {
  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsAppService,
    @InjectQueue("notifications") private queue: Queue,
  ) {}

  async create(dto: CreateConsultationDto) {
    const consultation = await this.prisma.consultation.create({
      data: {
        studentId: dto.studentId,
        scheduledAt: new Date(dto.scheduledAt),
        whatsappPhone: dto.whatsappPhone,
        notes: dto.notes,
      },
      include: { student: { include: { user: true } } },
    });

    // Schedule 24h reminder via BullMQ delayed job
    const reminderDelay =
      new Date(dto.scheduledAt).getTime() - Date.now() - 24 * 60 * 60 * 1000;
    if (reminderDelay > 0) {
      await this.queue.add(
        "send-consultation-reminder",
        {
          consultationId: consultation.id,
          phone: dto.whatsappPhone,
          studentName: consultation.student.user.firstName,
          scheduledAt: dto.scheduledAt,
        },
        { delay: reminderDelay },
      );
    }

    return consultation;
  }

  async findByStudent(studentId: string) {
    return this.prisma.consultation.findMany({
      where: { studentId },
      orderBy: { scheduledAt: "desc" },
    });
  }

  async findAll() {
    return this.prisma.consultation.findMany({
      include: { student: { include: { user: true } } },
      orderBy: { scheduledAt: "asc" },
    });
  }

  async markReminderSent(id: string) {
    return this.prisma.consultation.update({
      where: { id },
      data: { reminderSent: true },
    });
  }
}
