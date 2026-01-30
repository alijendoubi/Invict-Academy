"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch("/api/applications")
                const data = await res.json()
                setApplications(data)
            } catch (error) {
                console.error("Failed to fetch applications, using demo data:", error)
                // Demo fallback data
                setApplications([
                    {
                        id: 'a1',
                        university: 'Politecnico di Milano',
                        program: 'MSc in Computer Science',
                        status: 'SUBMITTED',
                        createdAt: new Date().toISOString(),
                        student: { user: { firstName: 'Marco', lastName: 'Rossi' } }
                    },
                    {
                        id: 'a2',
                        university: 'University of Bologna',
                        program: 'MA in International Relations',
                        status: 'APPROVED',
                        createdAt: new Date(Date.now() - 604800000).toISOString(),
                        student: { user: { firstName: 'Sarah', lastName: 'Smith' } }
                    },
                    {
                        id: 'a3',
                        university: 'Sapienza University of Rome',
                        program: 'BSc in Architecture',
                        status: 'DOCUMENTS_PENDING',
                        createdAt: new Date(Date.now() - 259200000).toISOString(),
                        student: { user: { firstName: 'Ahmed', lastName: 'Khan' } }
                    }
                ])
            } finally {
                setLoading(false)
            }
        }
        fetchApplications()
    }, [])

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
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                    New Application
                </Button>
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
                    <Card key={stat.label} className="bg-[#0B1020] border-white/10">
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
            <Card className="bg-[#0B1020] border-white/10">
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
                <TabsList className="bg-[#0B1020] border border-white/10 p-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">All Applications</TabsTrigger>
                    <TabsTrigger value="submitted" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">Submitted</TabsTrigger>
                    <TabsTrigger value="approved" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">Approved</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {filteredApplications.length === 0 ? (
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardContent className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                                <FileText className="h-8 w-8 opacity-20" />
                                <p>No applications found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredApplications.map((app) => (
                            <Card key={app.id} className="bg-[#0B1020] border-white/10 hover:border-cyan-500/30 transition-colors group">
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
                                        <Button size="sm" className="bg-white/5 hover:bg-white/10 text-white border-white/10 h-8" variant="outline">
                                            View Details
                                        </Button>
                                        <Button size="sm" variant="outline" className="border-white/10 text-gray-300 h-8">
                                            Manage Tasks
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="submitted">
                    <div className="space-y-4">
                        {filteredApplications.filter(a => a.status === "SUBMITTED").length === 0 ? (
                            <Card className="bg-[#0B1020] border-white/10">
                                <CardContent className="p-12 text-center text-gray-400">
                                    No submitted applications found
                                </CardContent>
                            </Card>
                        ) : (
                            filteredApplications.filter(a => a.status === "SUBMITTED").map(app => (
                                <div key={app.id} className="text-gray-300 p-4 bg-white/5 rounded border border-white/10">
                                    {app.university} - {app.program}
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="approved">
                    <div className="space-y-4">
                        {filteredApplications.filter(a => a.status === "APPROVED").length === 0 ? (
                            <Card className="bg-[#0B1020] border-white/10">
                                <CardContent className="p-12 text-center text-gray-400">
                                    No approved applications found
                                </CardContent>
                            </Card>
                        ) : (
                            filteredApplications.filter(a => a.status === "APPROVED").map(app => (
                                <div key={app.id} className="text-gray-300 p-4 bg-white/5 rounded border border-white/10">
                                    {app.university} - {app.program}
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    )
}

