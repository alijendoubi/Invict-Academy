import { Module } from "@nestjs/common";
import { QrAnalyticsService } from "./qr-analytics.service";
import { QrAnalyticsController } from "./qr-analytics.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [QrAnalyticsService],
  controllers: [QrAnalyticsController],
  exports: [QrAnalyticsService],
})
export class QrAnalyticsModule {}
