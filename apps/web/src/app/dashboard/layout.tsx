"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard, Users, UserCircle, FileText,
    Settings, LogOut, Menu, X, GraduationCap,
    Briefcase, DollarSign, Bell
} from "lucide-react"
import { useState, useEffect } from "react"

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/dashboard/leads", icon: UserCircle },
    { name: "Students", href: "/dashboard/students", icon: GraduationCap },
    { name: "Applications", href: "/dashboard/applications", icon: FileText },
    { name: "Associates", href: "/dashboard/associates", icon: Briefcase },
    { name: "Payments", href: "/dashboard/payments", icon: DollarSign },
    { name: "Users", href: "/dashboard/users", icon: Users },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user/profile")
                const data = await res.json()
                setUser(data)
            } catch (error) {
                console.error("Failed to fetch user, using demo profile:", error)
                setUser({
                    firstName: "Demo",
                    lastName: "Administrator",
                    email: "admin@invict.academy",
                    role: "ADMIN"
                })
            }
        }
        fetchUser()
    }, [])

    const filteredNavigation = navigation.filter(item => {
        if (!user) return false
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true

        // Student view
        const studentRoutes = ['Overview', 'Applications', 'Payments']
        return studentRoutes.includes(item.name)
    })

    return (
        <div className="min-h-screen bg-[#070A12]">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-64 bg-[#0B1020] border-r border-white/10 transition-transform lg:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <Image
                                src="/Logo.png"
                                alt="Invict Academy Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto rounded-lg object-contain"
                            />
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {filteredNavigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-cyan-500/10 text-cyan-400"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-semibold uppercase">
                                {user?.firstName?.[0]}{user?.lastName?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                            <Link
                                href="/login"
                                onClick={() => {
                                    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                                    window.location.href = "/login"
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-[#0B1020]/80 backdrop-blur-md border-b border-white/10">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-cyan-500 rounded-full" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
