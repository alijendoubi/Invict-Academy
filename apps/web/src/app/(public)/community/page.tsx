"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Users, Globe, Building2, Quote, ArrowRight, Star, Instagram } from "lucide-react"

export default function CommunityPage() {
    const { t } = useLanguage()

    const STATS = [
        { key: "students", value: "2,400+", label: t.community.stats.students, icon: Users },
        { key: "countries", value: "12+", label: t.community.stats.countries, icon: Globe },
        { key: "universities", value: "73+", label: t.community.stats.universities, icon: Building2 },
        { key: "scholarships", value: "€5M+", label: t.community.stats.scholarships, icon: Star },
    ]

    const TESTIMONIALS = [
        { name: "Ahmed B.", country: "Tunisia", text: "Invict Academy made the impossible possible. I am now studying Aerospace Engineering at PoliMi with a full DSU scholarship.", uni: "Politecnico di Milano" },
        { name: "Sara H.", country: "Morocco", text: "Their visa team is incredible. They guided me step-by-step through the Universitaly portal and embassy appointment.", uni: "Sapienza University" },
        { name: "Omar T.", country: "Egypt", text: "What I loved most was the transparency. No hidden fees. They even helped me find accommodation before I arrived in Turin.", uni: "Politecnico di Torino" },
        { name: "Amina K.", country: "Algeria", text: "Getting admitted to a medical program seemed daunting, but the Invict team prepared me for the IMAT and handled all paperwork.", uni: "University of Bologna" },
        { name: "Youssef M.", country: "Lebanon", text: "The dedicated advisor was available 24/7 on WhatsApp. I never felt lost during the 8-month application journey.", uni: "University of Padua" },
        { name: "Fatima Z.", country: "Tunisia", text: "Thanks to Invict, I secured a €7,200/year DSU scholarship. Living in Italy is practically free for me now!", uni: "Ca' Foscari Venice" },
    ]

    const AMBASSADORS = [
        { name: "Yassin E.", role: "PoliTo Ambassador", location: "Turin, Italy", img: "Y", color: "bg-blue-500", handle: "@yassin.study" },
        { name: "Nour S.", role: "Sapienza Ambassador", location: "Rome, Italy", img: "N", color: "bg-purple-500", handle: "@nour_in_rome" },
        { name: "Karim W.", role: "UniBo Ambassador", location: "Bologna, Italy", img: "K", color: "bg-orange-500", handle: "@karim.bologna" },
        { name: "Lina A.", role: "PoliMi Ambassador", location: "Milan, Italy", img: "L", color: "bg-cyan-500", handle: "@lina.milano" },
    ]

    return (
        <div className="min-h-screen bg-[#04060F] pt-[80px]">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container relative mx-auto px-4 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            {t.community.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            {t.community.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-12 border-b border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {STATS.map((stat, idx) => (
                            <motion.div
                                key={stat.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon size={28} className="text-cyan-400 mx-auto mb-4 opacity-80" />
                                <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
                                <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">{t.community.testimonials}</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-3xl bg-[#070A12] border border-white/5 hover:border-cyan-500/20 transition-colors group"
                            >
                                <Quote size={40} className="text-cyan-500/20 mb-6 group-hover:text-cyan-500/40 transition-colors" />
                                <p className="text-gray-300 leading-relaxed mb-6 flex-1 italic relative z-10">&quot;{testimonial.text}&quot;</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-gray-700 to-gray-900 text-white shrink-0`}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-white font-semibold flex items-center gap-2">
                                            {testimonial.name}
                                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300">{testimonial.country}</span>
                                        </h4>
                                        <p className="text-sm text-cyan-400">{testimonial.uni}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ambassadors Section */}
            <section className="py-24 bg-[#070A12] border-t border-b border-white/5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold text-white mb-4">{t.community.ambassadors}</h2>
                            <p className="text-gray-400 text-lg">{t.community.ambassadorsDesc}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {AMBASSADORS.map((ambassador, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="rounded-3xl bg-[#0B1020] border border-white/5 overflow-hidden group hover:border-white/10 transition-colors"
                            >
                                <div className={`h-24 w-full bg-gradient-to-br ${ambassador.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                                <div className="p-6 pt-0 relative">
                                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${ambassador.color} text-white text-3xl font-bold flex items-center justify-center -mt-10 mb-4 shadow-xl border-4 border-[#0B1020]`}>
                                        {ambassador.img}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{ambassador.name}</h3>
                                    <p className="text-cyan-400 text-sm font-medium mb-4">{ambassador.role}</p>
                                    <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                                        {ambassador.location}
                                    </p>
                                    <Button asChild variant="outline" className="w-full rounded-xl border-white/10 text-white hover:bg-white/5 gap-2">
                                        <a href="https://www.instagram.com/invict.academy" target="_blank" rel="noopener noreferrer">
                                            <Instagram size={16} /> @invict.academy
                                        </a>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
                <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        {t.community.joinTitle}
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                        {t.community.joinDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold h-14 px-8 text-lg rounded-full">
                            {t.community.joinCta}
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg rounded-full">
                            {t.common.bookConsultation}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
