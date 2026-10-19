"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Chapter, Headline } from "./primitives";
import s from "./v2.module.css";

/* ───────── Damla geometrisi (viewBox 240 × 300) ───────── */

const DROP = "M120 12 C138 52 208 118 208 192 A88 88 0 0 1 32 192 C32 118 102 52 120 12 Z";

const SEDIMENT = ["#b07a43", "#8c5a2c", "#c49458"];
const CHLORINE = "#d4e157";
const ODOR = "#9ccc65";
const DISSOLVED = "#e5e7eb";
const CLEAR = "#7fdcff";

/** Seviyeye göre su tonu ve damla ışıltısı: 0 = arıtılmamış, 5 = son kademe */
const TINT = [
  "rgba(181,132,74,0.42)",
  "rgba(176,160,96,0.36)",
  "rgba(150,172,122,0.32)",
  "rgba(118,186,180,0.32)",
  "rgba(86,190,240,0.36)",
  "rgba(110,214,255,0.44)",
];
const GLOW = [
  "rgba(196,140,80,0.35)",
  "rgba(190,170,100,0.3)",
  "rgba(150,180,120,0.3)",
  "rgba(120,190,180,0.32)",
  "rgba(90,195,245,0.42)",
  "rgba(120,215,255,0.6)",
];

type Stage = {
  code: string;
  label: string;
  name: string;
  color: string;
  desc: string;
  tags: { t: string; c: string }[];
  result?: boolean;
};

const STAGES: Stage[] = [
  {
    code: "00",
    label: "Başlangıç",
    name: "Arıtılmamış su",
    color: "#a8a29e",
    desc: "Şebeke suyunda gözle görülmeyen pek çok madde bulunabilir: kum, pas, klor, koku ve çözünmüş tuzlar. Şimdi bir damlayı takip edin.",
    tags: [],
  },
  {
    code: "PP",
    label: "Kademe 01",
    name: "Sediment Filtre",
    color: "#3b82f6",
    desc: "Suyun ilk durağı. Kum, pas ve askıdaki partikülleri tutar; suyun berraklığını artırır ve sonraki filtreleri korur.",
    tags: [
      { t: "Kum", c: SEDIMENT[2] },
      { t: "Pas", c: SEDIMENT[0] },
      { t: "Askıdaki partiküller", c: SEDIMENT[1] },
    ],
  },
  {
    code: "GAC",
    label: "Kademe 02",
    name: "Granül Aktif Karbon",
    color: "#ef4444",
    desc: "Aktif karbon granülleri klor, koku, tat bozucular ve organik kimyasalları azaltır.",
    tags: [
      { t: "Klor", c: CHLORINE },
      { t: "Koku ve tat", c: CHLORINE },
      { t: "Organik kimyasallar", c: CHLORINE },
    ],
  },
  {
    code: "CTO",
    label: "Kademe 03",
    name: "Granül Karbon Filtre",
    color: "#22c55e",
    desc: "İkinci kademe karbon arıtımı. Kalan klor, kötü tat ve kokuyu giderir.",
    tags: [
      { t: "Kalan klor", c: ODOR },
      { t: "Kötü tat", c: ODOR },
      { t: "Koku", c: ODOR },
    ],
  },
  {
    code: "RO",
    label: "Kademe 04",
    name: "Cruze 80 GPD Membran",
    color: "#d4a94e",
    desc: "Reverse osmosis sisteminin kalbi. Mikroskobik gözenekli membran, suda çözünmüş maddeleri süzer.",
    tags: [
      { t: "Çözünmüş maddeler", c: DISSOLVED },
      { t: "Kireç", c: DISSOLVED },
    ],
  },
  {
    code: "POST",
    label: "Kademe 05",
    name: "Post Karbon Filtre",
    color: "#e5e7eb",
    desc: "Tanktan musluğa giden suya son dokunuş. Tadı tazeler; bardağınıza berrak ve lezzetli su ulaşır.",
    tags: [
      { t: "Berrak", c: CLEAR },
      { t: "Lezzetli", c: CLEAR },
    ],
    result: true,
  },
];

