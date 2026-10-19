"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { TEL, WA } from "./contact";
import s from "./v2.module.css";

const PRODUCT = "/images/prada-v2/kasa.webp";

const d = (sec: number) => ({ "--d": `${sec}s` }) as CSSProperties;

const H1_LINES: { t: string; accent?: boolean }[][] = [
  [{ t: "Kırmızının" }],
  [{ t: "en" }, { t: "berrak", accent: true }],
  [{ t: "hâli." }],
];

/** Ürün üzerindeki HUD etiketleri: y = etiket yüksekliği, tx/ty = üründe işaret edilen nokta (%) */
const CALLOUTS = [
  { no: "01", title: "Şeffaf kasa", sub: "Filtreler her an gözünüzün önünde", side: "left", y: 14, tx: 21, ty: 30 },
  { no: "02", title: "5 aşamalı filtreleme", sub: "PP · GAC · CTO · RO · Post karbon", side: "left", y: 46, tx: 38, ty: 54 },
  { no: "03", title: "3.2 G metal tank", sub: "İhtiyaç anında hazır su", side: "right", y: 18, tx: 77, ty: 36 },
  { no: "04", title: "Su kaçak sensörü", sub: "Olası bir kaçakta suyu keser", side: "right", y: 50, tx: 70, ty: 80 },
] as const;

