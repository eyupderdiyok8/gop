"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE, TEL } from "../data";
import { KeyFace, Wordmark } from "./primitives";
import s from "./theme.module.css";

type Mode = "top" | "pearl" | "ink";

/** Başlık çizgisinin (y=28px) altındaki bölümün data-theme değerini okur; iç içe bölümlerde en içteki kazanır */
function readMode(): Mode {
  if (window.scrollY < 8) return "top";
  const list = document.querySelectorAll<HTMLElement>("section[data-theme], footer[data-theme]");
  for (let i = list.length - 1; i >= 0; i--) {
    const r = list[i].getBoundingClientRect();
    if (r.top <= 28 && r.bottom > 28) return list[i].dataset.theme === "ink" ? "ink" : "pearl";
  }
  return "pearl";
}

export function Header() {
  const [mode, setMode] = useState<Mode>("top");
  const { scrollYProgress } = useScroll();

  // Kaydırmada kare başına en fazla bir okuma; durum yalnızca değişince güncellenir
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setMode(readMode());
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const ink = mode === "ink";

  return (
    <header
      className={cn(
        ink ? s.ink : s.pearl,
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-300",
        mode === "top" && "border-transparent bg-transparent text-[#0B0F17]",
        mode === "pearl" && "border-[rgba(11,15,23,0.08)] bg-[rgba(244,248,253,0.94)] text-[#0B0F17]",
        ink && "border-white/[0.08] bg-[rgba(6,7,10,0.94)] text-[#F5F7FA]"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            prefetch={false}
            aria-label="Su Arıtma Teknik Servis ana sayfa"
            className={cn(s.focus, "-ml-1 flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full")}
          >
            <Image src="/images/prada-v2/logo-amblem.webp" alt="" width={320} height={226} loading="eager" className="h-[26px] w-auto" />
          </Link>
          <span aria-hidden className="h-4 w-px bg-current opacity-20 max-[359px]:hidden" />
          <Wordmark className="text-[11px] max-[359px]:hidden md:text-[12px]" />
        </div>

        <a
          href={TEL}
          className={cn(
            s.focus,
            "inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-4 text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-300",
            ink ? "bg-white/[0.08] text-white hover:bg-white/[0.14]" : "bg-[#0B0F17] text-white hover:bg-[#1a2030]"
          )}
        >
          <KeyFace ring="iris" size={36}>
            <Phone className="h-[15px] w-[15px]" strokeWidth={2.2} />
          </KeyFace>
          <span className="sm:hidden">Ara</span>
          <span className="hidden tabular-nums sm:inline">{PHONE}</span>
          <span className="sr-only sm:hidden">: {PHONE} numarasını arayın</span>
        </a>
      </div>

      {/* Sayfa ilerlemesi: panelin iris alt çizgisi (yalnızca transform) */}
      <motion.div
        aria-hidden
        className={cn(s.irisLine, "absolute inset-x-0 -bottom-px h-[2px] origin-left")}
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
