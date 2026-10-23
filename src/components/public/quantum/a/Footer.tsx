"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "framer-motion";
import { AtSign, Globe, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE, TEL } from "../data";
import { Reveal, Wordmark, useLive } from "./primitives";
import s from "./theme.module.css";

const LOGO = "/images/prada-v2/logo-tam.webp";

/** Mürekkep altbilgi: büyük marka logosu, telefon, kısa satır ve bağlantılar */
export function Footer() {
  const logoRef = useRef<HTMLDivElement>(null);
  // CSS maskesi görseli hemen indirir: ışık katmanı logo yaklaşınca eklenir, yalnızca ekrandayken döner
  const near = useInView(logoRef, { once: true, margin: "600px 0px" });
  const live = useLive(logoRef, { margin: "200px 0px" });

  return (
    <footer
      data-theme="ink"
      className={cn(
        s.ink,
        s.cv,
        "relative isolate overflow-clip bg-[#06070A] px-5 pb-[calc(56px+env(safe-area-inset-bottom,0px))] pt-20 text-[#F5F7FA] md:px-10 md:pb-16 md:pt-28"
      )}
      style={{ "--qa-cis": "900px" } as React.CSSProperties}
    >
      <div aria-hidden className={cn(s.irisLine, "absolute inset-x-0 top-0 h-px opacity-70")} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[34%] -z-10 h-[80vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,108,255,0.16),rgba(34,211,238,0.05)_55%,transparent)]"
      />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center text-center">
        <Reveal y={36} className="w-[min(74vw,440px)]">
          <div ref={logoRef} className="relative">
            <Image
              src={LOGO}
              alt="Su Arıtma Teknik Servis: Sağlıklı su, güvenilir hizmet"
              width={760}
              height={812}
              sizes="(min-width: 768px) 440px, 74vw"
              loading="lazy"
              draggable={false}
              className="h-auto w-full select-none"
            />
            {near && (
              <div
                aria-hidden
                className={cn("pointer-events-none absolute inset-0 overflow-hidden", !live && s.paused)}
                style={{ WebkitMaskImage: `url(${LOGO})`, maskImage: `url(${LOGO})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}
              >
                <span
                  className={cn(s.sweep, "absolute inset-y-[-20%] right-full w-[38%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.22)_50%,transparent)]")}
                  style={{ "--dur": "7.5s", "--sx1": "420%", "--d": "1.2s" } as React.CSSProperties}
                />
              </div>
            )}
          </div>
        </Reveal>

        <Wordmark className="mt-10 block text-[12px] text-white/85" />
        <p className="mt-3 max-w-md text-[15px] leading-[1.55] text-[color:var(--qa-fg-2)]">
          Satış ve kurulum: Su Arıtma Teknik Servis, İstanbul.
        </p>

        <a
          href={TEL}
          className={cn(
            s.focus,
            "mt-6 inline-flex min-h-11 items-center gap-3 rounded-full text-[clamp(1.6rem,6.4vw,2.4rem)] font-semibold tabular-nums tracking-[-0.03em] text-white transition-opacity hover:opacity-80"
          )}
        >
          <Phone className="h-6 w-6 text-[#22D3EE]" strokeWidth={2} />
          {PHONE}
        </a>

        <ul className="mt-10 flex flex-col items-center gap-1 text-sm text-[color:var(--qa-fg-2)] sm:flex-row sm:gap-8">
          <li>
            <a
              href="https://instagram.com/suaritmateknikservis34"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(s.focus, "inline-flex min-h-11 items-center gap-2 rounded-full transition-colors hover:text-white")}
            >
              <AtSign className="h-4 w-4" /> suaritmateknikservis34
            </a>
          </li>
          <li>
            <Link
              href="/"
              prefetch={false}
              className={cn(s.focus, "inline-flex min-h-11 items-center gap-2 rounded-full transition-colors hover:text-white")}
            >
              <Globe className="h-4 w-4" /> www.suaritmaservis34.com
            </Link>
          </li>
        </ul>

        <p className={cn(s.micro, "mt-10 text-[10px] text-white/45")}>© Su Arıtma Teknik Servis · SuArıtmaServis34</p>
      </div>
    </footer>
  );
}
