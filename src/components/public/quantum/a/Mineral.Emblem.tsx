"use client";

import { useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLive, useSvgId } from "./primitives";
import { MINERAL_HUES } from "./tokens";
import s from "./theme.module.css";
import mn from "./Mineral.module.css";

/**
 * Mineral amblemi: 48 düz renkli yay (konik maske yok, keskin ve ucuz) + çevresinde mineral taneleri.
 * Halka ayrı bir katmanda yalnızca görünürken 60 sn'de bir tur döner; açılışta tek bir beyaz parıltı geçer.
 * Ortada cihazın camındaki "B12" işaretinin inci zemindeki karşılığı ve "Alkali" etiketi.
 * Ölçek çizgisi ya da sayı yok: değer/ölçüm iddiası okunmasın.
 */

const C = 210; // merkez (viewBox 0 0 420 420)
const R = 166; // halka yarıçapı
const SW = 30; // halka kalınlığı
const N = 48;
const STEP = 360 / N;
const DISK = R - SW / 2 - 5;

function rgb(hex: string) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function mix(a: string, b: string, t: number) {
  const A = rgb(a);
  const B = rgb(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

/** t ∈ [0,1): mineral tonlarında döngüsel renk */
function hue(t: number) {
  const n = MINERAL_HUES.length;
  const p = t * n;
  const i = Math.floor(p) % n;
  return mix(MINERAL_HUES[i], MINERAL_HUES[(i + 1) % n], p - Math.floor(p));
}

function pt(deg: number, r: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

const fmt = (deg: number, r: number) => pt(deg, r).map((n) => n.toFixed(2)).join(" ");

function arc(a0: number, a1: number, r: number) {
  return `M${fmt(a0, r)} A${r} ${r} 0 0 1 ${fmt(a1, r)}`;
}

/** Tam sayı karması: sunucu ve tarayıcıda aynı sonucu verir (0–1) */
function hash(k: number) {
  let h = Math.imul(k ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const SEGS = Array.from({ length: N }, (_, k) => ({
  d: arc(k * STEP + 0.85, (k + 1) * STEP - 0.85, R),
  glow: arc(k * STEP, (k + 1) * STEP, R),
  color: hue(k / N),
}));

/** Halkanın dışında dağınık mineral taneleri (halkayla birlikte döner) */
const GRAINS = Array.from({ length: 34 }, (_, k) => {
  const [x, y] = pt(k * (360 / 34) + hash(k) * 8, 190 + hash(k + 99) * 18);
  return {
    x: +x.toFixed(2),
    y: +y.toFixed(2),
    r: +(1.4 + hash(k + 7) * 2.6).toFixed(2),
    color: hue(hash(k + 31)),
    o: +(0.35 + hash(k + 13) * 0.5).toFixed(2),
  };
});

/** Diskin içinde alttan yükselen kabarcıklar */
const BUBBLES = Array.from({ length: 9 }, (_, k) => ({
  x: +(C - 92 + hash(k + 200) * 184).toFixed(1),
  y: +(C + 104 + hash(k + 300) * 22).toFixed(1),
  r: +(2.2 + hash(k + 400) * 3.4).toFixed(2),
  d: +(k * 0.47).toFixed(2),
  dur: +(3.6 + hash(k + 500) * 1.8).toFixed(2),
  color: hue(hash(k + 600)),
}));

export function MineralEmblem({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref);
  const id = useSvgId("mineral");

  return (
    <div ref={ref} aria-hidden className={cn("relative aspect-square", !live && s.paused, className)}>
      {/* yumuşak renk halesi (filtre yok, statik) */}
      <div className="absolute inset-[-16%] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.16),rgba(47,123,255,0.1)_52%,rgba(139,92,246,0.05)_68%,transparent_80%)]" />

      {/* dönen halka + taneler: tek katman, compositor'da döner */}
      <svg
        viewBox="0 0 420 420"
        className={cn(s.spin, "absolute inset-0 h-full w-full overflow-visible")}
        style={{ "--dur": "60s" } as CSSProperties}
      >
        <g>
          {GRAINS.map((g, i) => (
            <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={g.color} fillOpacity={g.o} />
          ))}
        </g>
        <g fill="none">
          {/* parıltı: geniş, soluk kopya */}
          {SEGS.map((g, i) => (
            <path key={`g${i}`} d={g.glow} stroke={g.color} strokeWidth={SW + 28} strokeOpacity={0.12} />
          ))}
          {SEGS.map((g, i) => (
            <path key={i} d={g.d} stroke={g.color} strokeWidth={SW} />
          ))}
        </g>
      </svg>

      {/* sabit iç disk, kabarcıklar ve B12 */}
      <svg viewBox="0 0 420 420" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`${id}-disk`} cx="50%" cy="36%" r="68%">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.75" stopColor="#F3F7FC" />
            <stop offset="1" stopColor="#E3ECF7" />
          </radialGradient>
          <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`${id}-12`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3EA6FF" />
            <stop offset="1" stopColor="#2F6BFF" />
          </linearGradient>
          <clipPath id={`${id}-clip`}>
            <circle cx={C} cy={C} r={DISK} />
          </clipPath>
        </defs>

        <circle cx={C} cy={C} r={DISK} fill={`url(#${id}-disk)`} />

        {/* mineral kabarcıkları: diskin altından yükselir */}
        <g clipPath={`url(#${id}-clip)`}>
          {BUBBLES.map((b, i) => (
            <circle
              key={i}
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill="none"
              stroke={b.color}
              strokeWidth={1.6}
              className={mn.rise}
              style={{ "--d": `${b.d}s`, "--dur": `${b.dur}s`, "--ry": "-190px", "--o": "0.55" } as CSSProperties}
            />
          ))}
        </g>

        {/* 1px beyaz iç ve dış kenar */}
        <circle cx={C} cy={C} r={R - SW / 2 - 0.5} fill="none" stroke="#fff" strokeWidth={1.5} />
        <circle cx={C} cy={C} r={R + SW / 2 + 0.5} fill="none" stroke="#fff" strokeOpacity={0.9} strokeWidth={1} />

        {/* açılışta tek seferlik beyaz parıltı yayı (hareket azaltılınca CSS ile gizli) */}
        <motion.circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke={`url(#${id}-shine)`}
          strokeWidth={SW + 2}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.09 0.91"
          className="motion-reduce:hidden"
          initial={{ rotate: -110, opacity: 0 }}
          whileInView={{ rotate: 250, opacity: [0, 0.9, 0.9, 0] }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{
            rotate: { duration: 1.9, ease: [0.45, 0, 0.2, 1], delay: 0.3 },
            opacity: { duration: 1.9, times: [0, 0.15, 0.75, 1], delay: 0.3 },
          }}
        />

        {/* B12: cihaz camındaki işaretin inci zemindeki karşılığı */}
        <text x={C} y={C + 18} textAnchor="middle" className={s.display} fontWeight={700} letterSpacing="-4">
          <tspan fontSize={118} fill="#0B0F17">
            B
          </tspan>
          <tspan fontSize={54} dx={6} dy={10} fill={`url(#${id}-12)`}>
            12
          </tspan>
        </text>
        <text
          x={C}
          y={C + 74}
          textAnchor="middle"
          className={s.mono}
          fontSize={15}
          letterSpacing={6}
          fill="#475467"
        >
          ALKALİ
        </text>
      </svg>
    </div>
  );
}
