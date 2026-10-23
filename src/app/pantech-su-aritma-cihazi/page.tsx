import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/public/pantech-klasik/Header";
import { Hero } from "@/components/public/pantech-klasik/Hero";
import { Box, Filtration, Inside, LedPanel, Specs, Tankless } from "@/components/public/pantech-klasik/Sections";
import { Dock, FinalCta, Footer } from "@/components/public/pantech-klasik/Closing";
import { MotionRoot } from "@/components/public/prada-v2/MotionRoot";
import s from "@/components/public/prada-v2/v2.module.css";
import p from "@/components/public/pantech-klasik/pantech.module.css";

// Prada sayfasıyla aynı yazı sistemi; Türkçe karakterler için latin-ext dahil
const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-p2-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-p2-mono", display: "swap", preload: false });

const CANONICAL = "/pantech-su-aritma-cihazi";
const TITLE = "Pantech Tanksız Su Arıtma Cihazı | 600 GPD, LED Ekran";
const DESCRIPTION =
  "Pantech tanksız su arıtma cihazı: 600 GPD RO membran, 4 aşamalı filtreleme, dokunmatik dijital LED ekran, kompakt 38 × 15 × 47 cm gövde. Bilgi için: 0553 114 27 34.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  icons: {
    icon: [{ url: "/images/prada-v2/favicon-64.png", type: "image/png", sizes: "64x64" }],
    apple: "/images/prada-v2/apple-icon-180.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "SuArıtmaServis34",
    title: "Pantech Tanksız Su Arıtma Cihazı",
    description: DESCRIPTION,
    images: [{ url: "/images/pantech/og.jpg", width: 1200, height: 630, alt: "Pantech tanksız su arıtma cihazı" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pantech Tanksız Su Arıtma Cihazı",
    description: DESCRIPTION,
    images: ["/images/pantech/og.jpg"],
  },
};

export default function PantechKlasikPage() {
  return (
    <div className={`${sans.variable} ${mono.variable} ${s.root} ${p.theme}`}>
      <MotionRoot>
        <Header />
        <Hero />
        <Tankless />
        <Filtration />
        <LedPanel />
        <Inside />
        <Specs />
        <Box />
        <FinalCta />
        <Footer />
        <Dock />
      </MotionRoot>
    </div>
  );
}
