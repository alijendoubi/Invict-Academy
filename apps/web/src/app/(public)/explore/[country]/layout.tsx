import { Metadata } from 'next'
import { getCountry } from '@/lib/destinations'
import Schema from '@/components/Schema'

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://www.invictacademy.com'

interface Props {
    params: Promise<{ country: string }>;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
    const p = await params;
    const countryData = getCountry(p.country);

    if (!countryData) {
        return { title: 'Not Found' }
    }

    const canonicalUrl = `${DOMAIN}/explore/${p.country}`;

    return {
        title: `Study in ${countryData.name} - Universities & Scholarships | Invict Academy`,
        description: `Complete guide to studying in ${countryData.name}. Find English-taught programs, tuition fees, and scholarship opportunities for international students.`,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `Study in ${countryData.name} - Complete Guide`,
            description: countryData.overview,
            url: canonicalUrl,
            type: 'website',
        }
    }
}

export default async function CountryLayout({ params, children }: Props) {
    const p = await params;
    const countryData = getCountry(p.country);

    if (!countryData) return <>{children}</>;

    const countrySchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Study in ${countryData.name}`,
        "description": countryData.overview,
        "url": `${DOMAIN}/explore/${p.country}`,
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Explore",
                "item": `${DOMAIN}/explore`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": countryData.name,
                "item": `${DOMAIN}/explore/${p.country}`
            }
        ]
    };

    return (
        <>
            <Schema schema={countrySchema} />
            <Schema schema={breadcrumbSchema} />
            {children}
        </>
    )
}
