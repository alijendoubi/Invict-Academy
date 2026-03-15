"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Users, UserCircle, GraduationCap, TrendingUp,
    DollarSign, FileText, Loader2, Shield, CheckCircle2, Upload
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Stat {
    name: string
    value: string
    change: string
    status: string
    icon: any
    color: string
}

export default function DashboardPage() {
    const [data, setData] = useState<any>(null)
    const [stats, setStats] = useState<Stat[]>([])
    const [loading, setLoading] = useState(true)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [uploadDocType, setUploadDocType] = useState("PASSPORT")
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [studentId, setStudentId] = useState<string | null>(null)

    const openUpload = (docType: string) => {
        setUploadDocType(docType)
        setUploadError(null)
        setUploadSuccess(false)
        setUploadDialogOpen(true)
    }

    useEffect(() => {
        const iconMap: Record<string, any> = {
            "Total Leads": UserCircle,
            "Active Students": GraduationCap,
            "Applications": FileText,
            "Revenue (MTD)": DollarSign,
            "Application Status": TrendingUp,
            "Readiness Score": Shield,
            "Documents": FileText
        }

        const colorMap: Record<string, string> = {
            "Total Leads": "text-blue-400",
            "Active Students": "text-cyan-400",
            "Applications": "text-purple-400",
            "Revenue (MTD)": "text-green-400",
            "Application Status": "text-cyan-400",
            "Readiness Score": "text-yellow-400",
            "Documents": "text-blue-400"
        }

        async function fetchStats() {
            try {
                const res = await fetch('/api/dashboard/stats')
                const dashboardData = await res.json()
                setData(dashboardData)

                const formattedStats = dashboardData.stats.map((s: any) => ({
                    ...s,
                    icon: iconMap[s.name] || UserCircle,
                    color: colorMap[s.name] || "text-gray-400"
                }))

                setStats(formattedStats)
            } catch (err) {
                console.error("Failed to fetch stats:", err)
                setData(null)
                setStats([])
            } finally {
                setLoading(false)
            }
        }
        fetchStats()

        // Fetch the student profile id for uploads
        fetch('/api/user/profile')
            .then(r => r.json())
            .then(d => { if (d?.studentProfile?.id) setStudentId(d.studentProfile.id) })
            .catch(() => { })
    }, [])

    const recentActivity = data?.recentActivity || []

    const studentSteps = [
        { id: 'ACTIVE', name: 'Profile Ready', description: 'Basic info completed' },
        { id: 'APPLYING', name: 'Applying', description: 'Submitting to universities' },
        { id: 'ACCEPTED', name: 'Accepted', description: 'Offer letter received' },
        { id: 'VISA_IN_PROGRESS', name: 'Visa Stage', description: 'Embassy coordination' },
        { id: 'ARRIVED', name: 'Arrived', description: 'Welcome to Italy!' }
    ]

    const getCurrentStepIndex = () => {
        if (!data?.progress?.status) return 0
        const index = studentSteps.findIndex(s => s.id === data.progress.status)
        return index === -1 ? 0 : index
    }

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {data?.role === 'STUDENT' ? 'Student Dashboard' : 'Dashboard'}
                    </h1>
                    <p className="text-gray-400">
                        {data?.role === 'STUDENT'
                            ? "Track your journey to Italy and manage your applications."
                            : "Welcome back! Here's what's happening today."}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="bg-card border-white/10">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-cyan-400/60 mt-1">{stat.change}</p>
                                </div>
                                <div className={cn("h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center", stat.color)}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {data?.role === 'STUDENT' && (
                <Card className="bg-card border-white/10 overflow-hidden">
                    <CardHeader className="bg-white/[0.02] border-b border-white/5">
                        <CardTitle className="text-white">Your Pathway to Italy</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="relative">
                            {/* Line */}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5" />
                            <div
                                className="absolute top-5 left-0 h-0.5 bg-cyan-500 transition-all duration-500"
                                style={{ width: `${(getCurrentStepIndex() / (studentSteps.length - 1)) * 100}%` }}
                            />

                            {/* Steps */}
                            <div className="relative flex justify-between">
                                {studentSteps.map((step, idx) => {
                                    const isCompleted = idx < getCurrentStepIndex()
                                    const isCurrent = idx === getCurrentStepIndex()
                                    return (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors bg-card",
                                                isCompleted ? "border-cyan-500 bg-cyan-500 text-white" :
                                                    isCurrent ? "border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" :
                                                        "border-white/10 text-gray-500"
                                            )}>
                                                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span>{idx + 1}</span>}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p className={cn(
                                                    "text-sm font-semibold",
                                                    isCurrent ? "text-cyan-400" : "text-gray-300"
                                                )}>{step.name}</p>
                                                <p className="text-xs text-gray-500 mt-1 max-w-[120px]">{step.description}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity / Next Steps */}
                <Card className="bg-card border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">
                            {data?.role === 'STUDENT' ? 'Next Steps' : 'Recent Activity'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.role === 'STUDENT' ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">1</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Upload Passport</p>
                                        <p className="text-xs text-gray-400">Required for university evaluation</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white border-0 gap-1.5"
                                        onClick={() => openUpload("PASSPORT")}
                                    >
                                        <Upload size={12} /> Upload
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">2</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Academic Transcript</p>
                                        <p className="text-xs text-gray-400">Original and translated copies</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white border-0 gap-1.5"
                                        onClick={() => openUpload("TRANSCRIPT")}
                                    >
                                        <Upload size={12} /> Upload
                                    </Button>
                                </div>

                                {/* Upload Dialog */}
                                <Dialog open={uploadDialogOpen} onOpenChange={(open) => { setUploadDialogOpen(open); if (!open) { setUploadError(null); setUploadSuccess(false) } }}>
                                    <DialogContent className="bg-card border-white/10 text-white max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Upload size={18} className="text-cyan-400" />
                                                Upload {uploadDocType === "PASSPORT" ? "Passport" : "Academic Transcript"}
                                            </DialogTitle>
                                            <DialogDescription className="text-gray-400">
                                                Accepted formats: PDF, JPG, PNG (max 10 MB)
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={async (e) => {
                                            e.preventDefault()
                                            setUploading(true)
                                            setUploadError(null)
                                            const formData = new FormData(e.currentTarget as HTMLFormElement)
                                            formData.set("type", uploadDocType)
                                            if (studentId) formData.append("studentId", studentId)
                                            try {
                                                const res = await fetch("/api/documents/upload", { method: "POST", body: formData })
                                                const result = await res.json().catch(() => null)
                                                if (!res.ok) throw new Error(result?.error || result?.details || "Upload failed")
                                                setUploadSuccess(true)
                                                setTimeout(() => { setUploadDialogOpen(false); setUploadSuccess(false) }, 1800)
                                            } catch (err: any) {
                                                setUploadError(err.message || "Upload failed")
                                            } finally {
                                                setUploading(false)
                                            }
                                        }}>
                                            <div className="space-y-4 py-2">
                                                {uploadError && (
                                                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{uploadError}</p>
                                                )}
                                                {uploadSuccess && (
                                                    <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                                                        <CheckCircle2 size={14} /> Uploaded successfully!
                                                    </p>
                                                )}
                                                <div className="space-y-2">
                                                    <Label className="text-gray-300">Select File</Label>
                                                    <Input
                                                        name="file"
                                                        type="file"
                                                        required
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        className="bg-white/5 border-white/10 text-white file:text-cyan-400 file:bg-cyan-500/10 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter className="pt-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="border-white/10 text-gray-300"
                                                    onClick={() => setUploadDialogOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={uploading}
                                                    className="bg-cyan-600 hover:bg-cyan-500 text-white"
                                                >
                                                    {uploading ? <><Loader2 size={14} className="mr-2 animate-spin" /> Uploading...</> : <><Upload size={14} className="mr-2" /> Upload</>}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((activity: any) => (
                                    <div key={activity.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white capitalize">{activity.action}</p>
                                            <p className="text-xs text-gray-400">{activity.user} • {activity.entity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}, {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-card border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data?.role === 'STUDENT' ? (
                            <>
                                <Link href="/dashboard/student" className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                    <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                        <FileText className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">My Documents</p>
                                        <p className="text-xs text-gray-400">Manage your uploads</p>
                                    </div>
                                </Link>
                                <Link href="/italian-universities" className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                        <GraduationCap className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">University List</p>
                                        <p className="text-xs text-gray-400">Explore partner institutions</p>
                                    </div>
                                </Link>
                                <Link href="/dashboard/payments" className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                        <DollarSign className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Payments</p>
                                        <p className="text-xs text-gray-400">Pay tuition or services</p>
                                    </div>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard/leads" className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                    <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                        <UserCircle className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Add New Lead</p>
                                        <p className="text-xs text-gray-400">Create a new lead entry</p>
                                    </div>
                                </Link>
                                <Link href="/dashboard/applications" className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                        <FileText className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">New Application</p>
                                        <p className="text-xs text-gray-400">Start an application process</p>
                                    </div>
                                </Link>
                                <Link href="/dashboard/payments" className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group">
                                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                        <DollarSign className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Record Payment</p>
                                        <p className="text-xs text-gray-400">Log a new payment</p>
                                    </div>
                                </Link>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

