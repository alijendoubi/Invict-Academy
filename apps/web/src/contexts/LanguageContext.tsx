"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { en, fr, ar, tr, az } from "@/lib/translations"
import type { TranslationKeys, SupportedLocale } from "@/lib/translations"

const translations: Record<SupportedLocale, TranslationKeys> = { en, fr, ar, tr, az }

interface LanguageContextType {
    locale: SupportedLocale
    t: TranslationKeys
    setLocale: (locale: SupportedLocale) => void
}

const LanguageContext = createContext<LanguageContextType>({
    locale: "en",
    t: en,
    setLocale: () => { },
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<SupportedLocale>("en")

    useEffect(() => {
        const saved = localStorage.getItem("invict-locale") as SupportedLocale | null
        if (saved && translations[saved]) setLocaleState(saved)
    }, [])

    useEffect(() => {
        const dir = translations[locale].dir
        document.documentElement.setAttribute("dir", dir)
        document.documentElement.setAttribute("lang", locale)
        localStorage.setItem("invict-locale", locale)
    }, [locale])

    const setLocale = (l: SupportedLocale) => setLocaleState(l)

    return (
        <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
