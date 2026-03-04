"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { QrCode, TrendingUp, Globe, BarChart2, ArrowUp, Clock, Smartphone, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Demo QR scan data (replace with real API call)
const DEMO_STATS = {
    totalScans: 847,
    uniqueSessions: 612,
    countries: 14,
    topSources: [
        { source: "brochure-italy", scans: 312, change: +18 },
        { source: "business-card", scans: 198, change: +5 },
        { source: "brochure-germany", scans: 143, change: +32 },
        { source: "instagram-bio", scans: 94, change: -3 },
        { source: "exhibition-tunisia", scans: 61, change: +67 },
        { source: "direct", scans: 39, change: +10 },
    ],
    recentScans: [
        { source: "brochure-italy", timestamp: "2026-02-25T00:45:00Z", country: "Tunisia" },
        { source: "business-card", timestamp: "2026-02-25T00:38:00Z", country: "Algeria" },
        { source: "brochure-germany", timestamp: "2026-02-25T00:30:00Z", country: "Morocco" },
        { source: "instagram-bio", timestamp: "2026-02-25T00:22:00Z", country: "Libya" },
        { source: "brochure-italy", timestamp: "2026-02-25T00:18:00Z", country: "Tunisia" },
        { source: "exhibition-tunisia", timestamp: "2026-02-25T00:10:00Z", country: "Tunisia" },
        { source: "brochure-italy", timestamp: "2026-02-24T23:55:00Z", country: "Tunisia" },
        { source: "business-card", timestamp: "2026-02-24T23:48:00Z", country: "UAE" },
    ],
    conversionFunnel: [
        { stage: "QR Scanned", count: 847 },
        { stage: "Explored Destinations", count: 623 },
        { stage: "Viewed University", count: 418 },
        { stage: "Clicked WhatsApp CTA", count: 201 },
        { stage: "Booked Consultation", count: 89 },
    ],
}

function timeAgo(ts: string) {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
}

export default function QRAnalyticsPage() {
    const [stats, setStats] = useState(DEMO_STATS)
    const [loading, setLoading] = useState(true)

    async function refresh() {
        setLoading(true)
        try {
            const r = await fetch("/api/qr-analytics/stats")
            if (r.ok) setStats(await r.json())
        } catch { }
        setLoading(false)
    }

    useEffect(() => {
        refresh()
    }, [])

    const maxScans = Math.max(...stats.topSources.map(s => s.scans), 1)
    const maxFunnel = Math.max(stats.conversionFunnel[0].count, 1)

    return (
        <div className="p-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-white mb-1">QR Analytics Dashboard</h1>
                    <p className="text-gray-500 text-sm">Track where your brochure QR code is being scanned</p>
                </div>
                <Button onClick={refresh} disabled={loading} variant="outline"
                    className="border-white/10 hover:bg-white/5 text-gray-400 rounded-xl flex items-center gap-2">
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Refresh
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Scans", value: stats.totalScans, icon: QrCode, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                    { label: "Unique Sessions", value: stats.uniqueSessions, icon: Smartphone, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Countries", value: stats.countries, icon: Globe, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Consultation Rate", value: `${stats.totalScans > 0 ? Math.round((stats.conversionFunnel[4].count / stats.totalScans) * 100) : 0}%`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
                ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                        <div className={`h-10 w-10 rounded-2xl ${kpi.bg} flex items-center justify-center mb-3`}>
                            <kpi.icon size={18} className={kpi.color} />
                        </div>
                        <p className="text-3xl font-black text-white">{kpi.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{kpi.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Top Sources Bar Chart */}
                <Card className="bg-[#0B1020] border-white/10">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <BarChart2 size={16} className="text-cyan-400" /> Scans by Source
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                        {stats.topSources.map((s, i) => (
                            <div key={s.source}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-300 text-sm font-mono">{s.source}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs flex items-center gap-0.5 ${s.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                                            <ArrowUp size={10} className={s.change < 0 ? "rotate-180" : ""} />
                                            {Math.abs(s.change)}%
                                        </span>
                                        <span className="text-white font-bold text-sm">{s.scans}</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(s.scans / maxScans) * 100}%` }}
                                        transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card className="bg-[#0B1020] border-white/10">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <TrendingUp size={16} className="text-purple-400" /> Conversion Funnel
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-3">
                        {stats.conversionFunnel.map((stage, i) => {
                            const pct = Math.round((stage.count / maxFunnel) * 100)
                            const colors = ["bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-green-500"]
                            return (
                                <div key={stage.stage}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-400 text-sm">{stage.stage}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600 text-xs">{pct}%</span>
                                            <span className="text-white font-bold text-sm">{stage.count}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ delay: i * 0.1, duration: 0.6 }}
                                            className={`h-full ${colors[i]} rounded-full`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        <div className="pt-3 border-t border-white/5">
                            <p className="text-xs text-gray-500 text-center">
                                QR → Consultation conversion: <span className="text-green-400 font-bold">{stats.totalScans > 0 ? ((stats.conversionFunnel[4].count / stats.totalScans) * 100).toFixed(1) : 0}%</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Scans */}
            <Card className="bg-[#0B1020] border-white/10">
                <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                        <Clock size={16} className="text-blue-400" /> Recent Scans (Live)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-2">
                        {stats.recentScans.map((scan, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <QrCode size={14} className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-mono">{scan.source}</p>
                                        <p className="text-gray-600 text-xs">{scan.country}</p>
                                    </div>
                                </div>
                                <span className="text-gray-600 text-xs">{timeAgo(scan.timestamp)}</span>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* QR Code Generator Section */}
            <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-500/20">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2"><QrCode size={18} className="text-cyan-400" /> Generate Tracked QR Codes</h3>
                <p className="text-gray-400 text-sm mb-4">Create QR codes with unique source tags so you can track which materials drive the most engagement.</p>
                <div className="grid md:grid-cols-3 gap-3">
                    {["brochure-italy-2026", "business-card-v2", "exhibition-summer", "instagram-story", "whatsapp-campaign", "newspaper-ad"].map(source => (
                        <a key={source} href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://invictacademy.com/explore?source=${source}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/20 transition-all text-sm text-gray-400 hover:text-white">
                            <QrCode size={14} className="text-cyan-400 shrink-0" />
                            <span className="font-mono text-xs">{source}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
