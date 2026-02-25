"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Users, UserPlus, Search, Mail, Phone, Shield,
    MoreHorizontal, Loader2, CheckCircle2, XCircle
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DEMO_USERS = [
    { id: "u1", firstName: "Ali", lastName: "Jendoubi", email: "ali@invictacademy.com", role: "SUPER_ADMIN", createdAt: "2024-09-01T00:00:00Z", active: true },
    { id: "u2", firstName: "Fatima", lastName: "Benali", email: "fatima@invictacademy.com", role: "ADMIN", createdAt: "2024-10-01T00:00:00Z", active: true },
    { id: "u3", firstName: "Youssef", lastName: "Tounsi", email: "youssef@invictacademy.com", role: "ASSOCIATE", createdAt: "2024-11-01T00:00:00Z", active: true },
    { id: "u4", firstName: "Demo", lastName: "Student", email: "student@invict.academy", role: "STUDENT", createdAt: "2025-01-01T00:00:00Z", active: true },
]

const ROLE_COLORS: Record<string, string> = {
    SUPER_ADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
    ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    ASSOCIATE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    STUDENT: "bg-green-500/10 text-green-400 border-green-500/20",
}

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/users")
                const data = await res.json()
                if (Array.isArray(data)) setUsers(data)
                else if (Array.isArray(data?.data)) setUsers(data.data)
                else throw new Error("not array")
            } catch {
                setUsers(DEMO_USERS)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const filtered = users.filter(u =>
        !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">Users</h1>
                    <p className="text-gray-400">Manage staff, admins, and platform accounts</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 rounded-xl gap-2">
                            <UserPlus size={16} /> Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0B1020] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Invite New User</DialogTitle>
                            <DialogDescription>
                                Send an invitation to a new staff member or partner.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setSubmitting(true);
                            setTimeout(() => {
                                setUsers([{
                                    id: Math.random().toString(),
                                    firstName: (e.target as any).firstName.value,
                                    lastName: (e.target as any).lastName.value,
                                    email: (e.target as any).email.value,
                                    role: (e.target as any).role.value,
                                    createdAt: new Date().toISOString(),
                                    active: true
                                }, ...users]);
                                setSubmitting(false);
                                setDialogOpen(false);
                            }, 1000);
                        }} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">First Name</Label>
                                    <Input name="firstName" required placeholder="John" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Last Name</Label>
                                    <Input name="lastName" required placeholder="Doe" className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Email Address</Label>
                                <Input name="email" type="email" required placeholder="john@invictacademy.com" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Role</Label>
                                <Select name="role" required>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Select role..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="ASSOCIATE">Associate</SelectItem>
                                        <SelectItem value="STUDENT">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" className="border-white/10 text-gray-300">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={submitting} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Send Invitation
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Total Users", value: users.length, color: "text-white" },
                    { label: "Admins", value: users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length, color: "text-purple-400" },
                    { label: "Associates", value: users.filter(u => u.role === "ASSOCIATE").length, color: "text-blue-400" },
                    { label: "Students", value: users.filter(u => u.role === "STUDENT").length, color: "text-green-400" },
                ].map(s => (
                    <Card key={s.label} className="bg-[#0B1020] border-white/10">
                        <CardContent className="p-4">
                            <p className="text-gray-400 text-sm">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="pl-9 bg-white/5 border-white/10 text-white rounded-xl"
                />
            </div>

            <Card className="bg-[#0B1020] border-white/10 overflow-hidden">
                <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-white text-base">All Users ({filtered.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filtered.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center text-white font-semibold text-sm">
                                            {u.firstName?.[0]}{u.lastName?.[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-white font-medium text-sm">{u.firstName} {u.lastName}</p>
                                                <Badge className={`${ROLE_COLORS[u.role] || "bg-gray-500/10 text-gray-400"} border text-[10px] px-1.5 py-0`}>{u.role}</Badge>
                                            </div>
                                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                                <Mail size={10} />{u.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-700 text-xs hidden md:block">
                                            Joined {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                        {u.active
                                            ? <CheckCircle2 size={14} className="text-green-400" />
                                            : <XCircle size={14} className="text-red-400" />
                                        }
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-600 hover:text-white opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal size={14} />
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
