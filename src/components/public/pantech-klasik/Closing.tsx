"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AtSign, Globe, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { PHONE, PRODUCT, TEL, WA } from "./contact";
import { Chapter, Headline, Reveal } from "../prada-v2/primitives";
import s from "../prada-v2/v2.module.css";

/** Kapanış: fiyat ve kurulum bilgisi telefonla (fiyat yalnızca burada konuşulur) */
export function FinalCta() {
  return (
    <section id="iletisim" className={cn(s.cv, "relative isolate overflow-hidden px-5 pb-[18vh] pt-[14vh] md:px-10")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[40%] h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(62,166,255,0.22),rgba(62,166,255,0.07)_50%,transparent)]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <Chapter no="07" label="Fiyat ve İletişim" className="justify-center" />
        <Headline text="Pantech için *bir telefon* yeter." className="mx-auto mt-8 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-white" />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            {PRODUCT} fiyatı, kampanyalar ve kurulum için hemen arayın; tüm sorularınızı yanıtlayalım.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="relative mt-14 flex justify-center">
            {[0, 1.2, 2.4].map((delay) => (
              <span
                key={delay}
                aria-hidden
                className={cn(s.ripple, "pointer-events-none absolute left-1/2 top-1/2 h-24 w-[min(92%,520px)] rounded-full border border-[#3ea6ff]/40")}
                style={{ "--d": `${delay}s` } as React.CSSProperties}
              />
            ))}
            <a
              href={TEL}
              className="relative inline-flex items-center gap-3 rounded-full bg-white py-3 pl-3 pr-7 text-black shadow-[0_30px_80px_-20px_rgba(62,166,255,0.6)] transition hover:scale-[1.02] md:gap-4 md:py-4 md:pl-4 md:pr-9"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3ea6ff] text-white md:h-16 md:w-16">
                <Phone className="h-5 w-5 md:h-6 md:w-6" />
              </span>
              <span className="text-[clamp(1.55rem,5vw,3.2rem)] font-semibold tracking-[-0.035em]">{PHONE}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <a href={WA} className="group mt-10 inline-flex items-center gap-2.5 text-[15px] font-medium text-white/70 transition hover:text-white">
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> veya WhatsApp&apos;tan yazın
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

const LOGO = "/images/prada-v2/logo-tam.webp";

export function Footer() {
  return (
    <footer className={cn(s.cv, "relative isolate overflow-hidden border-t border-white/[0.07] px-5 pb-32 pt-20 md:px-10 md:pb-16 md:pt-28")}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[80vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(30,110,255,0.18),rgba(30,110,255,0.06)_50%,transparent)]"
      />
      <div className="mx-auto flex max-w-[1440px] flex-col items-center">
        <Reveal y={40} className="w-[min(80vw,520px)]">
          <Image src={LOGO} alt="Su Arıtma Teknik Servis — Sağlıklı su, güvenilir hizmet" width={760} height={812} className="h-auto w-full select-none" />
        </Reveal>
        <ul className="mt-14 flex flex-col items-center gap-3 text-sm text-white/60 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10">
          <li>
            <a href="https://instagram.com/suaritmateknikservis34" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
              <AtSign className="h-4 w-4" /> suaritmateknikservis34
            </a>
          </li>
          <li>
            <Link href="/" prefetch={false} className="inline-flex items-center gap-2 transition hover:text-white">
              <Globe className="h-4 w-4" /> www.suaritmaservis34.com
            </Link>
          </li>
          <li>
            <a href={TEL} className="inline-flex items-center gap-2 font-semibold text-white/80 transition hover:text-white">
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
          </li>
        </ul>
        <p className={cn(s.mono, "mt-10 text-[10px] uppercase tracking-[0.24em] text-white/45")}>© Su Arıtma Teknik Servis</p>
      </div>
    </footer>
  );
}

/** Hero'dan sonra beliren, kapanışta çekilen yüzen arama çubuğu */
export function Dock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      const end = document.getElementById("iletisim");
      const atEnd = end ? end.getBoundingClientRect().top < h * 0.7 : false;
      setShow(window.scrollY > h * 0.6 && !atEnd);
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

  return (
    <AnimatePresence>
        {show && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))]"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="pointer-events-auto flex w-full max-w-[520px] items-center gap-2 rounded-full border border-white/10 bg-[#101215]/95 p-1.5 pl-3 shadow-[0_20px_60px_rgba(0,0,0,0.65)] md:w-auto md:gap-2.5">
              <div className="mr-auto flex items-center gap-2.5 md:mr-5">
                <Image src="/images/prada-v2/logo-amblem.webp" alt="" width={320} height={226} className="h-8 w-auto" />
                <div className="hidden leading-tight sm:block">
                  <p className="text-[14px] font-semibold tracking-tight text-white">{PRODUCT}</p>
                  <p className={cn(s.mono, "text-[9.5px] uppercase tracking-[0.2em] text-white/55")}>Bilgi & sipariş</p>
                </div>
              </div>
              <a href={TEL} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-[#e6f4ff] md:px-5">
                <Phone className="h-4 w-4" /> Ara
              </a>
              <a href={WA} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-[#062b14] transition hover:brightness-95 md:px-5">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
}
