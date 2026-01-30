"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            role: formData.get("role") as string || "STUDENT",
        }

        const confirmPassword = formData.get("confirmPassword") as string
        if (data.password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const result = await res.json()
                throw new Error(result.error || "Registration failed")
            }

            setSuccess(true)
            setTimeout(() => router.push("/auth/login"), 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-[#0B1020] border-white/10">
                    <CardContent className="pt-12 pb-12 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Account Created!</h2>
                        <p className="text-gray-400">Redirecting you to login...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#0B1020] border-white/10">
                <CardHeader className="space-y-1">
                    <Link href="/" className="flex items-center space-x-2 mb-8">
                        <img
                            src="/Logo.png"
                            alt="Invict Academy Logo"
                            className="h-16 w-auto rounded-2xl object-contain"
                        />
                    </Link>
                    <CardTitle className="text-2xl text-center text-white">Create an account</CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Join Invict Academy to start your journey
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    required
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    required
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>
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
                            <Label htmlFor="role" className="text-gray-300">I am a...</Label>
                            <Select name="role" defaultValue="STUDENT">
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                    <SelectItem value="ASSOCIATE">Education Partner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
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
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-gray-400">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                            Sign in
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
