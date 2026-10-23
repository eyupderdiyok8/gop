"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { DISPLAY, IMAGES } from "../data";
import { FeatheredPhoto, IrisGradient, Sticker, Temsili, useSvgId } from "./primitives";
import { GLASS_PATH, PanelTwin } from "./PanelTwin";
import s from "./theme.module.css";
import g from "./GucAcik.module.css";

const { w: PW, h: PH } = IMAGES.hero;
const d = (sec: number, dur?: string) => ({ "--d": `${sec}s`, ...(dur ? { "--dur": dur } : {}) }) as CSSProperties;

/**
 * Cihaz silueti (hero.jpg pikseli, kenardan ~3px dışa taşırılmış). Hale fotoğrafın önünde çizilir
 * ama bu alanda gizlenir; böylece gök zeminin önünden, cihazın arkasından geçer.
 */
const SILHOUETTE: readonly (readonly [number, number])[] = [
  [19, 80], [23, 55], [38, 38], [58, 29], [100, 26], [160, 23], [220, 20], [280, 15], [320, 12], [350, 7],
  [378, 6], [402, 9], [460, 19], [520, 29], [580, 43], [620, 53], [660, 63], [694, 69], [694, 588], [662, 608],
  [622, 632], [582, 657], [542, 680], [502, 706], [462, 726], [422, 748], [396, 761], [360, 763], [300, 754],
  [200, 736], [100, 719], [60, 710], [38, 708], [25, 701], [18, 686], [17, 560], [15, 470], [13, 270], [16, 210],
  [18, 120],
];

/** Maske görseli: fotoğraf merkezli, 3 × genişlikte kare; siluet delik (evenodd) */
const SPAN = PW * 3;
const MX = PW / 2 - SPAN / 2;
const MY = PH / 2 - SPAN / 2;
const MASK_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${MX} ${MY} ${SPAN} ${SPAN}'>` +
  `<path fill-rule='evenodd' d='M${MX} ${MY}h${SPAN}v${SPAN}h-${SPAN}z M${SILHOUETTE.map(([x, y]) => `${x} ${y}`).join(" L")}z'/></svg>`;
const HALO_MASK = `url("data:image/svg+xml,${encodeURIComponent(MASK_SVG)}")`;

/* Hale geometrisi (viewBox 0 0 200 200) ve kuyruklu yıldızın izi */
const R = 97;
const TAIL_DEG = 32;
const TAIL_RAD = ((-90 - TAIL_DEG) * Math.PI) / 180;
const TAIL = [100 + R * Math.cos(TAIL_RAD), 100 + R * Math.sin(TAIL_RAD)].map((n) => +n.toFixed(2));

/** Soldaki yuvarlak tuş: On/Off (fotoğrafta başka bir yazı basılı olsa da gerçek adı bu) */
const POWER = DISPLAY.keys[0];
/** On/Off'a dokununca ekranın kapalı kaldığı süre; sonra açılış baştan oynar */
const OFF_MS = 600;

/** Ürün sahnesi: gök havuzu, yörünge halesi, LCP fotoğraf + açılan ekran, etiket. */
export function HeroStage({
  live,
  scale,
  rotateX,
  rotateY,
  haloScale,
  haloOpacity,
}: {
  live: boolean;
  scale: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  haloScale: MotionValue<number>;
  haloOpacity: MotionValue<number>;
}) {
  // On/Off'a dokununca ekran kısa bir süre kapanır, sonra yeniden açılır (anahtar değişir, açılış baştan oynar)
  const [replay, setReplay] = useState(0);
  const [off, setOff] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const power = () => {
    if (off) return;
    navigator.vibrate?.(10);
    setOff(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOff(false);
      setReplay((n) => n + 1);
    }, OFF_MS);
  };

  return (
    <div className={cn(g.device, "relative mx-auto", !live && s.paused)}>
      {/* Gök havuzu: fotoğrafın kenar rengiyle buluşur; arkada çok hafif mor yıkama */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[132%] w-[165%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(210,230,250,0.95),rgba(210,230,250,0.6)_58%,rgba(210,230,250,0)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.06),rgba(139,92,246,0))]"
      />

      {/* Kaydırınca ekrana doğru büyüme: odak camın ortası */}
      <motion.div style={{ scale, transformOrigin: "26% 52.6%" }} className="relative">
        {/* İmleç eğimi: hale de aynı düzlemde döner, maske hizada kalır */}
        <motion.div style={{ rotateX, rotateY, transformPerspective: 1200 }} className="relative">
          <FeatheredPhoto
            src={IMAGES.hero.src}
            alt="Quantum Plus dijital su arıtma cihazı; mat beyaz gövde ve siyah cam dokunmatik panel"
            width={PW}
            height={PH}
            feather={{ t: 2, l: 4, r: 4, b: 4 }}
            corner={14}
            lcp
            sizes="(min-width: 1024px) 560px, (min-width: 768px) 440px, 88vw"
          >
            <Screen key={replay} replay={replay} off={off} />
            <button
              type="button"
              onClick={power}
              aria-label="On/Off tuşu: ekranı kapatıp yeniden açın"
              title="On/Off: ekranı kapatıp açın"
              className={cn(
                s.focus,
                "absolute z-10 h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full motion-reduce:hidden"
              )}
              style={{ left: `${(POWER.cx / PW) * 100}%`, top: `${(POWER.cy / PH) * 100}%` }}
            />
          </FeatheredPhoto>

          <div aria-hidden className={g.halo} style={{ WebkitMaskImage: HALO_MASK, maskImage: HALO_MASK }}>
            <motion.div style={{ scale: haloScale, opacity: haloOpacity }} className="h-full w-full">
              <div className={cn(s.spin, "h-full w-full")} style={{ "--dur": "40s" } as CSSProperties}>
                <HaloRing />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <StickerNote />
        <Temsili className="absolute bottom-[1%] left-[64%] z-20 bg-white/60" />
      </motion.div>
    </div>
  );
}

