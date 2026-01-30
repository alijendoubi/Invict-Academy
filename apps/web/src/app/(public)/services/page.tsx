import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Check } from "lucide-react"

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[#070A12] text-white py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Our Services</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">Choose the level of support that fits your needs. From a single consultation to full A-Z management.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic */}
                    <Card className="bg-[#0B1020] border-white/10 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-300">Consultation</CardTitle>
                            <div className="text-3xl font-bold mt-2">€49 <span className="text-sm font-normal text-gray-500">/ session</span></div>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 text-gray-400 text-sm">
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>Profile Assessment</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>Country Eligibility Check</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>General Roadmap Q&A</span></div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white" variant="outline">Book Now</Button>
                        </CardFooter>
                    </Card>

                    {/* Standard */}
                    <Card className="bg-[#0B1020] border-cyan-500/50 relative flex flex-col shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                        <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        <CardHeader>
                            <CardTitle className="text-xl text-cyan-400">Admission & Visa</CardTitle>
                            <div className="text-3xl font-bold mt-2">€899 <span className="text-sm font-normal text-gray-500">/ one-time</span></div>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 text-gray-300 text-sm">
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>University Shortlisting (up to 5)</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>Application Submission</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>CV & Motivation Letter Edit</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>Visa Checklist & File Review</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-cyan-500" /> <span>Mock Visa Interview</span></div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {/* Premium */}
                    <Card className="bg-[#0B1020] border-white/10 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl text-purple-400">Full Ride (A-Z)</CardTitle>
                            <div className="text-3xl font-bold mt-2">€1,499</div>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 text-gray-400 text-sm">
                            <div className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> <span>Everything in Standard</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> <span>Scholarship Applications</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> <span>Housing Search Assistance</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> <span>Airport Pickup & Settlement</span></div>
                            <div className="flex gap-2"><Check className="h-4 w-4 text-purple-500" /> <span>24/7 Priority Support</span></div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-purple-900/20 text-purple-400 hover:bg-purple-900/30" variant="outline">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
