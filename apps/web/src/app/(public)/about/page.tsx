import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, Shield, Award } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#070A12] text-white">
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Bridging Ambition and Opportunity</h1>
                    <p className="text-xl text-gray-400">Invict Academy was founded with a single mission: to democratize access to world-class education for talented students worldwide.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Our Story</h2>
                        <p className="text-gray-400 leading-relaxed">
                            It started with a simple observation: thousands of brilliant students fail to study abroad not because of a lack of talent, but because of complex bureaucracy, confusing visa processes, and hidden application strategies.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            We gathered a team of former admissions officers, scholarship winners, and visa experts to change this. Today, we have helped over 500 students secure spots in top universities across France, Germany, Canada, and beyond.
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 h-[400px] flex items-center justify-center">
                        <p className="text-gray-500 italic">[Team Photo / Office Image]</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-24">
                    {[
                        { icon: Users, title: "Student-Fist", desc: "Your goals drive our strategy. No generic advice." },
                        { icon: Target, title: "Result-Oriented", desc: "98% visa success rate. We focus on outcomes." },
                        { icon: Shield, title: "Transparency", desc: "No hidden fees. Honest eligibility assessments." },
                        { icon: Award, title: "Excellence", desc: "We aim for top-tier universities, not just any offer." },
                    ].map((item, i) => (
                        <div key={i} className="p-6 bg-[#0B1020] rounded-xl border border-white/10 text-center">
                            <item.icon className="mx-auto h-10 w-10 text-cyan-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-3xl p-12 text-center border border-white/10">
                    <h2 className="text-3xl font-bold mb-6">Meet the Experts</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">Our team consists of alumni from Sorbonne, TU Munich, and McGill University.</p>
                    <Button asChild>
                        <Link href="/contact">Talk to an Expert</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
