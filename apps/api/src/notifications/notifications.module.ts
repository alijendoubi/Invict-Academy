import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { NotificationsService } from "./notifications.service";
import { NotificationsProcessor } from "./notifications.processor";
import { WhatsAppModule } from "../whatsapp/whatsapp.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "notifications",
    }),
    WhatsAppModule,
    PrismaModule,
  ],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
