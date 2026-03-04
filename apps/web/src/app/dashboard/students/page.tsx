"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search, Plus, GraduationCap, MapPin,
    Calendar, Loader2, Filter, Trash2,
    Copy, Check, MessageCircle, KeyRound,
    UserCircle2, FileText
} from "lucide-react"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface CredentialData {
    email: string
    password: string
    firstName: string
    lastName: string
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }
    return (
        <button
            onClick={copy}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-all text-xs font-medium shrink-0"
        >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
        </button>
    )
}

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [submitting, setSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [credentialData, setCredentialData] = useState<CredentialData | null>(null)
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
    const [profileDialogOpen, setProfileDialogOpen] = useState(false)
    const [studentProfile, setStudentProfile] = useState<any>(null)
    const [loadingProfile, setLoadingProfile] = useState(false)

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialSearch = searchParams?.get('search') || "";
    const initialTab = searchParams?.get('tab') || "overview";

    const fetchStudentProfile = async (id: string) => {
        setLoadingProfile(true)
        setSelectedStudentId(id)
        try {
            const res = await fetch(`/api/students/${id}`)
            if (res.ok) {
                setStudentProfile(await res.json())
                setProfileDialogOpen(true)
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error)
        } finally {
            setLoadingProfile(false)
        }
    }

    const fetchStudents = useCallback(async (searchValue = searchTerm) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== "all") params.append("status", statusFilter)
            if (searchValue) params.append("search", searchValue)

            const res = await fetch(`/api/students?${params.toString()}`)
            const data = await res.json()
            let fetchedStudents = []
            if (Array.isArray(data)) {
                fetchedStudents = data
            } else if (Array.isArray(data?.data)) {
                fetchedStudents = data.data
            } else {
                throw new Error("API did not return an array")
            }
            setStudents(fetchedStudents)
            return fetchedStudents
        } catch (error) {
            console.error("Error fetching students:", error)
            setStudents([])
            return []
        } finally {
            setLoading(false)
        }
    }, [statusFilter, searchTerm])

    useEffect(() => {
        const loadInitial = async () => {
            const initialStudents = await fetchStudents(initialSearch)
            if (initialSearch && initialStudents && initialStudents.length === 1) {
                fetchStudentProfile(initialStudents[0].id)
            }
        }
        loadInitial()

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user/profile")
                if (res.ok) setUser(await res.json())
            } catch (error) {
                console.error("Failed to fetch user:", error)
            }
        }
        fetchUser()
    }, [fetchStudents, initialSearch])

    const handleDeleteStudent = async () => {
        if (!studentToDelete) return;
        setDeleting(true)
        try {
            const res = await fetch(`/api/students/${studentToDelete}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to delete student")

            setStudentToDelete(null)
            fetchStudents()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setDeleting(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchStudents()
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
            APPLYING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            VISA_IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            ARRIVED: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        }
        return colors[status] || "bg-gray-500/10 text-gray-400"
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
                    <p className="text-gray-400">Manage enrolled students and their progress</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0B1020] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New Student</DialogTitle>
                            <DialogDescription>
                                Create a new student profile and view their temporary password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setSubmitting(true);

                            const formData = new FormData(e.currentTarget as HTMLFormElement);
                            const payload = {
                                firstName: formData.get("firstName"),
                                lastName: formData.get("lastName"),
                                email: formData.get("email"),
                                degreeLevel: formData.get("degree"),
                                universityInterest: formData.get("university"),
                            };

                            try {
                                const res = await fetch("/api/students", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(payload)
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || "Failed to create student");

                                // Show credential dialog instead of alert
                                setCredentialData({
                                    email: data.user.email,
                                    password: data.temporaryPassword,
                                    firstName: data.user.firstName,
                                    lastName: data.user.lastName,
                                });

                                fetchStudents();
                                setDialogOpen(false);
                            } catch (err: any) {
                                alert(err.message);
                            } finally {
                                setSubmitting(false);
                            }
                        }} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">First Name</Label>
                                    <Input name="firstName" required placeholder="Jane" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Last Name</Label>
                                    <Input name="lastName" required placeholder="Doe" className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Email Address</Label>
                                <Input name="email" type="email" required placeholder="jane@example.com" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Degree Level</Label>
                                    <Select name="degree">
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                            <SelectItem value="Bachelor's">Bachelor&apos;s</SelectItem>
                                            <SelectItem value="Master's">Master&apos;s</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Target University</Label>
                                    <Input name="university" placeholder="e.g. Polimi" className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </div>
                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" className="border-white/10 text-gray-300">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={submitting} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Add Student
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* ─── Credentials Dialog ────────────────────────────── */}
            <Dialog open={!!credentialData} onOpenChange={(open) => !open && setCredentialData(null)}>
                <DialogContent className="bg-[#0B1020] border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                <UserCircle2 size={20} className="text-cyan-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-white">Student Account Created</DialogTitle>
                                <DialogDescription className="text-gray-400 text-sm">
                                    Share these login credentials with {credentialData?.firstName}.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        {/* Email Row */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Email Address</p>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-white font-mono text-sm truncate">{credentialData?.email}</p>
                                <CopyButton value={credentialData?.email ?? ""} />
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                            <div className="flex items-center gap-1.5 mb-2">
                                <KeyRound size={11} className="text-amber-400" />
                                <p className="text-amber-400 text-xs uppercase tracking-widest">Temporary Password</p>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-white font-mono text-lg font-bold tracking-wider">{credentialData?.password}</p>
                                <CopyButton value={credentialData?.password ?? ""} />
                            </div>
                            <p className="text-amber-400/60 text-xs mt-2">Student will be prompted to change this on first login.</p>
                        </div>

                        {/* WhatsApp Share Button */}
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Hi ${credentialData?.firstName}, your Invict Academy account is ready!%0A%0AEmail: ${credentialData?.email}%0APassword: ${credentialData?.password}%0A%0APlease log in at invictacademy.com and change your password.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors text-sm"
                        >
                            <MessageCircle size={16} />
                            Send via WhatsApp
                        </a>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={() => setCredentialData(null)}
                            variant="outline"
                            className="w-full border-white/10 text-gray-300 hover:text-white"
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Student Profile Dialog */}
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                <DialogContent className="bg-[#0B1020] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    {studentProfile ? (
                        <div className="space-y-0">
                            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-white/5 ring-1 ring-cyan-500/10 shadow-lg">
                                        <span className="text-2xl font-bold text-white">
                                            {studentProfile.user.firstName[0]}{studentProfile.user.lastName[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <DialogTitle className="text-2xl font-black text-white">
                                            {studentProfile.user.firstName} {studentProfile.user.lastName}
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            {studentProfile.user.email} • Joined {new Date(studentProfile.createdAt).toLocaleDateString()}
                                        </DialogDescription>
                                    </div>
                                    <div className="ml-auto">
                                        <Badge className={cn("text-[10px] py-0.5 px-2", getStatusColor(studentProfile.status))}>
                                            {studentProfile.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="bg-white/5 border-white/10">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">Personal Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pt-2">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-500 uppercase">Degree Level</p>
                                                <p className="text-white font-medium text-sm">{studentProfile.degreeLevel || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-500 uppercase">University Interest</p>
                                                <p className="text-white font-medium text-sm">{studentProfile.universityInterest || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-500 uppercase">Nationality</p>
                                                <p className="text-white font-medium text-sm">{studentProfile.nationality || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-500 uppercase">Phone</p>
                                                <p className="text-white font-medium text-sm">{studentProfile.phone || "N/A"}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/5 border-white/10 md:col-span-2">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Applications</CardTitle>
                                            <Badge variant="outline" className="text-cyan-400 border-cyan-500/20">{studentProfile.applications?.length || 0}</Badge>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <div className="space-y-3">
                                                {studentProfile.applications?.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic py-4">No applications started</p>
                                                ) : (
                                                    studentProfile.applications.map((app: any) => (
                                                        <Link key={app.id} href={`/dashboard/applications/${app.id}`} className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-white font-semibold text-sm">{app.university || "University Pending"}</p>
                                                                    <p className="text-gray-500 text-[10px]">{app.program || "Course Pending"}</p>
                                                                </div>
                                                                <Badge className="text-[9px] bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                                                                    {app.status.replace(/_/g, ' ')}
                                                                </Badge>
                                                            </div>
                                                        </Link>
                                                    ))
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white/5 border-white/10 md:col-span-3">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">Document Locker</CardTitle>
                                            <Badge variant="outline" className="text-blue-400 border-blue-500/20">{studentProfile.documents?.length || 0}</Badge>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {studentProfile.documents?.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic py-4">No documents uploaded</p>
                                                ) : (
                                                    studentProfile.documents.map((doc: any) => (
                                                        <div key={doc.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                                                <FileText size={18} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-white font-medium text-[11px] truncate">{doc.filename}</p>
                                                                <p className="text-gray-500 text-[9px]">{doc.type}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <DialogClose asChild>
                                        <Button variant="outline" className="border-white/10 text-gray-300">Close</Button>
                                    </DialogClose>
                                    <Button asChild className="bg-cyan-600 hover:bg-cyan-500">
                                        <Link href={`/dashboard/admin/students?studentId=${studentProfile.id}`}>
                                            <MessageCircle size={16} className="mr-2" />
                                            Message Student (WhatsApp)
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                            <p className="text-gray-500 font-medium">Loading student profile...</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
                <DialogContent className="bg-[#0B1020] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-500">Delete Student Account</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you absolutely sure you want to delete this student? This action cannot be undone. It will permanently delete the student profile, user account, and all associated applications, documents, tasks, and history.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" className="border-white/10 text-gray-300">Cancel</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            disabled={deleting}
                            onClick={handleDeleteStudent}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete Student
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Total Students", value: students.length, color: "text-cyan-400" },
                    { label: "Active", value: students.filter(s => s.status === "ACTIVE").length, color: "text-green-400" },
                    { label: "Applying", value: students.filter(s => s.status === "APPLYING").length, color: "text-blue-400" },
                    { label: "Departed/Arrived", value: students.filter(s => ["DEPARTED", "ARRIVED"].includes(s.status)).length, color: "text-purple-400" },
                ].map((stat) => (
                    <Card key={stat.label} className="bg-[#0B1020] border-white/10">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="bg-[#0B1020] border-white/10">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 text-white"
                            />
                        </form>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="APPLYING">Applying</SelectItem>
                                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                    <SelectItem value="VISA_IN_PROGRESS">Visa</SelectItem>
                                    <SelectItem value="ARRIVED">Arrived</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="border-white/10 text-gray-300" onClick={() => fetchStudents()}>
                                <Filter className="h-4 w-4 mr-2" />
                                Apply
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Students Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
            ) : students.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p>No students found</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                        <Card key={student.id} className="bg-[#0B1020] border-white/10 hover:border-cyan-500/30 transition-colors group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                        {student.user.firstName[0]}{student.user.lastName[0]}
                                    </div>
                                    <Badge className={cn("text-[10px] py-0 px-1.5", getStatusColor(student.status))}>
                                        {student.status.replace(/_/g, ' ')}
                                    </Badge>
                                </div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                    {student.user.firstName} {student.user.lastName}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 truncate">{student.user.email}</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>{student.degreeLevel || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin className="h-4 w-4" />
                                        <span>{student.universityInterest || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white border-white/10"
                                    variant="outline"
                                    onClick={() => fetchStudentProfile(student.id)}
                                    disabled={loadingProfile}
                                >
                                    {loadingProfile && selectedStudentId === student.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "View Profile"}
                                </Button>
                                {user?.role === 'SUPER_ADMIN' && (
                                    <Button
                                        onClick={() => setStudentToDelete(student.id)}
                                        className="w-full mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20"
                                        variant="outline"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Student
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

