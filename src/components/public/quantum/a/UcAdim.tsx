"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE, TEL, WA } from "../data";
import { Chapter, Headline, KeyFace, Reveal, Section, WaGlyph, WhatsAppButton, useLive } from "./primitives";
import { EASE } from "./tokens";
import s from "./theme.module.css";

/**
 * 07 · Sahip olun — panelin LED grubu, açık renge çevrilmiş hâli.
 * Görününce sütunlar sırayla segment segment dolar; sütun dolunca adımın metni yükselir.
 */

const SEGS = 9;
const SEG_T = 0.07; // segment başına
const GAP_T = 0.4; // sütunlar arası
const START = 0.25;
const colStart = (c: number) => START + c * (SEGS * SEG_T + GAP_T);
const colFull = (c: number) => colStart(c) + SEGS * SEG_T;

const STEPS: { label: string; title: string; extra?: "contact" }[] = [
  { label: "ARA", title: "Arayın ya da WhatsApp'tan yazın.", extra: "contact" },
  { label: "BİLGİ", title: "Sorularınızı yanıtlayalım, size uygun bilgiyi verelim." },
  { label: "KURULUM", title: "Ekibimiz Quantum Plus'ı yerinde kursun." },
];

export function UcAdim() {
  const cardRef = useRef<HTMLDivElement>(null);
  const seen = useInView(cardRef, { once: true, margin: "0px 0px -18% 0px" });
  const live = useLive(cardRef);

  return (
    <Section id="uc-adim" cv={1050} className="bg-[linear-gradient(180deg,#E6F0FB_0%,#F4F8FD_42%,#F4F8FD_100%)]">
      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-24 md:px-8 lg:pb-32 lg:pt-32">
        <div className="grid gap-y-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-x-14">
          <div>
            <Chapter no="07" label="Sahip olun" />
            <Headline text="Sahip olmak *üç adım.*" className="mt-5" />
          </div>
          <Reveal>
            <p className="max-w-[34ch] text-[17px] leading-[1.55] text-[color:var(--qa-fg-2)]">
              Hepsi tek bir telefonla başlar. Satışı da kurulumu da biz yapıyoruz.
            </p>
          </Reveal>
        </div>

        {/* LED grubu kartı */}
        <div
          ref={cardRef}
          className={cn(
            "relative mt-10 overflow-hidden rounded-[28px] border border-[rgba(11,15,23,0.08)] bg-white px-5 pb-6 pt-7 shadow-[0_40px_80px_-46px_rgba(30,60,120,0.45)] md:px-10 md:pb-10 md:pt-10 lg:mt-14",
            !live && s.paused
          )}
        >
          {/* üst kenarda üç parçalı iris ilerleme çizgisi */}
          <div aria-hidden className="absolute inset-x-0 top-0 flex h-[3px] bg-[#EEF2F7]">
            {seen &&
              STEPS.map((st, c) => (
                <span
                  key={st.label}
                  className={cn(s.growX, "h-full flex-1")}
                  style={
                    {
                      "--d": `${colStart(c)}s`,
                      "--dur": `${SEGS * SEG_T}s`,
                      background: `linear-gradient(90deg, ${["#FF3DC8,#C04BFF", "#C04BFF,#5B6CFF", "#5B6CFF,#22D3EE"][c]})`,
                    } as CSSProperties
                  }
                />
              ))}
          </div>

          <ol className="grid gap-8 md:grid-cols-3 md:gap-0">
            {STEPS.map((st, c) => (
              <li
                key={st.label}
                className={cn(
                  "flex items-start gap-4 sm:gap-5 md:px-7 md:first:pl-0 md:last:pr-0",
                  c > 0 && "md:border-l md:border-[rgba(11,15,23,0.08)]"
                )}
              >
                <LedColumn col={c} seen={seen} />
                <motion.div
                  className="min-w-0 flex-1 pt-0.5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={seen ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.7, delay: colFull(c) - 0.08, ease: EASE }}
                >
                  <p className={cn(s.micro, "text-[color:var(--qa-fg-2)]")}>
                    <span className={cn(s.irisText, "font-semibold")}>0{c + 1}</span>
                    <span aria-hidden> · </span>
                    <span className="text-[color:var(--qa-fg)]">{st.label}</span>
                  </p>
                  <h3 className="mt-2.5 text-[19px] font-semibold leading-[1.22] tracking-[-0.02em] text-[color:var(--qa-fg)] md:text-[21px] lg:text-[23px]">
                    {st.title}
                  </h3>
                  {st.extra === "contact" && <Contact />}
                </motion.div>
              </li>
            ))}
          </ol>

          {/* CTA: üçüncü sütun dolunca tek bir nabız */}
          <div className="mt-9 flex flex-col gap-3 border-t border-[rgba(11,15,23,0.08)] pt-7 sm:flex-row sm:items-center sm:justify-center md:mt-12 md:pt-9">
            <a
              href={TEL}
              className={cn(
                s.focus,
                "relative inline-flex h-[64px] w-full items-center justify-center gap-3 rounded-full bg-[#0B0F17] pl-2 pr-7 text-[17px] font-semibold tracking-[-0.01em] text-white shadow-[0_22px_44px_-22px_rgba(11,15,23,0.7)] transition-transform duration-300 active:scale-[0.98] sm:w-auto sm:justify-start"
              )}
            >
              <span className="relative flex">
                <KeyFace ring="iris" size={48}>
                  <Phone className="h-[19px] w-[19px]" strokeWidth={2.2} />
                </KeyFace>
                {seen && (
                  <span
                    aria-hidden
                    className={cn(s.pulseOnce, "pointer-events-none absolute inset-0 rounded-full border-2 border-[#8B5CF6]")}
                    style={{ "--d": `${colFull(2) + 0.15}s`, "--dur": "1.2s" } as CSSProperties}
                  />
                )}
              </span>
              Hemen arayın
              <span className="sr-only">: {PHONE}</span>
            </a>
            <WhatsAppButton size="lg" className="w-full justify-center sm:w-auto" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Dikey LED sütunu: alttan yukarı dolar, en üst segment panel gibi yavaşça yanıp söner */
function LedColumn({ col, seen }: { col: number; seen: boolean }) {
  return (
    <div aria-hidden className="flex w-6 shrink-0 flex-col-reverse gap-1 md:w-[34px] md:gap-[5px]">
      {Array.from({ length: SEGS }, (_, i) => (
        <span key={i} className="relative h-[9px] rounded-[3px] bg-[#E3E9F1] md:h-[13px] md:rounded-[4px]">
          {seen && (
            <span className={cn(s.segIn, "absolute inset-0")} style={{ "--d": `${colStart(col) + i * SEG_T}s` } as CSSProperties}>
              <Lit top={i === SEGS - 1} col={col} />
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function Lit({ top, col }: { top: boolean; col: number }): ReactNode {
  const glow = (
    <>
      <span className="absolute -inset-[2px] rounded-[5px] bg-[rgba(52,227,122,0.22)] md:rounded-[6px]" />
      <span className="absolute inset-0 rounded-[3px] bg-[linear-gradient(90deg,#34E37A,#2EE6D6)] md:rounded-[4px]" />
    </>
  );
  if (!top) return glow;
  return (
    <span
      className={cn(s.blink, "absolute inset-0")}
      style={{ "--d": `${colFull(2) + 0.8 + col * 0.25}s`, "--dur": `${1.4 + col * 0.37}s` } as CSSProperties}
    >
      {glow}
    </span>
  );
}

/** 1. adım: gerçek tel: bağlantısı ve WhatsApp */
function Contact() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
      <a
        href={TEL}
        className={cn(
          s.focus,
          "inline-flex min-h-11 items-center gap-2 rounded-full text-[21px] font-semibold tabular-nums tracking-[-0.02em] text-[color:var(--qa-fg)] transition-opacity hover:opacity-75 md:text-[22px]"
        )}
      >
        <Phone aria-hidden className="h-[18px] w-[18px] text-[#6D3AE0]" strokeWidth={2.2} />
        {PHONE}
      </a>
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          s.focus,
          "inline-flex min-h-11 items-center gap-2 rounded-full text-[15px] font-medium text-[color:var(--qa-fg-2)] transition-colors hover:text-[color:var(--qa-fg)]"
        )}
      >
        <WaGlyph className="h-[18px] w-[18px] text-[#25D366]" />
        WhatsApp
      </a>
    </div>
  );
}