/* ───────── Deterministik partiküller (sunucu/istemci aynı) ───────── */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function insideDrop(x: number, y: number, margin: number) {
  const dx = x - 120;
  const dy = y - 192;
  if (dx * dx + dy * dy <= (88 - margin) ** 2) return true;
  if (y > 12 && y < 192) return Math.abs(dx) <= 88 * Math.sqrt((y - 12) / 180) - margin;
  return false;
}

type Particle = {
  id: number;
  type: 0 | 1 | 2 | 3;
  x: number;
  y: number;
  r: number;
  color: string;
  dur: number;
  delay: number;
  points?: string;
};

const PARTICLES: Particle[] = (() => {
  const rand = mulberry32(20261017);
  const spec: { type: Particle["type"]; count: number; r: [number, number] }[] = [
    { type: 0, count: 11, r: [4.5, 7.5] },
    { type: 1, count: 14, r: [2.4, 3.6] },
    { type: 2, count: 7, r: [6, 8.5] },
    { type: 3, count: 34, r: [1, 1.8] },
  ];
  const out: Particle[] = [];
  let id = 0;
  for (const { type, count, r } of spec) {
    for (let k = 0; k < count; k++) {
      let x = 120;
      let y = 200;
      for (let tries = 0; tries < 60; tries++) {
        x = 36 + rand() * 168;
        y = 58 + rand() * 216;
        if (insideDrop(x, y, 12)) break;
      }
      const radius = r[0] + rand() * (r[1] - r[0]);
      const p: Particle = {
        id: id++,
        type,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        r: Math.round(radius * 10) / 10,
        color: type === 0 ? SEDIMENT[k % 3] : type === 1 ? CHLORINE : type === 2 ? ODOR : DISSOLVED,
        dur: Math.round((7 + rand() * 6) * 10) / 10,
        delay: Math.round(rand() * 80) / 10,
      };
      if (type === 0) {
        p.points = Array.from({ length: 6 }, (_, j) => {
          const a = (j / 6) * Math.PI * 2 + rand() * 0.5;
          const rr = radius * (0.7 + rand() * 0.45);
          return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
        }).join(" ");
      }
      out.push(p);
    }
  }
  return out;
})();

const BUBBLES = [62, 92, 118, 146, 170, 104].map((x, i) => ({ x, r: 2 + (i % 3), delay: i * 0.8, dur: 4.5 + (i % 3) }));
const SPARKLES = [
  { x: 92, y: 150, r: 7 },
  { x: 150, y: 120, r: 5 },
  { x: 166, y: 206, r: 8 },
  { x: 78, y: 222, r: 5 },
  { x: 124, y: 250, r: 6 },
  { x: 118, y: 86, r: 4 },
];

const star = (r: number) => {
  const q = r * 0.22;
  return `M0 ${-r} L${q} ${-q} L${r} 0 L${q} ${q} L0 ${r} L${-q} ${q} L${-r} 0 L${-q} ${-q} Z`;
};

