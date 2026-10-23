"use client";

import { useRef, type CSSProperties, type SVGProps } from "react";
import { cn } from "@/lib/utils";
import { useLive, useSvgId } from "./primitives";
import { LED } from "./tokens";
import s from "./theme.module.css";

/**
 * SVG 7 segment gösterge (font değil). Her hane viewBox 0 0 40 70; boşluk dar aralık olur.
 * Yanan segment LED yeşil→camgöbeği, sönük #1B1F24; parıltı = geniş, %22 opak kopya çizgi.
 * Görünmezken animasyonlar donar; "light" modu da görünür olunca başlar.
 */

type SegKey = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const T = 7; // segment kalınlığı
const G = 1.4; // segmentler arası boşluk
const hx = T / 2;

function hSeg(yc: number, x1: number, x2: number) {
  return `${x1},${yc} ${x1 + hx},${yc - hx} ${x2 - hx},${yc - hx} ${x2},${yc} ${x2 - hx},${yc + hx} ${x1 + hx},${yc + hx}`;
}
function vSeg(xc: number, y1: number, y2: number) {
  return `${xc},${y1} ${xc + hx},${y1 + hx} ${xc + hx},${y2 - hx} ${xc},${y2} ${xc - hx},${y2 - hx} ${xc - hx},${y1 + hx}`;
}

const SEG: Record<SegKey, string> = {
  a: hSeg(5, 5 + G, 35 - G),
  b: vSeg(35, 5 + G, 35 - G),
  c: vSeg(35, 35 + G, 65 - G),
  d: hSeg(65, 5 + G, 35 - G),
  e: vSeg(5, 35 + G, 65 - G),
  f: vSeg(5, 5 + G, 35 - G),
  g: hSeg(35, 5 + G, 35 - G),
};
const ALL: SegKey[] = ["a", "b", "c", "d", "e", "f", "g"];
/** Kovalamaca sırası: dış halka saat yönünde */
const RING: SegKey[] = ["a", "b", "c", "d", "e", "f"];

const MAP: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
  "-": "g",
  _: "d",
};

const DIGIT_W = 40;
const ADVANCE = 49; // hane + aralık
const SPACE = 18;

/** Hane düzeni ve toplam genişlik (yerleşim hesabı için dışa açık) */
export function seg7Layout(value: string) {
  let x = 0;
  const cells: { ch: string; x: number }[] = [];
  for (const ch of value) {
    if (ch === " ") {
      x += SPACE;
      continue;
    }
    cells.push({ ch, x });
    x += ADVANCE;
  }
  return { cells, width: Math.max(DIGIT_W, x - (ADVANCE - DIGIT_W)) };
}

export type Seg7Mode = "static" | "light" | "chase" | "flicker";

export function Seg7({
  value,
  mode = "static",
  delay = 0,
  stagger = 0.05,
  loops,
  glow = true,
  className,
  ...rest
}: {
  /** "0553 114 27 34", "01"... (rakam, "-", "_", boşluk; "~" = tamamen sönük hane) */
  value: string;
  /** static: hemen yanık · light: haneler soldan sağa yanar · chase: dekoratif kovalamaca · flicker: kısa titreme */
  mode?: Seg7Mode;
  delay?: number;
  /** light: hane başına gecikme (sn) */
  stagger?: number;
  /** chase: tur sayısı; verilirse turlar bitince değer yanar, verilmezse sonsuz döner */
  loops?: number;
  glow?: boolean;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "values" | "mode">) {
  const ref = useRef<SVGSVGElement>(null);
  const live = useLive(ref, { margin: "0px" });
  const gid = useSvgId("seg");
  const { cells, width } = seg7Layout(value);

  const chaseDur = 0.54;
  const showValue = mode !== "chase" || loops !== undefined;
  const valueDelay = mode === "chase" && loops !== undefined ? delay + loops * chaseDur : delay;

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${width} 70`}
      className={cn(!live && s.paused, className)}
      {...rest}
    >
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={width} y2="70">
          <stop offset="0" stopColor={LED.on} />
          <stop offset="1" stopColor={LED.on2} />
        </linearGradient>
      </defs>
      {cells.map((cell, i) => {
        const lit = (MAP[cell.ch] ?? "").split("") as SegKey[];
        const litClass =
          mode === "light" ? s.segIn : mode === "flicker" ? s.flicker : mode === "chase" && loops !== undefined ? s.segIn : undefined;
        const litDelay = mode === "light" ? delay + i * stagger : valueDelay;
        return (
          <g key={i} transform={`translate(${cell.x} 0)`}>
            {ALL.map((k) => (
              <polygon key={k} points={SEG[k]} className={s.segOff} />
            ))}
            {showValue && lit.length > 0 && (
              <g className={litClass} style={litClass ? ({ "--d": `${litDelay}s` } as CSSProperties) : undefined}>
                {glow &&
                  lit.map((k) => (
                    <polygon key={`g${k}`} points={SEG[k]} fill={LED.glow} stroke={LED.glow} strokeWidth={6} strokeLinejoin="round" />
                  ))}
                {lit.map((k) => (
                  <polygon key={k} points={SEG[k]} fill={`url(#${gid})`} />
                ))}
              </g>
            )}
            {mode === "chase" &&
              RING.map((k, j) => (
                <polygon
                  key={`c${k}`}
                  points={SEG[k]}
                  fill={`url(#${gid})`}
                  className={s.chase}
                  style={
                    {
                      "--d": `${delay + j * (chaseDur / RING.length) + i * 0.03}s`,
                      "--dur": `${chaseDur}s`,
                      "--it": loops ?? "infinite",
                    } as CSSProperties
                  }
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
}