/**
 * Fotoğraftaki ekranın üstü: panel ikizi (açılış) + arkadan aydınlanma + On/Off dalgası.
 * off: ekran içeriği siyah yamayla örtülür (kapalı ekran), ikiz çizilmez.
 */
function Screen({ replay, off }: { replay: number; off: boolean }) {
  const id = useSvgId("gaScreen");
  const { ring } = DISPLAY;
  return (
    <>
      {!off && <PanelTwin variant="overlay" boot className="pointer-events-none absolute inset-0 h-full w-full" />}
      <svg
        aria-hidden
        viewBox={`0 0 ${PW} ${PH}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <path d={GLASS_PATH} />
          </clipPath>
          <radialGradient id={`${id}-bloom`} gradientUnits="userSpaceOnUse" cx={ring.cx} cy={ring.cy} r={300}>
            <stop offset="0" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="0.45" stopColor="#22D3EE" stopOpacity="0.16" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
        </defs>
        {off ? (
          <rect x={86} y={262} width={160} height={338} rx={6} fill="#050506" className={s.fadeIn} style={d(0, "0.18s")} />
        ) : (
          <rect x={0} y={0} width={PW} height={PH} fill={`url(#${id}-bloom)`} clipPath={`url(#${id}-clip)`} className={g.bloom} />
        )}
        {(off || replay > 0) && (
          <circle
            key={off ? "off" : "on"}
            cx={POWER.cx}
            cy={POWER.cy}
            r={POWER.r}
            fill="none"
            stroke="#38BDF8"
            strokeWidth={3}
            className={s.pulseOnce}
            style={d(0, "0.7s")}
          />
        )}
      </svg>
    </>
  );
}

/** İris yörünge: 1.5px çizgi + geniş soluk kopya (sahte parıltı) + beyaz kuyruklu yıldız */
function HaloRing() {
  const id = useSvgId("gaHalo");
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
      <defs>
        <IrisGradient id={`${id}-ring`} x1={0} y1={0} x2={1} y2={1} />
        <linearGradient id={`${id}-tail`} gradientUnits="userSpaceOnUse" x1={TAIL[0]} y1={TAIL[1]} x2={100} y2={100 - R}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle
        cx={100}
        cy={100}
        r={R}
        fill="none"
        stroke={`url(#${id}-ring)`}
        strokeWidth={3.4}
        strokeOpacity={0.1}
        className={s.fadeIn}
        style={d(1.3, "1.2s")}
      />
      <circle
        cx={100}
        cy={100}
        r={R}
        fill="none"
        stroke={`url(#${id}-ring)`}
        strokeWidth={0.42}
        pathLength={1}
        transform="rotate(-90 100 100)"
        className={s.draw}
        // 1 2 + 1.05: çizim başlamadan uçta nokta kalmasın
        style={{ ...d(0.25, "1.8s"), strokeDasharray: "1 2", strokeDashoffset: 1.05 }}
      />
      <g className={s.fadeIn} style={d(2, "0.6s")}>
        <path
          d={`M${TAIL[0]} ${TAIL[1]} A${R} ${R} 0 0 1 100 ${100 - R}`}
          fill="none"
          stroke={`url(#${id}-tail)`}
          strokeWidth={1.1}
          strokeLinecap="round"
        />
        <circle cx={100} cy={100 - R} r={2.6} fill="#8B5CF6" fillOpacity={0.16} />
        <circle cx={100} cy={100 - R} r={1.1} fill="#fff" stroke="#6D3AE0" strokeOpacity={0.55} strokeWidth={0.3} />
      </g>
    </svg>
  );
}

/** "Evet, bu bir su arıtma cihazı." etiketi ve cihaza uzanan el çizimi ok */
function StickerNote() {
  // Hareket azaltılınca etiket beklemeden görünür (ok da zaten çizili gelir)
  const reduce = useReducedMotion();
  return (
    <div className="absolute right-[-2%] top-[-7%] z-20 lg:right-[-12%] lg:top-[2%]">
      <Sticker rotate={-6} delay={reduce ? 0 : 2.3} className="lg:px-4 lg:py-2 lg:text-[15px]">
        Evet, bu bir su arıtma cihazı.
      </Sticker>
      <svg
        aria-hidden
        viewBox="0 0 60 64"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute -left-6 top-[calc(100%-2px)] h-16 w-[60px] overflow-visible text-[#0B0F17]/75"
      >
        <path
          d="M54 4 C44 1 31 5 29 14 C27 23 38 27 40 20 C42 12 28 11 22 22 C16 33 13 43 12 54"
          pathLength={1}
          className={s.draw}
          style={{ ...d(2.6, "0.7s"), strokeDasharray: "1 2", strokeDashoffset: 1.05 }}
        />
        <path d="M5 46 L12 55 L19 47" className={s.fadeIn} style={d(3.2, "0.25s")} />
      </svg>
    </div>
  );
}
