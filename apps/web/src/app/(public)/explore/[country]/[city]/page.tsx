"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Building, DollarSign, Users, Briefcase, Shield, Home, MapPin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCity } from "@/lib/destinations"

export default async function CityPage({ params }: { params: Promise<{ country: string; city: string }> }) {
    const p = await params
    const city = getCity(p.country, p.city)
    if (!city) notFound()

    const tabs = [
        { icon: DollarSign, label: "Cost of Living", color: "text-green-400" },
        { icon: Home, label: "Accommodation", color: "text-blue-400" },
        { icon: Users, label: "Student Life", color: "text-purple-400" },
        { icon: Briefcase, label: "Part-time Work", color: "text-yellow-400" },
        { icon: Shield, label: "Safety", color: "text-cyan-400" },
    ]

    return (
        <div className="min-h-screen bg-[#070A12] text-white">
            {/* Breadcrumb */}
            <div className="border-b border-white/5 py-4 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <Link href="/explore" className="hover:text-cyan-400">Explore</Link>
                    <span>/</span>
                    <Link href={`/explore/${p.country}`} className="hover:text-cyan-400 capitalize">{p.country}</Link>
                    <span>/</span>
                    <span className="text-white">{city.name}</span>
                </div>
            </div>

            {/* City Hero */}
            <section className="py-20 px-6 lg:px-12 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                                    <MapPin size={14} /> {city.region}
                                </div>
                                <h1 className="text-5xl font-black text-white mb-3">
                                    Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{city.name}</span>
                                </h1>
                                <p className="text-gray-400 text-lg leading-relaxed">{city.overview}</p>
                            </div>
                            {/* Cost Summary Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                {city.costOfLiving.breakdown.slice(0, 4).map((item, i) => (
                                    <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                                        <p className="text-white font-bold text-sm">{item.range}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                <p className="text-cyan-400 font-bold text-sm mb-1">Total Monthly Cost</p>
                                <p className="text-white text-2xl font-black">{city.costOfLiving.monthly}</p>
                                <p className="text-gray-400 text-xs mt-1">Including rent, food, transport & leisure</p>
                            </div>
                        </div>

                        {/* City Info Tabs */}
                        <div className="space-y-4">
                            {[
                                { icon: DollarSign, label: "Accommodation", color: "text-green-400", bg: "bg-green-500/10", content: city.accommodation.tips },
                                { icon: Users, label: "Student Life", color: "text-purple-400", bg: "bg-purple-500/10", content: city.studentLife },
                                { icon: Briefcase, label: "Part-time Work", color: "text-yellow-400", bg: "bg-yellow-500/10", content: city.partTimeWork },
                                { icon: Shield, label: "Safety", color: "text-cyan-400", bg: "bg-cyan-500/10", content: city.safety },
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`h-7 w-7 rounded-lg ${item.bg} flex items-center justify-center`}>
                                            <item.icon size={14} className={item.color} />
                                        </div>
                                        <p className="font-semibold text-sm text-white">{item.label}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.content}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Universities in this City */}
            <section className="py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Step 3 — Choose a University</p>
                        <h2 className="text-3xl font-black">Universities in {city.name}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {city.universities.map((uni, i) => (
                            <motion.div key={uni.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}>
                                <Link href={`/explore/${p.country}/${p.city}/${uni.slug}`}
                                    className="block p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                            <Building size={22} className="text-indigo-400" />
                                        </div>
                                        <ArrowRight size={18} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all mt-1" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{uni.name}</h3>
                                    {uni.worldRanking && <p className="text-cyan-400 text-xs mb-2">🏆 {uni.worldRanking}</p>}
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">Founded {uni.founded} · {uni.overview.slice(0, 100)}...</p>
                                    <div className="flex flex-wrap gap-2">
                                        {uni.strengths.slice(0, 4).map((s, j) => (
                                            <Badge key={j} className="bg-white/5 border-0 text-gray-400 text-xs">{s}</Badge>
                                        ))}
                                        {uni.programs.filter(p => p.language === "English").length > 0 && (
                                            <Badge className="bg-cyan-500/10 text-cyan-400 border-0 text-xs">
                                                {uni.programs.filter(p => p.language === "English").length} English programs
                                            </Badge>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-black">Questions About Studying in {city.name}?</h2>
                    <p className="text-gray-400">We have local knowledge and contacts in {city.name}. Let&apos;s talk about your options.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-2xl">
                            <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer">WhatsApp Our Team</a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5 rounded-2xl">
                            <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer">Book Free Consultation</a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
