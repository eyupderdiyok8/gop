"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE, TEL, waLink } from "../data";
import { Bezel, Chapter, Headline, IrisGradient, Reveal, Section, TouchKey, WaGlyph, useLive, useSvgId } from "./primitives";
import { Seg7 } from "./Seg7";
import s from "./theme.module.css";
import m from "./Son.module.css";

/**
 * Final — siyah cama dönüş. Panelin ekranı artık işletmenin numarasını LED rakamlarla gösterir,
 * iki yuvarlak tuşu ARA ve WHATSAPP olur. Dock bu bölüm görününce çekilir.
 */

const LOGO = "/images/prada-v2/logo-tam.webp";
const WA_SON = waLink("Merhaba, Quantum Plus hakkında bilgi almak istiyorum.");

/** Rakam zamanlaması (sn): önce hızlı segment kovalamacası, sonra haneler soldan sağa */
const CHASE = 0.1;
const LIT = 0.85;

export function Son() {
  return (
    <Section id="son" theme="ink" cv={1100} className="px-4 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
      <div aria-hidden className={cn(s.irisLine, "absolute inset-x-0 top-0 h-px opacity-60")} />
      {/* levhanın arkasında iris hale (bulanıklık yok, radyal gradyan) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[64%] -z-10 h-[110vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.2),rgba(91,108,255,0.08)_45%,rgba(34,211,238,0.04)_65%,transparent)]"
      />

      <div className="mx-auto max-w-[960px] text-center">
        <Chapter no="08" label="İletişim" className="justify-center" />
        <Headline text="Bilgi almak için *bizi arayın.*" className="mx-auto mt-5 max-w-[15ch]" />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-[34ch] text-[17px] leading-[1.55] text-[color:var(--qa-fg-2)]">
            Fiyat ve kurulum bilgisi için arayın ya da WhatsApp&apos;tan yazın.
          </p>
        </Reveal>

        <Reveal y={40} className="mt-12 md:mt-16">
          <Slab />
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── Siyah cam levha ───────── */

function Slab() {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref, { margin: "0px" });
  const id = useSvgId("son");

  return (
    <Bezel radius={32} className="mx-auto w-full max-w-[680px]" innerClassName="px-5 pb-8 pt-9 sm:px-10 md:pb-11 md:pt-12">
      <div ref={ref} className={cn(!live && s.paused)}>
        {/* cam boyunca ışık geçişi: açılışta bir kez, sonra ara ara */}
        <span
          aria-hidden
          className={cn(s.sweepOnce, "pointer-events-none absolute inset-y-0 right-full w-[42%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)]")}
          style={{ "--dur": "1.3s", "--d": "0.2s", "--sx1": "340%" } as CSSProperties}
        />
        <span
          aria-hidden
          className={cn(s.sweep, "pointer-events-none absolute inset-y-0 right-full w-[42%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]")}
          style={{ "--dur": "9s", "--d": "4s", "--sx1": "340%" } as CSSProperties}
        />

        {/* ekranın tamamı arama bağlantısı; LED rakamlar ekran okuyucudan gizli */}
        <a href={TEL} className={cn(s.focus, "relative block rounded-[20px]")}>
          <span className="sr-only">{PHONE} numarasını arayın</span>
          <span aria-hidden className="block">
            <span className={cn(s.fadeIn, "mx-auto block w-[104px] md:w-[136px]")} style={{ "--d": "0.1s", "--dur": "0.9s" } as CSSProperties}>
              <Image
                src={LOGO}
                alt=""
                width={760}
                height={812}
                sizes="(min-width: 768px) 136px, 104px"
                loading="lazy"
                draggable={false}
                className="h-auto w-full select-none"
              />
            </span>

            {/* iris halka: TDS rakamlarının yerinde telefon */}
            <span className="relative mx-auto mt-7 block h-[96px] w-[96px] md:mt-9 md:h-[124px] md:w-[124px]">
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full overflow-visible">
                <defs>
                  <IrisGradient id={id} x1={1} y1={0} x2={0} y2={1} />
                </defs>
                <circle cx={60} cy={60} r={52} fill="none" stroke="#14171D" strokeWidth={7} />
                <circle
                  cx={60}
                  cy={60}
                  r={52}
                  fill="none"
                  stroke={`url(#${id})`}
                  strokeWidth={7}
                  strokeLinecap="round"
                  pathLength={1}
                  transform="rotate(-90 60 60)"
                  className={s.draw}
                  style={{ "--d": "0.35s", "--dur": "0.9s" } as CSSProperties}
                />
                <circle
                  cx={60}
                  cy={60}
                  r={52}
                  fill="none"
                  stroke={`url(#${id})`}
                  strokeWidth={18}
                  strokeOpacity={0.12}
                  className={s.fadeIn}
                  style={{ "--d": "1s", "--dur": "0.8s" } as CSSProperties}
                />
                <g className={s.fadeIn} style={{ "--d": "1.3s" } as CSSProperties}>
                  <circle
                    cx={60}
                    cy={60}
                    r={52}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={8}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="0.05 0.95"
                    className={s.spin}
                    style={{ "--dur": "6s", opacity: 0.9 } as CSSProperties}
                  />
                </g>
              </svg>
              <span className={cn(s.fadeIn, "absolute inset-0 flex items-center justify-center")} style={{ "--d": "0.9s" } as CSSProperties}>
                <Phone className={cn(m.ring, "h-7 w-7 text-white md:h-9 md:w-9")} strokeWidth={1.9} />
              </span>
            </span>

            <span
              className={cn(s.growX, s.irisLine, "mx-auto mt-6 block h-[5px] w-[110px] rounded-full md:mt-7 md:w-[150px]")}
              style={{ "--d": "1.05s" } as CSSProperties}
            />

            {/* numara: dar ekranda iki satır ("0553" / "114 27 34"), geniş ekranda tek satır */}
            <span className="mt-8 block md:mt-10">
              <span className="mx-auto block w-full max-w-[330px] md:hidden">
                <Digits value="0553" from={0} className="mx-auto w-[50.5%]" />
                <Digits value="114 27 34" from={4} className="mt-3 w-full" />
              </span>
              <Digits value={PHONE} from={0} className="mx-auto hidden w-full max-w-[540px] md:block" />
            </span>
          </span>
        </a>

        {/* panelin On/Off ve Function tuşlarının yerinde ARA ve WHATSAPP */}
        <div className="mt-9 flex items-start justify-center gap-12 md:mt-11 md:gap-16">
          <span className="relative inline-flex text-[#8B5CF6]">
            <span aria-hidden className={cn(m.keyPulse, "left-1/2 top-0 h-16 w-16 -translate-x-1/2")} style={{ "--d": "2.6s" } as CSSProperties} />
            <TouchKey href={TEL} label={`${PHONE} numarasını arayın`} size={64} ring="iris" caption="Ara" captionAt="below">
              <Phone className="h-6 w-6" strokeWidth={2} />
            </TouchKey>
          </span>
          <span className="relative inline-flex text-[#25D366]">
            <span aria-hidden className={cn(m.keyPulse, "left-1/2 top-0 h-16 w-16 -translate-x-1/2")} style={{ "--d": "2.95s" } as CSSProperties} />
            <TouchKey href={WA_SON} external label="WhatsApp'tan yazın" size={64} ring="soft" caption="WhatsApp" captionAt="below">
              <WaGlyph className="h-7 w-7 text-[#25D366]" />
            </TouchKey>
          </span>
        </div>

        <p className={cn(s.micro, "mt-9 text-center leading-[1.7] text-white/40 md:mt-10")}>Su Arıtma Teknik Servis, İstanbul</p>
      </div>
    </Bezel>
  );
}

/** LED numara: kovalamaca katmanı söner, alttaki haneler soldan sağa yanar */
function Digits({ value, from, className }: { value: string; from: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const live = useLive(ref, { margin: "0px" });
  const blank = value.replace(/\d/g, "~");
  return (
    <span ref={ref} className={cn("relative block", !live && s.paused, className)}>
      <Seg7 value={value} mode="light" delay={LIT + from * 0.05} stagger={0.05} className="block h-auto w-full" />
      <span
        className={cn(s.fadeOut, "absolute inset-0")}
        style={{ "--d": `${LIT - 0.05 + from * 0.05}s`, "--dur": "0.25s" } as CSSProperties}
      >
        <Seg7 value={blank} mode="chase" loops={1} delay={CHASE + from * 0.03} glow={false} className="block h-full w-full" />
      </span>
    </span>
  );
}
