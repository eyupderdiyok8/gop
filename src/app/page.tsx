import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { SavingsCalculator } from "@/components/sections/SavingsCalculator";
import { DeviceRenewal } from "@/components/sections/DeviceRenewal";
import type { Metadata } from "next";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SuArıtmaServis34",
  "image": "https://www.suaritmaservis34.com/logo.png",
  "description": "Gaziosmanpaşa ve çevre ilçelerde su arıtma cihazı satışı, montajı ve periyodik bakım hizmetleri.",
  "url": "https://www.suaritmaservis34.com",
  "telephone": "+905531142734",
  "priceRange": "₺₺",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Gaziosmanpaşa",
    "addressRegion": "İstanbul",
    "addressCountry": "TR",
    "streetAddress": "Bağlarbaşı Mh. Adsız Nefer Cd. No:62"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.0796,
    "longitude": 28.9092
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "19:00"
    }
  ],
  "sameAs": [
    "https://wa.me/905531142734"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "240",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const metadata: Metadata = {
  title: "SuArıtmaServis34 | Gaziosmanpaşa Su Arıtma Satış, Montaj, Servis",
  description:
    "Gaziosmanpaşa ve çevre İstanbul ilçelerinde ev ve ofis tipi su arıtma cihazı satış, montaj ve periyodik bakım hizmetleri. Fiyat teklifi için hemen arayın.",
};

export default function HomePage() {
  return (
    <>
      <script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Hero />
      <DeviceRenewal />
      <Features />
      <FeaturedProducts />
      <Services />
      <Stats />
      <SavingsCalculator />
      <Testimonials />
      <BlogPreview />
      <CtaBand />
    </>
  );
}
