import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const stories = [
    { name: "Sarah B.", dest: "Sorbonne University, France", program: "Master in Economics", quote: "Invict made the impossible possible. I got rejected twice before applying with them. Their edit of my motivation letter made all the difference." },
    { name: "Ahmed K.", dest: "TU Berlin, Germany", program: "BSc Computer Science", quote: "The visa process for Germany is a nightmare, but the team prepared my file so well that my interview lasted only 5 minutes. Highly recommended." },
    { name: "Lina M.", dest: "McGill University, Canada", program: "Master of Management", quote: "They helped me secure a €10,000 scholarship which covered almost half my tuition. The ROI on their service is insane." },
    { name: "Youssef T.", dest: "Politecnico di Milano, Italy", program: "MSc Architecture", quote: "Professional, responsive, and honest. They told me exactly what I could aim for and didn't give false hope." },
]

export default function SuccessStoriesPage() {
    return (
        <div className="min-h-screen bg-[#070A12] text-white py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
                    <p className="text-gray-400 text-lg">Real students, real admissions, real results.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {stories.map((story, i) => (
                        <Card key={i} className="bg-[#0B1020] border-white/10 p-6 relative">
                            <Quote className="absolute top-6 right-6 text-white/5 h-12 w-12" />
                            <CardContent className="space-y-4 pt-4">
                                <p className="text-gray-300 italic text-lg">"{story.quote}"</p>
                                <div className="border-t border-white/5 pt-4">
                                    <div className="font-bold text-white">{story.name}</div>
                                    <div className="text-cyan-400 text-sm">{story.dest}</div>
                                    <div className="text-gray-600 text-xs">{story.program}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
