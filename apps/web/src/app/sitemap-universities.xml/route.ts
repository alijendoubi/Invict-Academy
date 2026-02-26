import { destinations } from '@/lib/destinations';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const baseUrl = 'https://invict.academy';
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 40000;

    // Extract universities from destinations
    const universities: any[] = [];
    destinations.forEach((country) => {
        country.cities?.forEach((city) => {
            city.universities?.forEach((uni) => {
                universities.push(uni);
            });
        });
    });

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUnis = universities.slice(start, end);

    let urls = '';
    paginatedUnis.forEach((uni) => {
        urls += `
  <url>
    <loc>${baseUrl}/universities/${uni.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    console.log(`[Sitemap] Generated sitemap-universities.xml: ${paginatedUnis.length} URLs (Page ${page})`);

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
    });
}
