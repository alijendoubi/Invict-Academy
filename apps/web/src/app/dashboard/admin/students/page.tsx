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

const DEMO_STUDENTS = [
    { id: "1", name: "Ahmed Benali", email: "ahmed@example.com", phone: "+216 20 123 456", country: "Italy", program: "Computer Engineering — PoliTo", status: "UNDER_REVIEW" as ApplicationStatus, lastActivity: "2 hours ago", advisor: "Sarah J." },
    { id: "2", name: "Fatima Al-Rashid", email: "fatima@example.com", phone: "+213 55 234 567", country: "Italy", program: "Business Administration — UniBO", status: "ACCEPTED" as ApplicationStatus, lastActivity: "1 day ago", advisor: "John D." },
    { id: "3", name: "Mohamed Khelifi", email: "mk@example.com", phone: "+216 25 345 678", country: "Germany", program: "Computer Science — FU Berlin", status: "VISA_PROCESSING" as ApplicationStatus, lastActivity: "3 hours ago", advisor: "Sarah J." },
    { id: "4", name: "Yasmine Touati", email: "yt@example.com", phone: "+216 50 456 789", country: "Italy", program: "Data Science — UniPadua", status: "SUBMITTED" as ApplicationStatus, lastActivity: "5 hours ago", advisor: "Ali M." },
    { id: "5", name: "Karim Mansouri", email: "km@example.com", phone: "+216 90 567 890", country: "Italy", program: "Aerospace Engineering — PoliMi", status: "DRAFT" as ApplicationStatus, lastActivity: "2 days ago", advisor: "Sarah J." },
]

const APPLICATION_STEPS = [
    "Initial Assessment",
    "Document Collection",
    "Application Submission",
    "University Review",
    "Admission Decision",
    "Visa Application",
    "Pre-Departure",
]

export default function AdminStudentsPage() {
    const [selectedStudent, setSelectedStudent] = useState(DEMO_STUDENTS[0])
    const [activeTab, setActiveTab] = useState<"students" | "messages" | "qr">("students")
    const [search, setSearch] = useState("")
    const [whatsappMsg, setWhatsappMsg] = useState("")
    const [sending, setSending] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("")
    const [messageSent, setMessageSent] = useState(false)

    const filtered = DEMO_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    )

    async function handleWhatsAppSend() {
        if (!whatsappMsg.trim()) return
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
        try {
            await fetch(`/api/applications/${selectedStudent.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
        } catch { }
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
                    { label: "Active Students", value: DEMO_STUDENTS.length, color: "text-cyan-400" },
                    { label: "Under Review", value: DEMO_STUDENTS.filter(s => s.status === "UNDER_REVIEW").length, color: "text-yellow-400" },
                    { label: "Accepted", value: DEMO_STUDENTS.filter(s => s.status === "ACCEPTED").length, color: "text-green-400" },
                    { label: "Visa Processing", value: DEMO_STUDENTS.filter(s => s.status === "VISA_PROCESSING").length, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
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
                        const cfg = STATUS_CONFIG[student.status]
                        return (
                            <motion.button
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                whileHover={{ x: 2 }}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedStudent.id === student.id ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {student.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold text-sm truncate">{student.name}</p>
                                        <p className="text-gray-500 text-xs truncate">{student.program}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} shrink-0`}>{cfg.label}</span>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                {/* Student Detail Panel */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Profile Header */}
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 flex items-center justify-center text-white font-black text-xl">
                                    {selectedStudent.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">{selectedStudent.name}</h2>
                                    <p className="text-gray-500 text-sm">{selectedStudent.program}</p>
                                    <p className="text-gray-600 text-xs mt-0.5">Advisor: {selectedStudent.advisor} · Last active: {selectedStudent.lastActivity}</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[selectedStudent.status].bg} ${STATUS_CONFIG[selectedStudent.status].color}`}>
                                {selectedStudent.status.replace("_", " ")}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <a href={`mailto:${selectedStudent.email}`} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                                <Mail size={14} className="text-gray-400" />
                                <span className="text-gray-400 text-xs">{selectedStudent.email}</span>
                            </a>
                            <a href={`https://wa.me/${selectedStudent.phone.replace(/\s+/g, "")}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors">
                                <Phone size={14} className="text-green-400" />
                                <span className="text-green-400 text-xs">{selectedStudent.phone}</span>
                            </a>
                        </div>

                        {/* Change Application Status */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Change Application Status</p>
                            <div className="flex flex-wrap gap-2">
                                {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleStatusChange(key)}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedStudent.status === key || selectedStatus === key ? `${cfg.bg} ${cfg.color} border-current` : "bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/20"}`}
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
                                const statusOrder = Object.keys(STATUS_CONFIG)
                                const currentIdx = statusOrder.indexOf(selectedStudent.status)
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
                                <p className="text-xs text-gray-500">to {selectedStudent.name} · {selectedStudent.phone}</p>
                            </div>
                        </div>

                        {/* Quick Templates */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {[
                                `Hi ${selectedStudent.name.split(" ")[0]}, your application has been received and is under review. We'll update you shortly.`,
                                `Congratulations ${selectedStudent.name.split(" ")[0]}! Your application has been ACCEPTED. Please check your email for next steps.`,
                                `Hi ${selectedStudent.name.split(" ")[0]}, we need 1-2 additional documents. Please contact us ASAP.`,
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
            </div>
        </div>
    )
}
