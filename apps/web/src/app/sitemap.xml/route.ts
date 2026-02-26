export const dynamic = 'force-dynamic';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://www.invictacademy.com'
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>\${baseUrl}/sitemap-static.xml</loc>
    <lastmod>\${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>\${baseUrl}/sitemap-countries.xml</loc>
    <lastmod>\${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>\${baseUrl}/sitemap-universities.xml</loc>
    <lastmod>\${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`
    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate' }
    })
}
