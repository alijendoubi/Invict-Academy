"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, MessageCircle, Heart, Users, GraduationCap, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

// ─── Real contact data ────────────────────────────────────────
const CONTACT = {
    phoneItaly: "+39 347 7590963",
    email: "contact@invictacademy.com",
    instagram: "https://www.instagram.com/invict.academy",
    facebook: "https://www.facebook.com/invictacademy777",
    whatsapp: "https://wa.me/393477590963",
    whatsappItaly: "https://wa.me/393477590963",
    youtube: "https://www.youtube.com/@InvictAcademy",
}

const STATS = [
    { label: "Community Members", value: "2,400+", icon: Users },
    { label: "Countries Covered", value: "12+", icon: Globe },
    { label: "Graduates Placed", value: "500+", icon: GraduationCap },
    { label: "Universities", value: "200+", icon: Heart },
]

export function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="bg-[#04060F] border-t border-white/5 text-sm">
            {/* Community Stats Bar */}
            <div className="border-b border-white/5 py-10 px-4">
                <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, i) => (
                        <div key={i} className="text-center">
                            <stat.icon size={20} className="text-cyan-400 mx-auto mb-2" />
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-gray-600 text-xs uppercase tracking-widest">{t.community.stats[stat.label.split(' ')[0].toLowerCase() as keyof typeof t.community.stats] || stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="container mx-auto px-4 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand & Mission */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/Logo.png"
                                alt="Invict Academy Logo"
                                width={160}
                                height={96}
                                className="h-24 w-auto rounded-2xl object-contain"
                                style={{ width: "auto" }}
                            />
                        </Link>
                        <p className="text-gray-400 max-w-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t.footer.tagline.replace('2,400+', '<strong className="text-white">2,400+</strong>').replace('2 400+', '<strong className="text-white">2 400+</strong>') }} />
                        {/* Community testimonial snippet */}
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-bold text-sm">A</div>
                            <div>
                                <p className="text-gray-300 text-xs italic">&quot;Invict Academy isn&apos;t a service — it&apos;s a family. Still in touch with my advisor 2 years after graduation.&quot;</p>
                                <p className="text-gray-600 text-xs mt-1">— Ahmed B., PoliTo graduate, now at Stellantis Italy</p>
                            </div>
                        </div>
                        {/* Socials */}
                        <div className="flex space-x-3">
                            <SocialIcon href={CONTACT.instagram} color="from-pink-500 to-orange-400" label="Instagram">
                                <Instagram size={16} />
                            </SocialIcon>
                            <SocialIcon href={CONTACT.facebook} color="from-blue-600 to-blue-500" label="Facebook">
                                <Facebook size={16} />
                            </SocialIcon>
                            <SocialIcon href={CONTACT.youtube} color="from-red-600 to-red-500" label="YouTube">
                                <Youtube size={16} />
                            </SocialIcon>
                            <SocialIcon href={CONTACT.whatsapp} color="from-green-600 to-green-500" label="WhatsApp">
                                <MessageCircle size={16} />
                            </SocialIcon>
                        </div>
                    </div>

                    {/* Explore */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-base">{t.footer.explore}</h4>
                        <ul className="space-y-3 text-gray-400">
                            <FooterLink href="/explore">🌍 {t.nav.explore}</FooterLink>
                            <FooterLink href="/why-us">✨ {t.nav.whyUs}</FooterLink>
                            <FooterLink href="/community">👥 {t.nav.community}</FooterLink>
                            <FooterLink href="/booklet">📚 {t.nav.booklet}</FooterLink>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold text-base">{t.footer.services}</h4>
                        <ul className="space-y-3 text-gray-400">
                            <FooterLink href="/eligibility">{t.footer.links.freeEligibility}</FooterLink>
                            <FooterLink href="/services">{t.footer.links.admissions}</FooterLink>
                            <FooterLink href="/services">{t.footer.links.dsuScholarship}</FooterLink>
                            <FooterLink href="/services">{t.footer.links.visaSupport}</FooterLink>
                            <FooterLink href="/auth/login">{t.footer.links.studentPortal}</FooterLink>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-5">
                        <h4 className="text-white font-semibold text-base">{t.footer.getInTouch}</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li>
                                <div className="flex gap-3 items-start">
                                    <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin size={16} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">{t.footer.addressLabel}</p>
                                        <p className="text-gray-300 text-sm leading-snug pr-4">{t.footer.address}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="flex gap-3 items-start">
                                    <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin size={16} className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">{t.footer.italyContactLabel}</p>
                                        <a href={CONTACT.whatsappItaly} target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm hover:text-cyan-400 transition-colors block">
                                            {CONTACT.phoneItaly}
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a href={`mailto:${CONTACT.email}`}
                                    className="flex items-center gap-3 group hover:text-white transition-colors">
                                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                        <Mail size={16} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">{t.footer.links.emailUs}</p>
                                        <p className="text-white font-medium text-sm">{CONTACT.email}</p>
                                    </div>
                                </a>
                            </li>
                        </ul>

                        {/* WhatsApp CTA */}
                        <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-green-600 hover:bg-green-500 transition-colors text-white font-semibold text-sm">
                            <MessageCircle size={16} /> {t.footer.links.chatOnWhatsapp}
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <p>© {new Date().getFullYear()} Invict Academy.</p>
                        <span className="hidden md:inline">·</span>
                        <p className="hidden md:inline">Your Future, Our Mission.</p>
                    </div>
                    <div className="flex gap-6 text-xs flex-wrap justify-center md:justify-end">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link>
                        <Link href="/about" className="hover:text-white transition-colors">{t.footer.about}</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">{t.footer.contact}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialIcon({ href, color, label, children }: { href: string; color: string; label: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className={`h-10 w-10 rounded-full bg-gradient-to-br ${color} text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-110 transition-all shadow-lg`}>
            {children}
        </a>
    )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                {children}
            </Link>
        </li>
    )
}
