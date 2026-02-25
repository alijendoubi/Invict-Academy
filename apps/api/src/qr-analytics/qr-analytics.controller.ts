import { Controller, Get, Post, Query, Req } from "@nestjs/common";
import { QrAnalyticsService } from "./qr-analytics.service";
import { Request } from "express";

@Controller("qr-analytics")
export class QrAnalyticsController {
  constructor(private readonly service: QrAnalyticsService) {}

  // Public: called by frontend when QR page loads
  @Post("scan")
  logScan(
    @Query("source") source: string = "unknown",
    @Query("country") country: string,
    @Query("city") city: string,
    @Req() req: Request,
  ) {
    return this.service.logScan(source, country, city, req);
  }

  // Admin: get aggregated stats
  @Get("stats")
  getStats() {
    return this.service.getStats();
  }
}
