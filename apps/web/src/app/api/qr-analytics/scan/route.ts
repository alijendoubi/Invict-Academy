import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const source = req.nextUrl.searchParams.get("source") || "direct"
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/qr-analytics/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source, userAgent: req.headers.get("user-agent") }),
        })
    } catch { /* API offline during dev — just log */ }
    return NextResponse.redirect(new URL("/explore", req.url))
}
