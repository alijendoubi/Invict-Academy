"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, Shield, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

function NotifToggle({ icon, label, desc, defaultOn }: { icon: string; label: string; desc: string; defaultOn: boolean }) {
    const [on, setOn] = useState(defaultOn)
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-gray-600 text-xs">{desc}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setOn(!on)}
                className={cn("relative w-11 h-6 rounded-full transition-all duration-200 shrink-0", on ? "bg-cyan-600" : "bg-white/10")}
            >
                <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200", on ? "translate-x-5" : "translate-x-0")} />
            </button>
        </div>
    )
}


export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [passwordSaving, setPasswordSaving] = useState(false)
    const [passwordMessage, setPasswordMessage] = useState("")
    const [passwordError, setPasswordError] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile")
                const data = await res.json()
                setUser(data)
            } catch (error) {
                console.error("Failed to fetch profile, using demo profile:", error)
                // Demo fallback data
                setUser({
                    firstName: "Demo",
                    lastName: "Administrator",
                    email: "admin@invict.academy",
                    phone: "+39 123 456 7890",
                    nationality: "Italian",
                    role: "ADMIN"
                })
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSaving(true)
        setSuccessMessage("")

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                const updated = await res.json()
                setUser(updated)
                setSuccessMessage("Profile updated successfully")
                setTimeout(() => setSuccessMessage(""), 3000)
            }
        } catch (error) {
            console.error("Failed to update profile:", error)
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPasswordSaving(true)
        setPasswordMessage("")
        setPasswordError("")

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        if (data.newPassword !== data.confirmPassword) {
            setPasswordError("New passwords do not match")
            setPasswordSaving(false)
            return
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                }),
            })

            const json = await res.json()

            if (res.ok) {
                setPasswordMessage("Password updated successfully")
                e.currentTarget.reset()
                setTimeout(() => setPasswordMessage(""), 3000)
            } else {
                setPasswordError(json.error || "Failed to update password")
            }
        } catch (error) {
            setPasswordError("An error occurred")
        } finally {
            setPasswordSaving(false)
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
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account preferences and security</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="bg-card border border-white/10 p-1">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">
                        <Lock className="h-4 w-4 mr-2" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-white/5 data-[state=active]:text-cyan-400">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <form onSubmit={handleProfileUpdate}>
                        <Card className="bg-card border-white/10 overflow-hidden">
                            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                                <CardTitle className="text-white">Profile Information</CardTitle>
                                <CardDescription className="text-gray-500">
                                    Update your personal details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            defaultValue={user?.firstName}
                                            className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            defaultValue={user?.lastName}
                                            className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            defaultValue={user?.phone}
                                            placeholder="+39 000 000 0000"
                                            className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nationality" className="text-gray-300">Nationality</Label>
                                        <Input
                                            id="nationality"
                                            name="nationality"
                                            defaultValue={user?.nationality}
                                            placeholder="Italian"
                                            className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={user?.email}
                                            className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-cyan-400">Account Role: {user?.role}</p>
                                        <p className="text-xs text-cyan-400/60 mt-0.5">
                                            Your role determines your access level. Only administrators can change roles.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 bg-white/[0.02] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                    {successMessage && (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            {successMessage}
                                        </>
                                    )}
                                </div>
                                <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>

                <TabsContent value="security">
                    <form onSubmit={handlePasswordUpdate}>
                        <Card className="bg-card border-white/10">
                            <CardHeader className="bg-white/[0.02] border-b border-white/5">
                                <CardTitle className="text-white text-lg">Change Password</CardTitle>
                                <CardDescription className="text-gray-500">
                                    Ensure your account is using a long, random password to stay secure
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current" className="text-gray-300">Current Password</Label>
                                    <Input id="current" type="password" name="currentPassword" required placeholder="Current Password" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new" className="text-gray-300">New Password</Label>
                                    <Input id="new" type="password" name="newPassword" required placeholder="New Password" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm" className="text-gray-300">Confirm New Password</Label>
                                    <Input id="confirm" type="password" name="confirmPassword" required placeholder="Confirm Password" className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 bg-white/[0.02] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-green-400">
                                    {passwordMessage && (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            {passwordMessage}
                                        </>
                                    )}
                                    {passwordError && (
                                        <span className="text-red-400">{passwordError}</span>
                                    )}
                                </div>
                                <Button type="submit" disabled={passwordSaving} className="bg-cyan-600 hover:bg-cyan-700">
                                    {passwordSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Update Password
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="bg-card border-white/10">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5">
                            <CardTitle className="text-white text-lg">Notification Preferences</CardTitle>
                            <CardDescription className="text-gray-500">
                                Choose how and when you receive updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-2">
                            {[
                                { key: "emailUpdates", label: "Email Updates", desc: "Receive application status changes by email", icon: "📧", default: true },
                                { key: "whatsappUpdates", label: "WhatsApp Messages", desc: "Get notified via WhatsApp for important milestones", icon: "💬", default: true },
                                { key: "documentReminders", label: "Document Reminders", desc: "Reminders when documents are pending or expiring", icon: "📄", default: true },
                                { key: "paymentReminders", label: "Payment Reminders", desc: "Alerts before upcoming invoice due dates", icon: "💳", default: true },
                                { key: "consultationReminders", label: "Consultation Reminders", desc: "Reminder 24h before your scheduled consultation", icon: "📅", default: true },
                                { key: "marketingEmails", label: "Community & News", desc: "Community updates, scholarship alerts, and tips", icon: "🎓", default: false },
                            ].map(pref => (
                                <NotifToggle key={pref.key} icon={pref.icon} label={pref.label} desc={pref.desc} defaultOn={pref.default} />
                            ))}
                            <div className="pt-4 flex justify-end">
                                <Button className="bg-cyan-600 hover:bg-cyan-700 rounded-xl">Save Preferences</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
