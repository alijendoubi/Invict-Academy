"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    FileText, Clock, CheckCircle, XCircle, AlertCircle,
    Loader2, ArrowLeft, Calendar, User, Mail,
    Plus, Trash2, CheckSquare, Square, Save, Circle,
    ExternalLink, ChevronRight, MapPin, GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

const APPLICATION_STEPS = [
    { key: "DOCUMENTS_RECEIVED", label: "Documents Received", icon: FileText, color: "text-blue-400" },
    { key: "APPLICATION_SUBMITTED", label: "Application Submitted", icon: Clock, color: "text-cyan-400" },
    { key: "UNDER_REVIEW", label: "Under Review", icon: AlertCircle, color: "text-yellow-400" },
    { key: "ADMISSION_LETTER", label: "Admission Letter", icon: GraduationCap, color: "text-purple-400" },
    { key: "VISA_PROCESS", label: "Visa Process", icon: ExternalLink, color: "text-orange-400" },
    { key: "COMPLETED", label: "Completed", icon: CheckCircle, color: "text-green-400" },
]

function StepTracker({ currentStep }: { currentStep: string }) {
    const currentIdx = APPLICATION_STEPS.findIndex(s => s.key === currentStep)
    return (
        <div className="relative p-2">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-8 right-8 h-[2px] bg-white/5 z-0" />
                <div
                    className="absolute top-5 left-8 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 z-0 transition-all duration-700"
                    style={{ width: `${Math.max(0, (currentIdx / (APPLICATION_STEPS.length - 1)) * 100 - 5)}%` }}
                />
                {APPLICATION_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentIdx
                    const isCurrent = idx === currentIdx
                    const Icon = step.icon
                    return (
                        <div key={step.key} className="flex flex-col items-center gap-2 z-10 relative px-2">
                            <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" :
                                isCurrent ? "bg-[#0B1020] border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]" :
                                    "bg-[#0B1020] border-white/10 text-gray-600"
                                }`}>
                                {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                            </div>
                            <span className={`text-[10px] text-center max-w-[80px] leading-tight hidden sm:block ${isCurrent ? "text-cyan-400 font-bold" :
                                isCompleted ? "text-gray-300" : "text-gray-600"
                                }`}>{step.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function ApplicationDetailsPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = params.id as string
    const defaultTab = searchParams.get('tab') || 'overview'

    const [application, setApplication] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [fetchingTasks, setFetchingTasks] = useState(false)

    const fetchApplication = useCallback(async () => {
        try {
            const res = await fetch(`/api/applications/${id}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setApplication(data)
        } catch (error) {
            console.error(error)
            router.push("/dashboard/applications")
        } finally {
            setLoading(false)
        }
    }, [id, router])

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/user/profile")
            if (res.ok) setUser(await res.json())
        } catch (error) { }
    }

    useEffect(() => {
        fetchApplication()
        fetchUser()
    }, [fetchApplication])

    const updateStatus = async (newStatus: string) => {
        setSaving(true)
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) fetchApplication()
        } finally {
            setSaving(false)
        }
    }

    const toggleChecklistItem = async (itemId: string, current: boolean) => {
        try {
            const res = await fetch(`/api/applications/checklist/${itemId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCompleted: !current })
            })
            if (res.ok) fetchApplication()
        } catch (error) { }
    }

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim()) return
        setFetchingTasks(true)
        try {
            const res = await fetch(`/api/applications/${id}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTaskTitle })
            })
            if (res.ok) {
                setNewTaskTitle("")
                fetchApplication()
            }
        } finally {
            setFetchingTasks(false)
        }
    }

    const toggleTask = async (taskId: string, currentStatus: string) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: currentStatus === 'DONE' ? 'TODO' : 'DONE' })
            })
            if (res.ok) fetchApplication()
        } catch (error) { }
    }

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
                <p className="text-gray-500 font-medium">Fetching application details...</p>
            </div>
        )
    }

    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(user?.role || '')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <Button variant="ghost" className="text-gray-400 hover:text-white pl-0" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Button>

                {isAdmin && (
                    <div className="flex items-center gap-2 bg-[#0B1020] border border-white/10 p-1 rounded-xl">
                        <span className="text-xs text-gray-500 px-3 font-semibold uppercase tracking-wider">Status Override</span>
                        <Select value={application.status} onValueChange={updateStatus} disabled={saving}>
                            <SelectTrigger className="w-[180px] bg-white/5 border-none h-9 text-cyan-400 font-bold">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                {["DRAFT", "DOCUMENTS_PENDING", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"].map(s => (
                                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Header & Main Info */}
                <Card className="lg:col-span-2 bg-[#0B1020] border-white/10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors group-hover:bg-cyan-500/10" />
                    <CardHeader className="relative z-10">
                        <div className="flex items-start justify-between">
                            <div>
                                <Badge className="mb-2 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{application.type}</Badge>
                                <CardTitle className="text-3xl font-black text-white">{application.university || "University Pending"}</CardTitle>
                                <CardDescription className="text-gray-400 text-lg flex items-center gap-2 mt-1">
                                    < GraduationCap size={18} className="text-cyan-500" /> {application.program || "Course Pending"}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Created On</p>
                                <p className="text-white font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-8 pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1 font-bold">
                                    <MapPin size={10} /> Country
                                </p>
                                <p className="text-white font-semibold">{application.country || "Italy"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1 font-bold">
                                    <Clock size={10} /> Intake Term
                                </p>
                                <p className="text-white font-semibold">{application.intakeTerm || "Not specified"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1 font-bold">
                                    <Calendar size={10} /> Deadline
                                </p>
                                <p className="text-white font-semibold">{application.deadline ? new Date(application.deadline).toLocaleDateString() : "Not specified"}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-6 font-bold">Application Journey</p>
                            <StepTracker currentStep={application.status === 'APPROVED' ? 'COMPLETED' : application.status} />
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar: Student Info */}
                <Card className="bg-[#0B1020] border-white/10 h-fit">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-base text-white flex items-center gap-2">
                            <User size={18} className="text-cyan-500" /> Student Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-white/5 ring-1 ring-cyan-500/10 shadow-lg">
                                <span className="text-xl font-bold text-white">{application.student?.user?.firstName?.[0]}{application.student?.user?.lastName?.[0]}</span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">{application.student?.user?.firstName} {application.student?.user?.lastName}</p>
                                <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5"><Mail size={12} className="text-cyan-500/50" /> {application.student?.user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-300 h-10 group rounded-xl">
                                <Link href={`/dashboard/admin/students?studentId=${application.studentId}`} className="flex items-center justify-between w-full">
                                    View Profile <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-300 h-10 group rounded-xl">
                                <Link href={`/dashboard/admin/students?studentId=${application.studentId}`} className="flex items-center justify-between w-full">
                                    Message Student <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-4">
                <TabsList className="bg-[#0B1020] border border-white/10 p-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">Steps & Guidance</TabsTrigger>
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">Tasks</TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-lg text-white">Application Checklist</CardTitle>
                            <CardDescription className="text-gray-500 text-xs">Complete these steps to advance the application</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {application.checklistItems?.length === 0 ? (
                                <div className="text-center py-12 text-gray-600 space-y-2">
                                    <CheckCircle className="h-8 w-8 mx-auto opacity-20" />
                                    <p>No checklist items assigned to this application type yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {application.checklistItems.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group",
                                                item.isCompleted
                                                    ? "bg-green-500/5 border-green-500/20 text-green-400/70"
                                                    : "bg-white/5 border-white/10 text-gray-300 hover:border-cyan-500/30"
                                            )}
                                            onClick={() => toggleChecklistItem(item.id, item.isCompleted)}
                                        >
                                            {item.isCompleted ? <CheckSquare className="h-5 w-5 text-green-400" /> : <Square className="h-5 w-5 text-gray-600 group-hover:text-cyan-400" />}
                                            <span className={cn("text-sm font-medium", item.isCompleted && "line-through opacity-70")}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-[#0B1020] border-white/10 h-fit">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">Active Tasks</CardTitle>
                                <CardDescription className="text-gray-500 text-xs">Specific tasks for this application</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isAdmin && (
                                    <form onSubmit={addTask} className="flex gap-2">
                                        <Input
                                            placeholder="Add a task..."
                                            className="bg-white/5 border-white/10 text-white"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            disabled={fetchingTasks}
                                        />
                                        <Button type="submit" size="icon" className="shrink-0 bg-cyan-600 hover:bg-cyan-500" disabled={fetchingTasks}>
                                            {fetchingTasks ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                        </Button>
                                    </form>
                                )}

                                <div className="space-y-3">
                                    {application.tasks?.length === 0 ? (
                                        <div className="py-12 text-center text-gray-600 text-xs italic">No tasks created yet</div>
                                    ) : (
                                        application.tasks.map((task: any) => (
                                            <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => toggleTask(task.id, task.status)} className="text-gray-600 hover:text-cyan-400 transition-colors">
                                                        {task.status === 'DONE' ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
                                                    </button>
                                                    <span className={cn("text-sm", task.status === 'DONE' ? "text-gray-500 line-through" : "text-white font-medium")}>{task.title}</span>
                                                </div>
                                                <Badge className={cn("text-[9px] h-4", task.priority === 'HIGH' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400")}>{task.priority}</Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">Log & History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                                    {application.stepLogs?.length === 0 ? (
                                        <p className="text-xs text-gray-600 pl-8">No history available yet.</p>
                                    ) : (
                                        application.stepLogs.map((log: any, idx: number) => (
                                            <div key={log.id} className="relative pl-8">
                                                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-[#0B1020] border-4 border-white/10 flex items-center justify-center ring-4 ring-[#0B1020]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                                </div>
                                                <p className="text-sm text-white font-medium">{log.description}</p>
                                                <p className="text-[10px] text-gray-500 mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                                            </div>
                                        ))
                                    )}
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-[#0B1020] border-4 border-white/10 flex items-center justify-center ring-4 ring-[#0B1020]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium">Application Created</p>
                                        <p className="text-[10px] text-gray-500 mt-1">{new Date(application.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="documents">
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Student Documents</CardTitle>
                            <CardDescription className="text-gray-500 text-xs">Manage and view documents uploaded by the student</CardDescription>
                        </CardHeader>
                        <CardContent className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 mb-2">
                                <FileText size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-semibold">View Student&apos;s Global Document Locker</p>
                                <p className="text-gray-500 text-sm max-w-sm">All documents like Passport, Transcripts and Diplomas are managed centrally for all applications.</p>
                            </div>
                            <Button asChild className="bg-cyan-600 hover:bg-cyan-500 h-10 mt-4 rounded-xl px-6">
                                <Link href={`/dashboard/admin/students?studentId=${application.studentId}&tab=documents`}>
                                    Go to Documents Section
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
