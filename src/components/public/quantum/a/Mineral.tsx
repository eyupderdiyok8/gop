"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { MINERAL, STAGES } from "../data";
import { Chapter, Frame, Headline, IrisGradient, Reveal, Section, useLive, useSvgId } from "./primitives";
import { MineralEmblem } from "./Mineral.Emblem";
import { Seg7 } from "./Seg7";
import { EASE, MINERAL_HUES, SPECTRUM } from "./tokens";
import s from "./theme.module.css";
import mn from "./Mineral.module.css";

/**
 * 03 · Mineral — altıncı aşama: Cruze Mineral Filtre (B12 vitaminli, suya alkali özellik kazandırır).
 * Altı kapının sonuncusu; ayrı bir filtre değildir. Altı kapı sahnesinin inci diskinden açılır:
 * mineral amblemi, altıncı tüpün dolduğu aşama kartı ve "arıtılmış su + mineral filtre" denklemi.
 * Sağlık iddiası ve sayı yok; yalnızca data.ts'teki MINERAL metni.
 */

const LAST = STAGES[STAGES.length - 1];
const TUBE = SPECTRUM[SPECTRUM.length - 1];

export function Mineral() {
  return (
    <Section
      id="mineral"
      cv={1400}
      className="bg-[linear-gradient(180deg,#F4F8FD_0%,#F4F8FD_40%,#E6F0FB_100%)]"
    >
      {/* zemin: altta gök tonu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(70%_90%_at_50%_100%,rgba(207,228,250,0.75),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
        <div className="grid gap-y-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_auto_auto_1fr] lg:gap-x-16 lg:gap-y-6">
          <Chapter no="03" label="Mineral" className="lg:col-start-2 lg:row-start-2" />
          <Headline text="Son kapıda *alkali* bir dokunuş." className="leading-[0.95] lg:col-start-2 lg:row-start-3" />

          <div className="justify-self-center py-6 lg:col-start-1 lg:row-span-6 lg:row-start-1 lg:self-center lg:py-0">
            <MineralEmblem className="w-[min(260px,70vw)] lg:w-[min(420px,36vw)]" />
          </div>

          <Reveal className="lg:col-start-2 lg:row-start-4">
            <p className="max-w-[36ch] text-[17px] leading-[1.55] text-[color:var(--qa-fg-2)]">
              Altı aşamalı filtrelemenin son kapısı: <strong className="font-semibold text-[color:var(--qa-fg)]">{MINERAL.name}</strong>.{" "}
              {MINERAL.line}
            </p>
          </Reveal>

          <Reveal className="lg:col-start-2 lg:row-start-5" delay={0.1}>
            <StageCard />
          </Reveal>
        </div>

        <Equation />
      </div>
    </Section>
  );
}

/* ───────── Aşama kartı: altıncı tüp dolar, kabarcıklar yükselir ───────── */

const TUBE_BUBBLES = [
  { l: "30%", s: 5, d: 0.2, dur: 3.2 },
  { l: "58%", s: 3.5, d: 1.1, dur: 2.8 },
  { l: "42%", s: 4, d: 1.9, dur: 3.6 },
  { l: "66%", s: 3, d: 2.6, dur: 3 },
] as const;

function StageCard() {
  const ref = useRef<HTMLElement>(null);
  const live = useLive(ref);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <figure ref={ref} className={cn("w-[min(100%,330px)]", !live && s.paused)}>
      <Frame innerClassName="flex items-center gap-5 px-5 py-5">
        {/* altıncı cam tüp (Altı kapı sahnesindeki tüplerin aynısı) */}
        <div aria-hidden className="relative h-[150px] w-[46px] flex-none">
          <span
            className="absolute -inset-x-[70%] -inset-y-[10%] rounded-full"
            style={{ background: `radial-gradient(closest-side, ${TUBE}40, transparent)` }}
          />
          <div className="relative h-full overflow-hidden rounded-full border border-white/10 bg-[#0D0F14]">
            <motion.div
              initial={{ y: "106%" }}
              animate={seen ? { y: "0%" } : undefined}
              transition={{ duration: 1.5, ease: EASE, delay: 0.25 }}
              className="absolute inset-[3px] overflow-hidden rounded-full"
              style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0) 26%), ${TUBE}` }}
            >
              <span className="absolute inset-x-[22%] top-[5px] h-[2px] rounded-full bg-white/70" />
              {seen &&
                TUBE_BUBBLES.map((b, i) => (
                  <span
                    key={i}
                    className={cn(mn.riseUp, "absolute bottom-[6%] rounded-full border border-white/80")}
                    style={
                      {
                        left: b.l,
                        width: b.s * 2,
                        height: b.s * 2,
                        "--d": `${1.4 + b.d}s`,
                        "--dur": `${b.dur}s`,
                        "--ry": "-104px",
                        "--o": "0.85",
                      } as CSSProperties
                    }
                  />
                ))}
            </motion.div>
            <span className="pointer-events-none absolute inset-y-[8%] left-[16%] w-[18%] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.12),transparent)]" />
          </div>
        </div>

        <figcaption className="min-w-0">
          <span aria-hidden className="inline-flex h-9 items-center gap-2 rounded-full bg-[#06070A] px-3">
            <Seg7 value={LAST.no} mode="flicker" className="h-4 w-auto" />
            <span className={cn(s.micro, "text-[10px] text-white/55")}>/ 06</span>
          </span>
          <span className="sr-only">Aşama {LAST.no} / 06: </span>
          <span className="mt-3 block text-[19px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#0B0F17]">{MINERAL.name}</span>
          <span
            className={cn(
              s.micro,
              "mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[rgba(11,15,23,0.1)] bg-white px-3 py-1.5 text-[#0B0F17]"
            )}
          >
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full" style={{ background: TUBE }} />
              <span
                className={cn(s.pulse, "absolute inset-0 rounded-full")}
                style={{ background: TUBE, "--dur": "2.6s", "--d": "1.2s" } as CSSProperties}
              />
            </span>
            {MINERAL.tag}
          </span>
        </figcaption>
      </Frame>
    </figure>
  );
}

/* ───────── Denklem ───────── */

const TOKEN =
  "inline-flex h-14 items-center gap-3 whitespace-nowrap rounded-full border border-[rgba(11,15,23,0.1)] bg-white px-5 text-[17px] font-semibold tracking-[-0.02em] text-[#0B0F17] shadow-[0_18px_40px_-26px_rgba(30,60,120,0.5)] md:h-16 md:px-6 md:text-[19px]";

const MINERAL_CONIC = `conic-gradient(${[...MINERAL_HUES, MINERAL_HUES[0]].join(",")})`;
const RING_MASK = "radial-gradient(closest-side, transparent 56%, #000 60%)";

function Equation() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const slide = (from: number, delay: number) => ({
    initial: { opacity: 0, x: from },
    animate: seen ? { opacity: 1, x: 0 } : undefined,
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <div ref={ref} className="mt-16 md:mt-24">
      <p className="sr-only">
        Arıtılmış su, son aşamada {MINERAL.name}&apos;den geçer: B12 vitaminli mineral filtre suya alkali özellik kazandırır.
      </p>
      <div aria-hidden className="flex flex-col items-center gap-2 lg:flex-row lg:justify-center lg:gap-5">
        <motion.span className={TOKEN} {...slide(-40, 0)}>
          {/* ilk beş aşama: spektrum çubukları */}
          <span className="flex items-end gap-[3px]">
            {SPECTRUM.slice(0, 5).map((c, i) => (
              <span key={c} className="w-[4px] rounded-full" style={{ background: c, height: 12 + (i % 2) * 4 }} />
            ))}
          </span>
          Arıtılmış su
        </motion.span>

        <Operator kind="plus" seen={seen} delay={0.55} />

        <motion.span className={TOKEN} {...slide(0, 0.12)}>
          <span className="h-5 w-5 rounded-full" style={{ background: MINERAL_CONIC, maskImage: RING_MASK, WebkitMaskImage: RING_MASK }} />
          {MINERAL.name}
        </motion.span>

        <Operator kind="eq" seen={seen} delay={0.75} />

        <motion.span
          className={cn(
            TOKEN,
            "border-[1.5px] border-transparent px-6 [background:linear-gradient(#fff,#fff)_padding-box,var(--qa-iris)_border-box] md:px-7"
          )}
          {...slide(40, 0.24)}
        >
          <Droplet className="h-5 w-5 text-[#22D3EE]" strokeWidth={2} fill="rgba(34,211,238,0.18)" />
          Alkali su
        </motion.span>
      </div>
    </div>
  );
}

/** "+" ve "=": iris çizgiyle çizilerek gelir */
function Operator({ kind, seen, delay }: { kind: "plus" | "eq"; seen: boolean; delay: number }) {
  const id = useSvgId("op");
  const d = kind === "plus" ? "M14 4V24M4 14H24" : "M5 10H23M5 18H23";
  return (
    <span className="flex h-9 w-9 items-center justify-center lg:h-16">
      <svg viewBox="0 0 28 28" className={cn("h-7 w-7", !seen && s.paused)}>
        <defs>
          <IrisGradient id={id} deep />
        </defs>
        <path
          d={d}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={2.4}
          strokeLinecap="round"
          pathLength={1}
          className={s.draw}
          style={{ "--d": `${delay}s`, "--dur": "0.55s" } as CSSProperties}
        />
      </svg>
    </span>
  );
}
