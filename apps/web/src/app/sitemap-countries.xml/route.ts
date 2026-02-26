import { destinations } from '@/lib/destinations';

export const dynamic = 'force-dynamic';

export async function GET() {
    const baseUrl = 'https://invict.academy';
    let urls = '';

    destinations.forEach((country) => {
        urls += `
  <url>
    <loc>${baseUrl}/countries/${country.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log(`[Sitemap] Generated sitemap-countries.xml: ${destinations.length} URLs`);

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
    });
}
