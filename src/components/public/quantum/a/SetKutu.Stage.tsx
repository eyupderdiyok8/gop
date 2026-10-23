"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type RefObject } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronUp, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "../data";
import { FeatheredPhoto, Frame, IrisGradient, Micro, Wordmark, useLive, useSvgId } from "./primitives";
import { SET_ITEMS, popDelay, type SetItem } from "./SetKutu.items";
import { EASE } from "./tokens";
import s from "./theme.module.css";
import m from "./SetKutu.module.css";

/**
 * Set sahnesi: kit.jpg beyaz çerçevede, üstünde siyah cam kapak.
 * Kapak masaüstünde kaydırmayla, her ekranda dokununca kalkar; sonra numaralı tuşlar belirir.
 * Bir parça seçilince "kamera" o noktaya 1.7x yaklaşır (yalnızca transform).
 */

const ZOOM = 1.7;
/** Görüntü kenarı çerçeveden içeri girmesin: en fazla bu kadar kaydır (%) */
const MAX_SHIFT = (ZOOM - 1) * 50;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const pad = (n: number) => String(n).padStart(2, "0");

function camera(i: number | null) {
  if (i === null) return { k: 1, x: 0, y: 0 };
  const f = SET_ITEMS[i].focus;
  return {
    k: ZOOM,
    x: clamp(-ZOOM * (f.x - 50), -MAX_SHIFT, MAX_SHIFT),
    y: clamp(-ZOOM * (f.y - 50), -MAX_SHIFT, MAX_SHIFT),
  };
}

