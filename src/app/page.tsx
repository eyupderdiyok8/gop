import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { SavingsCalculator } from "@/components/sections/SavingsCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SuArıtmaServis34 | Gaziosmanpaşa Su Arıtma Satış, Montaj, Servis",
  description:
    "Gaziosmanpaşa ve çevre İstanbul ilçelerinde ev ve ofis tipi su arıtma cihazı satış, montaj ve periyodik bakım hizmetleri. Fiyat teklifi için hemen arayın.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
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
