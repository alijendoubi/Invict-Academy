"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#0B1020] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Reset your password</CardTitle>
                    <CardDescription className="text-gray-400">
                        Enter your email and we’ll send a reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
                            Send reset link
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
