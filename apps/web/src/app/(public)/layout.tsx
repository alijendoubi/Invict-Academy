import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ChatWidget } from "@/components/chat/ChatWidget"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen relative flex flex-col">
            <Navbar />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />
            <ChatWidget />
        </div>
    )
}
