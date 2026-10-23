"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { MINERAL } from "../data";
import { CallButton, Headline, Section, WhatsAppButton, useLive } from "./primitives";
import { HeroStage } from "./GucAcik.Stage";
import s from "./theme.module.css";
import g from "./GucAcik.module.css";

const SPECS = ["6 aşama", MINERAL.tag, "Dokunmatik panel"] as const;
const d = (sec: number) => ({ "--d": `${sec}s` }) as CSSProperties;

/**
 * Hero · GÜÇ AÇIK: gerçek ürün fotoğrafının siyah camı ziyaretçinin önünde açılır.
 * Metin CSS ile ilk karede gelir (JS beklemez); ekran açılışı ve hale görünür olunca başlar.
 */
export function GucAcik() {
  const ref = useRef<HTMLElement>(null);
  const live = useLive(ref);
  const reduce = useReducedMotion();

  // Fareyle hafif eğim (dokunmatikte yok)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 70, damping: 18, mass: 0.8 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);

  // Bölüm yukarı kayarken cihaz ekrana doğru büyür, hale açılıp söner (hareket azaltılınca sabit)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, (p) => (reduce ? 1 : 1 + p * 0.12));
  const haloScale = useTransform(scrollYProgress, (p) => (reduce ? 1 : 1 + p * 0.25));
  const haloOpacity = useTransform(scrollYProgress, (p) => (reduce ? 1 : Math.max(0, 1 - p * 2.2)));

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <Section
      id="guc-acik"
      ref={ref}
      aria-labelledby="guc-acik-baslik"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      // İnci → gök: alt kenar dalış sahnesinin başladığı gök rengiyle (#CFE4FA) birleşir
      className="bg-[linear-gradient(180deg,#F4F8FD_0%,#EAF2FC_30%,#DCEBFA_64%,#CFE4FA_100%)]"
    >
      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 px-4 pb-12 pt-[76px] sm:px-6 md:px-10 lg:min-h-[100svh] lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-6 lg:pb-24 lg:pt-[88px] xl:px-16">
        {/* Etiket + başlık */}
        <div className="relative z-10 order-1 flex flex-col items-center text-center lg:order-none lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:items-start lg:text-left">
          <p
            className={cn(
              g.kicker,
              s.introRise,
              "inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-[color:var(--qa-line-2)] bg-white/70 px-3.5 py-2 text-[#0B0F17]"
            )}
            style={d(0.05)}
          >
            <span aria-hidden className={cn(g.power, "h-1.5 w-1.5 shrink-0 rounded-full")} />
            Yeni · Quantum Plus · Dijital Su Arıtma
          </p>
          <Headline
            as="h1"
            size="hero"
            intro
            delay={0.12}
            id="guc-acik-baslik"
            text="Suyun artık bir *ekranı* var."
            // leading: Headline'daki boyut sınıfı twMerge ile satır aralığını siliyor; burada geri veriliyor
            className="mt-5 max-w-[8.4em] text-wrap leading-[0.95] lg:mt-7 lg:text-[clamp(3.6rem,5.8vw,5.1rem)]"
          />
        </div>

        {/* Alt metin + CTA (DOM'da cihazdan önce: klavyede önce aramaya ulaşılır) */}
        <div className="relative z-10 order-3 mt-11 flex flex-col items-center text-center lg:order-none lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:mt-8 lg:items-start lg:text-left">
          <p
            className={cn(
              s.introRise,
              "max-w-[22rem] text-[16.5px] leading-[1.55] text-[color:var(--qa-fg-2)] sm:max-w-[27rem] sm:text-[17px] lg:max-w-[22rem] lg:text-[18px] xl:max-w-[26rem]"
            )}
            style={d(0.5)}
          >
            6 aşamalı filtreleme, suya alkali özellik kazandıran B12 vitaminli mineral filtre ve dokunmatik dijital panel.
            Mat beyaz gövde, siyah cam ön yüz.
          </p>
          <div
            className={cn(s.introRise, "mt-7 flex w-full max-w-[400px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row lg:mt-9 lg:flex-col lg:items-start xl:flex-row")}
            style={d(0.65)}
          >
            <CallButton size="lg" className="w-full justify-center sm:w-auto" />
            <WhatsAppButton size="lg" className="w-full justify-center sm:w-auto" />
          </div>
        </div>

        {/* Özellik çipleri: mobilde yatay kayan satır, masaüstünde sağ kenarda dikey ray */}
        <ul
          aria-label="Öne çıkanlar"
          className={cn(
            g.row,
            s.introRise,
            "order-4 -mx-4 mt-9 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:justify-center sm:px-6 md:-mx-10 md:px-10",
            "lg:absolute lg:right-3 lg:top-1/2 lg:m-0 lg:-translate-y-1/2 lg:flex-col lg:items-center lg:gap-5 lg:overflow-visible lg:p-0 xl:right-6"
          )}
          style={d(0.85)}
        >
          {SPECS.map((t, i) => (
            <li key={t} className="flex shrink-0 items-center lg:flex-col lg:gap-5">
              {i > 0 && <span aria-hidden className="hidden h-10 w-px bg-[color:var(--qa-line-2)] lg:block" />}
              <span
                className={cn(
                  s.micro,
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--qa-line-2)] bg-white/70 px-3.5 py-2 text-[color:var(--qa-fg)]",
                  "lg:flex-col lg:gap-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-[color:var(--qa-fg-2)]"
                )}
              >
                <span aria-hidden className="h-[5px] w-3 shrink-0 rounded-[2px] bg-[linear-gradient(90deg,#34E37A,#2EE6D6)] lg:h-3 lg:w-[5px]" />
                <span className={g.railText}>{t}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* Ürün sahnesi */}
        <div className="order-2 mt-10 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:self-center">
          <HeroStage
            live={live}
            scale={scale}
            rotateX={rotateX}
            rotateY={rotateY}
            haloScale={haloScale}
            haloOpacity={haloOpacity}
          />
        </div>

        {/* Kaydırma işareti: LED segmentleri aşağı doğru yanar */}
        <a
          href="#camin-icine"
          className={cn(
            s.focus,
            s.introRise,
            "order-5 mx-auto mt-9 inline-flex min-h-11 items-center gap-3 rounded-full px-3 lg:absolute lg:bottom-8 lg:left-10 lg:mx-0 lg:mt-0 lg:px-0 xl:left-16"
          )}
          style={d(1.1)}
        >
          <svg aria-hidden viewBox="0 0 12 30" className={cn("h-[30px] w-3", !live && s.paused)}>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={0} y={i * 10 + 2} width={12} height={6} rx={2} fill="#DCE3EC" />
                <rect
                  x={0}
                  y={i * 10 + 2}
                  width={12}
                  height={6}
                  rx={2}
                  fill="#34E37A"
                  className={g.cueSeg}
                  style={{ "--d": `${i * 0.18}s` } as CSSProperties}
                />
              </g>
            ))}
          </svg>
          <span className={cn(s.micro, "text-[color:var(--qa-fg-2)]")}>Ekrana yaklaşın</span>
        </a>
      </div>
    </Section>
  );
}
