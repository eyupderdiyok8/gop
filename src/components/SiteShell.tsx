"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isRandevu = pathname.startsWith("/randevu");
  const isLogin = pathname === "/login";

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
