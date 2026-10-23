"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { TEL, WA } from "./contact";
import s from "../prada-v2/v2.module.css";
import p from "./pantech.module.css";

const DEVICE = "/images/pantech/cihaz-on-kesik.webp";
const d = (sec: number) => ({ "--d": `${sec}s` }) as CSSProperties;

const H1_LINES: { t: string; accent?: boolean }[][] = [[{ t: "Saf" }, { t: "su," }], [{ t: "tanksız", accent: true }], [{ t: "tasarım." }]];

/** y = etiket yüksekliği, tx/ty = cihaz üzerinde işaret edilen nokta (%) */
const CALLOUTS = [
  { no: "01", title: "Dijital LED ekran", sub: "TDS değeri ve çalışma durumu", side: "left", y: 30, tx: 34, ty: 47 },
  { no: "02", title: "Dokunmatik panel", sub: "Tek dokunuşla kontrol", side: "left", y: 60, tx: 30, ty: 61 },
  { no: "03", title: "Tanksız gövde", sub: "Denge tankı yok, az yer kaplar", side: "right", y: 20, tx: 82, ty: 38 },
  { no: "04", title: "Filtre göstergeleri", sub: "PPC · RO · T33", side: "right", y: 62, tx: 42, ty: 72 },
] as const;

