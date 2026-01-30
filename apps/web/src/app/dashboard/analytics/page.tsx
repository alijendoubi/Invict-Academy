"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, Users, DollarSign, FileText, Calendar } from "lucide-react"

export default function AnalyticsPage() {
    // Mock data - replace with real API calls
    const revenueData = [
        { month: 'Jan', revenue: 12500, target: 15000 },
        { month: 'Feb', revenue: 15800, target: 15000 },
        { month: 'Mar', revenue: 18200, target: 18000 },
        { month: 'Apr', revenue: 21500, target: 20000 },
        { month: 'May', revenue: 24800, target: 22000 },
        { month: 'Jun', revenue: 28300, target: 25000 },
    ]

    const leadConversionData = [
        { stage: 'Leads', count: 248 },
        { stage: 'Contacted', count: 189 },
        { stage: 'Qualified', count: 142 },
        { stage: 'Converted', count: 89 },
    ]

    const applicationStatusData = [
        { name: 'Draft', value: 12, color: '#6B7280' },
        { name: 'Submitted', value: 45, color: '#3B82F6' },
        { name: 'In Review', value: 38, color: '#8B5CF6' },
        { name: 'Accepted', value: 78, color: '#10B981' },
        { name: 'Rejected', value: 21, color: '#EF4444' },
    ]

    const studentsByCountry = [
        { country: 'Italy', students: 89 },
        { country: 'France', students: 45 },
        { country: 'Germany', students: 38 },
        { country: 'Spain', students: 27 },
        { country: 'Netherlands', students: 18 },
    ]

    const monthlyStats = [
        { month: 'Jan', leads: 42, students: 12, applications: 28 },
        { month: 'Feb', leads: 38, students: 15, applications: 32 },
        { month: 'Mar', leads: 51, students: 18, applications: 41 },
        { month: 'Apr', leads: 45, students: 14, applications: 35 },
        { month: 'May', leads: 48, students: 16, applications: 38 },
        { month: 'Jun', leads: 52, students: 19, applications: 45 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-gray-400">Track performance and insights</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Last 6 months</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-[#0B1020] border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Revenue</p>
                                <p className="text-2xl font-bold text-white">€121,100</p>
                                <p className="text-xs text-green-400 mt-1">+18% from last period</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#0B1020] border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Conversion Rate</p>
                                <p className="text-2xl font-bold text-white">35.9%</p>
                                <p className="text-xs text-cyan-400 mt-1">+5.2% improvement</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-cyan-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#0B1020] border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Active Students</p>
                                <p className="text-2xl font-bold text-white">217</p>
                                <p className="text-xs text-purple-400 mt-1">+12 this month</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#0B1020] border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Applications</p>
                                <p className="text-2xl font-bold text-white">194</p>
                                <p className="text-xs text-blue-400 mt-1">78 accepted</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="revenue" className="space-y-4">
                <TabsList className="bg-[#0B1020] border border-white/10">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="conversion">Conversion</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="month" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        labelStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#06B6D4" strokeWidth={3} name="Revenue (€)" />
                                    <Line type="monotone" dataKey="target" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" name="Target (€)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="conversion" className="space-y-4">
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Lead Conversion Funnel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={leadConversionData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis type="number" stroke="#9CA3AF" />
                                    <YAxis dataKey="stage" type="category" stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        labelStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Bar dataKey="count" fill="#06B6D4" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Application Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={applicationStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {applicationStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0B1020] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Students by Country</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={studentsByCountry}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="country" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        />
                                        <Bar dataKey="students" fill="#10B981" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="overview" className="space-y-4">
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Monthly Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="month" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} name="Leads" />
                                    <Line type="monotone" dataKey="students" stroke="#10B981" strokeWidth={2} name="Students" />
                                    <Line type="monotone" dataKey="applications" stroke="#8B5CF6" strokeWidth={2} name="Applications" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
