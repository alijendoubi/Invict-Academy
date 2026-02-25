import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class QrAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async logScan(
    source: string,
    country?: string,
    city?: string,
    req?: Request,
  ) {
    const ip = req?.ip || req?.headers["x-forwarded-for"]?.toString() || "";
    const userAgent = req?.headers["user-agent"] || "";
    return this.prisma.qrScan.create({
      data: { source, country, city, ip, userAgent },
    });
  }

  async getStats() {
    const total = await this.prisma.qrScan.count();
    const bySource = await this.prisma.qrScan.groupBy({
      by: ["source"],
      _count: { _all: true },
      orderBy: { _count: { source: "desc" } },
    });
    const byCountry = await this.prisma.qrScan.groupBy({
      by: ["country"],
      _count: { _all: true },
      where: { country: { not: null } },
    });
    const last7Days = await this.prisma.qrScan.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "asc" },
    });
    return { total, bySource, byCountry, last7Days };
  }
}
