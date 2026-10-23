"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { MINERAL, STAGES } from "../data";
import { Chapter, Headline, IrisGradient, Micro, Reveal, Section, useSvgId } from "./primitives";
import { Seg7 } from "./Seg7";
import { EASE, SPECTRUM } from "./tokens";
import { rgba, span, useFullRange, useReducedPref } from "./CaminIcine.hooks";
import s from "./theme.module.css";

/**
 * Altı kapı: 6 aşamalı filtreleme, sırayla yanan altı cam tüp. Işık boncuğu borudan tüpe geçer.
 * Sonda tüpler birleşip iris bir halkaya dönüşür; içindeki inci disk ekranı kaplayıp Mineral bölümüne açılır.
 * 06 (Cruze Mineral Filtre) "Alkali · B12" etiketiyle vurgulanır; ayrı bir B12 filtresi yoktur.
 * Renkler dekoratiftir, kartuş etiket renkleriyle bilerek eşleşmez.
 */

const TITLE = "Musluğa giden yol *altı kapıdan* geçer.";
const LEAD = "Su, musluğa ulaşmadan önce altı aşamalı filtrelemeden geçer. Kaydırın; kapılar sırayla yansın.";
const DESC = [
  "İlk kapı. Tortu ve partiküller burada kalır.",
  "Granül aktif karbon; tat ve kokuya ilk dokunuş.",
  "Sıkıştırılmış blok karbonla ikinci karbon kademesi.",
  "Ters ozmozun kalbi. Su, membranın ince yapısından süzülür.",
  "Musluktan önceki son karbon kademesi.",
  `Son kapı. ${MINERAL.line}`,
];
const OUTRO_1 = "Altı kapı tamam.";
/** Altıncı aşamanın sırası (vurgu etiketi bu aşamada görünür) */
const MINERAL_STAGE = STAGES.length - 1;
const OUTRO_2 = "Sıra bardağınızda.";

/* Zaman çizelgesi (sabitlenen sahnenin ilerlemesi) */
const A = 0.02;
const B = 0.78;
const BAND = (B - A) / 6;
const END = {
  text: [0.78, 0.82],
  outro: [0.8, 0.84, 0.9, 0.93],
  merge: [0.82, 0.87],
  pipe: [0.81, 0.85],
  ring: [0.84, 0.88],
  disk: [0.85, 0.89],
  open: [0.9, 0.97],
  // disk köşeleri ≈ open'ın %94'ünde örter; başlık ondan sonra gündüze döner
  theme: 0.966,
};

/* Tüp yerleşimi: aralık = tüp genişliğinin %25'i → satır 7.25 tüp genişliğinde */
const ROW = 7.25;
const PITCH = 1.25 / ROW;
const C0 = 0.5 / ROW;

/* Işık boncuğu: tüp dolarken o tüpün üstünde bekler, ara bölgede bir sonrakine kayar */
const BEAD_IN: number[] = [];
const BEAD_OUT: number[] = [];
for (let i = 0; i < 6; i++) {
  BEAD_IN.push(A + BAND * i, A + BAND * (i + 0.78));
  BEAD_OUT.push(i, i);
}

/** Kaydırma → aşama; sınırda küçük ölü bölge (komşu aşamalar arasında titremesin) */
function stageAt(v: number, prev: number) {
  const raw = (v - A) / BAND;
  const idx = Math.min(5, Math.max(0, Math.floor(raw)));
  if (Math.abs(idx - prev) === 1 && Math.abs(raw - Math.round(raw)) < 0.06) return prev;
  return idx;
}

export function AltiKapi() {
  const reduce = useReducedPref();
  return reduce ? <GateList /> : <GateScene />;
}

/* ───────── Kaydırma sahnesi ───────── */

