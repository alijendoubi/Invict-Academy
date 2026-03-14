import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
    const source = req.nextUrl.searchParams.get("source") || "direct"
    try {
        await prisma.qrScan.create({
            data: {
                source,
                ip: req.headers.get("x-forwarded-for") || "unknown",
                userAgent: req.headers.get("user-agent") || "unknown",
            }
        });
    } catch { /* DB offline or error — just log/ignore to not break user redirect */ }
    return NextResponse.redirect(new URL("/explore", req.url))
}
