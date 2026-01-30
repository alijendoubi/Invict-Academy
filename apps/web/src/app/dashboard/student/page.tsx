"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    FileText, CheckCircle, Clock, AlertCircle,
    Calendar, MapPin, GraduationCap, DollarSign,
    Upload, MessageSquare
} from "lucide-react"

export default function StudentDashboardPage() {
    const studentData = {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        targetCountry: "France",
        targetProgram: "Master in Economics",
        intake: "September 2025",
        advisor: "John Smith"
    }

    const applicationProgress = {
        total: 6,
        completed: 4,
        percentage: 67
    }

    const tasks = [
        { id: 1, title: "Submit passport copy", status: "COMPLETED", dueDate: "2025-01-15" },
        { id: 2, title: "Upload academic transcripts", status: "COMPLETED", dueDate: "2025-01-20" },
        { id: 3, title: "Complete motivation letter", status: "IN_PROGRESS", dueDate: "2025-02-01" },
        { id: 4, title: "Submit language test scores", status: "PENDING", dueDate: "2025-02-10" },
    ]

    const applications = [
        { university: "Sorbonne University", status: "SUBMITTED", progress: 75 },
        { university: "Sciences Po", status: "IN_REVIEW", progress: 50 },
        { university: "HEC Paris", status: "DRAFT", progress: 30 },
    ]

    return (
        <div className="min-h-screen bg-[#070A12]">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-white/10 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {studentData.name}!</h1>
                    <p className="text-gray-400">Track your application progress and upcoming tasks</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Applications</p>
                                    <p className="text-2xl font-bold text-white">3</p>
                                </div>
                                <FileText className="h-8 w-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Tasks Pending</p>
                                    <p className="text-2xl font-bold text-white">2</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Documents</p>
                                    <p className="text-2xl font-bold text-white">12</p>
                                </div>
                                <Upload className="h-8 w-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Messages</p>
                                    <p className="text-2xl font-bold text-white">5</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overall Progress */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Application Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400">Overall Completion</span>
                                            <span className="text-cyan-400 font-semibold">{applicationProgress.percentage}%</span>
                                        </div>
                                        <Progress value={applicationProgress.percentage} className="h-3" />
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {applicationProgress.completed} of {applicationProgress.total} steps completed
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* My Applications */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">My Applications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {applications.map((app, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-white">{app.university}</h3>
                                            <Badge className={
                                                app.status === "SUBMITTED" ? "bg-blue-500/10 text-blue-400" :
                                                    app.status === "IN_REVIEW" ? "bg-purple-500/10 text-purple-400" :
                                                        "bg-gray-500/10 text-gray-400"
                                            }>
                                                {app.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Progress</span>
                                                <span className="text-cyan-400">{app.progress}%</span>
                                            </div>
                                            <Progress value={app.progress} className="h-2" />
                                        </div>
                                        <Button size="sm" className="w-full mt-3 bg-white/5 hover:bg-white/10" variant="outline">
                                            View Application
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Tasks */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Upcoming Tasks</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                        <div className="flex items-center gap-3">
                                            {task.status === "COMPLETED" ? (
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            ) : task.status === "IN_PROGRESS" ? (
                                                <Clock className="h-5 w-5 text-yellow-400" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-gray-400" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-white">{task.title}</p>
                                                <p className="text-xs text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {task.status !== "COMPLETED" && (
                                            <Button size="sm" variant="outline" className="border-white/10 text-gray-300">
                                                Start
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Summary */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">My Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                        SJ
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{studentData.name}</p>
                                        <p className="text-sm text-gray-400">{studentData.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-sm">
                                        <GraduationCap className="h-4 w-4 text-cyan-400" />
                                        <span className="text-gray-400">{studentData.targetProgram}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-cyan-400" />
                                        <span className="text-gray-400">{studentData.targetCountry}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-cyan-400" />
                                        <span className="text-gray-400">{studentData.intake}</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 mt-4">
                                    Edit Profile
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Advisor */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Your Advisor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-semibold">
                                        JS
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{studentData.advisor}</p>
                                        <p className="text-xs text-gray-400">Senior Advisor</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-white/5 hover:bg-white/10" variant="outline">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full justify-start bg-white/5 hover:bg-white/10" variant="outline">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Document
                                </Button>
                                <Button className="w-full justify-start bg-white/5 hover:bg-white/10" variant="outline">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Book Consultation
                                </Button>
                                <Button className="w-full justify-start bg-white/5 hover:bg-white/10" variant="outline">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    View Payments
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
