"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    CheckCircle2, GraduationCap, Plane, FileText, ArrowRight,
    UserCheck, Globe, Clock, Coins, ShieldCheck, MapPin,
    Star, Users, Landmark, Search, MessageCircle, Sparkles, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { allItalianUniversities } from "@/lib/destinations";
import { useLanguage } from "@/contexts/LanguageContext";


export default function Home() {
    const { t } = useLanguage();
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const universities = allItalianUniversities.map(u => u.name);


    return (
        <div className="flex flex-col min-h-screen bg-[#070A12] text-white overflow-hidden font-sans">
            {/* Premium Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-6 lg:px-12 border-b border-white/5 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
                    <motion.div
                        className="lg:col-span-7 space-y-10"
                        initial="initial"
                        animate="animate"
                        variants={{
                            animate: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <motion.div variants={fadeIn}>
                            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 rounded-full text-sm font-semibold flex w-fit items-center gap-2">
                                <Sparkles size={14} className="animate-pulse" />
                                {t.hero.badge || "2,400+ Students. One Community. 🇮🇹"}
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeIn}
                            className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white"
                        >
                            {t.hero.headingLine1 || "Your Future in"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
                                {t.hero.headingLine2 || "Italy Starts Here."}
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            className="text-xl text-gray-400 max-w-xl leading-relaxed"
                        >
                            {t.hero.subheading || "Human guidance meets modern technology. Secure your admission, €5,000+ scholarships, and visa with absolute certainty."}
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row gap-5 items-center sm:items-start"
                        >
                            <Button asChild size="lg" className="bg-white text-black hover:bg-cyan-400 hover:text-black font-bold rounded-2xl px-10 text-lg h-16 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                <Link href="/eligibility" className="flex items-center gap-2">
                                    {t.hero.cta || "Start Free Assessment"} <Zap size={18} fill="currentColor" />
                                </Link>
                            </Button>
                            <div className="flex -space-x-3 items-center group cursor-pointer">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-12 w-12 rounded-full border-2 border-[#070A12] bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 group-hover:translate-x-1 transition-transform">S{i}</div>
                                ))}
                                <div className="ml-6">
                                    <p className="text-sm font-bold text-white">{t.hero.joinCommunity || "Join 2,400+ Students"}</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-yellow-500 fill-yellow-500" />)}
                                        <span className="text-[10px] text-gray-500 ml-1">4.9/5 Rating</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="lg:col-span-5 relative"
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Floating Interaction Cards */}
                        <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-2xl">
                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gradient-to-br from-gray-900 to-black p-8 relative">
                                <div className="space-y-8">
                                    <div className="flex justify-between">
                                        <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                            <Landmark size={24} />
                                        </div>
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LATEST UPDATES</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                                        <div className="h-3 w-1/2 bg-white/5 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                            <p className="text-2xl font-black text-white">99%</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Visa Success</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                            <p className="text-2xl font-black text-cyan-400">€0</p>
                                            <p className="text-[10px] text-cyan-400/60 uppercase tracking-widest">Tuition Fee</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <div className="h-2 w-24 bg-gray-700 rounded-full" />
                                        </div>
                                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                                            <div className="h-2 w-2 rounded-full bg-cyan-500" />
                                            <div className="h-2 w-32 bg-gray-700 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-6">
                                    <div className="h-14 w-14 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform">
                                        <ArrowRight />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute -top-10 -right-10 p-5 bg-[#0B1020] border border-white/10 rounded-3xl shadow-2xl animate-bounce backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                    <Coins size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Scholarship Alert</p>
                                    <p className="text-[10px] text-gray-500">DSU Bands Open</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -left-10 p-5 bg-[#0B1020] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Live Support</p>
                                    <p className="text-[10px] text-gray-500">Advisors Online</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Ticker Section */}
            <div className="bg-[#05080E] border-b border-white/5 py-10 overflow-hidden relative">
                <div className="flex whitespace-nowrap animate-scroll gap-16 items-center opacity-30">
                    {[...universities, ...universities].map((uni, i) => (
                        <span key={i} className="text-lg font-bold uppercase tracking-[0.2em] text-white/80 grayscale hover:grayscale-0 transition-all cursor-default">
                            {uni}
                        </span>
                    ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#05080E] to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#05080E] to-transparent z-10" />
            </div>

            {/* Live Community Wins Ticker */}
            <div className="bg-[#0B1020] border-b border-white/5 py-6 overflow-hidden relative flex items-center">
                <div className="absolute left-6 z-20 flex items-center gap-2 bg-[#0B1020] pr-6 border-r border-white/10 py-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-white uppercase tracking-widest">{t.community.wallTitle || "Live Community Wins 🎉"}</span>
                </div>
                <div className="flex whitespace-nowrap animate-scroll-fast gap-12 items-center ml-64 opacity-80 pl-10" style={{ animationDuration: '40s' }}>
                    {[
                        "Ahmed B. got accepted to PoliMi 🎓",
                        "Sara H. secured 100% DSU Scholarship 💰",
                        "Omar T. received Italian Student Visa ✈️",
                        "Amina K. enrolled at Sapienza Rome 🏛️",
                        "Youssef M. booked flight to Venice 🛶",
                        "Fatima Z. found accommodation in Milan 🏠",
                        "Khalil D. passed PoliTo TIL Test ✅"
                    ].map((win, i) => (
                        <span key={i} className="text-sm font-medium text-gray-300 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            {win}
                        </span>
                    ))}
                    {[
                        "Ahmed B. got accepted to PoliMi 🎓",
                        "Sara H. secured 100% DSU Scholarship 💰",
                        "Omar T. received Italian Student Visa ✈️",
                        "Amina K. enrolled at Sapienza Rome 🏛️",
                        "Youssef M. booked flight to Venice 🛶",
                        "Fatima Z. found accommodation in Milan 🏠",
                        "Khalil D. passed PoliTo TIL Test ✅"
                    ].map((win, i) => (
                        <span key={`clone-${i}`} className="text-sm font-medium text-gray-300 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            {win}
                        </span>
                    ))}
                </div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B1020] to-transparent z-10" />
            </div>

            {/* ─── WHY CHOOSE US TEASER ─── */}
            <section className="py-32 px-6 lg:px-12 bg-[#050810] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{t.homepage?.whyUsBadge || "Why Invict Academy"}</Badge>
                        <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                            {t.homepage?.whyUsTitleLine1 || "The Agency That"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{t.homepage?.whyUsTitleLine2 || "Actually Delivers"}</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t.homepage?.whyUsDesc || "No vague promises. Clear timelines, real accountability, and guaranteed results or your money back."}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: ShieldCheck, title: "Money-Back Guarantee", desc: "If your visa is rejected due to our error, we refund 100% of our service fee. No questions asked.", color: "from-green-500/20 to-emerald-600/5", border: "border-green-500/20", iconColor: "text-green-400" },
                            { icon: Clock, title: "72-Hour Application Start", desc: "We begin your university application within 72 hours of signing. No weeks of waiting.", color: "from-cyan-500/20 to-blue-600/5", border: "border-cyan-500/20", iconColor: "text-cyan-400" },
                            { icon: UserCheck, title: "Dedicated Personal Advisor", desc: "One advisor owns your file from Day 1 to Arrival Day. You'll always know who to call.", color: "from-blue-500/20 to-indigo-600/5", border: "border-blue-500/20", iconColor: "text-blue-400" },
                            { icon: Coins, title: "Free DSU Scholarship Filing", desc: "We file your DSU scholarship application at no extra charge — up to €7,500/year secured.", color: "from-yellow-500/20 to-orange-600/5", border: "border-yellow-500/20", iconColor: "text-yellow-400" },
                            { icon: Globe, title: "12 Countries, 200+ Programs", desc: "Access to programs across Italy, Germany, France, Spain and beyond — all in one place.", color: "from-purple-500/20 to-violet-600/5", border: "border-purple-500/20", iconColor: "text-purple-400" },
                            { icon: MessageCircle, title: "WhatsApp Updates 24/7", desc: "Real-time updates on your application status via WhatsApp. We never leave you guessing.", color: "from-green-600/20 to-teal-600/5", border: "border-green-600/20", iconColor: "text-green-300" },
                        ].map((item, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                className={`p-7 rounded-3xl bg-gradient-to-br ${item.color} border ${item.border} group hover:scale-[1.02] transition-all duration-300`}>
                                <item.icon size={28} className={`${item.iconColor} mb-5 group-hover:scale-110 transition-transform`} />
                                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-14">
                        <Button asChild size="lg" className="bg-white text-black hover:bg-cyan-400 font-bold rounded-2xl px-10 h-14">
                            <Link href="/why-us" className="flex items-center gap-2">{t.homepage?.whyUsCta || "See All Reasons"} <ArrowRight size={18} /></Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ─── COMMUNITY SECTION ─── */}
            <section className="py-28 px-6 lg:px-12 bg-[#070A12] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{t.homepage?.communityBadge || "Our Community"}</Badge>
                        <h2 className="text-4xl lg:text-5xl font-black text-white">{t.homepage?.communityTitleLine1 || "We're Not an Agency."}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">{t.homepage?.communityTitleLine2 || "We're a Family."}</span></h2>
                        <p className="text-gray-500 max-w-xl mx-auto">{t.homepage?.communityDesc || "2,400+ students who connected, supported each other, and built a network across Italian universities. Join the group."}</p>
                    </div>

                    {/* Testimonials */}
                    <div className="grid md:grid-cols-3 gap-5 mb-14">
                        {[
                            { name: "Ahmed Bensalem", avatar: "A", country: "🇹🇳", university: "Politecnico di Turin", program: "MSc Civil Engineering", year: "Class of 2023", quote: "I didn't just get a visa — I got a whole support system. The WhatsApp group from my intake still has 200+ members. We meet up at aperitivo every month.", job: "Now at Webuild, Milan" },
                            { name: "Yousra Mokhtar", avatar: "Y", country: "🇲🇦", university: "University of Bologna", program: "MSc Data Science", year: "Class of 2024", quote: "What surprised me most was that other students who went through Invict helped me during my first week. They became my best friends in Italy.", job: "Now at Reply Consulting, Bologna" },
                            { name: "Khalil Dahmani", avatar: "K", country: "🇩🇿", university: "Ca' Foscari Venice", program: "MSc Economics", year: "Class of 2023", quote: "The community group calls, the study tips from senior students, the alumni network — it doesn't feel like you paid for a service. It feels like you joined something real.", job: "Now at Deutsche Bank, Frankfurt" },
                        ].map((t, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="p-7 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-5">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="text-yellow-500 fill-yellow-500" />)}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center text-white font-bold">{t.avatar}</div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.country} {t.name}</p>
                                        <p className="text-gray-600 text-xs">{t.university} · {t.program}</p>
                                        <p className="text-cyan-400 text-xs mt-0.5">{t.job}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* WhatsApp community CTA */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-gradient-to-r from-green-900/20 to-emerald-900/10 border border-green-500/20">
                        <div className="h-16 w-16 rounded-2xl bg-green-600 flex items-center justify-center shrink-0 shadow-xl">
                            <MessageCircle size={28} className="text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-bold text-xl mb-1">{t.homepage?.communityWhatsappTitle || "Join the Community WhatsApp Group"}</h3>
                            <p className="text-gray-400 text-sm">{t.homepage?.communityWhatsappDesc || "Connect with current students, recent graduates, and incoming students before you even land in Italy."}</p>
                        </div>
                        <a href="https://wa.me/21628123456?text=Hi! I'd like to join the student community group" target="_blank" rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl px-8 py-4 transition-all flex items-center gap-2 shrink-0 text-sm">
                            <MessageCircle size={16} /> {t.homepage?.communityWhatsappBtn || "Join on WhatsApp"}
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── OUR SERVICES TEASER ─── */}
            <section className="py-32 px-6 lg:px-12 bg-[#070A12] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{t.homepage?.servicesBadge || "Our Services"}</Badge>
                        <h2 className="text-4xl lg:text-6xl font-black text-white">{t.homepage?.servicesTitleLine1 || "Everything You Need,"}<br /><span className="text-gray-500">{t.homepage?.servicesTitleLine2 || "Under One Roof"}</span></h2>
                        <p className="text-gray-500 max-w-xl mx-auto">{t.homepage?.servicesDesc || "From first discovery to your first day on campus — we handle every step."}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { number: "01", title: "Eligibility Assessment", desc: "A comprehensive 90-minute consultation to evaluate your academic background, eligibility, and the best university matches for you.", items: ["Free 90-min consultation", "University matching", "Scholarship eligibility check", "Visa pathway analysis"], badge: "Free", badgeColor: "bg-green-500/20 text-green-400" },
                            { number: "02", title: "Document Preparation", desc: "We handle CIMEA recognition, translations, apostille, and every document your application needs — completely managed.", items: ["CIMEA/DoV coordination", "Official translations", "Apostille filing", "Document authentication"], badge: "Included", badgeColor: "bg-cyan-500/20 text-cyan-400" },
                            { number: "03", title: "University Applications", desc: "We submit your application to 2-3 universities simultaneously, maximising your chances of acceptance.", items: ["Multi-university strategy", "Application portal filing", "SOP & CV writing", "Interview preparation"], badge: "Core Service", badgeColor: "bg-blue-500/20 text-blue-400" },
                            { number: "04", title: "Scholarship Filing", desc: "We file your DSU regional scholarship application — the most generous student scholarship in Europe — at no extra charge.", items: ["DSU application filing", "ISEE calculation", "Housing application", "Scholarship tracking"], badge: "Included Free", badgeColor: "bg-yellow-500/20 text-yellow-400" },
                            { number: "05", title: "Visa & Permit", desc: "Full student visa application management including pre-enrollment, Universitaly, embassy appointment, and permit di soggiorno.", items: ["Universitaly pre-enrollment", "Embassy appointment coordination", "Visa document checklist", "Permit di Soggiorno support"], badge: "End-to-End", badgeColor: "bg-purple-500/20 text-purple-400" },
                            { number: "06", title: "Pre-Departure & Landing", desc: "From airport pickup coordination to housing setup and city orientation — we ensure your first week in Italy is smooth.", items: ["Airport transfer coordination", "Accommodation setup", "Bank account opening guide", "City orientation  session"], badge: "Premium", badgeColor: "bg-pink-500/20 text-pink-400" },
                        ].map((service, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                className="p-7 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-5">
                                    <span className="text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors">{service.number}</span>
                                    <Badge className={`${service.badgeColor} border-0 text-xs`}>{service.badge}</Badge>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                                <p className="text-gray-500 text-sm mb-5 leading-relaxed">{service.desc}</p>
                                <ul className="space-y-2">
                                    {service.items.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-gray-400 text-xs">
                                            <CheckCircle2 size={12} className="text-cyan-400 shrink-0" />{item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-14">
                        <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-white font-bold rounded-2xl px-10 h-14">
                            <Link href="/eligibility" className="flex items-center gap-2">{t.hero.cta || "Start Free Assessment"} <ArrowRight size={18} /></Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* A to Z Process Section */}
            <section className="py-32 px-6 lg:px-12 bg-[#070A12]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 space-y-4">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{t.homepage?.processBadge || "The Student Journey"}</Badge>
                        <h2 className="text-4xl lg:text-5xl font-black">{t.homepage?.processTitle || "Your Path from A to Z"}</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">{t.homepage?.processDesc || "We don't just consult; we execute every step with you."}</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[100px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {[
                            { step: "01", title: "Evaluation", desc: "We analyze your grades, budget, and goals to suggest the perfect programs.", icon: Search, color: "text-cyan-400" },
                            { step: "02", title: "Admission", desc: "Expert handling of CIMEA, Universitaly, and scholarship portals.", icon: GraduationCap, color: "text-blue-500" },
                            { step: "03", title: "Visa", desc: "Stress-free appointments and document preparation for a 100% success rate.", icon: Plane, color: "text-purple-500" },
                            { step: "04", title: "Arrival", desc: "Local support for Codice Fiscale, bank accounts, and housing search.", icon: CheckCircle2, color: "text-green-500" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                                whileHover={{ y: -10 }}
                            >
                                <div className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <span className="text-sm font-black text-gray-700 group-hover:text-cyan-500/50 transition-colors uppercase tracking-[0.3em] mb-4 block">{item.step}</span>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Italy Redesigned */}
            <section className="py-32 px-6 lg:px-12 bg-[#05080E] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-6xl font-black">{t.homepage?.whyItalyTitleLine1 || "Why the Italian"} <br /><span className="text-cyan-500">{t.homepage?.whyItalyTitleLine2 || "Dream?"}</span></h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Scholarships for All", desc: "Up to €7,500/year DSU stipends covering living costs completely." },
                                    { title: "Post-Study Work", desc: "1-year work search permit after graduation in the EU." },
                                    { title: "No GRE/GMAT Required", desc: "Most universities focus on your academic GPA and profile." }
                                ].map((benefit, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mt-1">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{benefit.title}</p>
                                            <p className="text-gray-500">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button size="lg" className="rounded-full px-10 h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10">{t.homepage?.exploreUnisBtn || "Explore Universities"}</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6 pt-12">
                                <div className="aspect-square bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                                    <Users className="text-blue-500" size={32} />
                                    <p className="font-bold text-xl">500k+ <br /><span className="text-sm font-normal text-gray-500">Intl Students</span></p>
                                </div>
                                <div className="aspect-[4/5] bg-gradient-to-br from-indigo-500 to-purple-700 rounded-3xl p-6 flex flex-col justify-end">
                                    <p className="text-white font-black text-3xl">Top 10</p>
                                    <p className="text-white/60 text-xs">Global Education Destination</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="aspect-[4/5] bg-cyan-500 rounded-3xl p-6 flex flex-col justify-end text-black">
                                    <p className="font-extrabold text-4xl">€156</p>
                                    <p className="font-bold">Entry Tuition</p>
                                    <p className="text-xs opacity-70">At public varsities</p>
                                </div>
                                <div className="aspect-square bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                                    <Globe className="text-green-500" size={32} />
                                    <p className="font-bold text-xl">Schengen <br /><span className="text-sm font-normal text-gray-500">Unrestricted Travel</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials (Success Stories Preview) */}
            <section className="py-24 px-6 lg:px-12 bg-[#070A12]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-end mb-16">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">{t.homepage?.successStoriesTitle || "Student Success"}</h2>
                            <p className="text-gray-400">{t.homepage?.successStoriesDesc || "Join our alumni at Italy's most prestigious institutions."}</p>
                        </div>
                        <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">{t.homepage?.viewAllStoriesBtn || "View All Stories"}</Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Ahmed R.", school: "Politecnico di Milano", text: "Invict Academy handled everything — from my scholarship to find my flat in Milan. They are family now.", tag: "CS Master" },
                            { name: "Sarah M.", school: "University of Bologna", text: "I didn't think I could study abroad with my budget. Invict found me a full-ride scholarship and a top law program.", tag: "Law Student" },
                            { name: "Kevin L.", school: "University of Rome", text: "The visa process was so scary, but Invict organized my file so perfectly that the interview was a breeze.", tag: "MBA Candidate" }
                        ].map((t, i) => (
                            <Card key={i} className="bg-[#0B1020] border-white/10 p-8 rounded-[2rem]">
                                <div className="flex gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-yellow-500 fill-yellow-500" />)}
                                </div>
                                <p className="text-gray-300 italic mb-8">&quot;{t.text}&quot;</p>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.school}</p>
                                    </div>
                                    <Badge className="ml-auto bg-white/5 border-none text-[10px]">{t.tag}</Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Redesigned Interactive Pathways (Refined Tabs) */}
            <section className="py-32 px-6 lg:px-12 bg-gradient-to-b from-[#0B1020] to-[#070A12] border-y border-white/5">
                <div className="container mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-extrabold tracking-tight">{t.homepage?.supportPillarsTitle || "Our Support Pillars"}</h2>
                        <p className="text-gray-500 text-lg">{t.homepage?.supportPillarsDesc || "Click through our areas of expertise"}</p>
                    </div>

                    <Tabs defaultValue="admission" className="w-full max-w-5xl mx-auto">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#05080E] p-1.5 rounded-2xl mb-12 shadow-2xl">
                            <TabsTrigger value="admission" className="rounded-xl py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-bold transition-all">Admission</TabsTrigger>
                            <TabsTrigger value="scholarship" className="rounded-xl py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-black font-bold transition-all">Scholarships</TabsTrigger>
                            <TabsTrigger value="visa" className="rounded-xl py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold transition-all">Visa</TabsTrigger>
                            <TabsTrigger value="arrival" className="rounded-xl py-3 data-[state=active]:bg-green-500 data-[state=active]:text-black font-bold transition-all">Arrival</TabsTrigger>
                        </TabsList>

                        {[
                            { id: 'admission', title: "Admission Mastery", desc: "Get into top Italian universities with a profile that stands out.", steps: ["Pre-evaluation within 48h", "Universitaly Portal Management", "Program Strategy session"], color: "bg-cyan-500" },
                            { id: 'scholarship', title: "Funding Your Dream", desc: "We specialize in regional DSU scholarships and merit-based grants.", steps: ["Economic assessment (ISEE-U)", "Scholarship application tracking", "Bank document review"], color: "bg-purple-500" },
                            { id: 'visa', title: "99% Visa Approval", desc: "Submit a foolproof file to the Italian consulate every single time.", steps: ["Consulate interview prep", "Insurance & Finance validation", "Digital checklist tracking"], color: "bg-amber-500" },
                            { id: 'arrival', title: "Landed & Home", desc: "From airport pickup to finding your apartment in historic city centers.", steps: ["Permit of Stay assistance", "Local SIM and Bank setup", "Housing network access"], color: "bg-green-500" }
                        ].map((tab) => (
                            <TabsContent key={tab.id} value={tab.id}>
                                <div className="grid lg:grid-cols-5 gap-0 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
                                    <div className="lg:col-span-3 bg-[#0B1224] p-12 space-y-8">
                                        <h3 className="text-4xl font-black text-white">{tab.title}</h3>
                                        <p className="text-gray-400 text-lg leading-relaxed">{tab.desc}</p>
                                        <div className="space-y-4">
                                            {tab.steps.map((step, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <div className={`h-8 w-8 rounded-full ${tab.color} text-black flex items-center justify-center font-bold`}>{i + 1}</div>
                                                    <span className="font-semibold">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={`lg:col-span-2 ${tab.color} p-12 flex flex-col justify-between text-black`}>
                                        <div className="space-y-4">
                                            <p className="font-black text-5xl opacity-20 uppercase tracking-tighter">{tab.id}</p>
                                            <p className="text-2xl font-bold leading-tight">{t.homepage?.expertStrategyText || "Expert-level strategy for your Italian dreams."}</p>
                                        </div>
                                        <Button size="lg" className="w-fit rounded-full bg-black text-white hover:bg-gray-900 border-none px-8 font-bold">{t.homepage?.discussAdvisorBtn || "Discuss with Advisor"}</Button>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* ─── COMMUNITY TEASER ─── */}
            <section className="py-32 px-6 lg:px-12 bg-[#05080E] border-y border-white/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Copy */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest w-fit">
                                {t.homepage?.communityTeaserBadge || "Our Community"}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                                {t.homepage?.communityTeaserLine1 || "2,400+ Students."}<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{t.homepage?.communityTeaserLine2 || "One Family."}</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {t.homepage?.communityTeaserDesc || "We don't just help you get admitted — we connect you with a real community of students who've been in your shoes. Alumni from 12 countries, active WhatsApp groups in every city, and ambassadors on the ground in Italy."}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: "12+", label: "Countries" },
                                    { value: "€3M+", label: "Scholarships Won" },
                                    { value: "40+", label: "Universities" },
                                    { value: "99%", label: "Visa Success" },
                                ].map((s, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <p className="text-2xl font-black text-white">{s.value}</p>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <Link href="/community" className="inline-flex items-center gap-2 bg-white text-black font-bold rounded-2xl px-8 py-4 hover:bg-cyan-400 transition-colors text-sm">
                                {t.homepage?.meetCommunityBtn || "Meet the Community"} <ArrowRight size={16} />
                            </Link>
                        </motion.div>

                        {/* Right: Testimonial cards stack */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            {[
                                { name: "Ahmed Belhaj", flag: "🇹🇳", uni: "PoliMi — MSc Engineering", quote: "Invict made what seemed impossible completely real. From documents to visa in 8 weeks.", init: "AB", color: "border-cyan-500/20" },
                                { name: "Mariam Al-Rashid", flag: "🇲🇦", uni: "Sapienza — MSc Architecture", quote: "I got €7,200/year + free housing. I literally cried when I got the letter.", init: "MR", color: "border-purple-500/20" },
                                { name: "Yusuf Demir", flag: "🇹🇷", uni: "UniBo — MSc Data Science", quote: "I tried on my own for 2 years. In 3 months with Invict I had my acceptance letter.", init: "YD", color: "border-green-500/20" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-6 rounded-2xl bg-white/[0.03] border ${item.color} flex gap-4 items-start`}
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                                        {item.init}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-300 text-sm leading-relaxed mb-3">&quot;{item.quote}&quot;</p>
                                        <p className="text-white font-bold text-sm">{item.flag} {item.name}</p>
                                        <p className="text-cyan-400 text-xs">{item.uni}</p>
                                    </div>
                                    <div className="flex gap-0.5 shrink-0">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 px-6 lg:px-12 bg-[#070A12]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-extrabold tracking-tight">{t.homepage?.faqTitle || "Common Questions"}</h2>
                        <p className="text-gray-500">{t.homepage?.faqDesc || "Everything you need to know about Invict Academy."}</p>
                    </div>
                    <Accordion type="single" collapsible className="space-y-4">
                        {[
                            { q: "Is university in Italy actually free?", a: "Most public universities have tuition fees between €156 and €3,000. However, with the DSU scholarship which we help you apply for, many students pay €0 and even receive a living stipend of around €6,000-€7,500 per year." },
                            { q: "Do I need to speak Italian?", a: "No! There are hundreds of programs taught entirely in English in Italy. We primarily assist students applying for English-taught degrees." },
                            { q: "When should I start the process?", a: "Ideally, 6-8 months before your intended intake. For September intake, the best time to start is between December and March." },
                            { q: "What is your success rate for visas?", a: "We maintain a 99% success rate. We ensure every document is in perfect order, including financial declarations and motivation letters, before you ever step into the consulate." }
                        ].map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-2xl bg-white/[0.02] px-6">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 pb-6 text-base leading-relaxed">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Massive CTA */}
            <section className="py-40 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[#070A12] z-0" />
                <div className="max-w-7xl mx-auto text-center relative z-10 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-6xl lg:text-8xl font-black tracking-tight text-white leading-none">
                            {t.homepage?.finalCtaLine1 || "Ready to Claim"} <br />{t.homepage?.finalCtaLine2 || "Your Future?"}
                        </h2>
                        <p className="text-gray-400 text-2xl max-w-2xl mx-auto font-medium">
                            {t.homepage?.finalCtaDesc || "It starts with a simple assessment. No files needed yet."}
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-white hover:text-black font-black rounded-3xl px-16 text-2xl h-20 shadow-2xl transition-all duration-300">
                            <Link href="/eligibility">{t.homepage?.checkEligibilityBtn || "Check Eligibility Now"}</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5 rounded-3xl px-16 text-2xl h-20">
                            <Link href="/contact">{t.common.bookConsultation || "Book Consultation"}</Link>
                        </Button>
                    </div>

                    <div className="flex justify-center items-center gap-8 pt-12 grayscale opacity-30">
                        <Landmark size={40} />
                        <Globe size={40} />
                        <GraduationCap size={40} />
                        <ShieldCheck size={40} />
                    </div>
                </div>
            </section>
        </div>
    );
}
