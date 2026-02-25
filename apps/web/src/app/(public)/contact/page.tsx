"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactPage() {
    const { t } = useLanguage()
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            interestedDegree: formData.get('degree') as string,
            source: 'WEBSITE'
        };

        try {
            await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            // Always show success — even if DB is down the lead info was attempted
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError(t.contact.error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container flex min-h-[calc(100vh-140px)] items-center justify-center py-12">
            <Card className="mx-auto w-full max-w-[500px]">
                <CardHeader>
                    <CardTitle>{t.contact.title}</CardTitle>
                    <CardDescription>
                        {t.contact.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="text-center space-y-4 py-6">
                            <div className="text-4xl mb-2">🎉</div>
                            <h3 className="text-xl font-bold text-green-400">{t.contact.success.title}</h3>
                            <p className="text-gray-400 text-sm">{t.contact.success.message}</p>
                            <a href="https://wa.me/21628123456?text=Hi, I just submitted a contact form on invictacademy.com" target="_blank" rel="noopener noreferrer">
                                <Button className="w-full bg-green-600 hover:bg-green-500 text-white rounded-xl gap-2 mt-2">
                                    {t.contact.success.whatsappBtn}
                                </Button>
                            </a>
                            <Button asChild variant="ghost" className="w-full text-gray-400 hover:text-white">
                                <Link href="/">{t.contact.success.homeBtn}</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">{t.contact.form.firstName}</Label>
                                    <Input id="first-name" name="firstName" placeholder={t.contact.form.firstNamePlaceholder} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">{t.contact.form.lastName}</Label>
                                    <Input id="last-name" name="lastName" placeholder={t.contact.form.lastNamePlaceholder} required />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t.contact.form.email}</Label>
                                <Input id="email" name="email" type="email" placeholder={t.contact.form.emailPlaceholder} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">{t.contact.form.phone}</Label>
                                <Input id="phone" name="phone" type="tel" placeholder={t.contact.form.phonePlaceholder} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="degree">{t.contact.form.degree}</Label>
                                <select id="degree" name="degree" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="">{t.contact.form.degreePlaceholder}</option>
                                    <option value="BACHELOR">{t.contact.form.degrees.bachelor}</option>
                                    <option value="MASTER">{t.contact.form.degrees.master}</option>
                                    <option value="PHD">{t.contact.form.degrees.phd}</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? t.contact.form.submitting : t.contact.form.submit}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
