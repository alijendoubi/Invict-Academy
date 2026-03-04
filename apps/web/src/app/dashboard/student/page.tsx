"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileText, CheckCircle, Clock, AlertCircle,
    Calendar, MapPin, GraduationCap,
    Upload, MessageSquare, Bell, Plane,
    Mail, Pin, ExternalLink, ChevronRight,
    Circle, CheckCircle2, Loader2, ArrowRight
} from "lucide-react"

const APPLICATION_STEPS = [
    { key: "DOCUMENTS_RECEIVED", label: "Documents Received", icon: FileText, color: "text-blue-400" },
    { key: "APPLICATION_SUBMITTED", label: "Application Submitted", icon: Upload, color: "text-cyan-400" },
    { key: "UNDER_REVIEW", label: "Under Review", icon: Loader2, color: "text-yellow-400" },
    { key: "ADMISSION_LETTER", label: "Admission Letter", icon: GraduationCap, color: "text-purple-400" },
    { key: "VISA_PROCESS", label: "Visa Process", icon: Plane, color: "text-orange-400" },
    { key: "COMPLETED", label: "Completed", icon: CheckCircle2, color: "text-green-400" },
]

function StepTracker({ currentStep }: { currentStep: string }) {
    const currentIdx = APPLICATION_STEPS.findIndex(s => s.key === currentStep)
    return (
        <div className="relative">
            <div className="flex items-center justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/5 z-0" />
                <div
                    className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 z-0 transition-all duration-700"
                    style={{ width: `${(currentIdx / (APPLICATION_STEPS.length - 1)) * 100}%` }}
                />
                {APPLICATION_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentIdx
                    const isCurrent = idx === currentIdx
                    const isPending = idx > currentIdx
                    const Icon = step.icon
                    return (
                        <div key={step.key} className="flex flex-col items-center gap-2 z-10 relative">
                            <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted ? "bg-cyan-500 border-cyan-500 text-black" :
                                isCurrent ? "bg-[#0B1020] border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]" :
                                    "bg-[#0B1020] border-white/10 text-gray-600"
                                }`}>
                                {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} className={isPending ? "" : ""} />}
                            </div>
                            <span className={`text-[10px] text-center max-w-[70px] leading-tight hidden sm:block ${isCurrent ? "text-cyan-400 font-bold" :
                                isCompleted ? "text-gray-300" : "text-gray-600"
                                }`}>{step.label}</span>
                        </div>
                    )
                })}
            </div>
            {/* Mobile: current step label */}
            <div className="mt-4 sm:hidden text-center">
                <span className="text-cyan-400 font-bold text-sm">
                    {APPLICATION_STEPS[currentIdx]?.label}
                </span>
            </div>
        </div>
    )
}

export default function StudentDashboardPage() {
    const [profile, setProfile] = useState<any>(null)
    const [applications, setApplications] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [consultation, setConsultation] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [documents, setDocuments] = useState<any[]>([])
    const [docsLoading, setDocsLoading] = useState(true)
    const [reply, setReply] = useState("")
    const [sendingReply, setSendingReply] = useState(false)
    const [replySent, setReplySent] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const [profileRes, appsRes] = await Promise.allSettled([
                    fetch("/api/user/profile"),
                    fetch("/api/applications/my"),
                ])
                if (profileRes.status === "fulfilled") {
                    const data = await profileRes.value.json()
                    setProfile(data)
                    if (data?.studentProfile?.id) {
                        const [msgRes, consultRes] = await Promise.allSettled([
                            fetch(`/api/messages`),
                            fetch(`/api/consultations/student/${data.studentProfile.id}`),
                        ])
                        if (msgRes.status === "fulfilled") {
                            const msgs = await msgRes.value.json()
                            setMessages(Array.isArray(msgs) ? msgs : [])
                        }
                        if (consultRes.status === "fulfilled") {
                            const consults = await consultRes.value.json()
                            setConsultation(Array.isArray(consults) && consults.length > 0 ? consults[0] : null)
                        }
                    }
                }
                if (appsRes.status === "fulfilled") {
                    const apps = await appsRes.value.json()
                    setApplications(Array.isArray(apps) ? apps : [])
                }

                // Fetch real documents
                fetch('/api/documents/my')
                    .then(r => r.json())
                    .then(d => setDocuments(Array.isArray(d) ? d : []))
                    .catch(() => { })
                    .finally(() => setDocsLoading(false))
            } catch {
                // Error handled by empty states
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const unreadCount = messages.filter(m => !m.readAt).length

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
                    <p className="text-gray-400">Loading your portal...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#070A12]">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-indigo-900/20 border-b border-white/10 p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[200px] bg-cyan-500/5 rounded-full blur-[80px]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-1">Student Portal</p>
                            <h1 className="text-3xl font-black text-white mb-1">
                                Welcome back, {profile?.firstName}! 👋
                            </h1>
                            <p className="text-gray-400">Track your application and stay connected with our admission team.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button asChild size="sm" className="bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 rounded-xl">
                                <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <MessageSquare size={14} /> WhatsApp Team
                                </a>
                            </Button>
                            <Button asChild size="sm" className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
                                <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Calendar size={14} /> Book Consultation
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* Application Journey Tracker */}
                {applications.map((app) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="bg-[#0B1020] border-white/10 overflow-hidden">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div>
                                        <CardTitle className="text-white text-lg">{app.university}</CardTitle>
                                        <p className="text-sm text-gray-400">{app.program} · {app.country}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`${app.currentStep === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                            app.currentStep === "ADMISSION_LETTER" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                app.currentStep === "VISA_PROCESS" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                                                    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                            } border`}>
                                            {APPLICATION_STEPS.find(s => s.key === app.currentStep)?.label || app.currentStep}
                                        </Badge>
                                        <Button asChild size="sm" variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2 group">
                                            <Link href={`/dashboard/applications/${app.id}`} className="flex items-center gap-1.5 font-bold">
                                                View Details <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-5 font-semibold">Application Journey</p>
                                <StepTracker currentStep={app.currentStep || "DOCUMENTS_RECEIVED"} />
                                <p className="text-xs text-gray-600 mt-5 text-right">
                                    Last updated: {new Date(app.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Messages Inbox */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Mail size={18} className="text-cyan-400" />
                                        Messages from Invict Team
                                        {unreadCount > 0 && (
                                            <span className="h-5 w-5 bg-cyan-500 text-black text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                                        )}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                {/* Message thread */}
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, x: msg.fromAdmin !== false ? -8 : 8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className={`flex ${msg.fromAdmin !== false ? "justify-start" : "justify-end"}`}
                                        >
                                            <div className={`max-w-[85%] p-3.5 rounded-2xl border text-sm ${msg.fromAdmin !== false
                                                ? msg.isPinned
                                                    ? "bg-cyan-500/5 border-cyan-500/20 rounded-tl-sm"
                                                    : "bg-white/[0.03] border-white/10 rounded-tl-sm"
                                                : "bg-blue-600/10 border-blue-500/20 rounded-tr-sm text-right"
                                                }`}>
                                                <p className={`text-xs font-semibold mb-1 ${msg.fromAdmin !== false ? "text-cyan-400" : "text-blue-400"}`}>
                                                    {msg.fromAdmin !== false ? "Invict Advisor" : "You"}
                                                    {msg.isPinned && <span className="ml-1 text-[10px]">📌</span>}
                                                </p>
                                                <p className="text-gray-300 leading-relaxed">{msg.content}</p>
                                                <p className="text-gray-700 text-[10px] mt-1.5">
                                                    {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="text-center py-10 text-gray-600">
                                            <Mail size={36} className="mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">No messages yet. Your advisor will be in touch soon.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Reply input */}
                                <div className="pt-3 border-t border-white/5">
                                    <p className="text-xs text-gray-600 mb-2">Send a message to your advisor:</p>
                                    <div className="flex gap-2 items-end">
                                        <textarea
                                            value={reply}
                                            onChange={e => setReply(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    // trigger click on send button
                                                    const btn = e.currentTarget.parentElement?.querySelector('button') as HTMLButtonElement
                                                    btn?.click()
                                                }
                                            }}
                                            placeholder="Type your message… (Enter to send)"
                                            rows={2}
                                            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/40 resize-none"
                                        />
                                        <button
                                            disabled={sendingReply || !reply.trim()}
                                            onClick={async () => {
                                                if (!reply.trim()) return
                                                setSendingReply(true)
                                                try {
                                                    const res = await fetch('/api/messages', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ content: reply }),
                                                    })
                                                    if (res.ok) {
                                                        const newMsg = await res.json()
                                                        setMessages(prev => [...prev, newMsg])
                                                        setReply('')
                                                        setReplySent(true)
                                                        setTimeout(() => setReplySent(false), 3000)
                                                    }
                                                } catch { }
                                                finally { setSendingReply(false) }
                                            }}
                                            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-1.5 h-10"
                                        >
                                            {sendingReply
                                                ? <Loader2 size={14} className="animate-spin" />
                                                : <ChevronRight size={14} />}
                                            Send
                                        </button>
                                    </div>
                                    {replySent && (
                                        <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                                            <CheckCircle size={11} /> Message sent!
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Required Documents — Live List */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <FileText size={18} className="text-purple-400" />
                                    My Documents
                                    {documents.length > 0 && (
                                        <span className="ml-auto text-xs text-gray-500">
                                            {documents.filter(d => d.status === 'APPROVED').length}/{documents.length} approved
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {docsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 size={20} className="animate-spin text-cyan-500" />
                                    </div>
                                ) : documents.length === 0 ? (
                                    <div className="text-center py-8 text-gray-600 text-sm">
                                        <FileText size={32} className="mx-auto mb-2 opacity-20" />
                                        No documents uploaded yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2 mb-4">
                                        {documents.map((doc, i) => (
                                            <div key={doc.id || i} className={`flex items-center gap-3 p-3 rounded-xl border ${doc.status === 'APPROVED' ? 'bg-green-500/5 border-green-500/20' :
                                                doc.status === 'REJECTED' ? 'bg-red-500/5 border-red-500/20' :
                                                    'bg-white/[0.02] border-white/5'
                                                }`}>
                                                {doc.status === 'APPROVED'
                                                    ? <CheckCircle size={14} className="text-green-400 shrink-0" />
                                                    : doc.status === 'REJECTED'
                                                        ? <Circle size={14} className="text-red-400 shrink-0" />
                                                        : <Clock size={14} className="text-yellow-400 shrink-0" />}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white truncate">{doc.filename}</p>
                                                    <p className="text-xs text-gray-600">{doc.type} · {new Date(doc.createdAt).toLocaleDateString('en-GB', { day: "numeric", month: "short" })}</p>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${doc.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                    doc.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>{doc.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full mt-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 rounded-xl" size="sm">
                                            <Upload size={14} className="mr-2" /> Upload Documents
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] bg-[#070A12] border-white/10 text-white">
                                        <DialogHeader>
                                            <DialogTitle>Upload Document</DialogTitle>
                                            <DialogDescription className="text-gray-400">
                                                Please select a file to upload. Allowed formats: PDF, JPG, PNG.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={async (e) => {
                                            e.preventDefault()
                                            setUploading(true)
                                            setUploadError(null)
                                            setUploadSuccess(false)
                                            const formData = new FormData(e.currentTarget)
                                            formData.append("studentId", profile?.studentProfile?.id || "")
                                            try {
                                                const res = await fetch("/api/documents/upload", {
                                                    method: "POST",
                                                    body: formData,
                                                })

                                                const data = await res.json().catch(() => null);

                                                if (!res.ok) {
                                                    throw new Error(data?.error || data?.details || "Upload failed");
                                                }

                                                setUploadSuccess(true)
                                                setTimeout(() => {
                                                    setIsUploadModalOpen(false)
                                                    setUploadSuccess(false)
                                                }, 2000)
                                            } catch (error: any) {
                                                setUploadError(error.message || "Something went wrong")
                                            } finally {
                                                setUploading(false)
                                            }
                                        }}>
                                            <div className="grid gap-4 py-4">
                                                {uploadError && <p className="text-sm font-medium text-red-500">{uploadError}</p>}
                                                {uploadSuccess && <p className="text-sm font-medium text-green-500">Document uploaded successfully!</p>}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="type" className="text-gray-300">Document Type</Label>
                                                    <select id="type" name="type" className="flex h-10 w-full rounded-md border border-white/10 bg-[#0B1020] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2" required>
                                                        <option value="GENERAL">General Document</option>
                                                        <option value="PASSPORT">Passport</option>
                                                        <option value="DIPLOMA">High School Diploma</option>
                                                        <option value="TRANSCRIPT">Transcripts</option>
                                                        <option value="CV">CV / Resume</option>
                                                        <option value="MOTIVATION_LETTER">Motivation Letter</option>
                                                        <option value="LANGUAGE_CERT">Language Certificate</option>
                                                    </select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="file" className="text-gray-300">File</Label>
                                                    <Input id="file" name="file" type="file" required className="bg-[#0B1020] border-white/10 text-white file:text-cyan-400 file:bg-cyan-500/10 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2" accept=".pdf,.jpg,.jpeg,.png" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" disabled={uploading}>
                                                    {uploading ? (
                                                        <>
                                                            <Loader2 size={16} className="mr-2 animate-spin" /> Uploading...
                                                        </>
                                                    ) : (
                                                        "Upload Document"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Consultation Card */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Calendar size={18} className="text-blue-400" />
                                    Your Consultation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {consultation ? (
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <p className="text-blue-300 font-bold">
                                                {new Date(consultation.scheduledAt).toLocaleDateString("en-GB", {
                                                    weekday: "long", day: "numeric", month: "long"
                                                })}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(consultation.scheduledAt).toLocaleTimeString("en-GB", {
                                                    hour: "2-digit", minute: "2-digit"
                                                })}
                                            </p>
                                            {consultation.notes && (
                                                <p className="text-gray-500 text-xs mt-2">{consultation.notes}</p>
                                            )}
                                        </div>
                                        <Button asChild className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl" size="sm">
                                            <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer">
                                                <MessageSquare size={14} className="mr-2" /> Reschedule via WhatsApp
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Calendar size={36} className="mx-auto mb-3 text-gray-700" />
                                        <p className="text-gray-500 text-sm mb-3">No consultation scheduled</p>
                                        <Button asChild className="w-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 rounded-xl" size="sm">
                                            <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                                <ExternalLink size={14} /> Book on Calendly
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Important Notes */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Bell size={18} className="text-yellow-400" />
                                    Important Notices
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                    <p className="text-yellow-300 text-xs font-bold uppercase tracking-wide mb-1">Action Needed</p>
                                    <p className="text-gray-300 text-sm">Please upload your remaining documents as soon as possible to avoid delays in your application.</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <p className="text-gray-400 text-sm">For urgent queries, reach our admission team directly on WhatsApp.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-2">
                                {[
                                    { label: "WhatsApp Consultation Team", href: "https://wa.me/message/QQJHB2LLHFFTF1", icon: MessageSquare, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                                    { label: "Book Consultation", href: "https://calendly.com/invictacademy777", icon: Calendar, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
                                    { label: "Contact Admission Team", href: "https://wa.me/393477590963", icon: ExternalLink, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                                ].map((action, i) => (
                                    <Button
                                        key={i}
                                        asChild
                                        className={`w-full justify-start border ${action.bg} ${action.color} hover:opacity-90 rounded-xl`}
                                        size="sm"
                                    >
                                        <a href={action.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            <action.icon size={14} />
                                            <span className="text-xs">{action.label}</span>
                                        </a>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
