"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star, ArrowRight, MapPin, GraduationCap, Briefcase, MessageCircle } from "lucide-react"

const stories = [
    {
        name: "Ahmed Bensalem", flag: "🇹🇳", role: "MSc Civil Engineering", current: "Webuild SpA, Milan",
        dest: "Politecnico di Torino", year: "Class of 2023",
        quote: "I had two previous rejections before working with Invict. They rewrote my SOP, fixed my document translations, and coached me for the phone screening. I got admitted in 6 weeks.",
        scholarship: "DSU Grant – €6,500/yr",
    },
    {
        name: "Yousra Mokhtar", flag: "🇲🇦", role: "MSc Data Science", current: "Reply Consulting, Bologna",
        dest: "University of Bologna", year: "Class of 2024",
        quote: "The scholarship filing alone was worth the service fee. They submitted my DSU before the deadline while I was still sorting my visa. I got the full housing grant in my first year.",
        scholarship: "DSU Grant – €5,800/yr + Housing",
    },
    {
        name: "Khalil Dahmani", flag: "🇩🇿", role: "MSc Economics", current: "Deutsche Bank, Frankfurt",
        dest: "Ca' Foscari University, Venice", year: "Class of 2023",
        quote: "Most honest team I dealt with. They told me Ca' Foscari was a better fit than Bocconi given my GPA, and they were right. I graduated top of my cohort.",
        scholarship: "DSU Grant – €4,900/yr",
    },
    {
        name: "Fatou Diallo", flag: "🇸🇳", role: "BSc Architecture", current: "RPBW Studio, Genoa",
        dest: "Politecnico di Milano", year: "Class of 2022",
        quote: "I was terrified of the Italian bureaucracy. Apostille, CIMEA, Universitaly — they handled every single step. I arrived in Italy knowing everything was ready.",
        scholarship: "PoliMi Scholarship – €3,000",
    },
    {
        name: "Rami Gharbi", flag: "🇹🇳", role: "LLM International Law", current: "European Commission, Brussels",
        dest: "University of Bologna", year: "Class of 2024",
        quote: "I reached out with only 3 months before the application deadline. The team moved fast, submitted to three universities simultaneously. I got two offers.",
        scholarship: "Emilia-Romagna DSU",
    },
    {
        name: "Soraya Lamine", flag: "🇲🇦", role: "MSc Environmental Engineering", current: "Enel Green Power, Rome",
        dest: "Sapienza University of Rome", year: "Class of 2023",
        quote: "The community WhatsApp group is the hidden gem. Current students helped me find housing before I even landed. I felt like I had friends waiting for me.",
        scholarship: "Lazio Region Grant – €5,200/yr",
    },
]

const stats = [
    { value: "2,400+", label: "Students Placed" },
    { value: "97%", label: "Visa Approval Rate" },
    { value: "€2.1M+", label: "Scholarships Secured" },
    { value: "73", label: "Italian Universities" },
]

export default function SuccessStoriesPage() {
    return (
        <div className="min-h-screen bg-[#070A12] text-white">
            {/* Hero */}
            <section className="pt-28 pb-20 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        Real Students · Real Admissions
                    </Badge>
                    <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        500+ Success<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Stories</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        From Tunis to Milan, from Casablanca to Bologna — our students are building their careers across Europe.
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-14">
                        {stats.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                <p className="text-2xl font-black text-cyan-400">{s.value}</p>
                                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="px-6 pb-24 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                            <Card className="bg-[#0B1020] border-white/5 hover:border-white/10 transition-all h-full">
                                <CardContent className="p-6 flex flex-col h-full">
                                    {/* Stars */}
                                    <div className="flex gap-0.5 mb-4">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={12} className="text-yellow-500 fill-yellow-500" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <div className="relative flex-1">
                                        <Quote className="absolute -top-1 -left-1 text-white/5 h-8 w-8" />
                                        <p className="text-gray-300 text-sm leading-relaxed pl-4 italic flex-1">
                                            &ldquo;{s.quote}&rdquo;
                                        </p>
                                    </div>

                                    {/* Scholarship badge */}
                                    {s.scholarship && (
                                        <div className="mt-4 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium w-fit flex items-center gap-1.5">
                                            🏆 {s.scholarship}
                                        </div>
                                    )}

                                    {/* Profile */}
                                    <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/5">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {s.flag}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{s.name}</p>
                                            <p className="text-gray-600 text-xs flex items-center gap-1">
                                                <GraduationCap size={10} />{s.dest} · {s.year}
                                            </p>
                                            <p className="text-cyan-400 text-xs flex items-center gap-1 mt-0.5">
                                                <Briefcase size={10} />{s.current}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 text-center p-10 rounded-3xl bg-gradient-to-r from-cyan-900/20 to-blue-900/10 border border-cyan-500/20 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-white mb-3">Join our next success story</h2>
                    <p className="text-gray-400 mb-8">Start with a free eligibility assessment and find out which Italian universities you qualify for.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/eligibility">
                            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl px-8 h-12 gap-2">
                                Check My Eligibility <ArrowRight size={16} />
                            </Button>
                        </Link>
                        <a href="https://wa.me/21628123456" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 rounded-2xl px-8 h-12 gap-2">
                                <MessageCircle size={16} /> Chat on WhatsApp
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
