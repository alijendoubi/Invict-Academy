import { Metadata } from 'next'
import { getUniversity } from '@/lib/destinations'
import { notFound } from 'next/navigation'
import Schema from '@/components/Schema'

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://www.invictacademy.com'

interface Props {
    params: Promise<{ country: string; city: string; university: string }>;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
    const p = await params;
    const uni = getUniversity(p.country, p.city, p.university);

    if (!uni) {
        return { title: 'Not Found' }
    }

    const canonicalUrl = `${DOMAIN}/explore/${p.country}/${p.city}/${p.university}`;

    return {
        title: `${uni.name} - Admissions, Tuition & Programs | Invict Academy`,
        description: `Learn about admissions, tuition fees, programs, and scholarships for international students at ${uni.name} in ${p.city}, ${p.country}.`,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${uni.name} - Study in ${p.country}`,
            description: uni.overview,
            url: canonicalUrl,
            type: 'website',
        }
    }
}

export default async function UniversityLayout({ params, children }: Props) {
    const p = await params;
    const uni = getUniversity(p.country, p.city, p.university);

    if (!uni) return notFound();

    const eduSchema = {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        "name": uni.name,
        "url": `${DOMAIN}/explore/${p.country}/${p.city}/${p.university}`,
        "description": uni.overview,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": p.country,
            "addressLocality": p.city
        },
        "sameAs": uni.website ? [uni.website] : []
    };

    return (
        <>
            <Schema schema={eduSchema} />
            {children}
        </>
    )
}
