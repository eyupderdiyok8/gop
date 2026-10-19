"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Hand, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chapter, Headline, Reveal } from "./primitives";
import s from "./v2.module.css";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const coord = (v: number) => Math.round(v * 10).toString().padStart(3, "0");

/** Kasanın üstünde gezinen "röntgen" merceği; içinde kasasız filtre görseli görünür */
export function XRay() {
  const boxRef = useRef<HTMLDivElement>(null);
  const manualUntil = useRef(0);
  const inView = useInView(boxRef, { margin: "120px 0px" });
  const reduce = useReducedMotion();

  const x = useMotionValue(40);
  const y = useMotionValue(48);
  const sx = useSpring(x, { stiffness: 110, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 110, damping: 20, mass: 0.6 });
  const clip = useMotionTemplate`circle(var(--r) at ${sx}% ${sy}%)`;
  const left = useMotionTemplate`${sx}%`;
  const top = useMotionTemplate`${sy}%`;
  const cx = useTransform(sx, coord);
  const cy = useTransform(sy, coord);

  // Kullanıcı dokunmuyorsa mercek ürünün üzerinde kendiliğinden gezinir; döngü yalnızca bölüm görünürken çalışır
  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const loop = (t: number) => {
      if (performance.now() >= manualUntil.current) {
        x.set(50 + 23 * Math.sin(t / 1700));
        y.set(52 + 22 * Math.sin(t / 1150 + 0.8));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, x, y]);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(clamp(((e.clientX - r.left) / r.width) * 100, 6, 94));
    y.set(clamp(((e.clientY - r.top) / r.height) * 100, 6, 94));
    manualUntil.current = performance.now() + 2600;
  }

  function leave() {
    manualUntil.current = performance.now() + 900;
  }

  return (
    <section id="ic-gorunum" className={cn(s.cv, "relative scroll-mt-16 overflow-hidden px-5 py-[14vh] md:px-10")}>
      <div className="mx-auto max-w-[1440px]">
        <Chapter no="03" label="İç Dünya" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Headline text="Saklayacak *hiçbir şeyi* yok." className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] text-white" />
          <p className="max-w-md text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-right">
            Şeffaf ve dayanıklı kasası sayesinde filtreleri dışarıdan görebilirsiniz. Merceği ürünün üzerinde gezdirin,
            içindeki sistemi keşfedin.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
          <Reveal className="order-2 lg:order-none">
            <SideNote
              kicker="Kasa"
              title="Şeffaf ve dayanıklı"
              text="Filtreler her an gözünüzün önünde; durumlarını dışarıdan kolayca takip edebilirsiniz."
              className="lg:ml-auto lg:text-right"
            />
          </Reveal>

          <div className="order-1 flex flex-col items-center lg:order-none">
            <div
              ref={boxRef}
              onPointerMove={move}
              onPointerDown={move}
              onPointerLeave={leave}
              className="relative aspect-[1000/1053] w-[min(88vw,600px)] cursor-crosshair touch-pan-y select-none [--r:82px] sm:[--r:110px] lg:[--r:128px]"
            >
              <div
                aria-hidden
                className="absolute inset-[6%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,40,40,0.28),rgba(255,40,40,0.08)_55%,transparent)]"
              />
              {/* Hero ile aynı dosya, önbellekten gelir; eager ek indirme yapmaz */}
              <Image
                src="/images/prada-v2/kasa.webp"
                alt="3.2 Prada'nın şeffaf kırmızı kasası"
                width={1000}
                height={1053}
                loading="eager"
                draggable={false}
                className="h-auto w-full"
              />

              {/* Mercek içi: kasasız görünüm */}
              <motion.div aria-hidden className="absolute inset-0" style={{ clipPath: clip, WebkitClipPath: clip }}>
                <div className="absolute inset-0 bg-[#060606]" />
                <motion.div
                  className="absolute h-[calc(var(--r)*2.4)] w-[calc(var(--r)*2.4)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(127,220,255,0.16),transparent)]"
                  style={{ left, top }}
                />
                <Image
                  src="/images/prada-v2/ic.webp"
                  alt=""
                  width={1000}
                  height={1053}
                  draggable={false}
                  className="absolute h-auto max-w-none"
                  style={{ left: "5%", top: "9.2%", width: "89%" }}
                />
                <div className={cn(s.scan, "absolute inset-0")} />
              </motion.div>

              {/* Mercek çerçevesi */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute h-[calc(var(--r)*2)] w-[calc(var(--r)*2)] -translate-x-1/2 -translate-y-1/2"
                style={{ left, top }}
              >
                <div className="absolute inset-0 rounded-full border border-white/60 shadow-[0_0_0_1px_rgba(255,59,59,0.35),0_0_60px_rgba(255,59,59,0.28),inset_0_0_34px_rgba(0,0,0,0.55)]" />
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className={cn(s.lensSweep, "absolute inset-0")}>
                    <div className="absolute inset-x-0 top-1/2 h-px bg-[#ff3b3b]/70 shadow-[0_0_14px_#ff3b3b]" />
                  </div>
                </div>
                <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white/70" />
                <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white/70" />
                <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/70" />
                <span className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/70" />
                <div
                  className={cn(
                    s.mono,
                    "absolute -top-8 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/80 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.2em] text-white/70"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b3b]" />
                  İç görünüm
                  <span className="text-white/50">
                    X<motion.span>{cx}</motion.span> Y<motion.span>{cy}</motion.span>
                  </span>
                </div>
              </motion.div>
            </div>

            <p className={cn(s.mono, "mt-6 inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-white/50")}>
              <MousePointer2 className="h-3.5 w-3.5 [@media(pointer:coarse)]:hidden" />
              <Hand className="hidden h-3.5 w-3.5 [@media(pointer:coarse)]:block" />
              <span className="[@media(pointer:coarse)]:hidden">İmleci ürünün üzerinde gezdirin</span>
              <span className="hidden [@media(pointer:coarse)]:inline">Ürüne dokunun veya yana kaydırın</span>
            </p>
          </div>

          <Reveal className="order-3 lg:order-none" delay={0.1}>
            <SideNote
              kicker="İçeride"
              title="Tek gövdede 5 aşama"
              text="3 ön filtre, Cruze 80 GPD membran, post karbon filtre ve 3.2 G metal tank aynı kompakt gövdede."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SideNote({ kicker, title, text, className }: { kicker: string; title: string; text: string; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-sm text-center lg:mx-0 lg:max-w-[300px] lg:text-left", className)}>
      <p className={cn(s.mono, "text-[10.5px] uppercase tracking-[0.24em] text-[#ff3b3b]")}>{kicker}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-white/55">{text}</p>
    </div>
  );
}
