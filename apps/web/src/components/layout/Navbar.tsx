"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const pathname = usePathname()

    const navItems = [
        { name: "Services", href: "/services" },
        { name: "Success Stories", href: "/success-stories" },
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#070A12]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-[120px] flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <img
                        src="/Logo.png"
                        alt="Invict Academy Logo"
                        className="h-[110px] w-[110px] rounded-xl object-contain hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
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
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Log in
                    </Link>
                    <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-full px-6">
                        <Link href="/eligibility">Check Eligibility</Link>
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-[#070A12] px-4 py-6 space-y-4 animate-accordion-down">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="pt-4 flex flex-col space-y-3">
                        <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-center text-gray-400 hover:text-white border border-white/10 rounded-lg">
                            Log in
                        </Link>
                        <Link href="/eligibility" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-center bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700">
                            Check Eligibility
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
