"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    FileText, CheckCircle, Clock, AlertCircle,
    Calendar, MapPin, GraduationCap,
    Upload, MessageSquare, Bell, Plane,
    Mail, Pin, ExternalLink, ChevronRight,
    Circle, CheckCircle2, Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

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

    useEffect(() => {
        const load = async () => {
            try {
                // Try API, fall back to demo data gracefully
                const [profileRes, appsRes] = await Promise.allSettled([
                    fetch("/api/user/profile"),
                    fetch("/api/applications/my"),
                ])
                if (profileRes.status === "fulfilled") {
                    const data = await profileRes.value.json()
                    setProfile(data)
                    // Load messages and consultation using studentId from profile
                    if (data?.studentProfile?.id) {
                        const [msgRes, consultRes] = await Promise.allSettled([
                            fetch(`/api/student-messages/student/${data.studentProfile.id}`),
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
            } catch {
                // Silently use demo data
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    // Demo data fallback for preview
    const demoProfile = profile || {
        firstName: "Ahmed", lastName: "Rahman",
        email: "ahmed@example.com",
        studentProfile: { id: "demo-123", status: "APPLYING", phone: "+213555000111" }
    }
    const demoApps = applications.length > 0 ? applications : [
        {
            id: "1", university: "Sapienza University of Rome", country: "Italy", program: "Computer Science MSc",
            status: "UNDER_REVIEW", currentStep: "UNDER_REVIEW", updatedAt: new Date().toISOString()
        },
    ]
    const demoMessages = messages.length > 0 ? messages : [
        { id: "1", subject: "Welcome to Invict Academy!", content: "Your student account is now active. Our team will be in touch shortly to discuss your application.", isPinned: true, readAt: null, createdAt: new Date().toISOString() },
        { id: "2", subject: "Documents Update", content: "Please make sure to upload a clear copy of your Diploma and Transcripts. Our team has reviewed your draft and everything looks promising!", isPinned: false, readAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000).toISOString() },
    ]

    const unreadCount = demoMessages.filter(m => !m.readAt).length

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
                                Welcome back, {demoProfile.firstName}! 👋
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
                {demoApps.map((app) => (
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
                                    <Badge className={`${app.currentStep === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                        app.currentStep === "ADMISSION_LETTER" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            app.currentStep === "VISA_PROCESS" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                                                "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                        } border`}>
                                        {APPLICATION_STEPS.find(s => s.key === app.currentStep)?.label || app.currentStep}
                                    </Badge>
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
                            <CardContent className="space-y-3 pt-4">
                                {demoMessages.map((msg, i) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`p-4 rounded-xl border transition-all ${msg.isPinned ? "bg-cyan-500/5 border-cyan-500/20" :
                                            !msg.readAt ? "bg-white/5 border-white/10" :
                                                "bg-white/[0.02] border-white/5"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                {msg.isPinned && <Pin size={12} className="text-cyan-400 mt-1 shrink-0" />}
                                                {!msg.readAt && !msg.isPinned && <div className="h-2 w-2 rounded-full bg-cyan-400 mt-2 shrink-0" />}
                                                <div>
                                                    <p className={`font-semibold text-sm ${!msg.readAt ? "text-white" : "text-gray-300"}`}>
                                                        {msg.subject || "Message from Invict Academy"}
                                                    </p>
                                                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{msg.content}</p>
                                                    <p className="text-gray-600 text-xs mt-2">
                                                        {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {demoMessages.length === 0 && (
                                    <div className="text-center py-12 text-gray-600">
                                        <Mail size={40} className="mx-auto mb-3 opacity-20" />
                                        <p>No messages yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Required Documents Checklist */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <FileText size={18} className="text-purple-400" />
                                    Required Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { name: "Passport", done: true },
                                        { name: "High School Diploma", done: true },
                                        { name: "Transcripts", done: false },
                                        { name: "CV / Resume", done: false },
                                        { name: "Motivation Letter", done: false },
                                        { name: "Language Certificate", done: false },
                                    ].map((doc, i) => (
                                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${doc.done ? "bg-green-500/5 border-green-500/20" : "bg-white/[0.02] border-white/5"
                                            }`}>
                                            {doc.done
                                                ? <CheckCircle size={14} className="text-green-400 shrink-0" />
                                                : <Circle size={14} className="text-gray-600 shrink-0" />
                                            }
                                            <span className={`text-sm ${doc.done ? "text-green-300" : "text-gray-400"}`}>{doc.name}</span>
                                        </div>
                                    ))}
                                </div>
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
                                            formData.append("studentId", demoProfile.studentProfile?.id || "demo-123")
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
