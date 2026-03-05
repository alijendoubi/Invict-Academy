"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, MapPin, DollarSign, CheckCircle2, Globe, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCountry } from "@/lib/destinations"

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
    const p = await params
    const country = getCountry(p.country)
    if (!country) notFound()

    return (
        <div className="min-h-screen bg-[#070A12] text-white">
            {/* Breadcrumb */}
            <div className="border-b border-white/5 py-4 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/explore" className="hover:text-cyan-400 flex items-center gap-1"><ArrowLeft size={14} /> Explore</Link>
                    <span>/</span>
                    <span className="text-white">{country.name}</span>
                </div>
            </div>

            {/* Country Hero */}
            <section className="py-20 px-6 lg:px-12 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-8xl">{country.flag}</span>
                            <div>
                                <h1 className="text-5xl font-black text-white mb-3">Study in {country.name}</h1>
                                <p className="text-gray-400 text-lg leading-relaxed">{country.overview}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1.5">{country.generalInfo.tuitionRange}</Badge>
                                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1.5">{country.generalInfo.postStudyWork}</Badge>
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1.5">{country.generalInfo.studentPopulation}</Badge>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Why Study in {country.name}</p>
                            {country.whyStudyHere.map((reason, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                                    <span className="text-gray-300 text-sm">{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Facts */}
            <section className="py-12 px-6 lg:px-12 border-b border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Tuition Range", value: country.generalInfo.tuitionRange },
                        { label: "Scholarships", value: country.generalInfo.scholarships.split(",")[0] },
                        { label: "Visa Type", value: country.generalInfo.visaType },
                        { label: "Post-Study Work", value: country.generalInfo.postStudyWork },
                    ].map((f, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{f.label}</p>
                            <p className="text-white font-semibold text-sm">{f.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Cities */}
            <section className="py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Step 2 — Choose a City</p>
                        <h2 className="text-3xl font-black">Cities in {country.name}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {country.cities.map((city, i) => (
                            <motion.div key={city.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5 }}>
                                <Link href={`/explore/${country.slug}/${city.slug}`} className="block p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                                            <MapPin size={22} className="text-cyan-400" />
                                        </div>
                                        <ArrowRight size={18} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                                    <p className="text-gray-500 text-sm mb-1">{city.region} · {city.population}</p>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{city.overview.slice(0, 100)}...</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-white/5 border-0 text-gray-400 text-xs">💰 {city.costOfLiving.monthly}</Badge>
                                        <Badge className="bg-white/5 border-0 text-gray-400 text-xs">🎓 {city.universities.length} univ.</Badge>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-r from-cyan-900/10 to-blue-900/10">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-black">Not Sure Which City? We&apos;ll Help You Decide.</h2>
                    <p className="text-gray-400">Our advisors have in-depth knowledge of every city and university. Book a free consultation and we&apos;ll match you to the perfect program.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-2xl">
                            <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5 rounded-2xl">
                            <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer">Book Consultation</a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
