import { MetadataRoute } from 'next'
import { destinations } from '@/lib/destinations'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://www.invictacademy.com'

    // Static routes
    const paths = [
        '',
        '/about',
        '/booklet',
        '/community',
        '/contact',
        '/eligibility',
        '/explore',
        '/italian-universities',
        '/services',
        '/success-stories',
        '/why-us',
        '/blog',
        '/careers',
        '/privacy',
        '/terms',
    ]

    const staticRoutes: MetadataRoute.Sitemap = paths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic destination routes from our library
    const destinationRoutes: MetadataRoute.Sitemap = []

    destinations.forEach((country) => {
        // Adding the country route
        destinationRoutes.push({
            url: `${baseUrl}/explore/${country.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        })

        country.cities?.forEach((city) => {
            // Adding the city route
            destinationRoutes.push({
                url: `${baseUrl}/explore/${country.slug}/${city.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            })

            city.universities?.forEach((uni) => {
                // Adding the university route
                destinationRoutes.push({
                    url: `${baseUrl}/explore/${country.slug}/${city.slug}/${uni.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                })
            })
        })
    })

    return [...staticRoutes, ...destinationRoutes]
}
