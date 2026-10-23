"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Move3d } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIMENSIONS, IMAGES } from "./data";

/**
 * Ön ve yan fotoğraflardan kurulan, sürükleyerek döndürülebilen CSS 3D kutu.
 * Oranlar gerçek ölçülerden: genişlik 26, yükseklik 41, derinlik 43 cm.
 * Boşta yavaşça kendi kendine döner (yalnızca ekrandayken); ölçü etiketleri kutuyla birlikte döner.
 */
export function Device3D({ className, scale = 7 }: { className?: string; scale?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "100px 0px" });
  const reduce = useReducedMotion();

  const rotY = useMotionValue(-32);
  const rotX = useMotionValue(-12);
  const sY = useSpring(rotY, { stiffness: 120, damping: 22 });
  const sX = useSpring(rotX, { stiffness: 120, damping: 22 });
  const transform = useTransform([sX, sY], ([x, y]) => `rotateX(${x}deg) rotateY(${y}deg)`);

  const drag = useRef<{ x: number; y: number; ry: number; rx: number } | null>(null);
  const idleUntil = useRef(0);
  const [hint, setHint] = useState(true);

  // Boştayken yavaş otomatik dönüş
  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      const dt = last ? t - last : 16;
      last = t;
      if (!drag.current && performance.now() > idleUntil.current) rotY.set(rotY.get() + dt * 0.012);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, rotY]);

  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ry: rotY.get(), rx: rotX.get() };
    setHint(false);
  }
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    rotY.set(drag.current.ry + dx * 0.45);
    rotX.set(Math.max(-35, Math.min(25, drag.current.rx - dy * 0.3)));
  }
  function onUp() {
    drag.current = null;
    idleUntil.current = performance.now() + 2500;
  }

  const W = DIMENSIONS.width * scale;
  const H = DIMENSIONS.height * scale;
  const D = DIMENSIONS.depth * scale;
  const face = "absolute left-1/2 top-1/2 [backface-visibility:hidden] overflow-hidden";
  const v = { "--w": `${W}px`, "--h": `${H}px`, "--d": `${D}px` } as CSSProperties;

  return (
    <div ref={wrapRef} className={cn("relative flex flex-col items-center", className)} style={v}>
      <div
        role="img"
        aria-label={`Quantum Plus 3D görünüm: yükseklik ${DIMENSIONS.height} cm, genişlik ${DIMENSIONS.width} cm, derinlik ${DIMENSIONS.depth} cm. Sürükleyerek döndürebilirsiniz.`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ width: Math.max(W, D) * 1.5, height: H * 1.45, perspective: 1400 }}
      >
        {/* Zemin gölgesi */}
        <div
          aria-hidden
          className="absolute left-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(30,41,90,0.26),rgba(30,41,90,0.08)_60%,transparent)]"
          style={{ width: D * 1.15, height: D * 0.32, marginLeft: (-D * 1.15) / 2, top: `calc(50% + ${H / 2 - D * 0.08}px)` }}
        />
        <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform }}>
          {/* Ön: fotoğraf */}
          <div
            className={cn(face, "rounded-[18px] bg-white")}
            style={{ width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2, transform: `translateZ(${D / 2}px)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 3D yüz dokusu; next/image sarmalayıcısı transform zincirini bozuyor */}
            <img src={IMAGES.front.src} alt="" draggable={false} className="h-full w-full object-cover" />
          </div>
          {/* Arka */}
          <div
            className={cn(face, "rounded-[18px] bg-[linear-gradient(160deg,#ffffff,#e6ebf2)]")}
            style={{ width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2, transform: `rotateY(180deg) translateZ(${D / 2}px)` }}
          />
          {/* Sağ ve sol: yan fotoğraf */}
          {[90, -90].map((deg) => (
            <div
              key={deg}
              className={cn(face, "rounded-[16px] bg-white")}
              style={{ width: D, height: H, marginLeft: -D / 2, marginTop: -H / 2, transform: `rotateY(${deg}deg) translateZ(${W / 2}px)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 3D yüz dokusu */}
              <img src={IMAGES.side.src} alt="" draggable={false} className={cn("h-full w-full object-cover", deg < 0 && "-scale-x-100")} />
            </div>
          ))}
          {/* Üst: mat beyaz kapak */}
          <div
            className={cn(face, "rounded-[18px] bg-[linear-gradient(180deg,#fdfdfe,#e9eef5)] shadow-[inset_0_0_30px_rgba(0,0,0,0.06)]")}
            style={{ width: W, height: D, marginLeft: -W / 2, marginTop: -D / 2, transform: `rotateX(90deg) translateZ(${H / 2}px)` }}
          />
          {/* Alt */}
          <div
            className={cn(face, "rounded-[18px] bg-[#c9d1dc]")}
            style={{ width: W, height: D, marginLeft: -W / 2, marginTop: -D / 2, transform: `rotateX(-90deg) translateZ(${H / 2}px)` }}
          />

          {/* Ölçü çizgileri (kutuyla birlikte döner) */}
          <DimLine label={`${DIMENSIONS.width} cm`} length={W} style={{ transform: `translateY(${H / 2 + 22}px) translateZ(${D / 2}px)` }} />
          <DimLine label={`${DIMENSIONS.depth} cm`} length={D} style={{ transform: `rotateY(90deg) translateY(${H / 2 + 22}px) translateZ(${W / 2}px)` }} />
          <DimLine
            label={`${DIMENSIONS.height} cm`}
            length={H}
            style={{ transform: `translateX(${-W / 2 - 24}px) translateZ(${D / 2}px) rotateZ(-90deg)` }}
          />
        </motion.div>
      </div>

      <p
        className={cn(
          "mt-2 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3.5 py-1.5 text-[12px] font-medium text-slate-600 transition-opacity duration-500",
          hint ? "opacity-100" : "opacity-0"
        )}
      >
        <Move3d className="h-3.5 w-3.5" /> Sürükleyin, çevirin
      </p>
    </div>
  );
}

function DimLine({ label, length, style }: { label: string; length: number; style: CSSProperties }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 flex h-4 items-center [backface-visibility:hidden]"
      style={{ width: length, marginLeft: -length / 2, marginTop: -8, ...style }}
    >
      <span className="h-4 w-px bg-violet-500" />
      <span className="h-px flex-1 bg-violet-500/70" />
      <span className="h-4 w-px bg-violet-500" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold tracking-wide text-violet-700 shadow-sm">
        {label}
      </span>
    </div>
  );
}
