import { Module } from "@nestjs/common";
import { StudentMessagesService } from "./student-messages.service";
import { StudentMessagesController } from "./student-messages.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [StudentMessagesService],
  controllers: [StudentMessagesController],
  exports: [StudentMessagesService],
})
export class StudentMessagesModule {}
