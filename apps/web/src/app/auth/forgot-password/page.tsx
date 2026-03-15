"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return
        setLoading(true)
        // Simulate brief delay for UX
        await new Promise(r => setTimeout(r, 600))
        setLoading(false)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-card border-white/10">
                    <CardContent className="pt-8 pb-6 text-center space-y-4">
                        <div className="mx-auto h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg">Check your email</h3>
                            <p className="text-gray-400 text-sm mt-2">
                                If an account with <span className="text-white">{email}</span> exists,
                                your administrator will be notified to reset your password.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-gray-400 space-y-1">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                <span>Contact your administrator directly for faster assistance.</span>
                            </div>
                        </div>
                        <Link
                            href="/auth/login"
                            className="inline-block text-sm text-cyan-400 hover:text-cyan-300 mt-2"
                        >
                            Back to login
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Reset your password</CardTitle>
                    <CardDescription className="text-gray-400">
                        Enter your email and we'll notify your administrator to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading || !email.trim()}
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
                        >
                            {loading ? "Submitting..." : "Request password reset"}
                        </Button>
                    </form>
                    <div className="text-xs text-center text-gray-500 mt-4">
                        <Link href="/auth/login" className="hover:text-gray-400">
                            Back to login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
