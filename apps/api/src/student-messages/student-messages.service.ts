import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStudentMessageDto } from "./dto/student-message.dto";

@Injectable()
export class StudentMessagesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentMessageDto) {
    return this.prisma.studentMessage.create({
      data: {
        studentId: dto.studentId,
        content: dto.content,
        subject: dto.subject,
        isPinned: dto.isPinned ?? false,
        fromAdmin: true,
      },
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.studentMessage.findMany({
      where: { studentId },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
  }

  async markRead(id: string) {
    return this.prisma.studentMessage.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }
}
