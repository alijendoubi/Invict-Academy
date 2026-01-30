"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search, Plus, GraduationCap, MapPin,
    Calendar, Loader2, Filter
} from "lucide-react"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const fetchStudents = useCallback(async (search = searchTerm) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== "all") params.append("status", statusFilter)
            if (search) params.append("search", search)

            const res = await fetch(`/api/students?${params.toString()}`)
            const data = await res.json()
            setStudents(data)
        } catch (error) {
            console.error("Error fetching students, using demo data:", error)
            // Demo fallback data
            setStudents([
                {
                    id: '1',
                    status: 'ACTIVE',
                    user: { firstName: 'Marco', lastName: 'Rossi', email: 'marco@example.com' },
                    applications: [{}, {}]
                },
                {
                    id: '2',
                    status: 'VISA_IN_PROGRESS',
                    user: { firstName: 'Chen', lastName: 'Wei', email: 'chen@example.com' },
                    applications: [{}]
                },
                {
                    id: '3',
                    status: 'APPLYING',
                    user: { firstName: 'Sarah', lastName: 'Smith', email: 'sarah@example.com' },
                    applications: [{}]
                }
            ])
        } finally {
            setLoading(false)
        }
    }, [statusFilter, searchTerm])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

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
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                </Button>
            </div>

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
                                <Button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white border-white/10" variant="outline">
                                    View Profile
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