const SPECS = [
  { v: "5", l: "Aşamalı filtreleme" },
  { v: "80 GPD", l: "Cruze membran" },
  { v: "3.2 G", l: "Metal tank" },
  { v: "38×28×43", l: "cm, kompakt gövde" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.7 });
  const smy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.7 });
  const rotateY = useTransform(smx, [-0.5, 0.5], [-13, 13]);
  const rotateX = useTransform(smy, [-0.5, 0.5], [8, -8]);
  const glowX = useTransform(smx, [-0.5, 0.5], [50, -50]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const prodY = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const prodScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const wordY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  // Mobilde hero ekrandan uzun; metin ancak ekrandan çıkarken solsun
  const fade = useTransform(scrollYProgress, [0.5, 0.9], [1, 0]);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
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
    <section
      ref={ref}
      id="tanisma"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      {/* Stüdyo ışığı, film greni */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className={cn(s.beam, s.introFade)} style={d(0.4)} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className={s.grain} />
      </div>

      {/* Dev "Prada" yazısı */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: wordY }}
        className="pointer-events-none absolute inset-x-0 top-[13%] -z-10 flex justify-center sm:top-[9%] xl:top-[5%]"
      >
        <span className={cn(s.serif, "flex select-none text-[44vw] leading-[0.85] tracking-[-0.055em] md:text-[31vw] xl:text-[27vw]")}>
          {"Prada".split("").map((ch, i) => (
            <span key={i} className={cn(s.introRise, s.wordmark, "inline-block")} style={d(0.1 + i * 0.08)}>
              {ch}
            </span>
          ))}
        </span>
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center px-5 pb-10 md:px-10 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:grid-rows-[auto_1fr] xl:items-end xl:gap-x-8 xl:pb-14">
        {/* Üst satır */}
        <div className="order-1 mt-5 flex w-full justify-center xl:order-none xl:col-span-3 xl:row-start-1 xl:mt-8 xl:justify-between xl:self-start">
          <p
            className={cn(
              s.mono,
              s.introRise,
              "inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/75 sm:text-[10.5px]"
            )}
            style={d(0.2)}
          >
            <span className={cn(s.pulseDot, "h-1.5 w-1.5 rounded-full bg-[#ff3b3b]")} />
            Yeni · 3.2 Prada Su Arıtma Cihazı
          </p>
          <ul
            className={cn(s.mono, s.introRise, "hidden items-center gap-6 text-[10.5px] uppercase tracking-[0.22em] text-white/50 xl:flex")}
            style={d(0.35)}
          >
            <li>5 Aşama</li>
            <li className="h-3 w-px bg-white/15" aria-hidden />
            <li>80 GPD Membran</li>
            <li className="h-3 w-px bg-white/15" aria-hidden />
            <li>3.2 G Metal Tank</li>
          </ul>
        </div>

        {/* Ürün */}
        <motion.div
          style={reduce ? undefined : { y: prodY, scale: prodScale }}
          className="relative order-2 mt-6 w-[min(80vw,50svh,500px)] xl:order-none xl:col-start-2 xl:row-start-2 xl:mt-0 xl:w-[min(40vw,64svh)] xl:self-center"
        >
          <motion.div
            aria-hidden
            style={reduce ? undefined : { x: glowX }}
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div
              className={cn(
                s.introGlow,
                "absolute left-1/2 top-1/2 h-[95%] w-[120%] rounded-full bg-[radial-gradient(closest-side,rgba(255,35,35,0.42),rgba(255,35,35,0.16)_45%,rgba(255,35,35,0.05)_70%,transparent)]"
              )}
            />
          </motion.div>

          <motion.div style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }} className="relative">
            <div className={cn(s.introLift, "relative")}>
              <Image
                src={PRODUCT}
                alt="3.2 Prada su arıtma cihazı, şeffaf kırmızı kasa ve siyah gövde"
                width={1000}
                height={1053}
                loading="eager"
                fetchPriority="high"
                draggable={false}
                className="relative h-auto w-full select-none"
              />
              {/* Ürün şeklinde karartma: görsel baştan boyanır, ışık bu katman kalkarken "yanar" */}
              <div
                aria-hidden
                className={cn(s.introShade, "absolute inset-0 bg-[#050505]")}
                style={{ WebkitMaskImage: `url(${PRODUCT})`, maskImage: `url(${PRODUCT})` }}
              />
              <div className={s.glintMask} style={{ WebkitMaskImage: `url(${PRODUCT})`, maskImage: `url(${PRODUCT})` }}>
                <span className={s.glintBand} />
              </div>
            </div>

            {/* HUD etiketleri */}
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
              <svg className="absolute inset-0 h-full w-full overflow-visible">
                {CALLOUTS.map((c, i) => (
                  <g key={c.no}>
                    <line
                      x1={c.side === "left" ? "-4%" : "104%"}
                      y1={`${c.y}%`}
                      x2={`${c.tx}%`}
                      y2={`${c.ty}%`}
                      pathLength={1}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={1}
                      className={s.introLine}
                      style={d(1.6 + i * 0.18)}
                    />
                    <circle cx={`${c.tx}%`} cy={`${c.ty}%`} r={3.5} fill="#fff" className={s.introFade} style={d(2.3 + i * 0.18)} />
                    <circle
                      cx={`${c.tx}%`}
                      cy={`${c.ty}%`}
                      r={10}
                      fill="none"
                      stroke="rgba(255,255,255,0.45)"
                      className={s.introFade}
                      style={d(2.4 + i * 0.18)}
                    />
                  </g>
                ))}
              </svg>
              {CALLOUTS.map((c, i) => (
                <div
                  key={c.no}
                  className={cn(
                    s.introFade,
                    "absolute w-[200px] -translate-y-1/2",
                    c.side === "left" ? "right-[105%] text-right" : "left-[105%]"
                  )}
                  style={{ top: `${c.y}%`, ...d(1.9 + i * 0.18) }}
                >
                  <p className={cn(s.mono, "text-[10px] uppercase tracking-[0.24em] text-[#ff3b3b]")}>{c.no}</p>
                  <p className="mt-1 text-[15px] font-medium leading-snug text-white">{c.title}</p>
                  <p className="text-[12.5px] leading-snug text-white/55">{c.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Zemin yansıması */}
          <div
            aria-hidden
            className={cn(
              s.introFade,
              "absolute -bottom-[3%] left-1/2 -z-10 h-[10%] w-[85%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,40,40,0.5),rgba(255,40,40,0.16)_50%,transparent)]"
            )}
            style={d(0.9)}
          />
        </motion.div>

        {/* Başlık */}
        <motion.div
          style={reduce ? undefined : { opacity: fade }}
          className="order-3 mt-8 w-full text-center xl:order-none xl:col-start-1 xl:row-start-2 xl:mt-0 xl:text-left"
        >
          <h1 className="text-[clamp(2.9rem,12vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white md:text-[clamp(4rem,8vw,5.6rem)] xl:text-[clamp(3.6rem,4.7vw,5.75rem)]">
            {H1_LINES.map((line, li) => (
              <span key={li} className="block">
                {line.map((w, wi) => (
                  <Fragment key={wi}>
                    {wi > 0 && " "}
                    <span className="-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-bottom">
                      <span
                        className={cn(s.introMask, w.accent && cn(s.serif, s.accent, "italic tracking-[-0.02em]"))}
                        style={d(0.55 + (li + wi) * 0.1)}
                      >
                        {w.t}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* Açıklama + aksiyonlar */}
        <motion.div
          style={reduce ? undefined : { opacity: fade }}
          className="order-4 mt-5 flex w-full max-w-md flex-col items-center text-center xl:order-none xl:col-start-3 xl:row-start-2 xl:mt-0 xl:max-w-[340px] xl:items-start xl:justify-self-end xl:text-left"
        >
          <p className={cn(s.introRise, "text-[15px] leading-relaxed text-white/60 md:text-base")} style={d(0.9)}>
            Şeffaf kasa, 5 aşamalı filtreleme ve 3.2 G metal tank. 3.2 Prada, mutfağınıza hem berrak su hem de göz
            alıcı bir tasarım getirir.
          </p>
          <div className={cn(s.introRise, "mt-6 flex flex-wrap justify-center gap-3 xl:justify-start")} style={d(1.05)}>
            <a
              href={TEL}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-black transition hover:bg-[#ffe9e6]"
            >
              <Phone className="h-4 w-4" /> Hemen Arayın
            </a>
            <a
              href={WA}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-[15px] font-semibold text-white transition hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Mobil teknik özet */}
        <ul
          className={cn(
            s.introRise,
            "order-5 mt-9 grid w-full max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 xl:hidden"
          )}
          style={d(1.3)}
        >
          {SPECS.map((sp) => (
            <li key={sp.l} className="bg-[#0a0a0a] px-4 py-3.5">
              <p className="text-lg font-semibold tracking-tight text-white">{sp.v}</p>
              <p className={cn(s.mono, "mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/55")}>{sp.l}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Kaydırma ipucu */}
      <div
        aria-hidden
        className={cn(s.introFade, "pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 xl:flex")}
        style={d(2.6)}
      >
        <span className={cn(s.mono, "text-[10px] uppercase tracking-[0.3em] text-white/50")}>Kaydırın</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className={cn(s.scrollCue, "absolute inset-0 bg-white/70")} />
        </span>
      </div>
    </section>
  );
}
