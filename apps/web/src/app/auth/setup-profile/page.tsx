"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react"

export default function SetupProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string
        const phone = formData.get("phone") as string
        const nationality = formData.get("nationality") as string

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/setup-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, phone, nationality }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to update profile")
            }

            // Successfully set up, go to student dashboard
            router.push("/dashboard/student")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-[#0B1020] border-cyan-500/30">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-cyan-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center text-white">Welcome to Invict Academy!</CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Please set a secure password and complete your profile to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/5">
                            <h3 className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Security
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">New Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={8}
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/5">
                            <h3 className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Profile Details
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-300">Phone Number (WhatsApp) *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="+1 234 567 890"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nationality" className="text-gray-300">Nationality</Label>
                                <Input
                                    id="nationality"
                                    name="nationality"
                                    type="text"
                                    placeholder="e.g., Italian, Turkish"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-6"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save & Continue to Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
