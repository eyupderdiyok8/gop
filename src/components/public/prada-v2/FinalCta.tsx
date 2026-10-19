"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "framer-motion";
import { ArrowRight, AtSign, Globe, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { PHONE, TEL, WA } from "./contact";
import { Chapter, Headline, Reveal } from "./primitives";
import s from "./v2.module.css";

export function FinalCta() {
  return (
    <section id="iletisim" className={cn(s.cv, "relative isolate overflow-hidden px-5 pb-[18vh] pt-[14vh] md:px-10")}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[38%] h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,40,40,0.22),rgba(255,40,40,0.07)_50%,transparent)]" />
        <Image
          src="/images/prada-v2/on.webp"
          alt=""
          width={1000}
          height={1333}
          className="absolute -bottom-[46%] left-1/2 w-[min(78vw,560px)] -translate-x-1/2 opacity-25 [mask-image:linear-gradient(to_bottom,black_15%,transparent_60%)]"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <Chapter no="08" label="İletişim" className="justify-center" />
        <Headline
          text="Berrak suya bir telefon *uzaklıktasınız.*"
          className="mx-auto mt-8 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-white"
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
            Model seçimi, fiyat ve kurulum için hemen arayın; tüm sorularınızı yanıtlayalım.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="relative mt-14 flex justify-center">
            {[0, 1.2, 2.4].map((delay) => (
              <span
                key={delay}
                aria-hidden
                className={cn(
                  s.ripple,
                  "pointer-events-none absolute left-1/2 top-1/2 h-24 w-[min(92%,520px)] rounded-full border border-[#ff3b3b]/40"
                )}
                style={{ "--d": `${delay}s` } as React.CSSProperties}
              />
            ))}
            <a
              href={TEL}
              className="relative inline-flex items-center gap-3 rounded-full bg-white py-3 pl-3 pr-7 text-black shadow-[0_30px_80px_-20px_rgba(255,59,59,0.6)] transition hover:scale-[1.02] md:gap-4 md:py-4 md:pl-4 md:pr-9"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff3b3b] text-white md:h-16 md:w-16">
                <Phone className="h-5 w-5 md:h-6 md:w-6" />
              </span>
              <span className="text-[clamp(1.55rem,5vw,3.2rem)] font-semibold tracking-[-0.035em]">{PHONE}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <a
            href={WA}
            className="group mt-10 inline-flex items-center gap-2.5 text-[15px] font-medium text-white/70 transition hover:text-white"
          >
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
  const logoRef = useRef<HTMLDivElement>(null);
  // CSS maskesi görseli hemen indirir; ışık efekti logo ekrana yaklaşınca eklenir (sayfa açılışını yormaz)
  const near = useInView(logoRef, { once: true, margin: "600px 0px" });

  return (
    <footer className={cn(s.cv, "relative isolate overflow-hidden border-t border-white/[0.07] px-5 pb-32 pt-20 md:px-10 md:pb-16 md:pt-28")}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[80vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(30,110,255,0.18),rgba(30,110,255,0.06)_50%,transparent)]"
      />
      <div className="mx-auto flex max-w-[1440px] flex-col items-center">
        {/* Büyük marka logosu */}
        <Reveal y={40} className="w-[min(80vw,560px)]">
          <div ref={logoRef} className="relative">
            <Image
              src={LOGO}
              alt="Su Arıtma Teknik Servis — Sağlıklı su, güvenilir hizmet"
              width={760}
              height={812}
              draggable={false}
              className="h-auto w-full select-none"
            />
            {near && (
              <div aria-hidden className={s.glintMask} style={{ WebkitMaskImage: `url(${LOGO})`, maskImage: `url(${LOGO})` }}>
                <span className={s.glintBand} />
              </div>
            )}
          </div>
        </Reveal>

        <ul className="mt-14 flex flex-col items-center gap-3 text-sm text-white/60 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10">
          <li>
            <a
              href="https://instagram.com/suaritmateknikservis34"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
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
