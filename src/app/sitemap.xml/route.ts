// /sitemap.xml: Search Console'a gönderilen adres. src/app/sitemaps/sitemap.ts'in ürettiği
// parçalı sitemap'leri (/sitemaps/sitemap/<id>.xml) listeleyen bir sitemap index döner.
const SITE_URL = "https://www.suaritmaservis34.com";
// src/app/sitemaps/sitemap.ts içindeki generateSitemaps id'leri
const SITEMAP_IDS = ["sayfalar", "blog", "urunler", "bolgeler"];

export const dynamic = "force-static";

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_IDS.map((id) => `  <sitemap><loc>${SITE_URL}/sitemaps/sitemap/${id}.xml</loc></sitemap>`).join("\n")}
</sitemapindex>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
