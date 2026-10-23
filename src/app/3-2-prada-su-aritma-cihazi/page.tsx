import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/public/prada-v2/Header";
import { Hero } from "@/components/public/prada-v2/Hero";
import { Manifesto } from "@/components/public/prada-v2/Manifesto";
import { Journey } from "@/components/public/prada-v2/Journey";
import { XRay } from "@/components/public/prada-v2/XRay";
import { Bento } from "@/components/public/prada-v2/Bento";
import { Blueprint } from "@/components/public/prada-v2/Blueprint";
import { BoxContents } from "@/components/public/prada-v2/BoxContents";
import { ModelPrice } from "@/components/public/prada-v2/ModelPrice";
import { FinalCta, Footer } from "@/components/public/prada-v2/FinalCta";
import { Dock } from "@/components/public/prada-v2/Dock";
import { MotionRoot } from "@/components/public/prada-v2/MotionRoot";
import s from "@/components/public/prada-v2/v2.module.css";

// Türkçe karakterler (ş, ğ, İ) için latin-ext alt kümesi de yükleniyor.
// Yalnızca ana yazı fontu önceden yüklenir; etiket fontu hero görseliyle yarışmasın diye ihtiyaç anında iner.
const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-p2-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-p2-mono", display: "swap", preload: false });

const TITLE = "3.2 Prada Su Arıtma Cihazı | Şeffaf Kasa, 5 Aşama";
const DESCRIPTION =
  "3.2 Prada su arıtma cihazı: şeffaf kırmızı kasa, 5 aşamalı filtreleme, Cruze 80 GPD membran, 3.2 G metal tank, su kaçak sensörü ve basınç düşürücü. Bilgi için: 0553 114 27 34.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/3-2-prada-su-aritma-cihazi" },
  // Sitenin varsayılan favicon'u 178 KB'lık logo.png; bu sayfada yeni amblemin küçük sürümü kullanılıyor
  icons: {
    icon: [{ url: "/images/prada-v2/favicon-64.png", type: "image/png", sizes: "64x64" }],
    apple: "/images/prada-v2/apple-icon-180.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "SuArıtmaServis34",
    title: "3.2 Prada Su Arıtma Cihazı",
    description: DESCRIPTION,
    images: [{ url: "/images/prada-v2/og.jpg", width: 1200, height: 630, alt: "3.2 Prada su arıtma cihazı" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "3.2 Prada Su Arıtma Cihazı",
    description: DESCRIPTION,
    images: ["/images/prada-v2/og.jpg"],
  },
};

export default function PradaPage() {
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
