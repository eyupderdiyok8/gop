const SITE_URL = "https://www.suaritmaservis34.com";

// Helper functions for programmatic SEO schemas

export function generateLocalBusinessSchema(locationName: string, serviceName?: string, lat?: number, lng?: number) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `SuArıtmaServis34 ${locationName} ${serviceName ? serviceName : 'Su Arıtma Servisi'}`,
    "@id": `${SITE_URL}/#localbusiness`,
    "image": `${SITE_URL}/images/su-aritma-servis34.webp`,
    "description": `${locationName} bölgesinde güvenilir, 7/24 hizmetinizde su arıtma çözümleri. Gaziosmanpaşa ve tüm İstanbul'a aynı gün servis.`,
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
    "areaServed": {
      "@type": "Place",
      "name": locationName
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "19:00"
    },
    "sameAs": ["https://wa.me/905531142734"]
  };

  if (lat && lng) {
    schema["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": lat,
      "longitude": lng
    };
  }

  return schema;
}

export function generateServiceSchema(serviceName: string, serviceDesc: string, providerName: string, areaServed: string) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": serviceDesc,
    "provider": {
      "@type": "LocalBusiness",
      "name": providerName,
      "telephone": "+905531142734",
      "url": "https://www.suaritmaservis34.com"
    },
    "areaServed": {
      "@type": "Place",
      "name": areaServed
    }
  };

  return schema;
}
