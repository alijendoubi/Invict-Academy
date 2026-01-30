"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        // Demo Bypass for Client Showcase
        if (password === "demo123" || password === "admin") {
            if (email === "admin@invict.academy") {
                router.push("/dashboard")
                setLoading(false)
                return
            }
            if (email === "student@invict.academy") {
                router.push("/dashboard/student")
                setLoading(false)
                return
            }
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Login failed")
            }

            const data = await res.json()

            // Redirect based on role
            if (data.user.role === "STUDENT") {
                router.push("/dashboard/student")
            } else if (data.user.role === "ASSOCIATE") {
                router.push("/dashboard/associate")
            } else {
                router.push("/dashboard")
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#0B1020] border-white/10">
                <CardHeader className="space-y-1">
                    <Link href="/" className="flex items-center space-x-2 mb-8">
                        <Image
                            src="/Logo.png"
                            alt="Invict Academy Logo"
                            width={200}
                            height={64}
                            className="h-16 w-auto rounded-2xl object-contain"
                        />
                    </Link>
                    <CardTitle className="text-2xl text-center text-white">Welcome back</CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Sign in to your Invict Academy account
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
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-300">Password</Label>
                                <Link href="/auth/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>

                        {/* Demo Credentials Hint */}
                        <div className="mt-6 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                            <p className="text-[10px] uppercase tracking-wider text-cyan-400/60 font-bold mb-2 text-center">
                                Demo Showcase Credentials
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="text-gray-400">
                                    <span className="text-white">Admin:</span> admin@invict.academy
                                </div>
                                <div className="text-gray-400 text-right">
                                    <span className="text-white">Pass:</span> demo123
                                </div>
                                <div className="text-gray-400">
                                    <span className="text-white">Student:</span> student@invict.academy
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                            Sign up
                        </Link>
                    </div>
                    <div className="text-xs text-center text-gray-500">
                        <Link href="/" className="hover:text-gray-400">
                            ← Back to home
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
