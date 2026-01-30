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

export default function Home() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const universities = [
        "Politecnico di Milano", "Sapienza University of Rome", "University of Bologna",
        "University of Padua", "University of Florence", "Politecnico di Torino",
        "University of Milan", "University of Pisa"
    ];

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
                                Ranked #1 for Italy Higher Ed in 2024
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeIn}
                            className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white"
                        >
                            Your Future in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
                                Italy Starts Here.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            className="text-xl text-gray-400 max-w-xl leading-relaxed"
                        >
                            Human guidance meets modern technology. Secure your admission, €5,000+ scholarships, and visa with absolute certainty.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row gap-5 items-center sm:items-start"
                        >
                            <Button asChild size="lg" className="bg-white text-black hover:bg-cyan-400 hover:text-black font-bold rounded-2xl px-10 text-lg h-16 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                <Link href="/eligibility" className="flex items-center gap-2">
                                    Start Free Assessment <Zap size={18} fill="currentColor" />
                                </Link>
                            </Button>
                            <div className="flex -space-x-3 items-center group cursor-pointer">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-12 w-12 rounded-full border-2 border-[#070A12] bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 group-hover:translate-x-1 transition-transform">S{i}</div>
                                ))}
                                <div className="ml-6">
                                    <p className="text-sm font-bold text-white">Join 2,400+ Students</p>
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

            {/* A to Z Process Section */}
            <section className="py-32 px-6 lg:px-12 bg-[#070A12]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 space-y-4">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">The Student Journey</Badge>
                        <h2 className="text-4xl lg:text-5xl font-black">Your Path from A to Z</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We don&apos;t just consult; we execute every step with you.</p>
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
                            <h2 className="text-4xl lg:text-6xl font-black">Why the Italian <br /><span className="text-cyan-500">Dream?</span></h2>
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
                            <Button size="lg" className="rounded-full px-10 h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10">Explore Universities</Button>
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
                            <h2 className="text-3xl font-bold">Student Success</h2>
                            <p className="text-gray-400">Join our alumni at Italy&apos;s most prestigious institutions.</p>
                        </div>
                        <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">View All Stories</Button>
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
                        <h2 className="text-4xl font-extrabold tracking-tight">Our Support Pillars</h2>
                        <p className="text-gray-500 text-lg">Click through our areas of expertise</p>
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
                                            <p className="text-2xl font-bold leading-tight">Expert-level strategy for your Italian dreams.</p>
                                        </div>
                                        <Button size="lg" className="w-fit rounded-full bg-black text-white hover:bg-gray-900 border-none px-8 font-bold">Discuss with Advisor</Button>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 px-6 lg:px-12 bg-[#070A12]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-extrabold tracking-tight">Common Questions</h2>
                        <p className="text-gray-500">Everything you need to know about Invict Academy.</p>
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
                            Ready to Claim <br />Your Future?
                        </h2>
                        <p className="text-gray-400 text-2xl max-w-2xl mx-auto font-medium">
                            It starts with a simple assessment. No files needed yet.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-white hover:text-black font-black rounded-3xl px-16 text-2xl h-20 shadow-2xl transition-all duration-300">
                            <Link href="/eligibility">Check Eligibility Now</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5 rounded-3xl px-16 text-2xl h-20">
                            <Link href="/contact">Book Consultation</Link>
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
