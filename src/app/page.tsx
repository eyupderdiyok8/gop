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
  "description": "Sultangazi merkezli su arıtma cihazı satışı, montajı, filtre değişimi ve teknik servis hizmetleri.",
  "url": "https://www.suaritmaservis34.com",
  "telephone": "+905531142734",
  "priceRange": "₺₺",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Sultangazi",
    "addressRegion": "İstanbul",
    "addressCountry": "TR",
    "postalCode": "34265",
    "streetAddress": "Sultançiftliği Mah. Eski Edirne Asfaltı Cad. No:461"
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
  "areaServed": [
    "Sultangazi",
    "Gaziosmanpaşa",
    "Eyüpsultan",
    "Bayrampaşa",
    "Esenler",
    "İstanbul Avrupa Yakası"
  ],
  "sameAs": [
    "https://wa.me/905531142734",
    "https://www.instagram.com/suaritmateknikservis34",
    "https://www.facebook.com/suaritmaistabulavrupa",
    "https://share.google/GFjeps99t7x2pgmNx"
  ],
};

export const metadata: Metadata = {
  title: "Sultangazi Su Arıtma Servisi ve Cihazları | SuArıtmaServis34",
  description:
    "Sultangazi merkezli ekibimizle İstanbul Avrupa Yakası'nda su arıtma cihazı satışı, montaj, filtre değişimi ve teknik servis hizmetleri.",
  alternates: {
    canonical: "/",
  },
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
      <Services />
      <Features />
      <DeviceRenewal />
      <FeaturedProducts />
      <Stats />
      <SavingsCalculator />
      <Testimonials />
      <BlogPreview />
      <CtaBand />
    </>
  );
}
