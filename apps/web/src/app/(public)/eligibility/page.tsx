"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"

export default function EligibilityPage() {
    const [step, setStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentLevel: "",
        degreeInterest: "",
        budget: "",
        intake: "",
        destinations: ["Italy"] // Locked to Italy
    })

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            // Mapping eligibility form to Lead schema
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    source: "Eligibility Wizard",
                    status: "NEW"
                }),
            })

            if (res.ok) {
                setSubmitted(true)
            }
        } catch (error) {
            console.error("Submission failed:", error)
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[#0B1020] border-white/10 text-center p-8">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Assessment Submitted!</h2>
                    <p className="text-gray-400 mb-8">
                        Thank you for your interest in studying in Italy. One of our education consultants will review your profile and contact you within 24 hours.
                    </p>
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => window.location.href = "/"}>
                        Return to Homepage
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#070A12] text-white py-20 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Check Your Eligibility</h1>
                    <p className="text-gray-400 mt-2">Find your path to higher education in Italy</p>
                    <div className="w-full h-1.5 bg-white/5 mt-8 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                <Card className="bg-[#0B1020] border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-white/[0.02] border-b border-white/5">
                        <CardTitle className="text-lg">Step {step} of 3</CardTitle>
                        <CardDescription>
                            {step === 1 && "Personal details and background"}
                            {step === 2 && "Detailed study preferences"}
                            {step === 3 && "Budget planning and timeline"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">First Name</Label>
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Last Name</Label>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Email Address</Label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="bg-white/5 border-white/10 text-white focus:ring-cyan-500/20"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Education Background</Label>
                                    <Select onValueChange={(v) => handleSelectChange('currentLevel', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white capitalize">
                                            <SelectValue placeholder="Current level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                            <SelectItem value="high_school">High School</SelectItem>
                                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                            <SelectItem value="master">Master's Degree</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={nextStep} className="w-full bg-cyan-600 hover:bg-cyan-700 h-11">
                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Desired Degree Level</Label>
                                    <Select onValueChange={(v) => handleSelectChange('degreeInterest', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="I want to study..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                            <SelectItem value="master">Master's Degree</SelectItem>
                                            <SelectItem value="phd">PhD / Research</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-300">Destination (Italy Focus)</Label>
                                    <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10 border-dashed">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">IT</div>
                                            <span className="font-medium text-white">Italy</span>
                                            <span className="text-xs text-cyan-500 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 ml-auto">SELECTED</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 italic">
                                            We currently specialize exclusively in Italian universities to provide the best possible support and scholarship assistance.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={prevStep} className="w-1/3 border-white/10 text-gray-400 hover:bg-white/5">Back</Button>
                                    <Button onClick={nextStep} className="w-2/3 bg-cyan-600 hover:bg-cyan-700">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Annual Budget Range</Label>
                                    <Select onValueChange={(v) => handleSelectChange('budget', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select budget range" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                            <SelectItem value="low">&lt; €5,000</SelectItem>
                                            <SelectItem value="mid">€5,000 - €15,000</SelectItem>
                                            <SelectItem value="high">&gt; €15,000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Intake Year</Label>
                                    <Select onValueChange={(v) => handleSelectChange('intake', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Preferred year" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                            <SelectItem value="2025">September 2025</SelectItem>
                                            <SelectItem value="2026">February/September 2026</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={prevStep} className="w-1/3 border-white/10 text-gray-400 hover:bg-white/5" disabled={submitting}>Back</Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-2/3 bg-green-600 hover:bg-green-700"
                                    >
                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Submit Assessment
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

