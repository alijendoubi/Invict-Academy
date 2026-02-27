"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
    GraduationCap, Globe, Wallet, Calendar, Bot, ChevronRight
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AIEligibilityWizard() {
    const { t } = useLanguage()
    const [step, setStep] = useState(1)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisStep, setAnalysisStep] = useState(0)
    const [submitted, setSubmitted] = useState(false)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentLevel: "",
        gpa: "",
        degreeInterest: "",
        budget: "",
        intake: "",
    })

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSelect = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value })
    }

    const startAnalysis = () => {
        setAnalyzing(true)
        setStep(5)

        // Simulate AI thinking steps
        setTimeout(() => setAnalysisStep(1), 1500)
        setTimeout(() => setAnalysisStep(2), 3000)
        setTimeout(() => setAnalysisStep(3), 4500)

        setTimeout(() => {
            setAnalyzing(false)
            submitLead()
        }, 6000)
    }

    const submitLead = async () => {
        try {
            await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    interestedDegree: formData.degreeInterest,
                    destinationInterests: ["Italy"],
                    budgetRange: formData.budget,
                    timeline: formData.intake,
                    source: "AI_WIZARD",
                    status: "NEW"
                }),
            })
            setSubmitted(true)
        } catch (error) {
            console.error("Submission failed", error)
            setSubmitted(true) // Show success anyway for UX
        }
    }

    const isValid = () => {
        if (step === 1) return formData.firstName && formData.lastName && formData.email
        if (step === 2) return formData.currentLevel && formData.gpa
        if (step === 3) return formData.degreeInterest
        if (step === 4) return formData.budget && formData.intake
        return true
    }

    return (
        <div className="min-h-screen bg-[#070A12] text-white pt-24 pb-20 px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                        <Sparkles size={14} className="animate-pulse" /> {t.eligibility.badge}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        {t.eligibility.title}
                    </h1>
                    <p className="text-gray-400 mt-2">{t.eligibility.subtitle}</p>
                </div>

                {/* Main Card */}
                <div className="bg-[#0B1020]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">

                    {/* Top Progress Bar */}
                    {step < 5 && (
                        <div className="flex gap-2 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i <= step ? "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-white/10"}`} />
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Bot className="text-cyan-400" /> {t.eligibility.step1.title}
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">{t.eligibility.step1.firstName}</label>
                                            <Input name="firstName" value={formData.firstName} onChange={handleInput} placeholder="John" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">{t.eligibility.step1.lastName}</label>
                                            <Input name="lastName" value={formData.lastName} onChange={handleInput} placeholder="Doe" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">{t.eligibility.step1.email}</label>
                                        <Input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="john@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">{t.eligibility.step1.phone}</label>
                                        <Input name="phone" value={formData.phone} onChange={handleInput} placeholder="+1234567890" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <GraduationCap className="text-cyan-400" /> {t.eligibility.step2.title}
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm text-gray-400">{t.eligibility.step2.question}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {[
                                                { id: "High School", label: t.eligibility.step2.highSchool },
                                                { id: "Bachelor's", label: t.eligibility.step2.bachelors },
                                                { id: "Master's", label: t.eligibility.step2.masters }
                                            ].map(level => (
                                                <button
                                                    key={level.id}
                                                    onClick={() => handleSelect('currentLevel', level.id)}
                                                    className={`p-4 rounded-xl border text-sm font-medium transition-all ${formData.currentLevel === level.id ? "bg-cyan-500/10 border-cyan-500 text-cyan-400" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
                                                >
                                                    {level.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">{t.eligibility.step2.gpaLabel}</label>
                                        <Input name="gpa" value={formData.gpa} onChange={handleInput} placeholder={t.eligibility.step2.gpaPlaceholder} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Globe className="text-cyan-400" /> {t.eligibility.step3.title}
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm text-gray-400">{t.eligibility.step3.question}</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: "BACHELOR", label: t.eligibility.step3.bachelorLabel, desc: t.eligibility.step3.bachelorDesc },
                                                { id: "MASTER", label: t.eligibility.step3.masterLabel, desc: t.eligibility.step3.masterDesc },
                                            ].map(deg => (
                                                <button
                                                    key={deg.id}
                                                    onClick={() => handleSelect('degreeInterest', deg.id)}
                                                    className={`p-4 rounded-xl border text-left transition-all ${formData.degreeInterest === deg.id ? "bg-cyan-500/10 border-cyan-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                                >
                                                    <div className={`font-semibold ${formData.degreeInterest === deg.id ? "text-cyan-400" : "text-white"}`}>{deg.label}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{deg.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 flex items-start gap-3">
                                        <div className="mt-0.5">💡</div>
                                        <p>{t.eligibility.step3.tip}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Wallet className="text-cyan-400" /> {t.eligibility.step4.title}
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm text-gray-400">{t.eligibility.step4.intakeLabel}</label>
                                        <Select onValueChange={(v) => handleSelect('intake', v)}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                                                <SelectValue placeholder={t.eligibility.step4.intakePlaceholder} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                                <SelectItem value="2025">September 2025</SelectItem>
                                                <SelectItem value="2026">February / September 2026</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm text-gray-400">{t.eligibility.step4.budgetLabel}</label>
                                        <Select onValueChange={(v) => handleSelect('budget', v)}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                                                <SelectValue placeholder={t.eligibility.step4.budgetPlaceholder} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0B1020] border-white/10 text-white">
                                                <SelectItem value="low">{t.eligibility.step4.budgetLow}</SelectItem>
                                                <SelectItem value="mid">{t.eligibility.step4.budgetMid}</SelectItem>
                                                <SelectItem value="high">{t.eligibility.step4.budgetHigh}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-gray-500">{t.eligibility.step4.budgetTip}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center min-h-[300px] flex flex-col justify-center">
                                {analyzing ? (
                                    <div className="space-y-8">
                                        <div className="relative w-24 h-24 mx-auto">
                                            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" />
                                            <Sparkles className="absolute inset-0 m-auto text-cyan-400 animate-pulse" size={32} />
                                        </div>
                                        <div className="space-y-3 h-20 text-sm font-medium text-cyan-400">
                                            {analysisStep === 0 && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{t.eligibility.analysis.reading} {"{ "}{formData.gpa}{" }"}</motion.p>}
                                            {analysisStep === 1 && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{t.eligibility.analysis.scanning}</motion.p>}
                                            {analysisStep === 2 && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{t.eligibility.analysis.calculating}</motion.p>}
                                            {analysisStep === 3 && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{t.eligibility.analysis.finalizing}</motion.p>}
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`space-y-6 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-bold mb-2">
                                            <CheckCircle2 size={16} /> {t.eligibility.result.badge}
                                        </div>
                                        <h2 className="text-2xl font-bold">{t.eligibility.result.title}, {formData.firstName}!</h2>

                                        <div className="space-y-3">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                                                <GraduationCap className="text-cyan-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-white">{t.eligibility.result.matchFound}</p>
                                                    <p className="text-gray-400 text-sm">{t.eligibility.result.matchDesc}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                                                <Wallet className="text-green-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-white">{t.eligibility.result.dsuEligible}</p>
                                                    <p className="text-gray-400 text-sm">{t.eligibility.result.dsuDesc}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-gray-300 mb-4 text-sm">{t.eligibility.result.savedProfile}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 text-sm font-bold" asChild>
                                                    <a href="https://calendly.com/invictacademy777" target="_blank" rel="noopener noreferrer">
                                                        <Calendar className="mr-2 h-4 w-4" /> {t.eligibility.result.bookCall}
                                                    </a>
                                                </Button>
                                                <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-sm font-bold" asChild>
                                                    <a href="https://wa.me/393477590963?text=Hi, I completed the AI Eligibility check and want to know my options!" target="_blank" rel="noopener noreferrer">
                                                        {t.eligibility.result.whatsappNow}
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {step < 5 && (
                        <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                            {step > 1 && (
                                <Button variant="outline" onClick={() => setStep(step - 1)} className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
                                    <ArrowLeft className={`h-4 w-4 ${t.dir === 'rtl' ? 'ml-2' : 'mr-2'}`} /> {t.eligibility.nav.back}
                                </Button>
                            )}
                            {step < 4 ? (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    disabled={!isValid()}
                                    className={`${t.dir === 'rtl' ? 'mr-auto' : 'ml-auto'} bg-white text-black hover:bg-gray-200`}
                                >
                                    {t.eligibility.nav.nextStep} <ArrowRight className={`h-4 w-4 ${t.dir === 'rtl' ? 'mr-2' : 'ml-2'}`} />
                                </Button>
                            ) : (
                                <Button
                                    onClick={startAnalysis}
                                    disabled={!isValid()}
                                    className={`${t.dir === 'rtl' ? 'mr-auto' : 'ml-auto'} bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all`}
                                >
                                    <Sparkles className={`h-4 w-4 ${t.dir === 'rtl' ? 'ml-2' : 'mr-2'}`} /> {t.eligibility.nav.analyze}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
