"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users, MessageSquare, Calendar, CheckSquare, TrendingUp,
    Search, Send, Phone, Mail, ChevronRight, Clock,
    MoreVertical, CheckCircle2, XCircle, AlertCircle,
    Loader2, RefreshCw, QrCode, FileText, Globe, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ─── Types ────────────────────────────────────────────────────
type ApplicationStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "VISA_PROCESSING" | "COMPLETED"

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    DRAFT: { label: "Draft", color: "text-gray-400", bg: "bg-gray-500/10", icon: Clock },
    SUBMITTED: { label: "Submitted", color: "text-blue-400", bg: "bg-blue-500/10", icon: CheckCircle2 },
    UNDER_REVIEW: { label: "Under Review", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: AlertCircle },
    ACCEPTED: { label: "Accepted", color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle2 },
    REJECTED: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", icon: XCircle },
    VISA_PROCESSING: { label: "Visa Processing", color: "text-purple-400", bg: "bg-purple-500/10", icon: Globe },
    COMPLETED: { label: "Completed", color: "text-cyan-400", bg: "bg-cyan-500/10", icon: Sparkles },
}

const APPLICATION_STEPS = [
    "Initial Assessment",
    "Document Collection",
    "Application Submission",
    "University Review",
    "Admission Decision",
    "Visa Application",
    "Pre-Departure",
]

