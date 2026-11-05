import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Services } from "@/components/sections/Services";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Testimonials } from "@/components/sections/Testimonials";
import { getInstallations } from "@/lib/installations/getInstallations";
import { LocationMap } from "@/components/sections/LocationMap";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { SavingsCalculator } from "@/components/sections/SavingsCalculator";
import { DeviceRenewal } from "@/components/sections/DeviceRenewal";
import { ServiceAreaLinks } from "@/components/seo/ServiceAreaLinks";
import type { Metadata } from "next";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.suaritmaservis34.com/#localbusiness",
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
    "latitude": 41.0918729,
    "longitude": 28.8640545
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
    "https://share.google/WT0lMbUXynTZeGOZ6"
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

export default async function HomePage() {
  const installations = await getInstallations().catch(() => undefined);
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
      <SavingsCalculator />
      <Testimonials installations={installations} />
      <BlogPreview />
      <ServiceAreaLinks />
      <LocationMap />
      <CtaBand />
    </>
  );
}
