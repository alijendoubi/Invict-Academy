"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Globe, QrCode, MapPin, ChevronRight, Users, GraduationCap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { destinations } from "@/lib/destinations"
import { useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

const countryColors: Record<string, string> = {
    italy: "from-green-600/20 to-red-600/20 border-green-500/20",
    germany: "from-yellow-600/20 to-gray-900 border-yellow-500/20",
    france: "from-blue-800/20 to-red-700/20 border-blue-500/20",
    spain: "from-red-700/20 to-yellow-600/20 border-red-500/20",
    lithuania: "from-yellow-500/20 to-green-700/20 border-yellow-500/20",
}

export default function ExplorePage() {
    const { t } = useLanguage()

    // Log QR scan silently
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const source = params.get("source") || "brochure-general"
        fetch(`/api/qr-analytics/scan?source=${source}`).catch(() => { })
    }, [])

    return (
        <div className="min-h-screen bg-[#070A12] text-white">
            {/* Hero */}
            <section className="relative pt-24 pb-20 px-6 lg:px-12 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2">
                            <QrCode size={14} /> {t.explore.badge}
                        </Badge>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6">
                            {t.explore.title.split('&')[0]}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">&amp; {t.explore.title.split('&')[1]}</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                            {t.explore.subtitle}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-2xl px-8">
                                <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Globe size={18} /> {t.explore.talkToTeam}
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5 rounded-2xl px-8">
                                <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    {t.explore.bookCta} <ArrowRight size={18} />
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="border-b border-white/5 py-8 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: t.explore.stats.destinations, value: `${destinations.length}` },
                        { label: t.explore.stats.cities, value: `${destinations.reduce((a, c) => a + c.cities.length, 0)}+` },
                        { label: t.explore.stats.universities, value: `${destinations.reduce((a, c) => a + c.cities.reduce((b, d) => b + d.universities.length, 0), 0)}+` },
                        { label: t.explore.stats.successRate, value: "99%" },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-black text-white">{s.value}</p>
                            <p className="text-gray-500 text-sm">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Destinations Grid */}
            <section className="py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">{t.explore.step1}</p>
                        <h2 className="text-3xl font-black text-white">{t.explore.selectCountry}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations.map((country, i) => (
                            <motion.div
                                key={country.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -6 }}
                            >
                                <Link href={`/explore/${country.slug}`} className={`block p-6 rounded-3xl bg-gradient-to-br ${countryColors[country.slug] || "from-white/5 to-white/2 border-white/10"} border hover:border-cyan-500/30 transition-all group`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-5xl">{country.flag}</span>
                                        <ArrowRight size={20} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">{country.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{country.language}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-white/5 border-0 text-gray-400 text-xs">{country.generalInfo.tuitionRange}</Badge>
                                        <Badge className="bg-white/5 border-0 text-gray-400 text-xs">{country.cities.length} {t.explore.citiesLabel}</Badge>
                                        <Badge className="bg-white/5 border-0 text-gray-400 text-xs">{country.cities.reduce((a, c) => a + c.universities.length, 0)} {t.explore.universitiesLabel}</Badge>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Block */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl font-black">{t.explore.ctaTitle}</h2>
                    <p className="text-gray-400 text-lg">{t.explore.ctaDesc}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="bg-white text-black hover:bg-cyan-400 font-bold rounded-2xl px-10">
                            <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer">{t.explore.whatsappCta}</a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5 rounded-2xl px-10">
                            <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer">{t.explore.bookCta}</a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
