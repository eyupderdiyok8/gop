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
  title: {
    default: "SuArıtmaServis34 | Gaziosmanpaşa Su Arıtma Servisi",
    template: "%s | SuArıtmaServis34",
  },
  description:
    "SuArıtmaServis34: Gaziosmanpaşa ve çevre ilçelerde su arıtma cihazı satış, kurulum ve periyodik bakım hizmetleri. Hızlı servis, profesyonel montaj, garanti kapsamlı servis.",
  keywords: [
    "suaritmagop",
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
    title: "SuArıtmaServis34 | Gaziosmanpaşa Su Arıtma",
    description:
      "Gaziosmanpaşa ve çevre ilçelerde profesyonel su arıtma çözümleri. Satış, montaj ve servis.",
    images: [
      {
        url: "https://www.suaritmaservis34.com/api/og",
        width: 1200,
        height: 630,
        alt: "SuArıtmaServis34 Su Arıtma Sistemleri",
      },
    ],
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
