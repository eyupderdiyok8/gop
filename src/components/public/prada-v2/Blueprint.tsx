"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Chapter, EASE, Headline, Reveal } from "./primitives";
import s from "./v2.module.css";

type Dim = { axis: "v" | "h"; side: "left" | "right" | "bottom"; label: string; from: number; to: number };

/** from/to: ürünün görsel içindeki sınırları (%), dekupe görsellerden ölçüldü */
const VIEWS: { key: string; label: string; title: string; src: string; w: number; h: number; dims: Dim[] }[] = [
  {
    key: "on",
    label: "Ön",
    title: "Ön görünüş",
    src: "/images/prada-v2/on.webp",
    w: 1000,
    h: 1333,
    dims: [
      { axis: "v", side: "right", label: "38 cm", from: 4.9, to: 95.7 },
      { axis: "h", side: "bottom", label: "28 cm", from: 7.1, to: 93.3 },
    ],
  },
  {
    key: "yan",
    label: "Yan",
    title: "Yan görünüş",
    src: "/images/prada-v2/yan.webp",
    w: 1000,
    h: 896,
    dims: [
      { axis: "v", side: "left", label: "38 cm", from: 5.1, to: 94.3 },
      { axis: "h", side: "bottom", label: "43 cm", from: 5.2, to: 94.9 },
    ],
  },
  {
    key: "aci",
    label: "Açılı",
    title: "Perspektif",
    src: "/images/prada-v2/kasa.webp",
    w: 1000,
    h: 1053,
    dims: [],
  },
];

const SPEC = [
  ["Filtreleme", "5 aşamalı · PP, GAC, CTO, RO, post karbon"],
  ["Membran", "Cruze 80 GPD"],
  ["Tank", "3.2 G metal"],
  ["Güvenlik", "Su kaçak sensörü"],
  ["Koruma", "Basınç düşürücü"],
  ["Model", "Pompalı / pompasız"],
  ["Musluk", "Paslanmaz çelik, lüks"],
  ["Kasa", "Şeffaf kırmızı, siyah gövde"],
  ["Ölçüler", "38 × 28 × 43 cm (Y × G × D)"],
];

export function Blueprint() {
  const [active, setActive] = useState(0);
  const view = VIEWS[active];

  return (
    <section id="olculer" className={cn(s.cv, "relative scroll-mt-16 px-5 py-[12vh] md:px-10")}>
      <div className="mx-auto max-w-[1440px]">
        <Chapter no="05" label="Ölçüler" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Headline text="Her açıdan *Prada.*" className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] text-white" />
          <p className="max-w-md text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-right">
            38 × 28 × 43 cm&apos;lik kompakt gövde, dar mutfaklara bile rahatça sığar. Şeffaf kasası ise her açıdan
            dikkat çeker.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          {/* Teknik çizim paneli */}
          <Reveal>
            <div className={cn(s.blueprint, "relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#070707] p-4 md:p-6")}>
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent,#070707_92%)]" />

              <div className="relative flex items-center justify-between gap-3">
                <div role="tablist" aria-label="Görünüm seçin" className="relative flex rounded-full border border-white/10 bg-black/60 p-1">
                  {VIEWS.map((v, i) => (
                    <button
                      key={v.key}
                      role="tab"
                      type="button"
                      aria-selected={active === i}
                      onClick={() => setActive(i)}
                      className={cn(
                        "relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors md:px-5",
                        active === i ? "text-black" : "text-white/55 hover:text-white"
                      )}
                    >
                      {active === i && (
                        <motion.span
                          layoutId="p2-view-pill"
                          className="absolute inset-0 rounded-full bg-white"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{v.label}</span>
                    </button>
                  ))}
                </div>
                <p className={cn(s.mono, "hidden text-[10px] uppercase tracking-[0.22em] text-white/50 sm:block")}>Ölçek · cm</p>
              </div>

              <div className="relative mt-4 h-[min(58svh,440px)] md:h-[min(62svh,540px)] [--H:min(58svh,440px)] md:[--H:min(62svh,540px)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={view.key}
                    className="absolute left-1/2 top-[46%]"
                    style={{
                      width: `min(100% - 92px, var(--H) * ${(view.w / view.h).toFixed(4)} * 0.86)`,
                      aspectRatio: `${view.w} / ${view.h}`,
                      x: "-50%",
                      y: "-50%",
                      transformPerspective: 1200,
                    }}
                    initial={{ opacity: 0, rotateY: 28, scale: 0.94, filter: "blur(8px)" }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, rotateY: -28, scale: 0.94, filter: "blur(8px)" }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <Image
                      src={view.src}
                      alt={`3.2 Prada ${view.title.toLowerCase()}`}
                      width={view.w}
                      height={view.h}
                      draggable={false}
                      className="h-full w-full select-none object-contain"
                    />
                    {view.dims.map((dm, i) => (
                      <DimLine key={dm.label + dm.side} dim={dm} delay={0.35 + i * 0.2} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Antet */}
              <div className={cn(s.mono, "relative mt-2 flex justify-between gap-3 border-t border-white/10 pt-3 text-[9.5px] uppercase tracking-[0.18em] text-white/50 md:text-[10px]")}>
                <span>3.2 Prada</span>
                <span>{view.title}</span>
                <span className="hidden sm:inline">Y×G×D 38×28×43</span>
              </div>
            </div>
          </Reveal>

          {/* Teknik özellikler */}
          <div className="lg:pt-4">
            <p className={cn(s.mono, "text-[10.5px] uppercase tracking-[0.24em] text-white/50")}>Teknik özellikler</p>
            <dl className="mt-5 border-t border-white/10">
              {SPEC.map(([k, v], i) => (
                <motion.div
                  key={k}
                  className="grid grid-cols-[110px_1fr] gap-4 border-b border-white/10 py-4 md:grid-cols-[140px_1fr]"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                >
                  <dt className={cn(s.mono, "pt-0.5 text-[10.5px] uppercase tracking-[0.2em] text-white/50")}>{k}</dt>
                  <dd className="text-[16px] font-medium text-white/90">{v}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function DimLine({ dim, delay }: { dim: Dim; delay: number }) {
  const color = "rgba(255,107,107,0.85)";
  if (dim.axis === "v") {
    return (
      <motion.div
        aria-hidden
        className={cn("absolute flex w-4 flex-col items-center", dim.side === "right" ? "-right-10" : "-left-10")}
        style={{ top: `${dim.from}%`, height: `${dim.to - dim.from}%`, originY: 0.5 }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay, ease: EASE }}
      >
        <span className="h-px w-4" style={{ background: color }} />
        <span className="w-px flex-1" style={{ background: color }} />
        <span className="h-px w-4" style={{ background: color }} />
        <span
          className={cn(
            s.mono,
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180 bg-[#070707] px-0.5 py-2 text-[11px] font-medium tracking-[0.12em] text-white [writing-mode:vertical-rl]"
          )}
        >
          {dim.label}
        </span>
      </motion.div>
    );
  }
  return (
    <motion.div
      aria-hidden
      className="absolute top-[calc(100%+18px)] flex h-4 items-center"
      style={{ left: `${dim.from}%`, width: `${dim.to - dim.from}%`, originX: 0.5 }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      <span className="h-4 w-px" style={{ background: color }} />
      <span className="h-px flex-1" style={{ background: color }} />
      <span className="h-4 w-px" style={{ background: color }} />
      <span
        className={cn(
          s.mono,
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#070707] px-2 text-[11px] font-medium tracking-[0.12em] text-white"
        )}
      >
        {dim.label}
      </span>
    </motion.div>
  );
}
