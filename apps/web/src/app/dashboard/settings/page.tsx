"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, Shield, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

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
                <TabsList className="bg-[#0B1020] border border-white/10 p-1">
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
                        <Card className="bg-[#0B1020] border-white/10 overflow-hidden">
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
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5">
                            <CardTitle className="text-white text-lg">Change Password</CardTitle>
                            <CardDescription className="text-gray-500">
                                Ensure your account is using a long, random password to stay secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current" className="text-gray-300">Current Password</Label>
                                <Input id="current" type="password" name="currentPassword" title="Current Password" placeholder="Current Password" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new" className="text-gray-300">New Password</Label>
                                <Input id="new" type="password" name="newPassword" title="New Password" placeholder="New Password" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm" className="text-gray-300">Confirm New Password</Label>
                                <Input id="confirm" type="password" name="confirmPassword" title="Confirm Password" placeholder="Confirm Password" className="bg-white/5 border-white/10 text-white" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-white/5 bg-white/[0.02] p-4 flex justify-end">
                            <Button className="bg-cyan-600 hover:bg-cyan-700">Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5">
                            <CardTitle className="text-white text-lg">Notification Preferences</CardTitle>
                            <CardDescription className="text-gray-500">
                                Manage how you receive updates and alerts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-400">Notification settings coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