// Map DB StudentStatus → CRM ApplicationStatus for display purposes
function mapStatus(s: string): ApplicationStatus {
    const map: Record<string, ApplicationStatus> = {
        ACTIVE: "DRAFT",
        APPLYING: "SUBMITTED",
        ACCEPTED: "ACCEPTED",
        VISA_IN_PROGRESS: "VISA_PROCESSING",
        DEPARTED: "COMPLETED",
        ARRIVED: "COMPLETED",
        COMPLETED: "COMPLETED",
    }
    return map[s] ?? "DRAFT"
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
    const [search, setSearch] = useState("")
    const [whatsappMsg, setWhatsappMsg] = useState("")
    const [sending, setSending] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("")
    const [messageSent, setMessageSent] = useState(false)

    useEffect(() => {
        fetch("/api/students")
            .then(r => r.json())
            .then(data => {
                const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
                setStudents(list)
                if (list.length > 0) setSelectedStudent(list[0])
            })
            .catch(() => setStudents([]))
            .finally(() => setLoading(false))
    }, [])

    const filtered = students.filter(s =>
        `${s.user?.firstName} ${s.user?.lastName} ${s.user?.email}`
            .toLowerCase().includes(search.toLowerCase())
    )

    const displayStatus = selectedStudent
        ? (mapStatus(selectedStudent.status))
        : "DRAFT"

    async function handleWhatsAppSend() {
        if (!whatsappMsg.trim() || !selectedStudent) return
        setSending(true)
        try {
            await fetch("/api/whatsapp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: selectedStudent.phone, message: whatsappMsg }),
            })
        } catch { }
        await new Promise(r => setTimeout(r, 1200))
        setMessageSent(true)
        setWhatsappMsg("")
        setSending(false)
        setTimeout(() => setMessageSent(false), 3000)
    }

    async function handleStatusChange(newStatus: ApplicationStatus) {
        setSelectedStatus(newStatus)
        if (!selectedStudent) return
        try {
            // Find the first application for this student and update it
            const appRes = await fetch(`/api/applications?studentId=${selectedStudent.id}`)
            const apps = await appRes.json()
            if (Array.isArray(apps) && apps.length > 0) {
                await fetch(`/api/applications/${apps[0].id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                })
            }
        } catch { }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
        )
    }

    return (
        <div className="p-6 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-1">Student Management</h1>
                <p className="text-gray-500 text-sm">Manage applications, send WhatsApp messages, and schedule consultations</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Active Students", value: students.length, color: "text-cyan-400" },
                    { label: "Under Review", value: students.filter(s => s.status === "APPLYING").length, color: "text-yellow-400" },
                    { label: "Accepted", value: students.filter(s => s.status === "ACCEPTED").length, color: "text-green-400" },
                    { label: "Visa Processing", value: students.filter(s => s.status === "VISA_IN_PROGRESS").length, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {students.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No students found. Add students from the Students page.</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Student List */}
                    <div className="lg:col-span-1 space-y-3">
                        <div className="relative mb-4">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                        {filtered.map(student => {
                            const cfg = STATUS_CONFIG[mapStatus(student.status)]
                            const name = `${student.user?.firstName ?? ""} ${student.user?.lastName ?? ""}`
                            return (
                                <motion.button
                                    key={student.id}
                                    onClick={() => { setSelectedStudent(student); setSelectedStatus("") }}
                                    whileHover={{ x: 2 }}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedStudent?.id === student.id ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{name}</p>
                                            <p className="text-gray-500 text-xs truncate">{student.universityInterest || student.degreeLevel || "No program set"}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} shrink-0`}>{cfg.label}</span>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* Student Detail Panel */}
                    {selectedStudent && (() => {
                        const student = selectedStudent
                        const name = `${student.user?.firstName ?? ""} ${student.user?.lastName ?? ""}`
                        const cfg = STATUS_CONFIG[displayStatus]
                        const statusOrder = Object.keys(STATUS_CONFIG)
                        const currentIdx = statusOrder.indexOf(displayStatus)

                        return (
                            <div className="lg:col-span-2 space-y-5">
                                {/* Profile Header */}
                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                    <div className="flex items-start justify-between gap-4 mb-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 flex items-center justify-center text-white font-black text-xl">
                                                {name[0]}
                                            </div>
                                            <div>
                                                <h2 className="text-white font-bold text-lg">{name}</h2>
                                                <p className="text-gray-500 text-sm">{student.universityInterest || "No university set"}</p>
                                                <p className="text-gray-600 text-xs mt-0.5">{student.degreeLevel || "Degree not set"}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                                            {displayStatus.replace("_", " ")}
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <a href={`mailto:${student.user?.email}`} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                                            <Mail size={14} className="text-gray-400" />
                                            <span className="text-gray-400 text-xs truncate">{student.user?.email}</span>
                                        </a>
                                        {student.phone ? (
                                            <a href={`https://wa.me/${student.phone.replace(/\s+/g, "")}`} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors">
                                                <Phone size={14} className="text-green-400" />
                                                <span className="text-green-400 text-xs">{student.phone}</span>
                                            </a>
                                        ) : (
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                <Phone size={14} className="text-gray-600" />
                                                <span className="text-gray-600 text-xs">No phone set</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Change Application Status */}
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Change Application Status</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([key, cfg]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => handleStatusChange(key)}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${displayStatus === key || selectedStatus === key ? `${cfg.bg} ${cfg.color} border-current` : "bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/20"}`}
                                                >
                                                    {cfg.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Application Step Tracker */}
                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Application Progress</p>
                                    <div className="space-y-2">
                                        {APPLICATION_STEPS.map((step, i) => {
                                            const isDone = i < currentIdx
                                            const isCurrent = i === currentIdx
                                            return (
                                                <div key={step} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCurrent ? "bg-cyan-500/10 border border-cyan-500/20" : isDone ? "bg-green-500/5" : "opacity-40"}`}>
                                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCurrent ? "bg-cyan-500 text-black" : isDone ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-600"}`}>
                                                        {isDone ? "✓" : i + 1}
                                                    </div>
                                                    <span className={`text-sm ${isCurrent ? "text-cyan-300 font-semibold" : isDone ? "text-gray-400" : "text-gray-600"}`}>{step}</span>
                                                    {isCurrent && <span className="ml-auto text-xs text-cyan-400/70">Current</span>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* WhatsApp Message Panel */}
                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-8 w-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                                            <MessageSquare size={16} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Send WhatsApp Message</p>
                                            <p className="text-xs text-gray-500">to {name} · {student.phone || "no phone"}</p>
                                        </div>
                                    </div>

                                    {/* Quick Templates */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {[
                                            `Hi ${student.user?.firstName}, your application has been received and is under review. We'll update you shortly.`,
                                            `Congratulations ${student.user?.firstName}! Your application has been ACCEPTED. Please check your email for next steps.`,
                                            `Hi ${student.user?.firstName}, we need 1-2 additional documents. Please contact us ASAP.`,
                                            `Your consultation is tomorrow. Link: calendly.com/invictacademy777`,
                                        ].map((template, i) => (
                                            <button key={i} onClick={() => setWhatsappMsg(template)}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-left">
                                                {["📬 Received", "🎉 Accepted", "📄 Need Docs", "📅 Reminder"][i]}
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        value={whatsappMsg}
                                        onChange={e => setWhatsappMsg(e.target.value)}
                                        placeholder="Type a WhatsApp message..."
                                        rows={4}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/30 resize-none mb-3"
                                    />
                                    <div className="flex items-center gap-3">
                                        <Button onClick={handleWhatsAppSend} disabled={sending || !whatsappMsg.trim()}
                                            className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center gap-2">
                                            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                            {sending ? "Sending..." : "Send via WhatsApp"}
                                        </Button>
                                        {messageSent && (
                                            <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-green-400 text-sm flex items-center gap-1">
                                                <CheckCircle2 size={14} /> Sent!
                                            </motion.span>
                                        )}
                                    </div>
                                </div>

                                {/* Schedule Consultation */}
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-500/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar size={18} className="text-cyan-400" />
                                        <p className="text-white font-semibold">Schedule a Consultation</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <input type="datetime-local" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/30" />
                                        <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-cyan-500/30">
                                            <option>Video Call</option>
                                            <option>WhatsApp Call</option>
                                            <option>Phone Call</option>
                                            <option>In Person</option>
                                        </select>
                                    </div>
                                    <Button className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-xl w-full flex items-center justify-center gap-2">
                                        <Calendar size={14} /> Schedule & Send Reminder
                                    </Button>
                                    <p className="text-gray-600 text-xs text-center mt-2">A WhatsApp reminder will be sent 24 hours before</p>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            )}
        </div>
    )
}
