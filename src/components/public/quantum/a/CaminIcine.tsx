"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { IMAGES } from "../data";
import { FeatheredPhoto, Micro, Section, Temsili, useSvgId } from "./primitives";
import { GLASS_PATH, PanelTwin } from "./PanelTwin";
import { easeInOut, useReducedPref } from "./CaminIcine.hooks";
import s from "./theme.module.css";

/**
 * Camın içine: kaydırdıkça kamera ekrana dalar. Fotoğraf büyür, vektör ikiz birebir üstüne oturur,
 * gövde söner ve siyah cam sayfanın kendisi olur. Gündüz → gece geçişi ürünün içinden yapılır.
 * Sticky + useScroll olduğu için content-visibility yok.
 */

const LINE1 = "Bugüne kadar su arıtma cihazına hiç bakmadınız.";
const LINE2 = "Bu sefer bakacaksınız.";
const LABEL = "QUANTUM PLUS · DİJİTAL LED EKRAN";

/* hero.jpg piksel geometrisi. Sonda halka–tuş grubu çerçevenin alt %60'ına oturur. */
const IMG_W = IMAGES.hero.w;
const FX = 166.5; // halka merkezi (x)
const FY = 262; // halkanın hemen üstü (y)
const GROUP_H = 336; // halka üstü → tuşların altı
const GROUP_W = 170;
const TOP = 0.4; // metin bölgesi: çerçevenin üst %40'ı

/** Zaman çizelgesi (kaydırma ilerlemesi) */
const T = {
  label: [0.02, 0.12],
  zoom: [0.05, 0.6],
  twin: [0.16, 0.34],
  dusk: [0.26, 0.36],
  ink: [0.34, 0.44],
  photo: [0.33, 0.43],
  sweep: [0.26, 0.5],
  cover: [0.5, 0.6],
  meta: [0.8, 0.9],
};
const WORDS_AT = 0.6;
const WORD_STEP = 0.02;

type Geo = { S: number; tx: number; ty: number };

export function CaminIcine() {
  const reduce = useReducedPref();
  return reduce ? <DiveStatic /> : <DiveScene />;
}

/* ───────── Kaydırma sahnesi ───────── */

