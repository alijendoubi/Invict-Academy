"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { allItalianUniversities, italianUniversitiesWithEnglish, type ItalianUniversityEntry } from "@/lib/destinations"
import {
    Search, Globe, GraduationCap, Filter, ExternalLink,
    CheckCircle2, MapPin, ChevronRight, Sparkles, Building2, BookOpen
} from "lucide-react"

const TYPE_COLORS: Record<ItalianUniversityEntry["type"], string> = {
    "Polytechnic": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "State University": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Special Institute": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Public Non-State": "bg-green-500/10 text-green-400 border-green-500/20",
}

const REGIONS = ["All", "Lombardia", "Lazio", "Campania", "Toscana", "Piemonte", "Emilia Romagna", "Veneto", "Puglia", "Sicilia", "Trentino-Alto Adige", "Liguria", "Marche", "Umbria", "Abruzzo", "Friuli Venezia Giulia", "Sardegna", "Calabria"]

export default function ItalianUniversitiesPage() {
    const [search, setSearch] = useState("")
    const [region, setRegion] = useState("All")
    const [englishOnly, setEnglishOnly] = useState(false)
    const [typeFilter, setTypeFilter] = useState<string>("All")

    const filtered = useMemo(() => {
        return allItalianUniversities.filter(u => {
            const q = search.toLowerCase()
            const matchSearch = !q || u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.nameIT.toLowerCase().includes(q)
            const matchRegion = region === "All" || u.region === region
            const matchEnglish = !englishOnly || u.englishPrograms
            const matchType = typeFilter === "All" || u.type === typeFilter
            return matchSearch && matchRegion && matchEnglish && matchType
        })
    }, [search, region, englishOnly, typeFilter])

    return (
        <div className="min-h-screen bg-[#070A12] text-white pb-24">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 border-b border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-cyan-500/6 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1.5 rounded-full text-sm font-semibold flex w-fit items-center gap-2 mb-6">
                        <Building2 size={14} /> Complete Directory · MIUR Official 2024/25
                    </Badge>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6">
                        All Italian<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Public Universities</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mb-10">
                        {allItalianUniversities.length} officially registered institutions — from ancient state universities to elite advanced schools. Filter by region, type, or English programs.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                        {[
                            { label: "Total Institutions", value: allItalianUniversities.length },
                            { label: "With English Programs", value: italianUniversitiesWithEnglish.length },
                            { label: "Regions Covered", value: "20" },
                            { label: "Special Schools", value: allItalianUniversities.filter(u => u.type === "Special Institute").length },
                        ].map((s, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                                <p className="text-2xl font-black text-cyan-400">{s.value}</p>
                                <p className="text-gray-600 text-xs mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-20 z-20 bg-[#070A12]/95 backdrop-blur-md border-b border-white/5 py-5 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name or city..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    {/* Region filter */}
                    <select
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 min-w-[160px]"
                    >
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {/* Type filter */}
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 min-w-[180px]"
                    >
                        {["All", "State University", "Polytechnic", "Special Institute", "Public Non-State"].map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    {/* English toggle */}
                    <label className="flex items-center gap-2 cursor-pointer shrink-0">
                        <div
                            onClick={() => setEnglishOnly(!englishOnly)}
                            className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${englishOnly ? "bg-cyan-500" : "bg-white/10"}`}
                        >
                            <div className={`h-4 w-4 rounded-full bg-white absolute top-1 transition-all ${englishOnly ? "left-6" : "left-1"}`} />
                        </div>
                        <span className="text-gray-400 text-sm whitespace-nowrap">English Programs Only</span>
                    </label>
                    <span className="text-gray-600 text-sm shrink-0">{filtered.length} results</span>
                </div>
            </section>

            {/* Results Grid */}
            <section className="px-6 lg:px-12 py-10 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((uni, i) => (
                        <motion.div key={uni.slug}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.02, 0.3) }}
                            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all group flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-cyan-400 transition-colors">{uni.name}</h3>
                                    <p className="text-gray-600 text-xs mt-0.5 truncate">{uni.nameIT}</p>
                                </div>
                                <Badge className={`${TYPE_COLORS[uni.type]} text-[10px] shrink-0 border`}>{uni.type.split(" ")[0]}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><MapPin size={11} />{uni.city}</span>
                                <span className="text-gray-800">·</span>
                                <span>{uni.region}</span>
                                {uni.founded && <><span className="text-gray-800">·</span><span>Est. {uni.founded}</span></>}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-3">
                                    {uni.englishPrograms && (
                                        <span className="flex items-center gap-1 text-green-400 text-xs">
                                            <CheckCircle2 size={11} /> English programs
                                        </span>
                                    )}
                                    {uni.scholarshipBody && (
                                        <span className="text-yellow-400/70 text-xs">{uni.scholarshipBody}</span>
                                    )}
                                </div>
                                <a href={uni.website} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-cyan-400 transition-colors">
                                    Website <ExternalLink size={10} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <GraduationCap size={40} className="mx-auto mb-4 opacity-30" />
                        <p>No universities match your filters. Try broadening your search.</p>
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="px-6 lg:px-12 py-16 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-black text-white mb-4">Not sure which university fits your profile?</h2>
                    <p className="text-gray-400 mb-8">Our advisors match you to the best university based on your GPA, budget, field, and scholarship eligibility — for free.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-2xl px-10 h-14">
                            <Link href="/eligibility">Get Free University Matching</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-2xl px-10 h-14">
                            <Link href="/explore/italy">Explore Italian Cities</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
