export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://invict.academy';
  const paths = [
    '',
    '/about',
    '/contact',
    '/eligibility-check',
    '/universities',
    '/countries',
    '/blog',
    '/booklet',
    '/community',
    '/explore',
    '/italian-universities',
    '/services',
    '/success-stories',
    '/why-us',
    '/careers',
    '/privacy',
    '/terms'
  ];

  const urls = paths.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  console.log(`[Sitemap] Generated sitemap-static.xml: ${paths.length} URLs`);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
