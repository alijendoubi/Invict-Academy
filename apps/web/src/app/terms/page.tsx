import Link from "next/link"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#070A12] text-white py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                <p className="text-gray-400 mb-8">
                    This placeholder will be replaced with the full terms of service.
                </p>
                <Link href="/" className="text-cyan-400 hover:text-cyan-300">
                    Back to home
                </Link>
            </div>
        </div>
    )
}
