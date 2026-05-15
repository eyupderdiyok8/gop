// Helper functions for programmatic SEO schemas

export function generateLocalBusinessSchema(locationName: string, serviceName?: string, lat?: number, lng?: number, ratingScore?: number, reviewCount?: number) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `SuArıtmaServis34 ${locationName} ${serviceName ? serviceName : 'Su Arıtma Servisi'}`,
    "image": "https://www.suaritmaservis34.com/og-image.jpg",
    "description": `${locationName} bölgesinde güvenilir, 7/24 hizmetinizde su arıtma çözümleri. Gaziosmanpaşa ve tüm İstanbul'a aynı gün servis.`,
    "url": "https://www.suaritmaservis34.com",
    "telephone": "+905531142734",
    "priceRange": "₺₺",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": locationName,
      "addressRegion": "İstanbul",
      "addressCountry": "TR"
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
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  if (lat && lng) {
    schema["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": lat,
      "longitude": lng
    };
  }

  // AggregateRating for massive CTR boost
  if (ratingScore && reviewCount) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": ratingScore,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return schema;
}

export function generateServiceSchema(serviceName: string, serviceDesc: string, providerName: string, areaServed: string, ratingScore?: number, reviewCount?: number) {
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

  if (ratingScore && reviewCount) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": ratingScore,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return schema;
}
