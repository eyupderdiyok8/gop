import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/public/headon/Header";
import { Hero } from "@/components/public/headon/Hero";
import { Manifesto } from "@/components/public/headon/Manifesto";
import { Journey } from "@/components/public/headon/Journey";
import { XRay } from "@/components/public/headon/XRay";
import { Bento } from "@/components/public/headon/Bento";
import { Blueprint } from "@/components/public/headon/Blueprint";
import { BoxContents } from "@/components/public/headon/BoxContents";
import { ModelPrice } from "@/components/public/headon/ModelPrice";
import { FinalCta, Footer } from "@/components/public/headon/FinalCta";
import { Dock } from "@/components/public/headon/Dock";
import { MotionRoot } from "@/components/public/headon/MotionRoot";
import s from "@/components/public/headon/v2.module.css";

// Türkçe karakterler (ş, ğ, İ) için latin-ext alt kümesi de yükleniyor.
// Yalnızca ana yazı fontu önceden yüklenir; etiket fontu hero görseliyle yarışmasın diye ihtiyaç anında iner.
const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-p2-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-p2-mono", display: "swap", preload: false });

const TITLE = "Headon Su Arıtma Cihazı | 5 Aşama, 2.2 G Metal Tank";
const DESCRIPTION =
  "Headon su arıtma cihazı: mat beyaz kompakt kasa, 5 aşamalı filtreleme (Phantex sediment, GAC, CTO, Headon 80 GPD membran, Easywell post karbon), 2.2 G metal tank, su kaçak sensörü, basınç düşürücü, lüks musluk; pompalı ve pompasız. Bilgi için: 0553 114 27 34.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/headon-su-aritma-cihazi" },
  // Sitenin varsayılan favicon'u 178 KB'lık logo.png; bu sayfada yeni amblemin küçük sürümü kullanılıyor
  icons: {
    icon: [{ url: "/images/prada-v2/favicon-64.png", type: "image/png", sizes: "64x64" }],
    apple: "/images/prada-v2/apple-icon-180.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "SuArıtmaServis34",
    title: "Headon Su Arıtma Cihazı",
    description: DESCRIPTION,
    images: [{ url: "/images/headon/headon-su-aritma-cihazi-og.jpg", width: 1200, height: 630, alt: "Headon su arıtma cihazı" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Headon Su Arıtma Cihazı",
    description: DESCRIPTION,
    images: ["/images/headon/headon-su-aritma-cihazi-og.jpg"],
  },
};

export default function HeadonPage() {
  return (
    <div className={`${sans.variable} ${mono.variable} ${s.root}`}>
      <MotionRoot>
        <Header />
        <Hero />
        <Manifesto />
        <Journey />
        <XRay />
        <Bento />
        <Blueprint />
        <BoxContents />
        <ModelPrice />
        <FinalCta />
        <Footer />
        <Dock />
      </MotionRoot>
    </div>
  );
}
