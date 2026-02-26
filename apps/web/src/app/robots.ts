import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://invict.academy';

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
