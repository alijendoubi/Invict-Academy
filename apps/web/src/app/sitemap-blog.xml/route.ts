export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://invict.academy';
  // In the future, fetch dynamic blog posts here
  const paths = [
    '/blog'
  ];

  const urls = paths.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  console.log(`[Sitemap] Generated sitemap-blog.xml: ${paths.length} URLs`);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
