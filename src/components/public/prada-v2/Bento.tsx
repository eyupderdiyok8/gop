"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Chapter, Headline, Reveal } from "./primitives";
import s from "./v2.module.css";

/** Fareyi takip eden kırmızı spot ışıklı kart */
function Tile({
  className,
  children,
  index,
  title,
  desc,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  index: string;
  title: string;
  desc: string;
  delay?: number;
}) {
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
  return (
    <Reveal className={cn("h-full", className)} delay={delay}>
      <div
        onPointerMove={onMove}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-b from-[#101010] to-[#0a0a0a] p-6 md:p-7"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgba(255,59,59,0.13), transparent 60%)" }}
        />
        <div className="relative flex min-h-[170px] flex-1 items-center justify-center">{children}</div>
        <div className="relative mt-6">
          <p className={cn(s.mono, "text-[10.5px] uppercase tracking-[0.24em] text-[#ff3b3b]")}>{index}</p>
          <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-white">{title}</h3>
          <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-white/55">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function Bento() {
  return (
    <section id="detaylar" className={cn(s.cv, "relative scroll-mt-16 px-5 py-[12vh] md:px-10")}>
      <div className="mx-auto max-w-[1440px]">
        <Chapter no="04" label="Detaylar" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Headline text="Her detay, *gönül rahatlığı* için." className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] text-white" />
          <p className="max-w-md text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-right">
            Güvenlik sensöründen musluğuna kadar 3.2 Prada, günlük kullanımda aklınızda soru işareti bırakmamak için
            tasarlandı.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(300px,auto)]">
          <Tile
            className="md:col-span-2"
            index="Güvenlik"
            title="Su Kaçak Sensörü"
            desc="Olası bir kaçakta suyu keserek evinizi korur."
          >
            <LeakScene />
          </Tile>
          <Tile className="lg:row-span-2" index="Depolama" title="3.2 G Metal Tank" desc="Dayanıklı metal depo; ihtiyaç anında hazır su." delay={0.08}>
            <TankScene />
          </Tile>
          <Tile index="Koruma" title="Basınç Düşürücü" desc="Şebeke basıncını dengeleyerek sistemi korur.">
            <GaugeScene />
          </Tile>
          <Tile index="Tasarım" title="Lüks Musluk" desc="Paslanmaz çelik, şık görünümlü özel musluk." delay={0.08}>
            <FaucetScene />
          </Tile>
          <Tile index="Seçenek" title="Pompalı & Pompasız" desc="Evinizin su basıncına uygun iki farklı model.">
            <PumpScene />
          </Tile>
          <Tile
            className="md:col-span-2"
            index="Boyut"
            title="Kompakt Tasarım"
            desc="38 × 28 × 43 cm ile dar mutfaklara bile sığar."
            delay={0.08}
          >
            <BoxScene />
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ───────── Su kaçak sensörü sahnesi ───────── */

const LEAK = { duration: 7, repeat: Infinity, ease: "easeInOut" as const };

function LeakScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const play = useInView(ref, { amount: 0.4 }) && !reduce;
  const t = (times: number[]) => ({ ...LEAK, times });

  return (
    <div ref={ref} className="relative w-full max-w-[560px]">
      {/* Durum rozetleri */}
      <div className="absolute right-0 top-0 z-10 h-8 w-[190px]">
        {[
          { label: "Sistem normal", dot: "#22c55e", o: [1, 1, 0, 0, 0, 1], times: [0, 0.34, 0.38, 0.9, 0.94, 1] },
          { label: "Kaçak algılandı", dot: "#f59e0b", o: [0, 0, 1, 1, 0, 0], times: [0, 0.34, 0.38, 0.6, 0.64, 1] },
          { label: "Su kesildi", dot: "#ff3b3b", o: [0, 0, 1, 1, 0], times: [0, 0.6, 0.64, 0.9, 0.94] },
        ].map((st, i) => (
          <motion.span
            key={st.label}
            className={cn(
              s.mono,
              "absolute right-0 top-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-white/85"
            )}
            initial={{ opacity: i === 0 ? 1 : 0 }}
            animate={play ? { opacity: st.o } : { opacity: i === 0 ? 1 : 0 }}
            transition={play ? t(st.times) : { duration: 0.3 }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.dot, boxShadow: `0 0 10px ${st.dot}` }} />
            {st.label}
          </motion.span>
        ))}
      </div>

      <svg viewBox="0 0 420 210" className="h-auto w-full">
        {/* zemin */}
        <line x1="10" y1="190" x2="410" y2="190" stroke="rgba(255,255,255,0.14)" />
        {/* cihaz */}
        <rect x="34" y="52" width="118" height="138" rx="20" fill="#1a0707" stroke="rgba(255,59,59,0.45)" />
        <rect x="34" y="150" width="118" height="40" rx="12" fill="#111" stroke="rgba(255,255,255,0.12)" />
        {[56, 84, 112].map((x) => (
          <rect key={x} x={x} y="66" width="18" height="78" rx="9" fill="rgba(255,59,59,0.28)" />
        ))}
        {/* boru */}
        <path d="M152 112 H262" stroke="rgba(255,255,255,0.22)" strokeWidth="8" strokeLinecap="round" />
        <motion.path
          d="M152 112 H262"
          stroke="#7fdcff"
          strokeWidth="2"
          strokeDasharray="6 10"
          strokeLinecap="round"
          animate={play ? { strokeDashoffset: [0, -64, -128, -128, -128, 0], opacity: [0.9, 0.9, 0.9, 0.15, 0.15, 0.9] } : {}}
          transition={play ? t([0, 0.3, 0.6, 0.64, 0.94, 1]) : undefined}
        />
        {/* vana */}
        <circle cx="196" cy="112" r="11" fill="#141414" stroke="rgba(255,255,255,0.35)" />
        <motion.g
          animate={play ? { rotate: [0, 0, 90, 90, 0] } : { rotate: 0 }}
          transition={play ? t([0, 0.6, 0.66, 0.92, 0.98]) : undefined}
        >
          <line x1="196" y1="98" x2="196" y2="126" stroke="#ff3b3b" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
        {/* bağlantı noktası ve damla */}
        <circle cx="240" cy="112" r="6" fill="#1f1f1f" stroke="rgba(255,255,255,0.3)" />
        <motion.path
          d="M240 118 C 236 125, 234 129, 240 133 C 246 129, 244 125, 240 118 Z"
          fill="#7fdcff"
          initial={{ opacity: 0 }}
          animate={
            play
              ? { opacity: [0, 0, 1, 1, 0, 0], y: [0, 0, 0, 56, 56, 0], scale: [0.3, 0.3, 1, 1, 1, 0.3] }
              : { opacity: 0 }
          }
          transition={play ? t([0, 0.06, 0.18, 0.27, 0.29, 1]) : undefined}
        />
        {/* su birikintisi */}
        <motion.ellipse
          cx="240"
          cy="190"
          ry="4"
          fill="rgba(127,220,255,0.35)"
          initial={{ rx: 0 }}
          animate={play ? { rx: [0, 0, 36, 36, 0] } : { rx: 0 }}
          transition={play ? t([0, 0.28, 0.4, 0.9, 0.98]) : undefined}
        />
        {/* sensör */}
        <rect x="292" y="182" width="52" height="10" rx="5" fill="#1d1d1d" stroke="rgba(255,255,255,0.25)" />
        <motion.circle
          cx="318"
          cy="187"
          r="2.6"
          animate={
            play
              ? { fill: ["#22c55e", "#22c55e", "#f59e0b", "#f59e0b", "#ff3b3b", "#ff3b3b", "#22c55e"] }
              : { fill: "#22c55e" }
          }
          transition={play ? t([0, 0.34, 0.38, 0.6, 0.64, 0.92, 1]) : undefined}
        />
        {[0, 1].map((k) => (
          <motion.circle
            key={k}
            cx="318"
            cy="186"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.2"
            initial={{ r: 4, opacity: 0 }}
            animate={play ? { r: [4, 4, 38, 4, 38, 4], opacity: [0, 0, 0.8, 0, 0.8, 0] } : { opacity: 0 }}
            transition={play ? { ...t([0, 0.36 + k * 0.04, 0.46 + k * 0.04, 0.47 + k * 0.04, 0.58, 1]) } : undefined}
          />
        ))}
      </svg>
    </div>
  );
}