function DiveScene() {
  const secRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const geo = useMotionValue<Geo>({ S: 1, tx: 0, ty: 0 });
  const [phase, setPhase] = useState({ twin: false, photo: true, bare: false, lit: false });
  const gid = useSvgId("dive");

  // p=0: çerçevenin üstü ekranın %25'inde (cihaz gelirken kamera itmeye başlar) · p=1: sahne bırakılır
  const { scrollYProgress: p } = useScroll({ target: secRef, offset: ["start 0.25", "end end"] });

  // Kutunun yerleşim konumu (transform hariç) + çerçeve boyutu → bitiş ölçeği ve kayması
  useEffect(() => {
    const frame = frameRef.current;
    const box = boxRef.current;
    if (!frame || !box) return;
    const measure = () => {
      const vw = frame.clientWidth;
      const vh = frame.clientHeight;
      const wd = box.offsetWidth;
      if (!wd || !vh) return;
      const k0 = wd / IMG_W;
      const yTop = vh * TOP;
      const k1 = Math.max(k0 * 1.6, Math.min((vh - 14 - yTop) / GROUP_H, (vw * 0.9) / GROUP_W));
      geo.set({ S: k1 / k0, tx: vw / 2 - box.offsetLeft - FX * k1, ty: yTop - box.offsetTop - FY * k1 });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(box);
    return () => ro.disconnect();
  }, [geo]);

  // Ölçek geometrik ilerler (sabit hızlı dalış); odak noktası düz bir çizgide merkeze kayar
  const zoom = useTransform(p, T.zoom, [0, 1]);
  const scale = useTransform(() => Math.pow(geo.get().S, easeInOut(zoom.get())));
  const x = useTransform(() => {
    const g = geo.get();
    const sc = scale.get();
    return g.S > 1 ? ((sc - 1) / (g.S - 1)) * g.tx : 0;
  });
  const y = useTransform(() => {
    const g = geo.get();
    const sc = scale.get();
    return g.S > 1 ? ((sc - 1) / (g.S - 1)) * g.ty : 0;
  });

  const labelO = useTransform(p, T.label, [1, 0]);
  const labelY = useTransform(p, T.label, [0, -24]);
  const twinO = useTransform(p, T.twin, [0, 1]);
  const duskO = useTransform(p, T.dusk, [0, 1]);
  const inkO = useTransform(p, T.ink, [0, 1]);
  const photoO = useTransform(p, T.photo, [1, 0]);
  const sweepX = useTransform(p, T.sweep, [-220, 780]);
  const coverO = useTransform(p, T.cover, [0, 1]);
  const metaO = useTransform(p, T.meta, [0, 1]);

  useMotionValueEvent(p, "change", (v) => {
    // Başlık rengi: cam ekranı kapladığı anda gece
    const el = secRef.current;
    if (el) el.dataset.theme = v > 0.38 ? "ink" : "pearl";
    const next = { twin: v > 0.12, photo: v < 0.45, bare: v > 0.62, lit: v > 0.8 };
    setPhase((prev) =>
      prev.twin === next.twin && prev.photo === next.photo && prev.bare === next.bare && prev.lit === next.lit ? prev : next
    );
  });

  const w1 = LINE1.split(" ");
  const w2 = LINE2.split(" ");

  return (
    <Section ref={secRef} id="camin-icine" theme="pearl" className="h-[190svh] bg-[#06070A] md:h-[230svh]">
      <div
        ref={frameRef}
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#CFE4FA_0%,#E0EDFB_45%,#EAF2FD_100%)] px-4 pb-8 pt-[112px] md:pb-10 md:pt-[124px]"
      >
        {/* Gündüz: cihazın arkasında hafif mor yıkama */}
        <motion.div
          aria-hidden
          style={{ opacity: labelO }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(42%_38%_at_50%_58%,rgba(139,92,246,0.08),transparent_75%)]"
        />
        {/* Alacakaranlık → gece: gri ara ton yerine lacivertten geçer */}
        <motion.div
          aria-hidden
          style={{ opacity: duskO }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,#22345A,#0B1220_75%)]"
        />
        <motion.div aria-hidden style={{ opacity: inkO }} className="pointer-events-none absolute inset-0 bg-[#06070A]" />

        {/* Ürün: fotoğraf + birebir vektör ikiz. Yalnızca transform. */}
        <motion.div
          ref={boxRef}
          style={{ x, y, scale, originX: 0, originY: 0 }}
          className="relative aspect-[690/770] w-[min(80vw,330px,calc((100svh-150px)*0.896))] flex-none md:w-[min(34vw,430px,calc((100svh-170px)*0.896))]"
        >
          <motion.div style={{ opacity: photoO }} className={cn("absolute inset-0", !phase.photo && "invisible")}>
            <FeatheredPhoto
              src={IMAGES.hero.src}
              width={IMAGES.hero.w}
              height={IMAGES.hero.h}
              feather={{ t: 3, r: 4, b: 5, l: 4 }}
              corner={14}
              sizes="(min-width: 768px) 430px, 80vw"
              alt="Quantum Plus su arıtma cihazının siyah cam dijital paneli"
              className="h-full w-full"
            />
          </motion.div>

          <motion.div aria-hidden style={{ opacity: twinO }} className={cn("absolute inset-0", !phase.twin && "invisible")}>
            <PanelTwin
              idle={phase.twin}
              // gece evresinde cam ekranı her zaman doldurmaz (masaüstü): parlama bandı cam kenarını göstermesin
              sheen={phase.twin && !phase.bare}
              logo={!phase.bare}
              mark={!phase.bare}
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <clipPath id={`${gid}-clip`}>
                  <path d={GLASS_PATH} />
                </clipPath>
                <linearGradient id={`${gid}-band`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Kaydırmaya bağlı ışık bandı: ikiz devraldığı anda camdan geçer */}
              <g clipPath={`url(#${gid}-clip)`}>
                <motion.g style={{ x: sweepX }}>
                  <rect x={-150} y={40} width={130} height={720} fill={`url(#${gid}-band)`} transform="skewX(-14)" />
                </motion.g>
              </g>
              {/* Logo ve B12 işareti kararır, cam kenarı gece zeminine karışır */}
              <motion.g style={{ opacity: coverO }}>
                {!phase.bare && (
                  <>
                    <rect x={40} y={112} width={280} height={146} fill="#06070A" />
                    <rect x={196} y={604} width={120} height={92} fill="#06070A" />
                  </>
                )}
                <path d={GLASS_PATH} fill="none" stroke="#06070A" strokeWidth={5} />
              </motion.g>
            </PanelTwin>
          </motion.div>
        </motion.div>

        {/* Başlangıç etiketi (gündüz) */}
        <motion.div
          aria-hidden
          style={{ opacity: labelO, y: labelY }}
          className="pointer-events-none absolute inset-x-0 top-[calc(56px+4svh)] z-20 flex flex-col items-center gap-3 px-5 text-center"
        >
          <Micro className="text-[#475467]">{LABEL}</Micro>
          <span className={cn(s.irisLine, "h-px w-16")} />
        </motion.div>

        {/* Manifesto: logonun yerinde, kelime kelime yükselir */}
        <div
          className={cn(
            s.ink,
            "pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[40svh] flex-col items-center justify-end px-5 pb-4 pt-[68px] text-center"
          )}
        >
          <h2 className="max-w-[min(92vw,1000px)] font-semibold tracking-[-0.045em] text-[#F5F7FA]">
            <span className="block text-balance text-[clamp(1.25rem,5.4vw,2.2rem)] leading-[1.1] tracking-[-0.03em] text-white/80 [@media(max-height:520px)]:text-[1rem]">
              {w1.map((w, i) => (
                <Word key={i} p={p} at={WORDS_AT + i * WORD_STEP}>
                  {w}
                </Word>
              ))}
            </span>
            <span className="mt-2 block text-[clamp(2.15rem,9.8vw,4.8rem)] leading-[0.95] [@media(max-height:520px)]:text-[1.75rem]">
              {w2.map((w, i) => (
                <Word
                  key={i}
                  p={p}
                  at={WORDS_AT + (w1.length + i) * WORD_STEP}
                  lit={phase.lit}
                  accent={
                    {
                      "--qa-gs": `${w2.length * 100}%`,
                      "--qa-gp": `${(i / Math.max(1, w2.length - 1)) * 100}%`,
                      "--qa-sd": `${i * 0.08}s`,
                    } as CSSProperties
                  }
                >
                  {w}
                </Word>
              ))}
            </span>
          </h2>
          <motion.div aria-hidden style={{ opacity: metaO }} className="mt-4 flex items-center gap-3 [@media(max-height:520px)]:hidden">
            <Micro className="text-[10px] text-white/50">DİJİTAL LED EKRAN</Micro>
            <Temsili className="text-white/70" />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/** Maskeden yükselen tek kelime (kaydırmaya bağlı) */
function Word({
  p,
  at,
  accent,
  lit = false,
  children,
}: {
  p: MotionValue<number>;
  at: number;
  accent?: CSSProperties;
  lit?: boolean;
  children: string;
}) {
  const y = useTransform(p, [at, at + 0.07], ["110%", "0%"]);
  const opacity = useTransform(p, [at, at + 0.05], [0, 1]);
  return (
    <>
      <span className="-mb-[0.14em] -mt-[0.08em] inline-block overflow-hidden pb-[0.14em] pt-[0.08em] align-bottom">
        <motion.span className="inline-block" style={{ y, opacity }}>
          {accent ? (
            <span className={cn(s.accent, lit && s.shimmer)} style={accent}>
              {children}
            </span>
          ) : (
            children
          )}
        </motion.span>
      </span>{" "}
    </>
  );
}

/* ───────── Hareket azaltılmış: sabit gece bandı ───────── */

function DiveStatic() {
  return (
    <Section id="camin-icine" theme="ink" className="px-5 py-[16svh] md:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_100%,rgba(139,92,246,0.14),transparent_70%)]"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <Micro>{LABEL}</Micro>
        <span aria-hidden className={cn(s.irisLine, "mt-4 h-px w-16")} />
        <h2 className="mt-8 font-semibold tracking-[-0.045em] text-[#F5F7FA]">
          <span className="block text-balance text-[clamp(1.25rem,4vw,2.2rem)] leading-[1.1] text-white/80">{LINE1}</span>
          <span className="mt-3 block text-[clamp(2.15rem,8vw,4.8rem)] leading-[0.95]">
            <span className={s.accent}>{LINE2}</span>
          </span>
        </h2>
      </div>
    </Section>
  );
}
