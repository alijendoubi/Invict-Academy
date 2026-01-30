"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search, Filter, Plus, Mail, Phone, Calendar,
    MoreHorizontal, Loader2, X
} from "lucide-react"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchLeads()
    }, [statusFilter]) // Refetch on filter change

    const fetchLeads = async (search = searchTerm) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== "all") params.append("status", statusFilter)
            if (search) params.append("search", search)

            const res = await fetch(`/api/leads?${params.toString()}`)
            const data = await res.json()
            setLeads(data)
        } catch (error) {
            console.error("Failed to fetch leads, using demo data:", error)
            // Demo fallback data
            setLeads([
                {
                    id: 'l1',
                    firstName: 'Sarah',
                    lastName: 'Johnson',
                    email: 'sarah.j@example.com',
                    phone: '+1 234 567 890',
                    status: 'NEW',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'l2',
                    firstName: 'Ahmed',
                    lastName: 'Khan',
                    email: 'ahmed.k@example.com',
                    phone: '+971 50 123 4567',
                    status: 'QUALIFIED',
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 'l3',
                    firstName: 'Elena',
                    lastName: 'Petrova',
                    email: 'elena.p@example.com',
                    phone: '+7 900 123 4567',
                    status: 'WON',
                    createdAt: new Date(Date.now() - 172800000).toISOString()
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchLeads()
    }

    const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setIsAddDialogOpen(false)
                fetchLeads()
            }
        } catch (error) {
            console.error("Failed to add lead:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            NEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            CONTACTED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            QUALIFIED: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            WON: "bg-green-500/10 text-green-400 border-green-500/20",
            LOST: "bg-red-500/10 text-red-400 border-red-500/20",
        }
        return colors[status] || "bg-gray-500/10 text-gray-400"
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
                    <p className="text-gray-400">Manage and track potential students</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lead
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0B1020] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New Lead</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Enter the information for the new prospective student.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddLead} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required className="bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required className="bg-white/5 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone (Optional)</Label>
                                <Input id="phone" name="phone" className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source">Source</Label>
                                <Select name="source" defaultValue="Website">
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                        <SelectItem value="Website">Website</SelectItem>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="Referral">Referral</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={submitting} className="w-full bg-cyan-600 hover:bg-cyan-700">
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Lead"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Total Leads", value: leads.length, color: "text-blue-400" },
                    { label: "New", value: leads.filter(l => l.status === "NEW").length, color: "text-purple-400" },
                    { label: "Qualified", value: leads.filter(l => l.status === "QUALIFIED").length, color: "text-cyan-400" },
                    { label: "Lost", value: leads.filter(l => l.status === "LOST").length, color: "text-red-400" },
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
                                placeholder="Search leads..."
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
                                    <SelectItem value="NEW">New</SelectItem>
                                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                                    <SelectItem value="QUALIFIED">Qualified</SelectItem>
                                    <SelectItem value="WON">Won</SelectItem>
                                    <SelectItem value="LOST">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="border-white/10 text-gray-300" onClick={() => fetchLeads()}>
                                <Filter className="h-4 w-4 mr-2" />
                                Apply
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="bg-[#0B1020] border-white/10 overflow-hidden">
                <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-white">Recent Leads ({leads.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-20" />
                            <p>No leads found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {leads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {lead.firstName?.[0]}{lead.lastName?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white truncate">
                                                    {lead.firstName} {lead.lastName}
                                                </p>
                                                <Badge className={cn("text-[10px] py-0 px-1.5", getStatusColor(lead.status))}>
                                                    {lead.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 truncate">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {lead.email}
                                                </span>
                                                {lead.phone && (
                                                    <span className="flex items-center gap-1 border-l border-white/10 pl-3">
                                                        <Phone className="h-3 w-3" />
                                                        {lead.phone}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 border-l border-white/10 pl-3">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

