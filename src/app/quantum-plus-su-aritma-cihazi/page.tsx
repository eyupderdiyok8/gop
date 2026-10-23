import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight, Unbounded } from "next/font/google";
import { MotionRoot } from "@/components/public/prada-v2/MotionRoot";
import { PHONE } from "@/components/public/quantum/data";
import { Header } from "@/components/public/quantum/a/Header";
import { GucAcik } from "@/components/public/quantum/a/GucAcik";
import { CaminIcine } from "@/components/public/quantum/a/CaminIcine";
import { Panel } from "@/components/public/quantum/a/Panel";
import { AltiKapi } from "@/components/public/quantum/a/AltiKapi";
import { Mineral } from "@/components/public/quantum/a/Mineral";
import { Cevirin } from "@/components/public/quantum/a/Cevirin";
import { Hikayeler } from "@/components/public/quantum/a/Hikayeler";
import { SetKutu } from "@/components/public/quantum/a/SetKutu";
import { UcAdim } from "@/components/public/quantum/a/UcAdim";
import { Son } from "@/components/public/quantum/a/Son";
import { Footer } from "@/components/public/quantum/a/Footer";
import { Dock } from "@/components/public/quantum/a/Dock";
import s from "@/components/public/quantum/a/theme.module.css";

// Türkçe karakterler için latin-ext de yükleniyor. Yalnızca ana metin fontu önceden yüklenir;
// kelime markası (Unbounded) ve mono etiketler hero görseliyle yarışmasın diye ihtiyaç anında iner.
const sans = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-qa-sans", display: "swap" });
const display = Unbounded({ subsets: ["latin", "latin-ext"], variable: "--font-qa-display", display: "swap", preload: false });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-qa-mono", display: "swap", preload: false });

const TITLE = "Quantum Plus Dijital Su Arıtma Cihazı";
const DESCRIPTION =
  `Quantum Plus dijital su arıtma cihazı: 6 aşamalı filtreleme, 80 GPD Cruze membran, B12 vitaminli alkali mineral filtre, dijital LED ekran, TDS ve filtre takibi, dokunmatik kontrol, su kaçak sensörü. Bilgi için: ${PHONE}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/quantum-plus-su-aritma-cihazi" },
  icons: {
    icon: [{ url: "/images/prada-v2/favicon-64.png", type: "image/png", sizes: "64x64" }],
    apple: "/images/prada-v2/apple-icon-180.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "SuArıtmaServis34",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/quantum/og.jpg", width: 1200, height: 630, alt: "Quantum Plus dijital su arıtma cihazı" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/quantum/og.jpg"],
  },
};

export default function QuantumPlusPage() {
  return (
    <div className={`${sans.variable} ${display.variable} ${mono.variable} ${s.root} bg-[#F4F8FD] text-[#0B0F17]`}>
      <MotionRoot>
        <Header />
        <GucAcik />
        <CaminIcine />
        <Panel />
        <AltiKapi />
        <Mineral />
        <Cevirin />
        <Hikayeler />
        <SetKutu />
        <UcAdim />
        <Son />
        <Footer />
        <Dock />
      </MotionRoot>
    </div>
  );
}