export function SetStage({
  active,
  shown,
  lidTap,
  onOpen,
  onReveal,
  onSelect,
  className,
}: {
  active: number | null;
  /** kapak bir kez açıldı: işaretler görünür */
  shown: boolean;
  /** dokunarak açma ilerlemesi (0–1), üst bileşen canlandırır */
  lidTap: MotionValue<number>;
  onOpen: () => void;
  onReveal: () => void;
  onSelect: (i: number | null) => void;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const firstKey = useRef<HTMLButtonElement>(null);
  const live = useLive(frameRef);
  const reduce = useReducedMotion();

  /* ───── Kapak ───── */
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const desk = useMotionValue(0);
  const still = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => desk.set(mq.matches ? 1 : 0);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [desk]);

  useEffect(() => {
    still.set(reduce ? 1 : 0);
  }, [reduce, still]);

  // masaüstü: çerçeve ilerlemesi 0.15→0.45 arasında kalkar · dokunuş her zaman · hareket azaltılınca açık
  const lid = useTransform([scrollYProgress, lidTap, desk, still], ([p, t, d, r]: number[]) =>
    r ? 1 : Math.max(d ? clamp((p - 0.15) / 0.3, 0, 1) : 0, t)
  );
  const lidY = useTransform(lid, (v) => `${-104 * v}%`);
  const lidTilt = useTransform(lid, [0, 1], [0, 6]);
  const lidShade = useTransform(lid, [0, 0.1, 0.8, 1], [0, 0.55, 0.35, 0]);
  const settle = useTransform(lid, [0, 1], [1.05, 1]);

  // eşik geçişleri: işaretler bir kez belirir, kapak yukarıdayken tıklanamaz.
  // Birleşik değer render sırasında da güncellenir: durum değişimi bir sonraki kareye ertelenir.
  const revealedRef = useRef(false);
  const openRef = useRef(false);
  const [lidOpen, setLidOpen] = useState(false);
  const check = useCallback(
    (v: number) => {
      const reveal = v > 0.8 && !revealedRef.current;
      if (reveal) revealedRef.current = true;
      const o = v > 0.92;
      const flip = o !== openRef.current;
      if (flip) openRef.current = o;
      if (reveal || flip)
        requestAnimationFrame(() => {
          if (reveal) onReveal();
          if (flip) setLidOpen(o);
        });
    },
    [onReveal]
  );
  useMotionValueEvent(lid, "change", check);
  useEffect(() => {
    check(lid.get());
  }, [lid, check]);

  // dar ekranda kaydırma kapağı açmaz: çerçeve bir süre ekranda kalınca kendiliğinden açılır
  const inView = useInView(frameRef, { amount: 0.6 });
  useEffect(() => {
    if (!inView || lidOpen) return;
    const t = window.setTimeout(() => {
      if (!desk.get()) onOpen();
    }, 2600);
    return () => window.clearTimeout(t);
  }, [inView, lidOpen, desk, onOpen]);

  const pull = (e: MouseEvent<HTMLButtonElement>) => {
    onOpen();
    // klavyeyle açıldıysa odak ilk tuşa geçsin
    if (e.detail === 0) window.setTimeout(() => firstKey.current?.focus(), 650);
  };

  /* ───── Kamera ───── */
  const k = useMotionValue(1);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  useEffect(() => {
    const c = camera(active);
    const opts = reduce ? { duration: 0 } : { type: "spring" as const, duration: 0.6, bounce: 0.1 };
    const runs = [animate(k, c.k, opts), animate(tx, c.x, opts), animate(ty, c.y, opts)];
    return () => runs.forEach((r) => r.stop());
  }, [active, reduce, k, tx, ty]);
  const camX = useTransform(tx, (v) => `${v}%`);
  const camY = useTransform(ty, (v) => `${v}%`);
  const unscale = useTransform(k, (v) => 1 / v);

  const item = active === null ? null : SET_ITEMS[active];

  return (
    <div className={cn("relative", className)}>
      {/* çerçevenin arkasında iris hale */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-6%] inset-y-[-12%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),rgba(34,211,238,0.08)_55%,transparent)]"
      />

      <Frame>
        <div
          ref={frameRef}
          className={cn("relative w-full", !live && s.paused)}
          style={{ aspectRatio: `${IMAGES.kit.w} / ${IMAGES.kit.h}` }}
        >
          {/* fotoğraf + işaretler: kapak kalkarken hafifçe yerine oturur, sonra kamera */}
          <motion.div className="absolute inset-0" style={{ scale: settle }}>
            <motion.div className="absolute inset-0" style={{ x: camX, y: camY, scale: k }}>
              <FeatheredPhoto
                src={IMAGES.kit.src}
                alt="Quantum Plus set içeriği: cihaz, üstte filtre kartuşları, membran, paslanmaz musluk, güç adaptörü, hortum ve bağlantı parçaları"
                width={IMAGES.kit.w}
                height={IMAGES.kit.h}
                sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 92vw"
                feather={3}
                className="h-full w-full"
              />
              <div inert={!shown} className="absolute inset-0">
                {SET_ITEMS.map((it, i) => (
                  <Marker
                    key={it.id}
                    i={i}
                    item={it}
                    active={active}
                    shown={shown}
                    unscale={unscale}
                    onSelect={onSelect}
                    keyRef={i === 0 ? firstKey : undefined}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* seçili parçanın künyesi (dar ekranda fotoğrafın altında gösterilir) */}
          <AnimatePresence mode="wait">
            {item && (
              <motion.div
                key={item.id}
                className="pointer-events-none absolute bottom-4 left-4 z-20 hidden max-w-[min(80%,360px)] rounded-[16px] border border-[rgba(11,15,23,0.08)] bg-white/95 px-4 py-3 shadow-[0_14px_30px_-18px_rgba(30,60,120,0.55)] md:block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, delay: 0.12 } }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.18 } }}
              >
                <p className="flex items-baseline gap-2 text-[13.5px] font-semibold leading-tight tracking-[-0.01em] text-[#0B0F17] md:text-[15px]">
                  <span className={cn(s.mono, s.irisText, "text-[11px] font-semibold")}>{pad((active ?? 0) + 1)}</span>
                  {item.name}
                </p>
                <p className="mt-0.5 text-[12.5px] leading-[1.4] text-[#475467] md:text-[13.5px]">{item.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* uzaklaş */}
          <AnimatePresence>
            {item && (
              <motion.button
                key="tumu"
                type="button"
                onClick={() => onSelect(null)}
                aria-label="Tüm seti göster"
                className={cn(
                  s.focus,
                  s.micro,
                  "absolute right-2 top-2 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-[rgba(11,15,23,0.1)] bg-white/95 px-4 text-[#0B0F17] shadow-[0_12px_26px_-16px_rgba(30,60,120,0.6)] md:right-3 md:top-3"
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <ZoomOut aria-hidden className="h-4 w-4" strokeWidth={2} />
                Tümü
              </motion.button>
            )}
          </AnimatePresence>

          {/* kapak */}
          <motion.div
            inert={lidOpen}
            className={cn(s.ink, "absolute inset-0 z-30 motion-reduce:hidden", lidOpen && "pointer-events-none")}
            style={{ y: lidY, rotateX: lidTilt, transformPerspective: 1100, originY: 0 }}
          >
            <Lid onPull={pull} />
            {/* kapağın fotoğrafa düşen gölgesi */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-full h-14 bg-[linear-gradient(180deg,rgba(6,7,10,0.4),transparent)]"
              style={{ opacity: lidShade }}
            />
          </motion.div>
        </div>
      </Frame>
    </div>
  );
}

/* ───────── Kapak yüzü ───────── */

function Lid({ onPull }: { onPull: (e: MouseEvent<HTMLButtonElement>) => void }) {
  const id = useSvgId("lid");
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(165deg,#171B23_0%,#08090D_50%,#0C0E13_100%)]">
      <div aria-hidden className="absolute inset-[10px] rounded-[14px] border border-white/[0.07] md:inset-4 md:rounded-[18px]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2 border-t border-white/[0.09] bg-white/[0.03]" />
      <span aria-hidden className={s.sheen} />
      <span
        aria-hidden
        className={cn(s.sweep, "absolute inset-y-0 right-full w-[30%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]")}
        style={{ "--dur": "7s", "--sx1": "440%", "--d": "1.4s" } as CSSProperties}
      />

      <div aria-hidden className="absolute inset-x-5 top-4 flex items-center justify-between text-white/55 md:inset-x-8 md:top-7">
        <Micro className="text-white/55">Kutu içeriği</Micro>
        <Micro className="text-white/55">Set</Micro>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-10 md:gap-4 md:pb-14">
        <svg aria-hidden viewBox="0 0 48 48" className="h-9 w-9 md:h-12 md:w-12">
          <defs>
            <IrisGradient id={id} x1={1} y1={0} x2={0} y2={1} />
          </defs>
          <circle cx={24} cy={24} r={19} fill="none" stroke={`url(#${id})`} strokeWidth={7} strokeOpacity={0.14} />
          <circle cx={24} cy={24} r={19} fill="none" stroke={`url(#${id})`} strokeWidth={2.6} />
        </svg>
        <Wordmark className="text-[15px] text-white md:text-[26px]" />
        <span aria-hidden className={cn(s.irisLine, "h-[2px] w-24 rounded-full md:w-40")} />
      </div>

      <div className="absolute inset-x-0 bottom-3.5 flex justify-center md:bottom-7">
        <button
          type="button"
          onClick={onPull}
          className={cn(
            s.focus,
            s.micro,
            "relative inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] pl-3.5 pr-4 text-white transition-colors duration-300 hover:bg-white/[0.13]"
          )}
        >
          <span aria-hidden className={cn(m.tabPulse, "pointer-events-none absolute inset-0 rounded-full border border-[#22D3EE]/70")} />
          <ChevronUp aria-hidden className="h-4 w-4" strokeWidth={2.2} />
          Kutuyu açın
        </button>
      </div>
    </div>
  );
}

/* ───────── Numaralı tuş ───────── */

function Marker({
  i,
  item,
  active,
  shown,
  unscale,
  onSelect,
  keyRef,
}: {
  i: number;
  item: SetItem;
  active: number | null;
  shown: boolean;
  unscale: MotionValue<number>;
  onSelect: (i: number | null) => void;
  keyRef?: RefObject<HTMLButtonElement | null>;
}) {
  const on = active === i;
  const dim = active !== null && !on;
  return (
    // 0×0 kutu tam noktada: ters ölçek kamera yaklaşırken tuşu aynı boyda tutar
    <motion.div className="absolute h-0 w-0" style={{ left: `${item.at.x}%`, top: `${item.at.y}%`, scale: unscale }}>
      <button
        ref={keyRef}
        type="button"
        aria-label={`${i + 1}. ${item.name}`}
        aria-pressed={on}
        onClick={() => onSelect(i)}
        className={cn(
          s.focus,
          "absolute left-0 top-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-opacity duration-300",
          dim && "opacity-35"
        )}
      >
        <motion.span
          className="relative flex"
          initial={false}
          animate={shown ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={shown ? { type: "spring", stiffness: 460, damping: 19, delay: popDelay(i) } : { duration: 0.2 }}
        >
          <span
            className={cn(
              s.key,
              on ? s.ringIris : s.ringCyan,
              "h-[26px] w-[26px] shadow-[0_6px_16px_-6px_rgba(6,7,10,0.7)] md:h-8 md:w-8"
            )}
          >
            <span className={cn(s.mono, "text-[11px] font-medium leading-none md:text-[12px]")}>{i + 1}</span>
          </span>
          {shown && (
            <span
              aria-hidden
              className={cn(s.pulseOnce, "pointer-events-none absolute inset-0 rounded-full border-[1.5px] border-[#22D3EE]")}
              style={{ "--d": `${popDelay(i) + 0.05}s`, "--dur": "1s" } as CSSProperties}
            />
          )}
          {shown && active === null && (
            <span aria-hidden className={m.ping} style={{ "--d": `${2.2 + i * 0.9}s` } as CSSProperties} />
          )}
        </motion.span>
      </button>
    </motion.div>
  );
}
