"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"
import { useLanguage } from "@/contexts/LanguageContext"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const pathname = usePathname()
    const { t } = useLanguage()

    const navItems = [
        { name: t.nav.services, href: "/services" },
        { name: t.nav.explore, href: "/explore" },
        { name: t.nav.whyUs, href: "/why-us" },
        { name: t.nav.community, href: "/community" },
        { name: t.nav.booklet, href: "/booklet" },
        { name: t.nav.universities, href: "/italian-universities" },
        { name: t.nav.about, href: "/about" },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-[80px] flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/Logo.png"
                        alt="Invict Academy Logo"
                        width={80}
                        height={80}
                        priority
                        className="h-[70px] rounded-xl object-contain hover:scale-105 transition-transform duration-300"
                        style={{ width: "auto" }}
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "px-3 py-2 text-sm font-medium rounded-full transition-colors",
                                pathname === item.href
                                    ? "text-white bg-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <LanguageSwitcher />
                    <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-2">
                        {t.nav.login}
                    </Link>
                    <Link
                        href="/eligibility"
                        className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-full px-5 py-2 text-sm transition-colors"
                    >
                        {t.nav.startFree}
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                        className="p-2 text-gray-400 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-white/5 bg-background px-4 py-6 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="pt-4 flex flex-col space-y-3 border-t border-white/5">
                        <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-center text-gray-400 hover:text-white border border-white/10 rounded-xl">
                            {t.nav.login}
                        </Link>
                        <Link href="/eligibility" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-center bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700">
                            {t.nav.startFree}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
