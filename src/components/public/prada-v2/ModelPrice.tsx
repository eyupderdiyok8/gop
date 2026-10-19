"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { PRICES, TEL, waLink } from "./contact";
import { Chapter, EASE, Headline, Reveal } from "./primitives";
import s from "./v2.module.css";

const MODELS = [
  {
    key: "pompasiz",
    name: "Pompasız",
    price: PRICES.pompasiz,
    for: "Şebeke basıncı yeterli olan evler için",
    points: ["Sade ve sessiz çalışma", "Basınç düşürücü ile korunan sistem"],
  },
  {
    key: "pompali",
    name: "Pompalı",
    price: PRICES.pompali,
    for: "Su basıncı düşük evler ve üst katlar için",
    points: ["Pompa, membranın ihtiyaç duyduğu basıncı sağlar", "Düşük basınçta da verimli arıtma"],
  },
];

export function ModelPrice() {
  const [model, setModel] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  // Kart içi akış animasyonları yalnızca bölüm görünürken çalışır
  const play = useInView(sectionRef, { margin: "100px 0px" });
  const selected = MODELS[model];
  const wa = waLink(
    `Merhaba, 3.2 Prada su arıtma cihazının ${selected.name.toLowerCase()} modeli (${selected.price}) hakkında bilgi almak istiyorum.`
  );

  return (
    <section ref={sectionRef} id="fiyat" className={cn(s.cv, "relative scroll-mt-16 overflow-hidden px-5 py-[12vh] md:px-10")}>
      <div className="mx-auto max-w-[1440px]">
        <Chapter no="07" label="Fiyat" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Headline text="Evinize uygun *Prada'yı* seçin." className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] text-white" />
          <p className="max-w-md text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-right">
            Hangisinin uygun olduğundan emin değil misiniz? Bizi arayın; su basıncınıza göre doğru modeli birlikte
            belirleyelim.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[2fr_1.15fr]">
          {/* Model kartları */}
          <div role="radiogroup" aria-label="Model seçimi" className="grid gap-5 sm:grid-cols-2">
            {MODELS.map((m, i) => (
              <Reveal key={m.key} delay={i * 0.08} className="h-full">
                <button
                  type="button"
                  role="radio"
                  aria-checked={model === i}
                  onClick={() => setModel(i)}
                  className={cn(
                    "relative flex h-full w-full flex-col rounded-[28px] border p-6 text-left transition-[border-color,background-color,box-shadow] duration-500 md:p-7",
                    model === i
                      ? "border-[#ff3b3b]/70 bg-[#ff3b3b]/[0.06] shadow-[0_0_60px_-10px_rgba(255,59,59,0.35)]"
                      : "border-white/[0.08] bg-[#0b0b0b] hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(s.mono, "text-[10.5px] uppercase tracking-[0.24em] text-white/50")}>Model 0{i + 1}</span>
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-300",
                        model === i ? "border-[#ff3b3b] bg-[#ff3b3b]" : "border-white/25"
                      )}
                    >
                      {model === i && <Check className="h-3.5 w-3.5 text-white" />}
                    </span>
                  </div>
                  <PressureIcon pump={i === 1} active={model === i && play} />
                  <span className="mt-6 block text-3xl font-semibold tracking-[-0.03em] text-white">{m.name}</span>
                  <span className="mt-1.5 block text-[15px] text-white/60">{m.for}</span>
                  <ul className="mt-5 space-y-2">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[14px] text-white/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff3b3b]" /> {p}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto flex items-baseline justify-between gap-3 border-t border-white/10 pt-5">
                    <span className={cn(s.mono, "text-[10.5px] uppercase tracking-[0.22em] text-white/50")}>Fiyat</span>
                    <span className="text-2xl font-semibold tracking-[-0.03em] text-white">{m.price}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          {/* Fiyat kartı */}
          <Reveal delay={0.16} className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1a0505] via-[#0d0d0d] to-[#0b0b0b] p-6 md:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,59,59,0.3),rgba(255,59,59,0.1)_50%,transparent)]"
              />
              <p className={cn(s.mono, "relative text-[10.5px] uppercase tracking-[0.24em] text-white/55")}>
                3.2 Prada · {selected.name}
              </p>
              <Odometer value={selected.price} />
              <p className="relative mt-3 text-[15px] text-white/60">
                Kurulum ve tüm detaylar için bizi arayın.
              </p>
              <div className="relative mt-auto flex flex-col gap-3 pt-8 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href={TEL}
                  className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-black transition hover:bg-[#ffe9e6]"
                >
                  <Phone className="h-4 w-4" /> Hemen Arayın
                </a>
                <a
                  href={wa}
                  className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[15px] font-semibold text-[#062b14] transition hover:brightness-95"
                >
                  <WhatsAppIcon className="h-4 w-4" /> {selected.name} için sor
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Rakamları slot makinesi gibi yuvarlayarak gösteren fiyat; model değişince yeni fiyata kısa bir turla geçer */
function Odometer({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [revealed, setRevealed] = useState(false);
  const chars = value.split("");
  const lastDigit = chars.filter((c) => /\d/.test(c)).length - 1;

  return (
    <p ref={ref} className="relative mt-4 flex items-baseline text-[clamp(3.6rem,9vw,6.2rem)] font-semibold leading-none tracking-[-0.05em] text-white">
      <span className="sr-only">{value}</span>
      <span aria-hidden className="flex items-end">
        {chars.map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span
                key={i}
                className={cn(
                  "inline-block leading-none",
                  ch === "₺" ? "ml-1.5 pb-[0.1em] text-[0.55em] text-white/70" : "h-[1em]"
                )}
              >
                {ch}
              </span>
            );
          }
          const d = Number(ch);
          const order = chars.slice(0, i).filter((c) => /\d/.test(c)).length;
          return (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "0%" }}
                animate={inView ? { y: `${-(10 + d) * 5}%` } : { y: "0%" }}
                transition={revealed ? { duration: 0.7, ease: EASE } : { duration: 1.6 + order * 0.18, ease: EASE }}
                onAnimationComplete={() => {
                  if (inView && order === lastDigit) setRevealed(true);
                }}
              >
                {Array.from({ length: 20 }, (_, k) => (
                  <span key={k} className="block h-[1em] leading-none">
                    {k % 10}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
    </p>
  );
}

function PressureIcon({ pump, active }: { pump: boolean; active: boolean }) {
  return (
    <svg viewBox="0 0 120 60" className="mt-6 h-14 w-auto self-start" aria-hidden>
      <path d="M4 40 H116" stroke="rgba(255,255,255,0.15)" strokeWidth="10" strokeLinecap="round" />
      <motion.path
        d="M4 40 H116"
        stroke={active ? "#7fdcff" : "rgba(255,255,255,0.35)"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={pump ? "10 6" : "4 12"}
        initial={{ strokeDashoffset: 0 }}
        animate={active ? { strokeDashoffset: [0, pump ? -64 : -32] } : { strokeDashoffset: 0 }}
        transition={active ? { duration: 1.2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
      />
      {pump && (
        <g>
          <circle cx="60" cy="40" r="15" fill="#0b0b0b" stroke={active ? "#ff3b3b" : "rgba(255,255,255,0.35)"} strokeWidth="2" />
          <motion.g
            animate={active ? { rotate: 360 } : { rotate: 0 }}
            transition={active ? { duration: 1.4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
          >
            <path d="M60 31 L63 40 L60 49 L57 40 Z" fill={active ? "#ff3b3b" : "rgba(255,255,255,0.4)"} />
            <path d="M51 40 L60 37 L69 40 L60 43 Z" fill={active ? "#ff3b3b" : "rgba(255,255,255,0.4)"} />
          </motion.g>
        </g>
      )}
      <text x="4" y="14" className={s.mono} fill="rgba(255,255,255,0.4)" fontSize="9" letterSpacing="1.5">
        {pump ? "DÜŞÜK BASINÇ + POMPA" : "ŞEBEKE BASINCI"}
      </text>
    </svg>
  );
}
