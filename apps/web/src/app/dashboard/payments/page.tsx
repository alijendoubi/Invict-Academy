"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    CreditCard, CheckCircle2, Clock, AlertCircle,
    Download, MessageCircle, Calendar, FileText,
    ChevronDown, ChevronUp, Lock, Wallet, Plus, DollarSign
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
        totalPaid: 0, totalDue: 0, nextPaymentDate: null,
        nextPaymentAmount: 0, currency: "EUR", packageName: "", startDate: null,
    })
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    // Admin: record payment form state
    const [payForm, setPayForm] = useState<{ invoiceId: string; amount: string; method: string; reference: string } | null>(null)
    const [payLoading, setPayLoading] = useState(false)

    // Admin: create invoice form state
    const [showCreateInvoice, setShowCreateInvoice] = useState(false)
    const [students, setStudents] = useState<any[]>([])
    const [newInvoice, setNewInvoice] = useState({ studentId: "", amount: "", dueDate: "" })
    const [createLoading, setCreateLoading] = useState(false)

    const loadPayments = async () => {
        try {
            const res = await fetch("/api/payments")
            const data = await res.json()
            if (data?.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices)
            if (data?.summary) setSummary(data.summary)
            if (data?.isAdmin) setIsAdmin(true)
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadPayments() }, [])

    // Load students list when admin opens create invoice form
    useEffect(() => {
        if (showCreateInvoice && students.length === 0) {
            fetch("/api/students")
                .then(r => r.json())
                .then(data => {
                    if (Array.isArray(data)) setStudents(data)
                    else if (data?.students) setStudents(data.students)
                })
                .catch(() => {})
        }
    }, [showCreateInvoice, students.length])

    const paidTotal = invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.amount, 0)
    const pendingTotal = invoices.filter(i => i.status !== "PAID").reduce((s, i) => s + i.amount, 0)
    const progressPct = paidTotal + pendingTotal > 0 ? Math.round((paidTotal / (paidTotal + pendingTotal)) * 100) : 0

    // ─── Admin: Record payment ──────────────────────────────
    const handleRecordPayment = async () => {
        if (!payForm) return
        setPayLoading(true)
        try {
            const res = await fetch("/api/payments/manage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "record_payment",
                    invoiceId: payForm.invoiceId,
                    amount: parseFloat(payForm.amount),
                    method: payForm.method || "BANK_TRANSFER",
                    reference: payForm.reference || undefined,
                }),
            })
            if (res.ok) {
                setPayForm(null)
                await loadPayments()
            }
        } catch {
            // silent
        } finally {
            setPayLoading(false)
        }
    }

    // ─── Admin: Update invoice status ───────────────────────
    const handleUpdateStatus = async (invoiceId: string, status: string) => {
        try {
            const res = await fetch("/api/payments/manage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update_status", invoiceId, status }),
            })
            if (res.ok) await loadPayments()
        } catch {
            // silent
        }
    }

    // ─── Admin: Create invoice ──────────────────────────────
    const handleCreateInvoice = async () => {
        setCreateLoading(true)
        try {
            const res = await fetch("/api/payments/manage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_invoice",
                    studentId: newInvoice.studentId,
                    amount: parseFloat(newInvoice.amount),
                    dueDate: newInvoice.dueDate || undefined,
                }),
            })
            if (res.ok) {
                setShowCreateInvoice(false)
                setNewInvoice({ studentId: "", amount: "", dueDate: "" })
                await loadPayments()
            }
        } catch {
            // silent
        } finally {
            setCreateLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">Payments</h1>
                    <p className="text-gray-400 text-sm">
                        {isAdmin
                            ? "Manage invoices and record payments for all students"
                            : <>Invoices, receipts & payment schedule for <span className="text-white font-medium">{summary.packageName}</span></>
                        }
                    </p>
                </div>
                <div className="flex gap-2">
                    {isAdmin && (
                        <Button
                            onClick={() => setShowCreateInvoice(!showCreateInvoice)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl gap-2"
                        >
                            <Plus size={16} /> New Invoice
                        </Button>
                    )}
                    <a href="https://wa.me/393477590963?text=Hi, I have a question about my payment" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl gap-2">
                            <MessageCircle size={16} /> WhatsApp Support
                        </Button>
                    </a>
                </div>
            </div>

            {/* Admin: Create Invoice Form */}
            {isAdmin && showCreateInvoice && (
                <Card className="bg-card border-cyan-500/20">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-white font-semibold">Create Invoice</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label className="text-gray-400 text-xs">Student</Label>
                                <select
                                    value={newInvoice.studentId}
                                    onChange={e => setNewInvoice(p => ({ ...p, studentId: e.target.value }))}
                                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm [&>option]:bg-gray-900 [&>option]:text-white"
                                >
                                    <option value="" className="bg-gray-900 text-white">Select student...</option>
                                    {students.map((s: any) => (
                                        <option key={s.id} value={s.id} className="bg-gray-900 text-white">
                                            {s.user?.firstName} {s.user?.lastName} — {s.user?.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label className="text-gray-400 text-xs">Amount (EUR)</Label>
                                <Input
                                    type="number" min="0" step="0.01"
                                    value={newInvoice.amount}
                                    onChange={e => setNewInvoice(p => ({ ...p, amount: e.target.value }))}
                                    className="mt-1 bg-white/5 border-white/10 text-white"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-400 text-xs">Due Date</Label>
                                <Input
                                    type="date"
                                    value={newInvoice.dueDate}
                                    onChange={e => setNewInvoice(p => ({ ...p, dueDate: e.target.value }))}
                                    className="mt-1 bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleCreateInvoice}
                                disabled={createLoading || !newInvoice.studentId || !newInvoice.amount}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl"
                            >
                                {createLoading ? "Creating..." : "Create Invoice"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowCreateInvoice(false)} className="border-white/10 text-gray-400 rounded-xl">
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        label: "Total Paid", value: fmt(paidTotal),
                        sub: `${invoices.filter(i => i.status === "PAID").length} invoices settled`,
                        icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20",
                    },
                    {
                        label: "Remaining Balance", value: fmt(pendingTotal),
                        sub: `${invoices.filter(i => i.status !== "PAID").length} invoices remaining`,
                        icon: Wallet, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20",
                    },
                    {
                        label: "Next Payment Due",
                        value: isAdmin ? fmt(pendingTotal) : fmtDate(summary.nextPaymentDate),
                        sub: isAdmin
                            ? `${invoices.filter(i => i.status !== "PAID").length} invoices outstanding`
                            : `${fmt(summary.nextPaymentAmount)} — ${invoices.find(i => i.status === "PENDING")?.description?.split("–")[0] || "Next invoice"}`,
                        icon: Calendar, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20",
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
                            <p className="text-gray-500 text-xs mt-0.5">
                                {isAdmin ? `${invoices.length} total invoices` : `Service started ${fmtDate(summary.startDate)}`}
                            </p>
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
                <h2 className="text-white font-bold text-xl mb-4">
                    {isAdmin ? "All Invoices" : "Invoice History"}
                </h2>
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
                                                    <p className="text-gray-600 text-xs mt-0.5">
                                                        {isAdmin && inv.studentName && <span className="text-gray-400">{inv.studentName} · </span>}
                                                        {inv.id.slice(0, 8)} · Due {fmtDate(inv.dueDate)}
                                                    </p>
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
                                                        <p className="text-white text-sm font-mono">{inv.id.slice(0, 8)}</p>
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

                                                {/* Paid amount info for partial payments */}
                                                {isAdmin && inv.paidAmount > 0 && !isPaid && (
                                                    <div className="mb-4 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                                                        <p className="text-yellow-400 text-xs">
                                                            Partially paid: {fmt(inv.paidAmount)} of {fmt(inv.amount)} ({Math.round((inv.paidAmount / inv.amount) * 100)}%)
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex gap-2 flex-wrap">
                                                    {isPaid && (
                                                        <a href={`/api/payments/${inv.id}/receipt`} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl gap-1.5 h-8 text-xs">
                                                                <Download size={12} /> Download Receipt
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {!isAdmin && inv.status === "PENDING" && (
                                                        <a href={`https://wa.me/393477590963?text=Hi, I'd like to pay invoice ${inv.id}`} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white rounded-xl gap-1.5 h-8 text-xs">
                                                                <MessageCircle size={12} /> Pay via WhatsApp
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {!isAdmin && inv.status === "UPCOMING" && (
                                                        <Button size="sm" disabled className="bg-white/5 text-gray-600 rounded-xl gap-1.5 h-8 text-xs cursor-not-allowed">
                                                            <Lock size={12} /> Not yet due
                                                        </Button>
                                                    )}
                                                    <a href={`/api/payments/${inv.id}/invoice`} target="_blank" rel="noopener noreferrer">
                                                        <Button size="sm" variant="outline" className="border-white/10 text-gray-400 hover:text-white rounded-xl gap-1.5 h-8 text-xs">
                                                            <FileText size={12} /> View Invoice
                                                        </Button>
                                                    </a>

                                                    {/* Admin actions */}
                                                    {isAdmin && !isPaid && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setPayForm({
                                                                    invoiceId: inv.id,
                                                                    amount: String(inv.amount - (inv.paidAmount || 0)),
                                                                    method: "BANK_TRANSFER",
                                                                    reference: "",
                                                                })}
                                                                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1.5 h-8 text-xs"
                                                            >
                                                                <DollarSign size={12} /> Record Payment
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleUpdateStatus(inv.id, "PAID")}
                                                                className="bg-green-600 hover:bg-green-500 text-white rounded-xl gap-1.5 h-8 text-xs"
                                                            >
                                                                <CheckCircle2 size={12} /> Mark Paid
                                                            </Button>
                                                        </>
                                                    )}
                                                    {isAdmin && isPaid && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(inv.id, "UNPAID")}
                                                            variant="outline"
                                                            className="border-red-500/20 text-red-400 hover:text-red-300 rounded-xl gap-1.5 h-8 text-xs"
                                                        >
                                                            Revert to Unpaid
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Record Payment Form (inline) */}
                                                {payForm !== null && payForm.invoiceId === inv.id && (
                                                    <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                                                        <p className="text-white text-sm font-semibold">Record Payment</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            <div>
                                                                <Label className="text-gray-400 text-xs">Amount (EUR)</Label>
                                                                <Input
                                                                    type="number" min="0" step="0.01"
                                                                    value={payForm.amount}
                                                                    onChange={e => setPayForm(p => p ? { ...p, amount: e.target.value } : p)}
                                                                    className="mt-1 bg-white/5 border-white/10 text-white text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-gray-400 text-xs">Method</Label>
                                                                <select
                                                                    value={payForm.method}
                                                                    onChange={e => setPayForm(p => p ? { ...p, method: e.target.value } : p)}
                                                                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                                                >
                                                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                                                    <option value="MANUAL">Manual / Cash</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-gray-400 text-xs">Reference (optional)</Label>
                                                                <Input
                                                                    value={payForm.reference}
                                                                    onChange={e => setPayForm(p => p ? { ...p, reference: e.target.value } : p)}
                                                                    className="mt-1 bg-white/5 border-white/10 text-white text-sm"
                                                                    placeholder="e.g. transfer ID"
                                                                />
                                                            </div>
                                                            <div className="flex items-end gap-2">
                                                                <Button
                                                                    onClick={handleRecordPayment}
                                                                    disabled={payLoading || !payForm.amount}
                                                                    className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm"
                                                                >
                                                                    {payLoading ? "Saving..." : "Confirm"}
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => setPayForm(null)}
                                                                    className="border-white/10 text-gray-400 rounded-xl text-sm"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}

                    {invoices.length === 0 && !loading && (
                        <Card className="bg-card border-white/5">
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-500">No invoices found</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Payment Methods Info */}
            <Card className="bg-card border-white/10">
                <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><CreditCard size={16} className="text-cyan-400" /> How to Pay</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
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
        </div>
    )
}