/* ───────── Bileşenler ───────── */

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const [level, setLevel] = useState(0);
  const inView = useInView(sectionRef, { margin: "200px 0px" });

  // Kademe takibi yalnızca bölüm ekrana yakınken çalışır; uzaktayken ölçüm yapıp ertelenen yerleşimi zorlamaz
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = window.innerHeight * (window.innerWidth >= 1024 ? 0.5 : 0.74);
      let idx = 0;
      blocks.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < line) idx = i;
      });
      setLevel(idx);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [inView]);

  return (
    <section ref={sectionRef} id="yolculuk" className={cn(s.cvTall, "relative scroll-mt-16")}>
      <div className="mx-auto max-w-[1440px] px-5 pt-6 md:px-10">
        <Chapter no="02" label="Yolculuk" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Headline text="Bir damlanın *beş durağı.*" className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] text-white" />
          <p className="max-w-md text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-right">
            Kaydırdıkça suyun beş kademede nasıl arındığını izleyin. Her durak, suyu bir öncekinden daha berrak bırakır.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-6 max-w-[1440px] px-5 md:px-10 lg:mt-0 lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Yapışkan panel: mobilde damla + aktif kademe metni, masaüstünde yalnızca damla */}
        <div className="sticky top-16 z-10 -mx-5 flex h-[calc(100svh-4rem)] flex-col items-center gap-5 bg-[#050505] px-5 pb-24 pt-3 md:-mx-10 md:px-10 lg:top-0 lg:mx-0 lg:h-[100svh] lg:justify-center lg:self-start lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0">
          <DropVisual level={level} playing={inView} />
          <div className="w-full max-w-md lg:hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <StageText stage={STAGES[level]} active compact />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Kademeler: masaüstünde metin blokları, mobilde kaydırma mesafesi */}
        <div className="relative pb-[8svh] lg:pb-[26svh]">
          {STAGES.map((st, i) => (
            <div
              key={st.code}
              ref={(el) => {
                blocks.current[i] = el;
              }}
              className="h-[70svh] lg:flex lg:h-auto lg:min-h-[88svh] lg:flex-col lg:justify-center lg:py-10"
            >
              <div className="hidden lg:block">
                <StageText stage={st} active={level === i} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StageText({ stage, active, compact = false }: { stage: Stage; active: boolean; compact?: boolean }) {
  return (
    <div className={cn("transition-opacity duration-700", active ? "opacity-100" : "opacity-25")}>
      <div className={cn("flex items-center", compact ? "gap-3" : "gap-4")}>
        <span
          className={cn(
            s.mono,
            "flex items-center justify-center rounded-full border font-semibold tracking-[0.08em] transition-shadow duration-700",
            compact ? "h-10 w-10 text-[9.5px]" : "h-14 w-14 text-[11px]"
          )}
          style={{ borderColor: stage.color, color: stage.color, boxShadow: active ? `0 0 34px ${stage.color}66` : "none" }}
        >
          {stage.code}
        </span>
        <span className={cn(s.mono, "text-[11px] uppercase tracking-[0.26em] text-white/55")}>{stage.label}</span>
      </div>
      <h3
        className={cn(
          "font-semibold leading-[1] tracking-[-0.04em] text-white",
          compact ? "mt-3 text-[28px]" : "mt-6 text-[clamp(2.1rem,4.4vw,3.7rem)]"
        )}
      >
        {stage.name}
      </h3>
      <p className={cn("max-w-lg leading-relaxed text-white/60", compact ? "mt-2 text-[15px]" : "mt-5 text-[17px]")}>
        {stage.desc}
      </p>
      {stage.tags.length > 0 && (
        <div className={compact ? "mt-4" : "mt-7"}>
          <p className={cn(s.mono, "text-[10.5px] uppercase tracking-[0.24em] text-white/50", compact && "sr-only")}>
            {stage.result ? "Sonuç" : "Tutulanlar"}
          </p>
          <ul className={cn("flex flex-wrap gap-2", !compact && "mt-3")}>
            {stage.tags.map((t) => (
              <li
                key={t.t}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-white/80",
                  compact ? "px-3 py-1 text-[13px]" : "px-3.5 py-1.5 text-sm"
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: t.c }} />
                {t.t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DropVisual({ level, playing }: { level: number; playing: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-[240/300] h-[25svh] lg:h-[min(60svh,540px)]">
        {/* Işıltı: filtre yerine radyal maskeli renk katmanı (GPU'yu yormaz, renk geçişi yumuşak) */}
        <div
          aria-hidden
          className="absolute -inset-[22%] [mask-image:radial-gradient(closest-side,black,transparent)]"
          style={{ backgroundColor: GLOW[level], transition: "background-color 1.2s ease" }}
        />
        <svg
          viewBox="0 0 240 300"
          className={cn("absolute inset-0 h-full w-full overflow-visible", !playing && s.paused)}
          role="img"
          aria-label="Su damlasının arınma kademelerini gösteren temsilî çizim"
        >
          <defs>
            <clipPath id="p2-drop-clip">
              <path d={DROP} />
            </clipPath>
            <radialGradient id="p2-drop-shade" cx="35%" cy="38%" r="75%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="55%" stopColor="#fff" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
            </radialGradient>
            <linearGradient id="p2-scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="80%" stopColor="#fff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          <path d={DROP} style={{ fill: TINT[level], transition: "fill 1.2s ease" }} />

          <g clipPath="url(#p2-drop-clip)">
            {PARTICLES.map((p, i) => (
              <ParticleShape key={p.id} p={p} visible={level <= p.type} order={i} />
            ))}

            {level >= 4 &&
              BUBBLES.map((b, i) => (
                <circle
                  key={i}
                  cx={b.x}
                  cy={272}
                  r={b.r}
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth={0.8}
                  className={s.bubble}
                  style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
                />
              ))}

            {level === 5 &&
              SPARKLES.map((sp, i) => (
                <g key={i} transform={`translate(${sp.x} ${sp.y})`}>
                  <path d={star(sp.r)} fill="#fff" className={s.twinkle} style={{ animationDelay: `${i * 0.35}s` }} />
                </g>
              ))}

            {level > 0 && (
              <motion.g key={level} initial={{ y: -80 }} animate={{ y: 310 }} transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}>
                <rect x={0} y={0} width={240} height={80} fill="url(#p2-scan)" />
              </motion.g>
            )}

            <path d={DROP} fill="url(#p2-drop-shade)" />
          </g>

          <path d={DROP} fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth={1.2} />
          <path
            d="M68 168 C62 196 68 226 90 246"
            fill="none"
            stroke="#fff"
            strokeOpacity={0.4}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mt-5 flex flex-col items-center gap-2.5 lg:mt-8">
        <div className="flex items-center gap-1.5" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={cn("h-1 rounded-full transition-all duration-500", i <= level ? "w-8 bg-[#ff3b3b]" : "w-4 bg-white/15")}
            />
          ))}
        </div>
        <p className={cn(s.mono, "text-[10.5px] uppercase tracking-[0.24em] text-white/60")} aria-live="polite">
          {level === 0 ? "Arıtılmamış su" : `Kademe 0${level} / 05 · ${STAGES[level].code}`}
        </p>
        <p className="text-[10px] text-white/45">Temsilî görseldir</p>
      </div>
    </div>
  );
}

function ParticleShape({ p, visible, order }: { p: Particle; visible: boolean; order: number }) {
  const lag = visible ? 0 : (order % 9) * 0.05;
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      <g
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translate(0px, 0px) scale(1)" : "translate(0px, 36px) scale(0.3)",
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: `opacity 0.6s ease ${lag}s, transform 0.9s cubic-bezier(0.5, 0, 0.75, 0) ${lag}s`,
        }}
      >
        <g className={s.drift} style={{ animationDuration: `${p.dur}s`, animationDelay: `-${p.delay}s` }}>
          {p.type === 0 && <polygon points={p.points} fill={p.color} />}
          {p.type === 1 && <circle r={p.r} fill={p.color} fillOpacity={0.9} />}
          {p.type === 2 && (
            <path
              d={`M${-p.r} 0 q${p.r / 2} ${-p.r * 0.7} ${p.r} 0 t${p.r} 0`}
              fill="none"
              stroke={p.color}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeOpacity={0.85}
            />
          )}
          {p.type === 3 && <circle r={p.r} fill={p.color} fillOpacity={0.75} />}
        </g>
      </g>
    </g>
  );
}
