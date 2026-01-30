"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { LeadsService } from "@/lib/services/leads"

export default function ContactPage() {
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
            await LeadsService.create(data);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container flex min-h-[calc(100vh-140px)] items-center justify-center py-12">
            <Card className="mx-auto w-full max-w-[500px]">
                <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>
                        Fill out the form below to get started with your study abroad journey.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-bold text-green-600">Thank you!</h3>
                            <p>We have received your information and will contact you shortly.</p>
                            <Button asChild className="w-full">
                                <Link href="/">Back to Home</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" name="firstName" placeholder="John" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" name="lastName" placeholder="Doe" required />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" type="tel" placeholder="+1234567890" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="degree">Interested Degree</Label>
                                <select id="degree" name="degree" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="">Select Degree...</option>
                                    <option value="BACHELOR">Bachelor</option>
                                    <option value="MASTER">Master</option>
                                    <option value="PHD">PhD</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
