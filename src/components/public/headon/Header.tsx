"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE, TEL } from "./contact";
import s from "./v2.module.css";

const LINKS = [
  { href: "#yolculuk", label: "Yolculuk" },
  { href: "#ic-gorunum", label: "İçini Gör" },
  { href: "#detaylar", label: "Detaylar" },
  { href: "#olculer", label: "Ölçüler" },
  { href: "#kutu", label: "Kutu" },
  { href: "#iletisim", label: "İletişim" },
];

export function Header() {
  const [solid, setSolid] = useState(false);

  // Dinleyici bileşen yerleştikten sonra bağlanır; yükleme sırasında durum güncellemesi olmaz
  useEffect(() => {
    const update = () => setSolid(window.scrollY > 24);
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
        solid ? "border-white/[0.07] bg-[#050505]/85 backdrop-blur-md" : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10">
        <Link href="/" prefetch={false} aria-label="Su Arıtma Teknik Servis ana sayfa" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/prada-v2/logo-amblem.webp"
            alt=""
            width={320}
            height={226}
            loading="eager"
            className="h-9 w-auto md:h-10"
          />
          <Image
            src="/images/prada-v2/logo-isim.webp"
            alt="Su Arıtma Teknik Servis"
            width={440}
            height={115}
            loading="eager"
            className="h-6 w-auto md:h-7"
          />
        </Link>

        <nav aria-label="Sayfa bölümleri" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(s.mono, "text-[11px] uppercase tracking-[0.2em] text-white/55 transition hover:text-white")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={TEL}
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-2 pl-2 pr-4 text-sm font-medium text-white transition hover:border-[#ff3b3b]/60 hover:bg-[#ff3b3b]/10"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff3b3b] text-white">
            <Phone className="h-3.5 w-3.5" />
          </span>
          <span className="hidden sm:inline">{PHONE}</span>
          <span className="sm:hidden">Ara</span>
        </a>
      </div>
    </header>
  );
}
