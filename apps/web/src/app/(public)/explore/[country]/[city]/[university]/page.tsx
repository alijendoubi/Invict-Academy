"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Globe, BookOpen, Award, Shield, FileText, CheckCircle, Circle, MessageSquare, Calendar, ExternalLink, GraduationCap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUniversity } from "@/lib/destinations"

const REQUIRED_DOCS = [
    "Valid Passport (minimum 1 year remaining)",
    "High School Diploma / Bachelor's Degree",
    "Academic Transcripts",
    "CV / Résumé",
    "Motivation Letter",
    "Language Certificate (IELTS / TOEFL)",
    "CIMEA / Declaration of Value (DoV) for foreign diplomas",
    "Passport-size Photo",
]

export default function UniversityPage({ params }: { params: { country: string; city: string; university: string } }) {
    const uni = getUniversity(params.country, params.city, params.university)
    if (!uni) notFound()

    const englishPrograms = uni.programs.filter(p => p.language === "English" || p.language === "Both")
    const masterPrograms = englishPrograms.filter(p => p.level === "Master")
    const bachelorPrograms = englishPrograms.filter(p => p.level === "Bachelor")

    return (
        <div className="min-h-screen bg-[#070A12] text-white">
            {/* Breadcrumb */}
            <div className="border-b border-white/5 py-4 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <Link href="/explore" className="hover:text-cyan-400">Explore</Link>
                    <span>/</span>
                    <Link href={`/explore/${params.country}`} className="hover:text-cyan-400 capitalize">{params.country}</Link>
                    <span>/</span>
                    <Link href={`/explore/${params.country}/${params.city}`} className="hover:text-cyan-400 capitalize">{params.city}</Link>
                    <span>/</span>
                    <span className="text-white">{uni.shortName || uni.name}</span>
                </div>
            </div>

            {/* University Hero */}
            <section className="py-16 px-6 lg:px-12 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Founded {uni.founded}</Badge>
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">{uni.type}</Badge>
                                {uni.worldRanking && (
                                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">🏆 {uni.worldRanking}</Badge>
                                )}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white">{uni.name}</h1>
                            <p className="text-gray-400 text-lg leading-relaxed">{uni.overview}</p>
                            <div className="flex flex-wrap gap-2">
                                {uni.strengths.map((s, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/5">{s}</span>
                                ))}
                            </div>
                            <Button asChild className="rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white" size="sm">
                                <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Globe size={14} /> Official Website <ExternalLink size={12} />
                                </a>
                            </Button>
                        </div>

                        {/* Quick Apply Box */}
                        <div className="lg:w-80 p-6 rounded-3xl bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/20 space-y-4 shrink-0">
                            <p className="text-cyan-400 font-bold text-sm uppercase tracking-widest">Apply Through Invict</p>
                            <p className="text-white font-semibold">Let our team handle your full application to {uni.shortName || uni.name}.</p>
                            <div className="space-y-2">
                                <Button asChild className="w-full bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 rounded-xl" size="sm">
                                    <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <MessageSquare size={14} /> WhatsApp Consultation Team
                                    </a>
                                </Button>
                                <Button asChild className="w-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 rounded-xl" size="sm">
                                    <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <Calendar size={14} /> Book Free Consultation
                                    </a>
                                </Button>
                                <Button asChild className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded-xl" size="sm">
                                    <a href={`https://wa.me/393477590963?text=Hello, I'm interested in applying to ${uni.name}.`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <ExternalLink size={14} /> Direct Admission Team
                                    </a>
                                </Button>
                            </div>
                            <p className="text-gray-500 text-xs text-center">Documents ready? Contact our admission team directly.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-12 grid lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Available Programs */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <GraduationCap size={22} className="text-cyan-400" /> Available Programs (English)
                        </h2>
                        {masterPrograms.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Master&apos;s Programs</p>
                                <div className="space-y-2">
                                    {masterPrograms.map((prog, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                                                <span className="text-gray-300 text-sm font-medium">{prog.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-cyan-500/10 text-cyan-400 border-0 text-xs">{prog.language}</Badge>
                                                <span className="text-gray-600 text-xs">{prog.duration}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {bachelorPrograms.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Bachelor&apos;s Programs</p>
                                <div className="space-y-2">
                                    {bachelorPrograms.map((prog, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span className="text-gray-300 text-sm">{prog.name}</span>
                                            <Badge className="bg-blue-500/10 text-blue-400 border-0 text-xs">{prog.duration}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {englishPrograms.length === 0 && (
                            <p className="text-gray-500 text-sm">Contact us for current English-taught program availability.</p>
                        )}
                    </section>

                    {/* Admission Requirements */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <BookOpen size={22} className="text-blue-400" /> Admission Requirements
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-sm font-bold text-blue-300 mb-3 uppercase tracking-wide">Bachelor&apos;s Admission</p>
                                <ul className="space-y-2">
                                    {uni.admissionRequirements.bachelor.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                            <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-sm font-bold text-cyan-300 mb-3 uppercase tracking-wide">Master&apos;s Admission</p>
                                <ul className="space-y-2">
                                    {uni.admissionRequirements.master.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                            <CheckCircle size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Language Requirements */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Globe size={22} className="text-purple-400" /> Language Requirements
                        </h2>
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                <p className="text-xs text-cyan-400 uppercase tracking-widest font-bold mb-1">English Programs</p>
                                <p className="text-white font-semibold">{uni.languageRequirements.english}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Italian Programs</p>
                                <p className="text-gray-300">{uni.languageRequirements.italian}</p>
                            </div>
                            {uni.languageRequirements.notes && (
                                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                                    <p className="text-yellow-400 text-sm">⚠️ {uni.languageRequirements.notes}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Scholarships */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Award size={22} className="text-yellow-400" /> Scholarships Available
                        </h2>
                        <div className="space-y-3">
                            {uni.scholarships.map((sch, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                    <Sparkles size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                                    <p className="text-gray-300 text-sm">{sch}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <p className="text-gray-400 text-sm">💡 <strong className="text-white">Important:</strong> For deadlines, contact our team — they change annually. We help you apply for scholarships as part of our service.</p>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Required Documents Checklist */}
                    <Card className="bg-[#0B1020] border-white/10">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-white flex items-center gap-2 text-base">
                                <FileText size={16} className="text-orange-400" /> Required Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            {REQUIRED_DOCS.map((doc, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                                    <Circle size={14} className="text-gray-600 shrink-0 group-hover:text-cyan-400 transition-colors" />
                                    <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{doc}</span>
                                </div>
                            ))}
                            <Button asChild className="w-full mt-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 rounded-xl" size="sm">
                                <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <MessageSquare size={14} /> Ask about my documents
                                </a>
                            </Button>
                        </CardContent>
                    </Card>


                    {/* Quick CTAs */}
                    <Card className="bg-gradient-to-br from-cyan-900/30 to-indigo-900/20 border-cyan-500/20">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-cyan-400 text-sm uppercase tracking-widest">Ready to Apply?</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            {[
                                { label: "WhatsApp Consultation Team", href: "https://wa.me/message/QQJHB2LLHFFTF1", icon: MessageSquare, color: "text-green-400 bg-green-500/10 border-green-500/20" },
                                { label: "Book Free Consultation", href: "https://calendly.com/invictacademy777", icon: Calendar, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
                                { label: "Fill Application Form", href: "/contact", icon: FileText, color: "text-white bg-white/10 border-white/20" },
                                { label: "Direct Admission Team (Italy)", href: "https://wa.me/393477590963", icon: ExternalLink, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                            ].map((action, i) => (
                                <Button key={i} asChild className={`w-full justify-start border ${action.color} rounded-xl hover:opacity-90`} size="sm">
                                    <a href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-2">
                                        <action.icon size={14} />
                                        <span className="text-xs">{action.label}</span>
                                    </a>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