const SPECS = [
  { v: "Tanksız", l: "Kompakt tasarım" },
  { v: "4", l: "Aşamalı filtreleme" },
  { v: "600 GPD", l: "RO membran" },
  { v: "LED", l: "Dijital ekran" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.7 });
  const smy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.7 });
  const rotateY = useTransform(smx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(smy, [-0.5, 0.5], [7, -7]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const devY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const wordY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const fade = useTransform(scrollYProgress, [0.5, 0.9], [1, 0]);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      ref={ref}
      id="tanisma"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(62,166,255,0.14),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Dev "PANTECH" yazısı */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: wordY }}
        className="pointer-events-none absolute inset-x-0 top-[14%] -z-10 flex justify-center sm:top-[10%] xl:top-[7%]"
      >
        <span
          className={cn(
            s.introRise,
            p.wordmark,
            "select-none text-[21vw] font-semibold leading-none tracking-[-0.06em] md:text-[18vw] xl:text-[16vw]"
          )}
          style={d(0.1)}
        >
          PANTECH
        </span>
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center px-5 pb-10 md:px-10 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:grid-rows-[auto_1fr] xl:items-end xl:gap-x-8 xl:pb-14">
        <div className="order-1 mt-5 flex w-full justify-center xl:order-none xl:col-span-3 xl:row-start-1 xl:mt-8 xl:justify-between xl:self-start">
          <p
            className={cn(
              s.mono,
              s.introRise,
              "inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/75 sm:text-[10.5px]"
            )}
            style={d(0.2)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ea6ff] shadow-[0_0_10px_#3ea6ff]" />
            Yeni · Pantech
          </p>
          <ul className={cn(s.mono, s.introRise, "hidden items-center gap-6 text-[10.5px] uppercase tracking-[0.22em] text-white/50 xl:flex")} style={d(0.35)}>
            <li>Tanksız</li>
            <li className="h-3 w-px bg-white/15" aria-hidden />
            <li>4 Aşama</li>
            <li className="h-3 w-px bg-white/15" aria-hidden />
            <li>600 GPD Membran</li>
          </ul>
        </div>

        {/* Cihaz */}
        <motion.div
          style={reduce ? undefined : { y: devY }}
          className="relative order-2 mt-6 w-[min(56vw,40svh,330px)] xl:order-none xl:col-start-2 xl:row-start-2 xl:mt-0 xl:w-[min(25vw,38svh)] xl:self-center"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className={cn(
                s.introGlow,
                "absolute left-1/2 top-1/2 h-[85%] w-[190%] rounded-full bg-[radial-gradient(closest-side,rgba(62,166,255,0.38),rgba(62,166,255,0.12)_50%,transparent)]"
              )}
            />
          </div>
          <motion.div style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }} className="relative">
            <div className={cn(s.introLift, "relative")}>
              <Image
                src={DEVICE}
                alt="Pantech tanksız su arıtma cihazı, dijital LED ekranlı ön panel"
                width={554}
                height={991}
                loading="eager"
                fetchPriority="high"
                draggable={false}
                className="relative h-auto w-full select-none"
              />
              <div
                aria-hidden
                className={cn(s.introShade, "absolute inset-0 bg-black")}
                style={{ WebkitMaskImage: `url(${DEVICE})`, maskImage: `url(${DEVICE})` }}
              />
            </div>

            <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
              <svg className="absolute inset-0 h-full w-full overflow-visible">
                {CALLOUTS.map((c, i) => (
                  <g key={c.no}>
                    <line
                      x1={c.side === "left" ? "-12%" : "112%"}
                      y1={`${c.y}%`}
                      x2={`${c.tx}%`}
                      y2={`${c.ty}%`}
                      pathLength={1}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={1}
                      className={s.introLine}
                      style={d(1.4 + i * 0.18)}
                    />
                    <circle cx={`${c.tx}%`} cy={`${c.ty}%`} r={3.5} fill="#9be7ff" className={s.introFade} style={d(2.1 + i * 0.18)} />
                    <circle cx={`${c.tx}%`} cy={`${c.ty}%`} r={10} fill="none" stroke="rgba(155,231,255,0.5)" className={s.introFade} style={d(2.2 + i * 0.18)} />
                  </g>
                ))}
              </svg>
              {CALLOUTS.map((c, i) => (
                <div
                  key={c.no}
                  className={cn(s.introFade, "absolute w-[210px] -translate-y-1/2", c.side === "left" ? "right-[114%] text-right" : "left-[114%]")}
                  style={{ top: `${c.y}%`, ...d(1.7 + i * 0.18) }}
                >
                  <p className={cn(s.mono, "text-[10px] uppercase tracking-[0.24em] text-[#3ea6ff]")}>{c.no}</p>
                  <p className="mt-1 text-[15px] font-medium leading-snug text-white">{c.title}</p>
                  <p className="text-[12.5px] leading-snug text-white/50">{c.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <div
            aria-hidden
            className={cn(
              s.introFade,
              "absolute -bottom-[2%] left-1/2 -z-10 h-[7%] w-[120%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(62,166,255,0.45),rgba(62,166,255,0.12)_50%,transparent)]"
            )}
            style={d(0.9)}
          />
        </motion.div>

        <motion.div style={reduce ? undefined : { opacity: fade }} className="order-3 mt-9 w-full text-center xl:order-none xl:col-start-1 xl:row-start-2 xl:mt-0 xl:text-left">
          <h1 className="text-[clamp(2.9rem,12vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white md:text-[clamp(4rem,8vw,5.6rem)] xl:text-[clamp(3.6rem,4.7vw,5.75rem)]">
            <span className="sr-only">Pantech tanksız su arıtma cihazı: </span>
            {H1_LINES.map((line, li) => (
              <span key={li} className="block">
                {line.map((w, wi) => (
                  <Fragment key={wi}>
                    {wi > 0 && " "}
                    <span className="-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-bottom">
                      <span className={cn(s.introMask, w.accent && cn(s.accent, "font-light tracking-[-0.04em]"))} style={d(0.55 + (li + wi) * 0.1)}>
                        {w.t}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { opacity: fade }}
          className="order-4 mt-5 flex w-full max-w-md flex-col items-center text-center xl:order-none xl:col-start-3 xl:row-start-2 xl:mt-0 xl:max-w-[340px] xl:items-start xl:justify-self-end xl:text-left"
        >
          <p className={cn(s.introRise, "text-[15px] leading-relaxed text-white/60 md:text-base")} style={d(0.9)}>
            Pantech; 600 GPD RO membranı, 4 aşamalı filtrelemeyi ve dokunmatik dijital LED ekranı tek bir kompakt gövdede
            buluşturur. Denge tankı kullanmaz, minimum alan kaplar.
          </p>
          <div className={cn(s.introRise, "mt-6 flex flex-wrap justify-center gap-3 xl:justify-start")} style={d(1.05)}>
            <a href={TEL} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-black transition hover:bg-[#e6f4ff]">
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

        <ul className={cn(s.introRise, "order-5 mt-9 grid w-full max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 xl:hidden")} style={d(1.3)}>
          {SPECS.map((sp) => (
            <li key={sp.l} className="bg-[#070707] px-4 py-3.5">
              <p className="text-lg font-semibold tracking-tight text-white">{sp.v}</p>
              <p className={cn(s.mono, "mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/55")}>{sp.l}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
