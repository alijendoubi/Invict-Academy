import { Metadata } from 'next'
import { getUniversity } from '@/lib/destinations'
import { notFound } from 'next/navigation'
import Schema from '@/components/Schema'

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://www.invictacademy.com'

interface Props {
    params: { country: string; city: string; university: string };
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
    const uni = getUniversity(params.country, params.city, params.university);

    if (!uni) {
        return { title: 'Not Found' }
    }

    const canonicalUrl = `${DOMAIN}/explore/${params.country}/${params.city}/${params.university}`;

    return {
        title: `${uni.name} - Admissions, Tuition & Programs | Invict Academy`,
        description: `Learn about admissions, tuition fees, programs, and scholarships for international students at ${uni.name} in ${params.city}, ${params.country}.`,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${uni.name} - Study in ${params.country}`,
            description: uni.overview,
            url: canonicalUrl,
            type: 'website',
        }
    }
}

export default function UniversityLayout({ params, children }: Props) {
    const uni = getUniversity(params.country, params.city, params.university);

    if (!uni) return notFound();

    const eduSchema = {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        "name": uni.name,
        "url": `${DOMAIN}/explore/${params.country}/${params.city}/${params.university}`,
        "description": uni.overview,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": params.country,
            "addressLocality": params.city
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
