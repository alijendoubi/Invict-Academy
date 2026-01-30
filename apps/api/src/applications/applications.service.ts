import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from "../students/dto/student.dto";
import { ApplicationStatus } from "@invict/db";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: {
        ...dto,
        status: ApplicationStatus.DRAFT,
      },
    });
  }

  async findAll() {
    return this.prisma.application.findMany({
      include: {
        student: {
          include: { user: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: {
        checklistItems: true,
        tasks: true,
      },
    });
    if (!app) throw new NotFoundException("Application not found");
    return app;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    // If status changes to SUBMITTED, notify student (as per req)
    const current = await this.findOne(id);

    const updated = await this.prisma.application.update({
      where: { id },
      data: dto,
      include: { student: { include: { user: true } } },
    });

    if (
      dto.status === ApplicationStatus.SUBMITTED &&
      current.status !== ApplicationStatus.SUBMITTED
    ) {
      // Send notification
      // We'll queue a job here
      // await this.notificationsService.sendApplicationSubmitted(updated);
      console.log(
        `Sending application submitted email to ${updated.student.user.email}`,
      );
    }

    return updated;
  }
}
