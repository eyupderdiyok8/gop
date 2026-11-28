import { BUSINESS_NAME } from "@/lib/business";

const SITE_URL = "https://www.suaritmaservis34.com";

/**
 * Tanıtım sayfaları (Prada, Pantech, Quantum Plus, Headon) için Product ve BreadcrumbList işaretlemesi.
 * Fiyat sayfada yazmadığı için offers verilmez; şema yalnızca sayfada görünen bilgiyi taşır.
 */
export function LandingProductJsonLd({ name, description, path, image }: { name: string; description: string; path: string; image: string }) {
  const url = `${SITE_URL}${path}`;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#product`,
      name,
      description,
      image: `${SITE_URL}${image}`,
      url,
      category: "Su Arıtma Cihazı",
      isRelatedTo: { "@id": `${SITE_URL}/#localbusiness`, "@type": "LocalBusiness", name: BUSINESS_NAME },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Ürünler", item: `${SITE_URL}/urunler` },
        { "@type": "ListItem", position: 3, name, item: url },
      ],
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