/* ───────── Tank sahnesi ───────── */

function TankScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.4 });
  // Dalgalar yalnızca kart görünürken akar; ekran dışında işlemciyi meşgul etmez
  const flow = inView && !reduce;
  const wave = "M-200 0 Q-175 -8 -150 0 T-100 0 T-50 0 T0 0 T50 0 T100 0 T150 0 T200 0 T250 0 T300 0 T350 0 T400 0 V320 H-200 Z";

  return (
    <div ref={ref} className="relative flex w-full items-center justify-center gap-6 py-4">
      <svg viewBox="0 0 200 300" className="h-[260px] w-auto lg:h-[340px]">
        <defs>
          <clipPath id="p2-tank-clip">
            <rect x="44" y="34" width="112" height="236" rx="54" />
          </clipPath>
          <linearGradient id="p2-tank-metal" x1="0" x2="1">
            <stop offset="0" stopColor="#2a2a2a" />
            <stop offset="0.35" stopColor="#3d3d3d" />
            <stop offset="0.55" stopColor="#1c1c1c" />
            <stop offset="1" stopColor="#111" />
          </linearGradient>
          <linearGradient id="p2-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fdcff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#2b8fd6" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x="88" y="14" width="24" height="22" rx="6" fill="#262626" stroke="rgba(255,255,255,0.2)" />
        <rect x="44" y="34" width="112" height="236" rx="54" fill="url(#p2-tank-metal)" />
        <g clipPath="url(#p2-tank-clip)">
          <motion.g
            initial={{ y: 262 }}
            animate={inView ? { y: 96 } : { y: 262 }}
            transition={{ duration: reduce ? 0 : 2.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.path
              d={wave}
              fill="url(#p2-water)"
              initial={{ x: 0 }}
              animate={flow ? { x: [0, 100] } : { x: 0 }}
              transition={flow ? { duration: 3.2, repeat: Infinity, ease: "linear" } : { duration: 0 }}
            />
            <g transform="translate(0 6)">
              <motion.path
                d={wave}
                fill="rgba(127,220,255,0.25)"
                initial={{ x: 100 }}
                animate={flow ? { x: [100, 0] } : { x: 100 }}
                transition={flow ? { duration: 4.4, repeat: Infinity, ease: "linear" } : { duration: 0 }}
              />
            </g>
          </motion.g>
          <rect x="58" y="40" width="10" height="224" rx="5" fill="#fff" opacity="0.08" />
        </g>
        <rect x="44" y="34" width="112" height="236" rx="54" fill="none" stroke="rgba(255,255,255,0.22)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="166" x2={i % 2 ? 172 : 178} y1={70 + i * 40} y2={70 + i * 40} stroke="rgba(255,255,255,0.3)" />
        ))}
      </svg>
      <div className="text-left">
        <p className={cn(s.serif, "text-[64px] italic leading-none text-white lg:text-[80px]")}>3.2</p>
        <p className={cn(s.mono, "mt-2 text-[10.5px] uppercase tracking-[0.24em] text-white/55")}>Galon · Metal</p>
      </div>
    </div>
  );
}

