export const dynamic = 'force-dynamic';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://www.invictacademy.com'
    // In the future, fetch dynamic blog posts here
    const paths = [
        '/blog'
    ]

    const urls = paths.map(route => `
  <url>
    <loc>\${baseUrl}\${route}</loc>
    <lastmod>\${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\${urls}
</urlset>`

    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate' }
    })
}
