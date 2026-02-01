import Link from "next/link"

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-[#070A12] text-white py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">Blog</h1>
                <p className="text-gray-400 mb-8">
                    Insights, guides, and updates about studying in Italy.
                </p>
                <div className="p-8 bg-[#0B1020] border border-white/10 rounded-2xl">
                    <p className="text-gray-400">No posts yet. Check back soon.</p>
                    <Link href="/" className="inline-block mt-4 text-cyan-400 hover:text-cyan-300">
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