/* ───────── Basınç göstergesi ───────── */

function polar(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: 110 + r * Math.sin(a), y: 118 - r * Math.cos(a) };
}

function arc(from: number, to: number, r: number) {
  const p1 = polar(from, r);
  const p2 = polar(to, r);
  return `M${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
}

function GaugeScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.5 });
  const angle = useMotionValue(-80);
  const x2 = useTransform(angle, (a) => polar(a, 70).x);
  const y2 = useTransform(angle, (a) => polar(a, 70).y);
  const [settled, setSettled] = useState(false);
  useEffect(() => angle.on("change", (v) => setSettled(Math.abs(v) < 12)), [angle]);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      angle.set(0);
      return;
    }
    const controls = animate(angle, [-80, 74, 62, 70, -6, 4, 0], {
      duration: 3.4,
      times: [0, 0.28, 0.36, 0.44, 0.78, 0.9, 1],
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1.6,
    });
    return () => controls.stop();
  }, [inView, reduce, angle]);

  return (
    <div ref={ref} className="relative w-full max-w-[260px]">
      <svg viewBox="0 0 220 140" className="h-auto w-full">
        <path d={arc(-90, 90, 86)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />
        <path d={arc(-28, 28, 86)} fill="none" stroke="#22c55e" strokeOpacity="0.8" strokeWidth="10" />
        <path d={arc(52, 90, 86)} fill="none" stroke="#ff3b3b" strokeOpacity="0.85" strokeWidth="10" strokeLinecap="round" />
        {Array.from({ length: 13 }, (_, i) => -90 + i * 15).map((a) => {
          const p1 = polar(a, 72);
          const p2 = polar(a, a % 45 === 0 ? 62 : 67);
          return <line key={a} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />;
        })}
        <motion.line x1={110} y1={118} x2={x2} y2={y2} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="110" cy="118" r="8" fill="#0a0a0a" stroke="#fff" strokeWidth="2" />
      </svg>
      <p
        className={cn(
          s.mono,
          "mx-auto mt-2 w-fit rounded-full border px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] transition-colors duration-300",
          settled ? "border-[#22c55e]/40 text-[#4ade80]" : "border-[#ff3b3b]/40 text-[#ff6b6b]"
        )}
      >
        {settled ? "Basınç dengelendi" : "Yüksek şebeke basıncı"}
      </p>
    </div>
  );
}

/* ───────── Musluk ───────── */

const POUR = { duration: 6, repeat: Infinity, ease: "easeInOut" as const };

function FaucetScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const play = useInView(ref, { amount: 0.4 }) && !reduce;

  return (
    <div ref={ref} className="w-full max-w-[250px]">
      <svg viewBox="0 0 220 200" className="h-auto w-full" role="img" aria-label="Paslanmaz çelik musluktan bardağa akan su">
        <defs>
          <linearGradient id="p2-chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8a8a8a" />
            <stop offset="0.3" stopColor="#f4f4f4" />
            <stop offset="0.55" stopColor="#9d9d9d" />
            <stop offset="0.8" stopColor="#e6e6e6" />
            <stop offset="1" stopColor="#7d7d7d" />
          </linearGradient>
          <clipPath id="p2-glass-clip">
            <path d="M131 128 H173 L168 182 H136 Z" />
          </clipPath>
        </defs>

        <line x1="10" y1="184" x2="210" y2="184" stroke="rgba(255,255,255,0.14)" />
        <rect x="56" y="171" width="34" height="13" rx="4" fill="url(#p2-chrome)" />
        <path d="M73 173 V84 C73 36 152 30 152 78 V88" fill="none" stroke="url(#p2-chrome)" strokeWidth="9" strokeLinecap="round" />
        <path d="M80 72 C88 50 122 42 140 56" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="146.5" y="86" width="11" height="6" rx="2" fill="#d4d4d4" />
        <path d="M77 128 L102 113" stroke="url(#p2-chrome)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="77" cy="128" r="6.5" fill="url(#p2-chrome)" />

        {/* akan su */}
        <motion.line
          x1="152"
          y1="94"
          x2="152"
          y2="178"
          stroke="#7fdcff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="7 7"
          initial={{ strokeDashoffset: 0, opacity: 1 }}
          animate={play ? { strokeDashoffset: [0, -84], opacity: [1, 1, 0, 0, 1] } : { strokeDashoffset: 0, opacity: 1 }}
          transition={
            play
              ? {
                  strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
                  opacity: { ...POUR, times: [0, 0.6, 0.66, 0.95, 1] },
                }
              : undefined
          }
        />

        {/* bardak */}
        <g clipPath="url(#p2-glass-clip)">
          <motion.rect
            x="128"
            width="48"
            height="64"
            fill="rgba(127,220,255,0.38)"
            initial={{ y: 182, opacity: 1 }}
            animate={play ? { y: [182, 142, 142, 142, 182], opacity: [1, 1, 1, 0, 0] } : { y: 150, opacity: 1 }}
            transition={play ? { ...POUR, times: [0, 0.6, 0.85, 0.95, 1] } : { duration: 0.6 }}
          />
        </g>
        <path d="M131 128 L136 182 H168 L173 128" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M137 136 L140 174" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ───────── Pompalı / Pompasız ───────── */

function PumpScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [pump, setPump] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setPump((p) => !p), 2800);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="w-full max-w-[300px]">
      <div className="relative grid grid-cols-2 rounded-full border border-white/10 bg-black/50 p-1">
        <motion.span
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white"
          animate={{ x: pump ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        />
        {["Pompasız", "Pompalı"].map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => setPump(i === 1)}
            className={cn(
              "relative z-10 rounded-full py-2 text-sm font-semibold transition-colors duration-300",
              pump === (i === 1) ? "text-black" : "text-white/60"
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <div className={cn(s.mono, "flex justify-between text-[10px] uppercase tracking-[0.18em] text-white/50")}>
          <span>Giriş basıncı</span>
          <span>{pump ? "Pompa devrede" : "Şebeke yeterli"}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="flex h-full"
            animate={{ width: pump ? "82%" : "70%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span className="h-full bg-[#22c55e]" animate={{ width: pump ? "34%" : "100%" }} transition={{ duration: 0.8 }} />
            <motion.span
              className="h-full bg-gradient-to-r from-[#ff3b3b] to-[#ff8f70]"
              animate={{ width: pump ? "66%" : "0%" }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        </div>
        <p className="mt-3 text-[13px] text-white/50">
          {pump ? "Basıncı düşük evlerde pompa, sistemi verimli çalıştırır." : "Basıncı yeterli evlerde sade ve sessiz çözüm."}
        </p>
      </div>
    </div>
  );
}

/* ───────── İzometrik ölçü kutusu ───────── */

const ISO = (() => {
  const k = 2.7;
  const W = 28 * k;
  const D = 43 * k;
  const H = 38 * k;
  const c = Math.cos(Math.PI / 6);
  const p = (x: number, y: number, z: number) => ({ x: (x - z) * c + 165, y: (x + z) * 0.5 - y + 132 });
  const A = p(0, 0, 0);
  const B = p(W, 0, 0);
  const C = p(W, 0, D);
  const Dp = p(0, 0, D);
  const A2 = p(0, H, 0);
  const B2 = p(W, H, 0);
  const C2 = p(W, H, D);
  const D2 = p(0, H, D);
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  return {
    visible: [seg(B, C), seg(C, Dp), seg(C, C2), seg(B, B2), seg(Dp, D2), seg(A2, B2), seg(B2, C2), seg(C2, D2), seg(D2, A2)],
    hidden: [seg(A, B), seg(A, Dp), seg(A, A2)],
    labels: [
      { t: "38 cm", x: Dp.x - 16, y: (Dp.y + D2.y) / 2, anchor: "end" as const },
      { t: "28 cm", x: (C.x + Dp.x) / 2 - 10, y: (C.y + Dp.y) / 2 + 22, anchor: "end" as const },
      { t: "43 cm", x: (B.x + C.x) / 2 + 14, y: (B.y + C.y) / 2 + 20, anchor: "start" as const },
    ],
  };
})();

function BoxScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-center md:gap-14">
      <svg viewBox="0 0 260 250" className="h-[220px] w-auto">
        {ISO.hidden.map((d, i) => (
          <path key={d} d={d} stroke="rgba(255,255,255,0.18)" strokeDasharray="3 5" fill="none" opacity={inView ? 1 : 0} style={{ transition: `opacity 0.6s ${0.2 + i * 0.1}s` }} />
        ))}
        {ISO.visible.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke={i < 5 ? "#ff3b3b" : "rgba(255,255,255,0.75)"}
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.65, 0, 0.35, 1] }}
          />
        ))}
        {ISO.labels.map((l, i) => (
          <motion.text
            key={l.t}
            x={l.x}
            y={l.y}
            textAnchor={l.anchor}
            className={s.mono}
            fill="rgba(255,255,255,0.8)"
            fontSize="12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1 + i * 0.15 }}
          >
            {l.t}
          </motion.text>
        ))}
      </svg>
      <dl className="grid grid-cols-3 gap-6 text-center md:grid-cols-1 md:gap-4 md:text-left">
        {[
          { k: "Yükseklik", v: "38" },
          { k: "Genişlik", v: "28" },
          { k: "Derinlik", v: "43" },
        ].map((m) => (
          <div key={m.k}>
            <dt className={cn(s.mono, "text-[10px] uppercase tracking-[0.22em] text-white/50")}>{m.k}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
              {m.v}
              <span className="ml-1 text-sm font-normal text-white/55">cm</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
