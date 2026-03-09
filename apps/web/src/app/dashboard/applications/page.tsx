"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [students, setStudents] = useState<any[]>([])
    const [studentsLoading, setStudentsLoading] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState("")
    const [userRole, setUserRole] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/applications")
            const data = await res.json()
            if (Array.isArray(data)) {
                setApplications(data)
            } else if (Array.isArray(data?.data)) {
                setApplications(data.data)
            } else {
                setApplications([])
            }
        } catch (error) {
            console.error("Failed to fetch applications:", error)
            setApplications([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => {
                if (d?.role) setUserRole(d.role)
            })
            .catch(() => { })
        fetchApplications()
    }, [])

    // Load real students when the dialog opens
    useEffect(() => {
        if (!dialogOpen) return
        setStudentsLoading(true)
        fetch("/api/students")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setStudents(data)
                else if (Array.isArray(data?.data)) setStudents(data.data)
                else setStudents([])
            })
            .catch(() => setStudents([]))
            .finally(() => setStudentsLoading(false))
    }, [dialogOpen])

    const filteredApplications = applications.filter(app =>
        app.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "SUBMITTED": return <Clock className="h-4 w-4" />
            case "UNDER_REVIEW": return <AlertCircle className="h-4 w-4" />
            case "APPROVED": return <CheckCircle className="h-4 w-4" />
            case "REJECTED": return <XCircle className="h-4 w-4" />
            default: return <FileText className="h-4 w-4" />
        }
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            DRAFT: "bg-gray-500/10 text-gray-400",
            SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            DOCUMENTS_PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            UNDER_REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            APPROVED: "bg-green-500/10 text-green-400 border-green-500/20",
            REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
        }
        return colors[status] || "bg-gray-500/10 text-gray-400"
    }

    const calculateProgress = (app: any) => {
        if (app.status === "APPROVED") return 100
        if (app.status === "REJECTED") return 100
        if (app.status === "UNDER_REVIEW") return 75
        if (app.status === "SUBMITTED") return 50
        if (app.status === "DOCUMENTS_PENDING") return 25
        return 10
    }

    const handleCreateApplication = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            const bodyData: any = {
                universityName: formData.get("university"),
                courseName: formData.get("program"),
                type: formData.get("type") || "UNIVERSITY",
                status: "DRAFT",
                country: formData.get("country"),
                intakeTerm: formData.get("intakeTerm"),
            }

            const deadline = formData.get("deadline")
            if (deadline) bodyData.deadline = deadline

            if (userRole !== "STUDENT") {
                bodyData.studentId = selectedStudentId
            }

            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to create application")
            }

            form.reset()
            setSelectedStudentId("")
            setDialogOpen(false)
            fetchApplications()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setSubmitting(false)
        }
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
                    <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
                    <p className="text-gray-400">Track university applications and their status</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                            <Plus className="mr-2 h-4 w-4" /> New Application
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Start New Application</DialogTitle>
                            <DialogDescription>
                                Create a new university application for a student.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateApplication} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Target University</Label>
                                    <Input name="university" required placeholder="e.g. Sapienza University of Rome" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Degree Program</Label>
                                    <Input name="program" required placeholder="e.g. BSc in Architecture" className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Target Country</Label>
                                    <Input name="country" required placeholder="e.g. Italy" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Application Type</Label>
                                    <Select name="type" required defaultValue="UNIVERSITY">
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select type..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-white/10 text-white">
                                            <SelectItem value="UNIVERSITY">University</SelectItem>
                                            <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
                                            <SelectItem value="VISA">Visa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Intake Term</Label>
                                    <Input name="intakeTerm" placeholder="e.g. Fall 2026" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Deadline (Optional)</Label>
                                    <Input name="deadline" type="date" className="bg-white/5 border-white/10 text-white [color-scheme:dark]" />
                                </div>
                            </div>
                            {userRole !== "STUDENT" && (
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Assign to Student</Label>
                                    <Select required value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder={studentsLoading ? "Loading students..." : "Select student..."} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-white/10 text-white">
                                            {studentsLoading ? (
                                                <div className="flex items-center justify-center p-4">
                                                    <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
                                                </div>
                                            ) : students.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">No students found</div>
                                            ) : (
                                                students.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        {s.user?.firstName} {s.user?.lastName} ({s.user?.email})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" className="border-white/10 text-gray-300">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={submitting || (userRole !== "STUDENT" && !selectedStudentId)} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Create Application
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-5">
                {[
                    { label: "Total", value: applications.length, icon: FileText, color: "text-blue-400" },
                    { label: "Pending", value: applications.filter(a => ["DRAFT", "DOCUMENTS_PENDING"].includes(a.status)).length, icon: Clock, color: "text-yellow-400" },
                    { label: "Submitted", value: applications.filter(a => a.status === "SUBMITTED").length, icon: FileText, color: "text-purple-400" },
                    { label: "Approved", value: applications.filter(a => a.status === "APPROVED").length, icon: CheckCircle, color: "text-green-400" },
                    { label: "Rejected", value: applications.filter(a => a.status === "REJECTED").length, icon: XCircle, color: "text-red-400" },
                ].map((stat) => (
                    <Card key={stat.label} className="bg-card border-white/10">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <Card className="bg-card border-white/10">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by university, program or student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Applications List */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="bg-card border border-white/10 p-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">All Applications</TabsTrigger>
                    <TabsTrigger value="submitted" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">Submitted</TabsTrigger>
                    <TabsTrigger value="approved" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">Approved</TabsTrigger>
                </TabsList>

                {(["all", "submitted", "approved"] as const).map(tab => {
                    const tabApps = tab === "all"
                        ? filteredApplications
                        : filteredApplications.filter(a => a.status === tab.toUpperCase())

                    return (
                        <TabsContent key={tab} value={tab} className="space-y-4">
                            {tabApps.length === 0 ? (
                                <Card className="bg-card border-white/10">
                                    <CardContent className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                                        <FileText className="h-8 w-8 opacity-20" />
                                        <p>No applications found</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                tabApps.map((app) => (
                                    <Card key={app.id} className="bg-card border-white/10 hover:border-cyan-500/30 transition-colors group">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-white">{app.university || "University pending"}</h3>
                                                        <Badge className={cn("text-[10px] py-0 px-1.5", getStatusColor(app.status))}>
                                                            <span className="flex items-center gap-1">
                                                                {getStatusIcon(app.status)}
                                                                {app.status.replace(/_/g, ' ')}
                                                            </span>
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-1">{app.program || "Course information pending"}</p>
                                                    <p className="text-gray-500 text-xs">Student: {app.student?.user?.firstName} {app.student?.user?.lastName}</p>
                                                </div>
                                                <div className="md:text-right shrink-0">
                                                    <p className="text-xs text-gray-500 mb-1">Created on</p>
                                                    <p className="text-sm text-white font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-xs text-gray-500">Progress</span>
                                                    <span className="text-cyan-400 font-medium">{calculateProgress(app)}%</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                                                        style={{ width: `${calculateProgress(app)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm" asChild className="bg-white/5 hover:bg-white/10 text-white border-white/10 h-8" variant="outline">
                                                    <Link href={`/dashboard/applications/${app.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                                <Button size="sm" asChild variant="outline" className="border-white/10 text-gray-300 h-8">
                                                    <Link href={`/dashboard/applications/${app.id}?tab=tasks`}>
                                                        Manage Tasks
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    )
                })}
            </Tabs>

        </div>
    )
}
