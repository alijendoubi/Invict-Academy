"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    BookOpen, Download, Eye, QrCode, GraduationCap, Globe,
    MapPin, ChevronRight, FileText, Landmark, Coins,
    Clock, ShieldCheck, Users, ArrowRight, Sparkles, CheckCircle2
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function BookletPage() {
    const { t } = useLanguage()

    const BOOKLET_SECTIONS = [
        { id: "italy-guide", title: t.booklet.materials[0].title, pages: t.booklet.materials[0].pages, description: t.booklet.materials[0].desc, tags: t.booklet.materials[0].tags, color: "from-cyan-500/20 to-blue-600/5", border: "border-cyan-500/20" },
        { id: "polimi-guide", title: t.booklet.materials[1].title, pages: t.booklet.materials[1].pages, description: t.booklet.materials[1].desc, tags: t.booklet.materials[1].tags, color: "from-blue-500/20 to-indigo-600/5", border: "border-blue-500/20" },
        { id: "polito-guide", title: t.booklet.materials[2].title, pages: t.booklet.materials[2].pages, description: t.booklet.materials[2].desc, tags: t.booklet.materials[2].tags, color: "from-purple-500/20 to-violet-600/5", border: "border-purple-500/20" },
        { id: "dsu-scholarship", title: t.booklet.materials[3].title, pages: t.booklet.materials[3].pages, description: t.booklet.materials[3].desc, tags: t.booklet.materials[3].tags, color: "from-yellow-500/20 to-orange-600/5", border: "border-yellow-500/20" },
        { id: "visa-guide", title: t.booklet.materials[4].title, pages: t.booklet.materials[4].pages, description: t.booklet.materials[4].desc, tags: t.booklet.materials[4].tags, color: "from-green-500/20 to-emerald-600/5", border: "border-green-500/20" },
        { id: "bologna-guide", title: t.booklet.materials[5].title, pages: t.booklet.materials[5].pages, description: t.booklet.materials[5].desc, tags: t.booklet.materials[5].tags, color: "from-red-500/20 to-rose-600/5", border: "border-red-500/20" },
    ]

    const QUICK_STATS = [
        { label: t.booklet.stats.guides, value: "12+", icon: BookOpen },
        { label: t.booklet.stats.universities, value: "30+", icon: GraduationCap },
        { label: t.booklet.stats.countries, value: "6", icon: Globe },
        { label: t.booklet.stats.updated, value: "2025/26", icon: Clock },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-[#070A12] text-white overflow-hidden font-sans">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cyan-500/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 rounded-full text-sm font-semibold flex w-fit items-center gap-2 mx-auto mb-6">
                            <Sparkles size={14} className="animate-pulse" />
                            {t.booklet.badge}
                        </Badge>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
                        {t.booklet.titleLine1}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{t.booklet.titleLine2}</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
                        {t.booklet.subtitle}
                    </motion.p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        {QUICK_STATS.map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                                <stat.icon size={20} className="text-cyan-400 mx-auto mb-2" />
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                                <p className="text-gray-600 text-xs">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured QR CTA */}
            <section className="py-12 px-6 lg:px-12 bg-[#05080E] border-b border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-gradient-to-r from-cyan-900/20 to-blue-900/10 border border-cyan-500/20">
                        <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl">
                            <QrCode size={64} className="text-black" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-bold text-xl mb-2">{t.booklet.promo.title}</h3>
                            <p className="text-gray-400">{t.booklet.promo.desc}</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Button asChild className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-2xl">
                                <Link href="/explore">{t.booklet.promo.explore}</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-2xl">
                                <Link href="/eligibility">{t.booklet.promo.assessment}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guides Grid */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">{t.booklet.guidesTitle}</h2>
                        <p className="text-gray-500">{t.booklet.guidesDesc}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BOOKLET_SECTIONS.map((guide, i) => (
                            <motion.div key={guide.id}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                className={`p-7 rounded-3xl bg-gradient-to-br ${guide.color} border ${guide.border} group hover:scale-[1.02] transition-all duration-300 flex flex-col`}>
                                <div className="flex items-start justify-between mb-5">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <FileText size={22} className="text-white/50" />
                                    </div>
                                    <Badge className="bg-black/30 text-gray-400 border-0 text-xs">{guide.pages}</Badge>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-3 leading-snug">{guide.title}</h3>
                                <p className="text-gray-400 text-sm mb-5 leading-relaxed flex-1">{guide.description}</p>
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {guide.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <a href={`https://wa.me/393477590963?text=Hi, I'd like to request the PDF: ${guide.title}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 transition-all">
                                        <Download size={14} /> {t.booklet.requestPdf}
                                    </a>
                                    <Link href={`/explore`}
                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
                                        <Eye size={14} /> {t.booklet.exploreUni}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* University Quick Access */}
            <section className="py-20 px-6 lg:px-12 bg-[#050810] border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-8 text-center">{t.booklet.quickAccessTitle}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { name: t.booklet.unis[0].name, city: t.booklet.unis[0].city, flag: "🇮🇹", href: "/explore/italy/milan/politecnico-milano", rank: t.booklet.unis[0].rank },
                            { name: t.booklet.unis[1].name, city: t.booklet.unis[1].city, flag: "🇮🇹", href: "/explore/italy/turin/politecnico-torino", rank: t.booklet.unis[1].rank },
                            { name: t.booklet.unis[2].name, city: t.booklet.unis[2].city, flag: "🇮🇹", href: "/explore/italy/rome/sapienza", rank: t.booklet.unis[2].rank },
                            { name: t.booklet.unis[3].name, city: t.booklet.unis[3].city, flag: "🇮🇹", href: "/explore/italy/bologna/unibo", rank: t.booklet.unis[3].rank },
                            { name: t.booklet.unis[4].name, city: t.booklet.unis[4].city, flag: "🇮🇹", href: "/explore/italy/padua/unipd", rank: t.booklet.unis[4].rank },
                            { name: t.booklet.unis[5].name, city: t.booklet.unis[5].city, flag: "🇮🇹", href: "/explore/italy/venice/ca-foscari", rank: t.booklet.unis[5].rank },
                            { name: t.booklet.unis[6].name, city: t.booklet.unis[6].city, flag: "🇮🇹", href: "/explore/italy/trento/unitn", rank: t.booklet.unis[6].rank },
                            { name: t.booklet.unis[7].name, city: t.booklet.unis[7].city, flag: "🇮🇹", href: "/explore/italy/pisa/unipi", rank: t.booklet.unis[7].rank },
                        ].map((uni, i) => (
                            <Link key={i} href={uni.href}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all group">
                                <span className="text-2xl shrink-0">{uni.flag}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-400 transition-colors">{uni.name}</p>
                                    <p className="text-gray-600 text-xs">{uni.city} · {uni.rank}</p>
                                </div>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* WhatsApp CTA */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                        {t.booklet.whatsappCtaTitle1}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{t.booklet.whatsappCtaTitle2}</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">{t.booklet.whatsappCtaDesc}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl px-10 h-14 text-lg">
                            <a href="https://wa.me/393477590963?text=Hi, I'd like to learn more about studying in Italy" target="_blank" rel="noopener noreferrer">
                                {t.booklet.chatWhatsapp}
                            </a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-2xl px-10 h-14 text-lg">
                            <Link href="/eligibility">{t.booklet.freeCheck}</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
