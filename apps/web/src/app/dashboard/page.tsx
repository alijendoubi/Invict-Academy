"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users, UserCircle, GraduationCap, TrendingUp,
    DollarSign, FileText, Loader2, Shield, CheckCircle2
} from "lucide-react"
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
                console.error("Failed to fetch stats, using demo data", err)
                // Demo fallback data
                const demoData = {
                    role: 'ADMIN',
                    stats: [
                        { name: "Total Leads", value: "1,248", change: "+12.5%", status: "up" },
                        { name: "Active Students", value: "842", change: "+8.2%", status: "up" },
                        { name: "Applications", value: "156", change: "+14.1%", status: "up" },
                        { name: "Revenue (MTD)", value: "€42,500", change: "+18.4%", status: "up" },
                    ]
                }
                setData(demoData)
                const mockStats = demoData.stats.map((s: any) => ({
                    ...s,
                    icon: iconMap[s.name] || UserCircle,
                    color: colorMap[s.name] || "text-gray-400"
                }))
                setStats(mockStats)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const recentActivity = [
        { type: "New Lead", name: "Sarah Johnson", time: "5 min ago", status: "NEW" },
        { type: "Application Submitted", name: "Ahmed Khan", time: "1 hour ago", status: "SUBMITTED" },
        { type: "Visa Approved", name: "Maria Garcia", time: "2 hours ago", status: "APPROVED" },
        { type: "Payment Received", name: "John Doe", time: "3 hours ago", status: "PAID" },
    ]

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
                    <Card key={stat.name} className="bg-[#0B1020] border-white/10">
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
                <Card className="bg-[#0B1020] border-white/10 overflow-hidden">
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
                                                "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors bg-[#0B1020]",
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
                <Card className="bg-[#0B1020] border-white/10">
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
                                    <Button size="sm" variant="outline" className="text-xs border-white/10">Upload</Button>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">2</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">Academic Transcript</p>
                                        <p className="text-xs text-gray-400">Original and translated copies</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="text-xs border-white/10">Upload</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{activity.type}</p>
                                            <p className="text-xs text-gray-400">{activity.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                activity.status === "NEW" && "bg-blue-500/10 text-blue-400",
                                                activity.status === "SUBMITTED" && "bg-purple-500/10 text-purple-400",
                                                activity.status === "APPROVED" && "bg-green-500/10 text-green-400",
                                                activity.status === "PAID" && "bg-cyan-500/10 text-cyan-400"
                                            )}>
                                                {activity.status}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-[#0B1020] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data?.role === 'STUDENT' ? (
                            <>
                                <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                                    <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">My Documents</p>
                                        <p className="text-xs text-gray-400">Manage your uploads</p>
                                    </div>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <GraduationCap className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">University List</p>
                                        <p className="text-xs text-gray-400">Explore partner institutions</p>
                                    </div>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <DollarSign className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Payments</p>
                                        <p className="text-xs text-gray-400">Pay tuition or services</p>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                                    <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <UserCircle className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Add New Lead</p>
                                        <p className="text-xs text-gray-400">Create a new lead entry</p>
                                    </div>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">New Application</p>
                                        <p className="text-xs text-gray-400">Start an application process</p>
                                    </div>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <DollarSign className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Record Payment</p>
                                        <p className="text-xs text-gray-400">Log a new payment</p>
                                    </div>
                                </button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

