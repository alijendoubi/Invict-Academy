"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CreditCard, CheckCircle2, Clock, AlertCircle,
    Download, MessageCircle, ArrowRight, Receipt,
    TrendingUp, Wallet, Calendar, FileText, ChevronDown, ChevronUp, Lock
} from "lucide-react"

// ─── Helpers ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    PAID: { label: "Paid", color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle2 },
    PENDING: { label: "Due Soon", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
    UPCOMING: { label: "Upcoming", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Calendar },
    OVERDUE: { label: "Overdue", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: AlertCircle },
}

function fmt(amount: number | undefined, currency = "EUR") {
    if (amount === undefined) return "—"
    return new Intl.NumberFormat("en-EU", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount)
}

function fmtDate(dateStr: string | null | undefined) {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Component ──────────────────────────────────────────────────────
export default function PaymentsPage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [summary, setSummary] = useState<any>({
        totalPaid: 0,
        totalDue: 0,
        nextPaymentDate: null,
        nextPaymentAmount: 0,
        currency: "EUR",
        packageName: "",
        startDate: null,
    })
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/payments")
                const data = await res.json()
                if (data?.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices)
                if (data?.summary) setSummary(data.summary)
            } catch {
                // Use demo data
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const paidTotal = invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.amount, 0)
    const pendingTotal = invoices.filter(i => i.status !== "PAID").reduce((s, i) => s + i.amount, 0)
    const progressPct = Math.round((paidTotal / (paidTotal + pendingTotal)) * 100)

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">Payments</h1>
                    <p className="text-gray-400 text-sm">Invoices, receipts & payment schedule for <span className="text-white font-medium">{summary.packageName}</span></p>
                </div>
                <a href="https://wa.me/393477590963?text=Hi, I have a question about my payment" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl gap-2">
                        <MessageCircle size={16} /> WhatsApp Support
                    </Button>
                </a>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        label: "Total Paid",
                        value: fmt(paidTotal),
                        sub: `${invoices.filter(i => i.status === "PAID").length} invoices settled`,
                        icon: CheckCircle2,
                        color: "text-green-400",
                        bg: "bg-green-500/10",
                        border: "border-green-500/20",
                    },
                    {
                        label: "Remaining Balance",
                        value: fmt(pendingTotal),
                        sub: `${invoices.filter(i => i.status !== "PAID").length} invoices remaining`,
                        icon: Wallet,
                        color: "text-yellow-400",
                        bg: "bg-yellow-500/10",
                        border: "border-yellow-500/20",
                    },
                    {
                        label: "Next Payment Due",
                        value: fmtDate(summary.nextPaymentDate),
                        sub: `${fmt(summary.nextPaymentAmount)} — ${invoices.find(i => i.status === "PENDING")?.description?.split("–")[0] || "Next invoice"}`,
                        icon: Calendar,
                        color: "text-cyan-400",
                        bg: "bg-cyan-500/10",
                        border: "border-cyan-500/20",
                    },
                ].map((card, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                        <Card className={`bg-card border ${card.border}`}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <p className="text-gray-400 text-sm">{card.label}</p>
                                    <div className={`h-8 w-8 rounded-xl ${card.bg} flex items-center justify-center`}>
                                        <card.icon size={16} className={card.color} />
                                    </div>
                                </div>
                                <p className={`text-2xl font-black ${card.color} mb-1`}>{card.value}</p>
                                <p className="text-gray-600 text-xs">{card.sub}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Overall Progress */}
            <Card className="bg-card border-white/10">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="text-white font-semibold">Payment Progress</h3>
                            <p className="text-gray-500 text-xs mt-0.5">Service started {fmtDate(summary.startDate)}</p>
                        </div>
                        <span className="text-2xl font-black text-cyan-400">{progressPct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden mb-4">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Invoice List */}
            <div>
                <h2 className="text-white font-bold text-xl mb-4">Invoice History</h2>
                <div className="space-y-3">
                    {invoices.map((inv, i) => {
                        const cfg = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UPCOMING
                        const isExpanded = expandedId === inv.id
                        const isPaid = inv.status === "PAID"

                        return (
                            <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <Card className={`bg-card border transition-all ${isPaid ? "border-white/5" : inv.status === "PENDING" ? "border-yellow-500/30" : "border-white/5"}`}>
                                    <CardContent className="p-5">
                                        {/* Main row */}
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl ${isPaid ? "bg-green-500/10" : "bg-white/5"} flex items-center justify-center shrink-0`}>
                                                    {isPaid
                                                        ? <CheckCircle2 size={18} className="text-green-400" />
                                                        : inv.status === "PENDING"
                                                            ? <Clock size={18} className="text-yellow-400" />
                                                            : <Lock size={18} className="text-gray-600" />
                                                    }
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-white font-semibold text-sm">{inv.description}</p>
                                                        <Badge className={`${cfg.color} border text-[10px] px-1.5 py-0`}>{cfg.label}</Badge>
                                                    </div>
                                                    <p className="text-gray-600 text-xs mt-0.5">{inv.id} · Due {fmtDate(inv.dueDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className={`text-lg font-black ${isPaid ? "text-green-400" : inv.status === "PENDING" ? "text-yellow-400" : "text-gray-500"}`}>
                                                    {fmt(inv.amount)}
                                                </span>
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                                                    className="text-gray-600 hover:text-white transition-colors"
                                                >
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded detail */}
                                        {isExpanded && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-white/5">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-gray-600 text-xs mb-1">Invoice No.</p>
                                                        <p className="text-white text-sm font-mono">{inv.id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 text-xs mb-1">Amount</p>
                                                        <p className="text-white text-sm font-bold">{fmt(inv.amount)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 text-xs mb-1">Due Date</p>
                                                        <p className="text-white text-sm">{fmtDate(inv.dueDate)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 text-xs mb-1">{isPaid ? "Paid On" : "Status"}</p>
                                                        <p className={`text-sm font-semibold ${isPaid ? "text-green-400" : "text-yellow-400"}`}>
                                                            {isPaid ? fmtDate(inv.paidDate) : cfg.label}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 flex-wrap">
                                                    {isPaid && (
                                                        <a href={`/api/payments/${inv.id}/receipt`} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl gap-1.5 h-8 text-xs">
                                                                <Download size={12} /> Download Receipt
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {inv.status === "PENDING" && (
                                                        <a href={`https://wa.me/393477590963?text=Hi, I'd like to pay invoice ${inv.id}`} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white rounded-xl gap-1.5 h-8 text-xs">
                                                                <MessageCircle size={12} /> Pay via WhatsApp
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {inv.status === "UPCOMING" && (
                                                        <Button size="sm" disabled className="bg-white/5 text-gray-600 rounded-xl gap-1.5 h-8 text-xs cursor-not-allowed">
                                                            <Lock size={12} /> Not yet due
                                                        </Button>
                                                    )}
                                                    <a href={`/api/payments/${inv.id}/invoice`} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" variant="outline" className="border-white/10 text-gray-400 hover:text-white rounded-xl gap-1.5 h-8 text-xs">
                                                            <FileText size={12} /> View Invoice
                                                        </Button>
                                                    </a>
                                                </div>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Payment Methods Info */}
            <Card className="bg-card border-white/10">
                <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><CreditCard size={16} className="text-cyan-400" /> How to Pay</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                method: "Bank Transfer",
                                detail: "IBAN: TN59 1234 5678 9012 3456",
                                note: "Reference: your invoice number",
                                icon: "🏦",
                            },
                            {
                                method: "WhatsApp Coordination",
                                detail: "+39 347 7590963",
                                note: "Send transfer proof, we confirm in 2h",
                                icon: "💬",
                            },
                            {
                                method: "Installment Plan",
                                detail: "Split into 3–5 payments",
                                note: "Contact us to arrange",
                                icon: "📅",
                            },
                        ].map((m, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-2xl mb-2">{m.icon}</p>
                                <p className="text-white font-semibold text-sm mb-1">{m.method}</p>
                                <p className="text-gray-400 text-xs mb-1 font-mono">{m.detail}</p>
                                <p className="text-gray-600 text-xs">{m.note}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                        <p className="text-cyan-400 text-xs flex items-center gap-2">
                            <CheckCircle2 size={12} />
                            All payments are tracked and receipts are issued within 24 hours of confirmation.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
