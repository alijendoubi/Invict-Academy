"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Loader2, Mail, CheckCircle2, TrendingUp, Users, Coins, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CredentialsDialog } from "@/components/CredentialsDialog"

const DEMO_ASSOCIATES = [
    { id: "a1", name: "Karim Mansouri", email: "karim@gmail.com", country: "Tunisia 🇹🇳", referrals: 12, converted: 8, commission: 1600, status: "ACTIVE", joinedAt: "2024-09-01" },
    { id: "a2", name: "Nour Haddad", email: "nour.h@gmail.com", country: "Morocco 🇲🇦", referrals: 7, converted: 4, commission: 800, status: "ACTIVE", joinedAt: "2024-11-01" },
    { id: "a3", name: "Yasmine Dridi", email: "yasmine.d@gmail.com", country: "Algeria 🇩🇿", referrals: 5, converted: 2, commission: 400, status: "PENDING", joinedAt: "2025-01-15" },
]

export default function AssociatesPage() {
    const [associates, setAssociates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [addError, setAddError] = useState("")
    const [newCredentials, setNewCredentials] = useState<{ email: string, password: string, name: string } | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/associates")
                const data = await res.json()
                if (Array.isArray(data)) setAssociates(data)
                else throw new Error("not array")
            } catch {
                setAssociates(DEMO_ASSOCIATES)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const filtered = associates.filter(a =>
        !search || `${a.name} ${a.email} ${a.country} `.toLowerCase().includes(search.toLowerCase())
    )

    const totalReferrals = associates.reduce((s, a) => s + (a.referrals || 0), 0)
    const totalConverted = associates.reduce((s, a) => s + (a.converted || 0), 0)
    const totalCommission = associates.reduce((s, a) => s + (a.commission || 0), 0)

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">Associates</h1>
                    <p className="text-gray-400">Partner and referral commission management</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 rounded-xl gap-2">
                            <UserPlus size={16} /> Add Associate
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New Associate</DialogTitle>
                            <DialogDescription>
                                Register a new partner/affiliate to the network.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setSubmitting(true);
                            setAddError("");

                            const formData = new FormData(e.currentTarget);
                            const data = Object.fromEntries(formData.entries());

                            try {
                                const res = await fetch("/api/associates", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(data),
                                });

                                const json = await res.json();

                                if (!res.ok) {
                                    setAddError(json.error || "Failed to add associate");
                                    return;
                                }

                                // Fetch updated list
                                const refreshRes = await fetch("/api/associates");
                                if (refreshRes.ok) {
                                    setAssociates(await refreshRes.json());
                                }

                                setDialogOpen(false);
                                setNewCredentials({
                                    email: data.email as string,
                                    password: json.tempPassword,
                                    name: data.name as string
                                });
                            } catch (err) {
                                setAddError("Network Error: Could not add associate");
                            } finally {
                                setSubmitting(false);
                            }
                        }} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Full Name</Label>
                                <Input name="name" required placeholder="e.g. Karim Mansouri" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Email Address</Label>
                                <Input name="email" type="email" required placeholder="karim@example.com" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Country Location</Label>
                                <Input name="country" required placeholder="e.g. Tunisia" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            {addError && (
                                <p className="text-red-400 text-sm mt-2 font-medium">{addError}</p>
                            )}
                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" className="border-white/10 text-gray-300">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={submitting} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Register Associate
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Total Associates", value: associates.length, color: "text-white", icon: Users },
                    { label: "Total Referrals", value: totalReferrals, color: "text-blue-400", icon: TrendingUp },
                    { label: "Converted", value: totalConverted, color: "text-green-400", icon: CheckCircle2 },
                    { label: "Commissions Earned", value: `€${totalCommission.toLocaleString()} `, color: "text-yellow-400", icon: Coins },
                ].map(s => (
                    <Card key={s.label} className="bg-card border-white/10">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 text-sm">{s.label}</p>
                                <s.icon size={14} className={s.color} />
                            </div>
                            <p className={`text - 2xl font - black ${s.color} `}>{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search associates..."
                    className="pl-9 bg-white/5 border-white/10 text-white rounded-xl" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
                    </div>
                ) : filtered.map(a => (
                    <Card key={a.id} className="bg-card border-white/10 hover:border-white/20 transition-all">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-600/30 flex items-center justify-center text-white font-bold">
                                    {a.name?.charAt(0)}
                                </div>
                                <Badge className={`text - [10px] px - 1.5 py - 0 border ${a.status === "ACTIVE" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"} `}>
                                    {a.status}
                                </Badge>
                            </div>
                            <h3 className="text-white font-semibold text-sm mb-0.5">{a.name}</h3>
                            <p className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Mail size={10} />{a.email}</p>
                            <p className="text-gray-600 text-xs mb-4">{a.country} · Joined {new Date(a.joinedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
                            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                {[
                                    { label: "Referrals", value: a.referrals },
                                    { label: "Converted", value: a.converted },
                                    { label: "Commission", value: `€${a.commission} ` },
                                ].map(stat => (
                                    <div key={stat.label} className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                                        <p className="text-white font-bold text-sm">{stat.value}</p>
                                        <p className="text-gray-600 text-[10px]">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <Button size="sm" variant="outline" className="w-full border-white/10 text-gray-300 hover:text-white rounded-xl gap-1.5 text-xs">
                                <ExternalLink size={11} /> View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <CredentialsDialog
                isOpen={!!newCredentials}
                onOpenChange={(op) => { if (!op) setNewCredentials(null) }}
                credentials={newCredentials!}
                title="Associate Account Created"
                description={`A temporary password has been generated for ${newCredentials?.name}.`}
            />
        </div>
    )
}