function GateScene() {
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cover = useMotionValue(24);
  const [stage, setStage] = useState(0);
  const gid = useSvgId("gate");

  const { scrollYProgress: p } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useMotionValueEvent(p, "change", (v) => {
    setStage((prev) => stageAt(v, prev));
    // disk ekranı kaplayınca başlık gündüze döner
    const el = secRef.current;
    if (el) el.dataset.theme = v > END.theme ? "pearl" : "ink";
  });

  // Diskin ekranı tamamen örtmesi için gereken ölçek (en uzak köşeye göre)
  useEffect(() => {
    const frame = frameRef.current;
    const ring = ringRef.current;
    if (!frame || !ring) return;
    const measure = () => {
      const f = frame.getBoundingClientRect();
      const r = ring.getBoundingClientRect();
      if (!r.width) return;
      const cx = r.left + r.width / 2 - f.left;
      const cy = r.top + r.height / 2 - f.top;
      const far = Math.hypot(Math.max(cx, f.width - cx), Math.max(cy, f.height - cy));
      // halkanın soluk ışıma çizgisi (iç yarıçap ≈ 46/56) bile köşeleri geçsin
      cover.set(Math.max(4, (far / ((r.width / 2) * (46 / 56))) * 1.04));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [cover]);

  // opacity eşlemeleri tam aralıklı (bkz. useFullRange)
  const textO = useFullRange(p, END.text, [1, 0]);
  const outroO = useFullRange(p, END.outro, [0, 1, 1, 0]);
  const outroY = useTransform(p, END.outro.slice(0, 2), [16, 0]);
  const pipeO = useFullRange(p, END.pipe, [1, 0]);
  const bead = useTransform(p, BEAD_IN, BEAD_OUT);
  const beadX = useTransform(bead, (b) => `${b * PITCH * 100}%`);
  const pipeLit = useTransform(bead, (b) => b / 5);
  const ringDraw = useTransform(p, END.ring, [0, 1]);
  const ringO = useFullRange(p, [END.ring[0], END.ring[0] + 0.012], [0, 1]);
  const diskS = useTransform(p, END.disk, [0.1, 1]);
  const diskO = useFullRange(p, [END.disk[0], END.disk[0] + 0.015], [0, 1]);
  // iris açılışı: geometrik ölçek (sabit hızlı yaklaşma hissi)
  const open = useTransform(() => {
    const k = cover.get();
    return Math.pow(k, span(p.get(), END.open[0], END.open[1]));
  });

  return (
    <Section ref={secRef} id="alti-kapi" theme="ink">
      {/* Giriş: bölüm başlığı normal akışta */}
      <div className="relative mx-auto max-w-6xl px-4 pb-[6svh] pt-[16svh] md:px-8">
        <Chapter no="02" label="Filtreleme" />
        <Headline text={TITLE} className="mt-6 max-w-[15ch] lg:max-w-[17ch]" />
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-md text-[16px] leading-[1.55] text-white/62 md:text-[17px]">{LEAD}</p>
        </Reveal>
      </div>

      <div ref={trackRef} className="relative h-[300svh] md:h-[340svh]">
        <div
          ref={frameRef}
          aria-hidden
          className={cn(
            s.dockSafe,
            "sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-[calc(56px+2svh)]"
          )}
        >
          {/* Arka plan: her aşamaya bir renk yıkaması; yalnızca etkin olan görünür */}
          {SPECTRUM.map((c, i) => (
            <motion.div
              key={c}
              initial={false}
              animate={{ opacity: stage === i ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(70% 55% at 50% 60%, ${rgba(c, 0.14)}, transparent 72%)` }}
            />
          ))}

          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
            {/* Numara + aşama adı (ve kapanış cümlesi aynı yerde) */}
            <div className="relative w-full">
              <motion.div style={{ opacity: textO }} className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <Seg7 key={stage} value={STAGES[stage].no} mode="flicker" className="h-9 w-auto md:h-12" />
                  <span className="flex flex-col items-start gap-1 text-left">
                    <Micro className="text-white/60">AŞAMA</Micro>
                    <Micro className="text-white/35">/ 06</Micro>
                  </span>
                </div>
                <div className="mt-4 grid w-full">
                  {STAGES.map((st, i) => (
                    <motion.p
                      key={st.no}
                      initial={false}
                      animate={{ opacity: i === stage ? 1 : 0, y: i === stage ? 0 : 12 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="text-balance text-[clamp(2rem,8vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[#F5F7FA] [grid-area:1/1] [@media(max-height:520px)]:text-[1.6rem]"
                    >
                      {st.name}
                    </motion.p>
                  ))}
                </div>
                {/* 06: mineral filtrenin vurgusu. Yeri her aşamada ayrılır (tüpler kaymaz), yalnızca 06'da görünür. */}
                <motion.span
                  initial={false}
                  animate={{ opacity: stage === MINERAL_STAGE ? 1 : 0, y: stage === MINERAL_STAGE ? 0 : 8 }}
                  transition={{ duration: 0.45, ease: EASE, delay: stage === MINERAL_STAGE ? 0.12 : 0 }}
                  className={cn(
                    s.micro,
                    "mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[#F5F7FA] [@media(max-height:520px)]:hidden"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: SPECTRUM[MINERAL_STAGE] }} />
                  {MINERAL.tag}
                </motion.span>
              </motion.div>

              <motion.div
                style={{ opacity: outroO, y: outroY }}
                className={cn(s.ink, "pointer-events-none absolute inset-0 flex flex-col items-center justify-center")}
              >
                <p className="text-[clamp(2rem,8vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[#F5F7FA]">
                  {OUTRO_1}
                </p>
                <p className="mt-2 text-[clamp(1.5rem,5.5vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
                  <span className={s.accent}>{OUTRO_2}</span>
                </p>
              </motion.div>
            </div>

            {/* Tüpler */}
            <div className="relative mt-[clamp(36px,6svh,64px)] w-[min(84vw,300px)] md:w-[min(64vw,540px)]">
              {/* Boru: tüp tepelerini bağlar; ışık boncuğu üzerinde ilerler */}
              <motion.div style={{ opacity: pipeO }} className="absolute inset-x-0 -top-[18px] h-px">
                <span className="absolute top-0 h-px bg-white/[0.14]" style={{ left: `${C0 * 100}%`, right: `${C0 * 100}%` }} />
                <span className="absolute top-0 h-px" style={{ left: `${C0 * 100}%`, right: `${C0 * 100}%` }}>
                  <motion.span className={cn(s.irisLine, "absolute inset-0 origin-left")} style={{ scaleX: pipeLit }} />
                </span>
                <motion.span className="absolute inset-x-0 top-0 h-0" style={{ x: beadX }}>
                  <span className="absolute top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2" style={{ left: `${C0 * 100}%` }}>
                    <span className="absolute inset-0 rounded-full bg-white/20" />
                    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.18)]" />
                  </span>
                </motion.span>
              </motion.div>

              {/* Sahte ışıma: tüplerin arkasında ayrı katman (radyal gradyan, filtre yok) */}
              <motion.div style={{ opacity: pipeO }} className="pointer-events-none absolute inset-0 grid grid-cols-6 gap-x-[3.448%]">
                {SPECTRUM.map((c, i) => (
                  <span key={c} className="relative">
                    <motion.span
                      initial={false}
                      animate={{ opacity: i === stage ? 1 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute -inset-x-[90%] -inset-y-[16%] rounded-full"
                      style={{ background: `radial-gradient(closest-side, ${rgba(c, 0.34)}, transparent)` }}
                    />
                  </span>
                ))}
              </motion.div>

              <div className="relative grid h-[clamp(150px,26svh,320px)] grid-cols-6 gap-x-[3.448%] md:h-[clamp(200px,32svh,320px)] [@media(max-height:520px)]:h-[96px]">
                {STAGES.map((st, i) => (
                  <Tube key={st.no} i={i} p={p} state={i < stage ? "done" : i === stage ? "on" : "off"} />
                ))}
              </div>

              {/* Kapanış: iris halka + inci disk → ekranı kaplar */}
              <div
                ref={ringRef}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-28 w-28 -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div style={{ scale: open }} className="absolute inset-0">
                  <motion.div style={{ scale: diskS, opacity: diskO }} className="absolute inset-[3px] rounded-full bg-[#F4F8FD]" />
                  <motion.svg style={{ opacity: ringO }} viewBox="0 0 112 112" className="absolute inset-0 h-full w-full overflow-visible">
                    <defs>
                      <IrisGradient id={`${gid}-ring`} x1={0} y1={0} x2={1} y2={1} />
                    </defs>
                    <circle cx={56} cy={56} r={54} fill="none" stroke={`url(#${gid}-ring)`} strokeWidth={12} strokeOpacity={0.16} />
                    <motion.circle
                      cx={56}
                      cy={56}
                      r={54}
                      fill="none"
                      stroke={`url(#${gid}-ring)`}
                      strokeWidth={3}
                      transform="rotate(-90 56 56)"
                      style={{ pathLength: ringDraw }}
                    />
                  </motion.svg>
                </motion.div>
              </div>
            </div>

            {/* Tek satırlık açıklama */}
            <motion.div style={{ opacity: textO }} className="mt-[clamp(22px,4svh,40px)] grid w-full max-w-md">
              {DESC.map((d, i) => (
                <motion.p
                  key={i}
                  initial={false}
                  animate={{ opacity: i === stage ? 1 : 0, y: i === stage ? 0 : 12 }}
                  transition={{ duration: 0.45, ease: EASE, delay: i === stage ? 0.06 : 0 }}
                  className="text-balance text-[15px] leading-[1.5] text-white/62 [grid-area:1/1] md:text-[18px]"
                >
                  {d}
                </motion.p>
              ))}
            </motion.div>

            {/* İlerleme noktaları */}
            <motion.div style={{ opacity: textO }} className="mt-5 flex items-center gap-2">
              {SPECTRUM.map((c, i) => (
                <span
                  key={c}
                  className={cn("h-1.5 rounded-full", i === stage ? "w-5" : "w-1.5")}
                  style={{ background: i <= stage ? c : "rgba(255,255,255,0.18)", opacity: i < stage ? 0.6 : 1 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ekran okuyucular için aşamaların tamamı */}
      <ol className="sr-only">
        {STAGES.map((st, i) => (
          <li key={st.no}>
            {st.no}. {st.name}: {DESC[i]}
          </li>
        ))}
      </ol>
      <p className="sr-only">
        {OUTRO_1} {OUTRO_2}
      </p>
    </Section>
  );
}

/** Tek cam tüp: dolgu kaydırmayla alttan yükselir (translateY, menisküs keskin kalır) */
function Tube({ i, p, state }: { i: number; p: MotionValue<number>; state: "off" | "on" | "done" }) {
  const c = SPECTRUM[i];
  const fill = useTransform(p, [A + BAND * (i + 0.06), A + BAND * (i + 0.72)], ["110%", "0%"]);
  const mx = useTransform(p, END.merge, ["0%", `${(3.125 - 1.25 * i) * 100}%`]);
  const ms = useTransform(p, END.merge, [1, 0.25]);
  const mo = useFullRange(p, [END.merge[0] + 0.02, END.merge[1]], [1, 0]);

  return (
    <motion.div style={{ x: mx, scaleX: ms, opacity: mo }} className="relative h-full">
      <span className="absolute -top-[18px] left-1/2 h-[18px] w-px -translate-x-1/2 bg-white/[0.14]" />
      <motion.div
        initial={false}
        animate={{ opacity: state === "done" ? 0.7 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-full overflow-hidden rounded-full border border-white/10 bg-[#0D0F14]"
      >
        <motion.div
          style={{ y: fill, background: `linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0) 26%), ${c}` }}
          className="absolute inset-[3px] rounded-full"
        >
          <span className="absolute inset-x-[22%] top-[5px] h-[2px] rounded-full bg-white/70" />
        </motion.div>
        <span className="pointer-events-none absolute inset-y-[8%] left-[16%] w-[18%] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.12),transparent)]" />
      </motion.div>
    </motion.div>
  );
}

/* ───────── Hareket azaltılmış: sabitlemesiz liste ───────── */

function GateList() {
  return (
    <Section id="alti-kapi" theme="ink" cv={1700} className="px-4 pb-[14svh] pt-[16svh] md:px-8">
      <div className="mx-auto max-w-6xl">
        <Chapter no="02" label="Filtreleme" />
        <Headline text={TITLE} className="mt-6 max-w-[15ch] lg:max-w-[17ch]" />
        <p className="mt-6 max-w-md text-[16px] leading-[1.55] text-white/62 md:text-[17px]">
          Su, musluğa ulaşmadan önce altı aşamalı filtrelemeden geçer.
        </p>
        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((st, i) => (
            <li key={st.no} className="flex gap-4 rounded-[22px] border border-white/10 bg-[#0D0F14] p-5">
              <span aria-hidden className="relative h-24 w-8 flex-none overflow-hidden rounded-full border border-white/10 bg-[#06070A]">
                <span
                  className="absolute inset-[3px] rounded-full"
                  style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0) 26%), ${SPECTRUM[i]}` }}
                />
              </span>
              <div>
                <Seg7 value={st.no} className="h-6 w-auto" />
                <h3 className="mt-3 text-[19px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#F5F7FA]">{st.name}</h3>
                {i === MINERAL_STAGE && (
                  <span className={cn(s.micro, "mt-2 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[#F5F7FA]")}>
                    {MINERAL.tag}
                  </span>
                )}
                <p className="mt-1.5 text-[15px] leading-[1.5] text-white/62">{DESC[i]}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[#F5F7FA]">
          {OUTRO_1} <span className={s.accent}>{OUTRO_2}</span>
        </p>
      </div>
    </Section>
  );
}
