const SITE_URL = "https://www.suaritmaservis34.com";
const BUSINESS_ID = `${SITE_URL}/#localbusiness`;

// Helper functions for programmatic SEO schemas

// Tüm bölge sayfalarında aynı işletme varlığı (aynı @id, ad, adres ve konum) kullanılır;
// sayfaya göre değişen tek şey hizmet verilen bölgedir (areaServed).
export function generateLocalBusinessSchema(areaServed: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    "name": "SuArıtmaServis34",
    "image": `${SITE_URL}/images/su-aritma-servis34.webp`,
    "description": "Sultangazi merkezli su arıtma cihazı satışı, montajı, filtre değişimi ve teknik servis. İstanbul Avrupa Yakası'nda yerinde servis desteği.",
    "url": SITE_URL,
    "telephone": "+905531142734",
    "priceRange": "₺₺",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sultançiftliği Mah. Eski Edirne Asfaltı Cad. No:461",
      "postalCode": "34265",
      "addressLocality": "Sultangazi",
      "addressRegion": "İstanbul",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.0796,
      "longitude": 28.9092
    },
    "areaServed": {
      "@type": "Place",
      "name": areaServed
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "19:00"
    },
    "sameAs": ["https://wa.me/905531142734"]
  };
}

export function generateServiceSchema(serviceName: string, serviceDesc: string, areaServed: string, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${areaServed} ${serviceName}`,
    "serviceType": serviceName,
    "description": serviceDesc,
    "url": pageUrl,
    "provider": { "@id": BUSINESS_ID },
    "areaServed": {
      "@type": "Place",
      "name": areaServed
    }
  };
}
