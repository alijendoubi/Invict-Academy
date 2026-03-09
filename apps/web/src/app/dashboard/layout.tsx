"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard, Users, UserCircle, FileText,
    Settings, LogOut, Menu, X, GraduationCap,
    Briefcase, DollarSign, Bell, QrCode, MessageSquare,
    FileCheck2, UserPlus, MessageCircle, AlertTriangle, CheckCircle2
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

const NOTIF_ICONS: Record<string, any> = {
    MESSAGE: MessageCircle,
    DOCUMENT: FileCheck2,
    LEAD: UserPlus,
    STUDENT: UserCircle,
    SUCCESS: CheckCircle2,
    WARNING: AlertTriangle,
}

const NOTIF_COLORS: Record<string, string> = {
    MESSAGE: "text-cyan-400 bg-cyan-500/10",
    DOCUMENT: "text-purple-400 bg-purple-500/10",
    LEAD: "text-blue-400 bg-blue-500/10",
    STUDENT: "text-green-400 bg-green-500/10",
    SUCCESS: "text-green-400 bg-green-500/10",
    WARNING: "text-yellow-400 bg-yellow-500/10",
}

function timeAgo(ts: string) {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
    if (diff < 1) return "Just now"
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
}

function NotificationBell() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<any[]>([])
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetch("/api/notifications")
            .then(r => r.json())
            .then(d => Array.isArray(d) ? setNotifications(d) : [])
            .catch(() => { })
    }, [])

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-cyan-500 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <p className="text-white font-bold text-sm">Notifications</p>
                        {unreadCount > 0 && (
                            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center text-gray-600 text-sm">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                No notifications
                            </div>
                        ) : (
                            notifications.map(n => {
                                const Icon = NOTIF_ICONS[n.type] || Bell
                                const colorClass = NOTIF_COLORS[n.type] || "text-gray-400 bg-white/5"
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => { setOpen(false); router.push(n.href || "/dashboard") }}
                                        className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3 ${!n.read ? "bg-cyan-500/5" : ""
                                            }`}
                                    >
                                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                            <Icon size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${!n.read ? "text-white" : "text-gray-300"}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{n.body}</p>
                                            <p className="text-xs text-gray-700 mt-1">{timeAgo(n.createdAt)}</p>
                                        </div>
                                        {!n.read && <div className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["all"] },
    { name: "Leads", href: "/dashboard/leads", icon: UserCircle, roles: ["ADMIN", "SUPER_ADMIN", "STAFF"] },
    { name: "Students", href: "/dashboard/students", icon: GraduationCap, roles: ["ADMIN", "SUPER_ADMIN", "STAFF"] },
    { name: "Student Management", href: "/dashboard/admin/students", icon: MessageSquare, roles: ["ADMIN", "SUPER_ADMIN", "STAFF"] },
    { name: "Applications", href: "/dashboard/applications", icon: FileText, roles: ["all"] },
    { name: "Associates", href: "/dashboard/associates", icon: Briefcase, roles: ["ADMIN", "SUPER_ADMIN"] },
    { name: "Payments", href: "/dashboard/payments", icon: DollarSign, roles: ["all"] },
    { name: "QR Analytics", href: "/dashboard/admin/qr-analytics", icon: QrCode, roles: ["ADMIN", "SUPER_ADMIN"] },
    { name: "Users", href: "/dashboard/users", icon: Users, roles: ["ADMIN", "SUPER_ADMIN"] },
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
        if (item.roles.includes("all")) return true
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true
        if (user.role === 'STAFF' && item.roles.includes('STAFF')) return true
        return false
    })

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-64 bg-card border-r border-white/10 transition-transform lg:translate-x-0",
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
                            <button
                                onClick={async () => {
                                    try {
                                        await fetch('/api/auth/logout', { method: 'POST' });
                                    } catch (error) {
                                        console.error('Logout failed:', error);
                                    } finally {
                                        window.location.href = "/auth/login";
                                    }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-white/10">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-4">
                            <NotificationBell />
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
