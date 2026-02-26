import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://www.invictacademy.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/api/',
                '/auth/',
                '/admin/',
                '/search',
                '/*?*filter=',
                '/*?*sort='
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
