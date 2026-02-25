import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConsultationsService } from "./consultations.service";
import { ConsultationsController } from "./consultations.controller";
import { WhatsAppModule } from "../whatsapp/whatsapp.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    WhatsAppModule,
    PrismaModule,
    BullModule.registerQueue({ name: "notifications" }),
  ],
  providers: [ConsultationsService],
  controllers: [ConsultationsController],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
