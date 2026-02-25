"use client"

import * as React from "react"
import { Globe, ChevronDown, Check } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import type { SupportedLocale } from "@/lib/translations"

const LANGUAGES: { code: SupportedLocale; label: string; nativeLabel: string; flag: string }[] = [
    { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
    { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
    { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
    { code: "tr", label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷" },
    { code: "az", label: "Azerbaijani", nativeLabel: "Azərbaycan", flag: "🇦🇿" },
]

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage()
    const [open, setOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    const current = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0]

    React.useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Select language"
            >
                <Globe size={15} className="text-cyan-400" />
                <span className="hidden lg:block">{current.flag} {current.nativeLabel}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full mt-2 right-0 w-52 bg-[#0B1020] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-1">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => { setLocale(lang.code); setOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span className={locale === lang.code ? "text-cyan-400 font-semibold" : "text-gray-300"}>
                                {lang.nativeLabel}
                            </span>
                            {locale === lang.code && <Check size={14} className="text-cyan-400 ml-auto" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
