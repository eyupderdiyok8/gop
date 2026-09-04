import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.suaritmaservis34.com"),
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  title: {
    default: "SuArıtmaServis34 | Sultangazi Su Arıtma Servisi",
    template: "%s | SuArıtmaServis34",
  },
  description:
    "Sultangazi merkezli su arıtma cihazı satışı, montaj, filtre değişimi ve teknik servis. İstanbul Avrupa Yakası'nda yerinde servis desteği.",
  keywords: [
    "suaritmagop",
    "sultangazi su arıtma",
    "sultangazi su arıtma servisi",
    "istanbul avrupa yakası su arıtma",
    "su arıtma gaziosmanpaşa",
    "su arıtma istanbul",
    "su arıtma cihazı",
    "su arıtma servisi",
    "gaziosmanpaşa su arıtma fiyatları",
    "sultangazi su arıtma montaj",
    "reverse osmosis istanbul",
    "su filtresi gaziosmanpaşa",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "SuArıtmaServis34",
    title: "SuArıtmaServis34 | Sultangazi Su Arıtma Servisi",
    description:
      "Sultangazi ve İstanbul Avrupa Yakası'nda su arıtma cihazı satışı, montaj, filtre değişimi ve teknik servis.",
    images: [
      {
        url: "https://www.suaritmaservis34.com/images/su-aritma-servis34.webp",
        width: 1200,
        height: 630,
        alt: "SuArıtmaServis34 Su Arıtma Sistemleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuArıtmaServis34 | Sultangazi Su Arıtma Servisi",
    description: "Sultangazi merkezli su arıtma cihazı, montaj, bakım ve teknik servis hizmetleri.",
    images: ["/images/su-aritma-servis34.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
