import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const ip = getClientIp(req);
    const rl = rateLimit(`qr-scan:${ip}`, { limit: 20, windowSecs: 60 });
    if (!rl.allowed) {
        // Still redirect on rate limit — don't expose error to public
        return NextResponse.redirect(new URL("/explore", req.url));
    }

    const source = req.nextUrl.searchParams.get("source") || "direct"
    try {
        await prisma.qrScan.create({
            data: {
                source,
                ip,
                userAgent: req.headers.get("user-agent") || "unknown",
            }
        });
    } catch { /* DB offline or error — just log/ignore to not break user redirect */ }
    return NextResponse.redirect(new URL("/explore", req.url))
}
