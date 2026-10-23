"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { DISPLAY, IMAGES } from "./data";

/**
 * Ürün fotoğrafındaki (hero.jpg) siyah ekranın üstüne birebir bindirilen canlı katman.
 * viewBox fotoğrafın piksel boyutuyla aynıdır; ebeveyn fotoğrafla aynı en-boy oranında olmalı.
 * Halka döner, LED çubuklar ekolayzer gibi oynar, On/Off ve Function tuşları nabız atar. Görünmüyorken durur.
 */
export function LivingDisplay({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "80px 0px" });
  const reduce = useReducedMotion();
  const [levels, setLevels] = useState<number[]>([4, 4, 4, 4]);

  // Çubuk seviyeleri: her sütun kendi ritmiyle 2–6 segment arasında gezinir
  useEffect(() => {
    if (!inView || reduce) return;
    let t = 0;
    const id = setInterval(() => {
      t += 1;
      setLevels(
        DISPLAY.bars.map((_, i) => {
          const wave = Math.sin(t * (0.55 + i * 0.17) + i * 1.3);
          return Math.max(2, Math.min(6, Math.round(4 + wave * 2)));
        })
      );
    }, 420);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const { ring, underline, bars, segments, keys } = DISPLAY;
  const circ = 2 * Math.PI * ring.r;
  const play = inView && !reduce;

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${IMAGES.hero.w} ${IMAGES.hero.h}`}
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id="qd-ring" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.45" stopColor="#6366f1" />
          <stop offset="0.75" stopColor="#c026d3" />
          <stop offset="1" stopColor="#f0abfc" />
        </linearGradient>
        <linearGradient id="qd-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
        <filter id="qd-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dönen ışık: halkanın üstünde dolaşan parlak yay */}
      <g transform={`rotate(-90 ${ring.cx} ${ring.cy})`}>
        <circle
          cx={ring.cx}
          cy={ring.cy}
          r={ring.r}
          fill="none"
          stroke="url(#qd-ring)"
          strokeWidth={ring.stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ * 0.22} ${circ}`}
          filter="url(#qd-glow)"
          opacity={0.95}
        >
          {play && (
            <animateTransform attributeName="transform" type="rotate" from={`0 ${ring.cx} ${ring.cy}`} to={`360 ${ring.cx} ${ring.cy}`} dur="3.2s" repeatCount="indefinite" />
          )}
        </circle>
      </g>

      {/* Alt çizgide akan parıltı */}
      <line
        x1={underline.x1}
        y1={underline.y1}
        x2={underline.x2}
        y2={underline.y2}
        stroke="url(#qd-line)"
        strokeWidth={underline.width}
        strokeLinecap="round"
        strokeDasharray="18 120"
        opacity={0.9}
        filter="url(#qd-glow)"
      >
        {play && <animate attributeName="stroke-dashoffset" from="140" to="0" dur="1.8s" repeatCount="indefinite" />}
      </line>

      {/* LED çubuklar: alttan yukarı "level" kadar segment yanar, gerisi söner */}
      {bars.map((b, bi) => {
        const step = (b.bottom - b.top) / segments;
        return (
          <g key={b.label}>
            {Array.from({ length: segments }, (_, si) => {
              const fromBottom = segments - 1 - si; // 0 = en alttaki
              const on = fromBottom < levels[bi];
              const y = b.top + si * step + 1;
              return (
                <rect
                  key={si}
                  x={b.x}
                  y={y}
                  width={b.w}
                  height={step - 3.2}
                  rx={2.2}
                  fill={on ? (fromBottom >= 4 ? "#a7f3d0" : "#34d399") : "#2b3036"}
                  opacity={on ? 0.95 : 0.92}
                  filter={on ? "url(#qd-glow)" : undefined}
                  style={{ transition: "fill 0.25s, opacity 0.25s" }}
                />
              );
            })}
          </g>
        );
      })}

      {/* Dokunmatik tuşlar nabız atar */}
      {keys.map((k, i) => (
        <circle key={k.label} cx={k.cx} cy={k.cy} r={k.r} fill="none" stroke="#38bdf8" strokeWidth={2.5} opacity={0}>
          {play && (
            <>
              <animate attributeName="r" values={`${k.r};${k.r + 9}`} dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite" />
            </>
          )}
        </circle>
      ))}
    </svg>
  );
}
