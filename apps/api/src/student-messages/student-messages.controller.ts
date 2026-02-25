import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { StudentMessagesService } from "./student-messages.service";
import { CreateStudentMessageDto } from "./dto/student-message.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("student-messages")
@UseGuards(JwtAuthGuard)
export class StudentMessagesController {
  constructor(private readonly service: StudentMessagesService) {}

  // Admin: send message to student
  @Post()
  create(@Body() dto: CreateStudentMessageDto) {
    return this.service.create(dto);
  }

  // Student: get own messages
  @Get("student/:studentId")
  findByStudent(@Param("studentId") id: string) {
    return this.service.findByStudent(id);
  }

  // Student: mark as read
  @Patch(":id/read")
  markRead(@Param("id") id: string) {
    return this.service.markRead(id);
  }
}
