"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
    Globe2, Users, Heart, Shield, DollarSign, Star,
    CheckCircle2, ArrowRight, Building, Phone, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/LanguageContext"

export default function WhyUsPage() {
    const { t } = useLanguage()

    const pillars = [
        {
            icon: Globe2,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            title: t.whyUs.pillars[0].title,
            desc: t.whyUs.pillars[0].desc,
        },
        {
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            title: t.whyUs.pillars[1].title,
            desc: t.whyUs.pillars[1].desc,
        },
        {
            icon: Building,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            title: t.whyUs.pillars[2].title,
            desc: t.whyUs.pillars[2].desc,
        },
        {
            icon: Heart,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            title: t.whyUs.pillars[3].title,
            desc: t.whyUs.pillars[3].desc,
        },
        {
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
            title: t.whyUs.pillars[4].title,
            desc: t.whyUs.pillars[4].desc,
        },
        {
            icon: Shield,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            title: t.whyUs.pillars[5].title,
            desc: t.whyUs.pillars[5].desc,
        },
    ]

    return (
        <div className="min-h-screen bg-[#070A12] text-white">
            {/* Hero */}
            <section className="relative pt-28 pb-24 px-6 lg:px-12 border-b border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 rounded-full mb-6 text-sm">
                            {t.whyUs.badge}
                        </Badge>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.95]">
                            {t.whyUs.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                {t.whyUs.titleHighlight}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed mb-8">
                            {t.whyUs.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="bg-white text-black hover:bg-cyan-400 font-bold rounded-2xl px-10 h-14">
                                <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    {t.whyUs.talkToTeam} <ArrowRight size={18} />
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5 rounded-2xl px-10 h-14">
                                <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer">
                                    {t.whyUs.bookCta}
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6 Pillars */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">{t.whyUs.pillarsLabel}</p>
                        <h2 className="text-4xl font-black">{t.whyUs.pillarsTitle}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                className={`p-7 rounded-3xl bg-white/[0.02] border ${pillar.border} hover:bg-white/[0.04] transition-all`}
                            >
                                <div className={`h-14 w-14 rounded-2xl ${pillar.bg} flex items-center justify-center mb-5`}>
                                    <pillar.icon size={26} className={pillar.color} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-6 lg:px-12 border-y border-white/5 bg-[#05080E]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "2,400+", label: t.whyUs.stats.students },
                            { value: "99%", label: t.whyUs.stats.success },
                            { value: "€7,500", label: t.whyUs.stats.scholarship },
                            { value: "5+", label: t.whyUs.stats.countries },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="text-center"
                            >
                                <p className="text-5xl font-black text-white mb-2">{stat.value}</p>
                                <p className="text-gray-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-16 px-6 lg:px-12 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-black mb-8 text-center">{t.whyUs.contactTitle}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                            <MapPin size={20} className="text-cyan-400 shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-white mb-1">{t.whyUs.officeAddress}</p>
                                <p className="text-gray-400 text-sm">Avenue Taieb Mhiri<br />Immeuble Zayatine B2-2<br />Monastir 5000, Tunisia</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                            <Phone size={20} className="text-green-400 shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-white mb-1">{t.whyUs.italyOffice}</p>
                                <a href="tel:+393477590963" className="text-green-400 text-sm hover:underline">+39 347 759 0963</a>
                                <p className="text-gray-500 text-xs mt-1">{t.whyUs.directSupport}</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                            <Star size={20} className="text-yellow-400 shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-white mb-1">{t.common.bookConsultation}</p>
                                <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline">calendly.com/invictacademy777</a>
                                <p className="text-gray-500 text-xs mt-1">{t.whyUs.bookConsultationExtra}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Tagline */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <p className="text-2xl text-gray-300 italic leading-relaxed">
                        {t.whyUs.tagline1}<br />
                        {t.whyUs.tagline2}
                    </p>
                    <p className="text-cyan-400 font-bold">— Invict Academy</p>
                    <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-white font-black rounded-3xl px-12 text-lg h-16 mt-4">
                        <a href="https://wa.me/message/QQJHB2LLHFFTF1" target="_blank" rel="noopener noreferrer">
                            {t.whyUs.startJourney}
                        </a>
                    </Button>
                </div>
            </section>
        </div>
    )
}
