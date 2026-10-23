"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Ürün tanıtım sayfaları (kendi header/footer'ları var). Yeni ürün sayfası eklenince buraya da ekleyin.
const LANDING_PAGES = ["/3-2-prada-su-aritma-cihazi", "/pantech-su-aritma-cihazi", "/quantum-plus-su-aritma-cihazi"];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isRandevu = pathname.startsWith("/randevu");
  const isLogin = pathname === "/login";

  if (LANDING_PAGES.some((p) => pathname.startsWith(p))) {
    // Ürün tanıtım landing page'leri kendi header/footer'ına sahip
    return <main className="min-h-screen">{children}</main>;
  }

  if (isAdmin) {
    // Admin kendi layout'una sahip
    return <>{children}</>;
  }

  if (isRandevu || isLogin) {
    // Public randevu/login sayfası minimal görünüm
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
