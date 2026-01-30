import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#05080E] border-t border-white/5 pt-16 pb-8 text-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <img
                                src="/Logo.png"
                                alt="Invict Academy Logo"
                                className="h-24 w-auto rounded-2xl object-contain mb-8"
                            />
                        </Link>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            We empower ambitious students to access world-class education. From university admission to visa approval and settling in, we are your dedicated partners in this life-changing journey.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={<Instagram size={18} />} href="#" />
                            <SocialIcon icon={<Facebook size={18} />} href="#" />
                            <SocialIcon icon={<Linkedin size={18} />} href="#" />
                            <SocialIcon icon={<Twitter size={18} />} href="#" />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-base">Services</h4>
                        <ul className="space-y-3 text-gray-400">
                            <FooterLink href="/services/admissions">University Admissions</FooterLink>
                            <FooterLink href="/services/scholarships">Scholarships</FooterLink>
                            <FooterLink href="/services/visa">Visa Support</FooterLink>
                            <FooterLink href="/services/arrival">Arrival & Housing</FooterLink>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-base">Company</h4>
                        <ul className="space-y-3 text-gray-400">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/success-stories">Success Stories</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-base">Contact</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                                <span>123 Education Lane,<br />Knowledge City, 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-cyan-500 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-cyan-500 shrink-0" />
                                <span>admissions@invict.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Invict Academy. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a href={href} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-black transition-all">
            {icon}
        </a>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-cyan-400 transition-colors">
                {children}
            </Link>
        </li>
    )
}
