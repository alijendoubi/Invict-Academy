import Link from "next/link"

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-[#070A12] text-white py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">Careers</h1>
                <p className="text-gray-400 mb-8">
                    Join our mission to expand access to education abroad.
                </p>
                <div className="p-8 bg-[#0B1020] border border-white/10 rounded-2xl">
                    <p className="text-gray-400">No open roles at the moment.</p>
                    <Link href="/contact" className="inline-block mt-4 text-cyan-400 hover:text-cyan-300">
                        Contact us
                    </Link>
                </div>
            </div>
        </div>
    )
}
