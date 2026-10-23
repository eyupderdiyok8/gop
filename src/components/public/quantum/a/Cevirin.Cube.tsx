"use client";

import {
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Hand } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIMENSIONS, IMAGES } from "../data";
import { Frame, featherMask, useLive } from "./primitives";
import { EASE } from "./tokens";
import s from "./theme.module.css";

/**
 * Sürüklenerek dönen CSS 3D kutu (26 × 41 × 43 cm, birim u = H / 41).
 * Ön: front.jpg · sol: side.jpg olduğu gibi · sağ: side.jpg aynalı · üst ve arka: mat CSS.
 * Ölçü çizgileri kutuyla aynı düzlemlerde yaşar. Yüz gölgeleri sabit bir ışığa göre yaw'dan hesaplanır.
 */

export type View = "on" | "34" | "yan";
export type Dim = "h" | "w" | "d";

export const VIEWS: Record<View, number> = { on: 0, "34": -35, yan: -90 };
/** open.jpg'nin açısına denk gelen yaw (göz kararı) */
export const LID_YAW = -55;
/** Ölçü çipine basınca o ölçünün en iyi okunduğu açı */
export const DIM_VIEW: Record<Dim, View> = { h: "34", w: "on", d: "yan" };

const PITCH = -12;
const AUTO = 360 / 28000; // derece / ms (28 sn'de bir tur)
const IDLE = 4000;
const LIGHT = -30; // anahtar ışık: önden-soldan

const W = DIMENSIONS.width;
const H = DIMENSIONS.height;
const D = DIMENSIONS.depth;

const u = (n: number) => `calc(var(--u) * ${n})`;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Üst bileşenin olay işleyicilerinden çağrılır */
export type CubeApi = {
  /** en yakın eşdeğer açıya yaylanarak döner ve 4 sn bekler */
  snap: (deg: number) => void;
  /** otomatik turu 4 sn sonra yeniden başlatır */
  release: () => void;
};

/* ───────── Sahne ───────── */

function box(w: number, h: number, transform: string): CSSProperties {
  return { width: u(w), height: u(h), marginLeft: u(-w / 2), marginTop: u(-h / 2), transform };
}

/** Yüz normalinin ışığa göre gölge opaklığı (0.04 – 0.4) */
function shadeFor(phi: number) {
  return (y: number) => 0.04 + (1 - Math.cos(((y + phi - LIGHT) * Math.PI) / 180)) * 0.18;
}

const FACE = "absolute left-1/2 top-1/2 overflow-hidden rounded-[10px] border border-[#EEF2F7] [backface-visibility:hidden]";
const MATTE = "bg-[linear-gradient(180deg,#F4F6F9,#E3E8EF)]";

export function CubeStage({
  ref,
  open,
  dim,
  onFree,
  className,
  children,
}: {
  ref?: Ref<CubeApi>;
  open: boolean;
  dim: Dim | null;
  /** kullanıcı sürükleyince ya da otomatik tur yeniden başlayınca (seçili açı çipi sönsün) */
  onFree?: () => void;
  className?: string;
  /** sahnenin altındaki yuva (kapak açıkken açıklama) */
  children?: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const live = useLive(stageRef, { margin: "80px 0px" });
  const reduce = useReducedMotion();

  const target = useMotionValue(VIEWS["34"]);
  const yaw = useSpring(target, { stiffness: 60, damping: 15, mass: 1 });

  const holdUntil = useRef(0);
  const armed = useRef(false);
  const drag = useRef<{ x: number; v0: number; lx: number; lt: number; vx: number } | null>(null);
  const [dragged, setDragged] = useState(false);
  const free = useEffectEvent(() => onFree?.());

  // Boştayken yavaş otomatik tur (yalnızca görünürken, kapak kapalıyken)
  useEffect(() => {
    if (!live || open) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      const dt = last ? Math.min(t - last, 64) : 16;
      last = t;
      if (!drag.current && performance.now() > holdUntil.current) {
        target.set(target.get() + dt * AUTO);
        if (armed.current) {
          armed.current = false;
          free();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live, open, target]);

  const set = (v: number) => {
    target.set(v);
    if (reduce) yaw.jump(v);
  };
  const hold = () => {
    holdUntil.current = performance.now() + IDLE;
    armed.current = true;
  };

  useImperativeHandle(ref, () => ({
    snap: (deg: number) => {
      const v = deg + 360 * Math.round((target.get() - deg) / 360);
      target.set(v);
      if (reduce) yaw.jump(v);
      holdUntil.current = performance.now() + IDLE;
      armed.current = true;
    },
    release: () => {
      holdUntil.current = performance.now() + IDLE;
      armed.current = true;
    },
  }), [reduce, target, yaw]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (open || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, v0: target.get(), lx: e.clientX, lt: e.timeStamp, vx: 0 };
    cubeRef.current?.style.setProperty("will-change", "transform");
    setDragged(true);
    onFree?.();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dt = e.timeStamp - d.lt;
    if (dt > 0) d.vx = 0.75 * ((e.clientX - d.lx) / dt) + 0.25 * d.vx;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    set(d.v0 + (e.clientX - d.x) * 0.5); // 1px = 0.5°
  };

  const end = (fling: boolean) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    // atalet: son hızın kısa bir izdüşümü, yay yumuşatır
    if (fling && !reduce) target.set(target.get() + clamp(d.vx, -3, 3) * 0.5 * 160);
    hold();
    cubeRef.current?.style.removeProperty("will-change");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (open || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    set(target.get() + (e.key === "ArrowRight" ? 15 : -15));
    hold();
    onFree?.();
  };

  const transform = useTransform(yaw, (y) => `rotateX(${PITCH}deg) rotateY(${y}deg)`);
  const shFront = useTransform(yaw, shadeFor(0));
  const shRight = useTransform(yaw, shadeFor(90));
  const shBack = useTransform(yaw, shadeFor(180));
  const shLeft = useTransform(yaw, shadeFor(-90));
  // zemin gölgesi: izdüşüm genişliğini izler
  const floor = useTransform(yaw, (y) => {
    const r = (y * Math.PI) / 180;
    return (W * Math.abs(Math.cos(r)) + D * Math.abs(Math.sin(r))) / D;
  });

  const lift = { duration: 0.6, ease: EASE, delay: open ? 0.65 : 0.35 };
  const swap = { duration: open ? 0.55 : 0.4, ease: "easeOut" as const, delay: open ? 1.25 : 0 };

  return (
    <div
      ref={stageRef}
      className={cn("relative mx-auto w-full [--H:min(46svh,300px,72vw)] lg:[--H:min(56svh,400px)]", className)}
      style={{ "--u": "calc(var(--H) / 41)", height: "calc(var(--H) * 1.2 + 108px)" } as CSSProperties}
    >
      {/* stüdyo zemini: ufuk çizgisi ve gölge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[-50vw] bottom-0" style={{ top: `calc(50% + ${u(13)})` }}>
        <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(11,15,23,0.1)_30%,rgba(11,15,23,0.1)_70%,transparent)]" />
        <div className="h-full w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.35),transparent_70%)]" />
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(30,50,90,0.3),rgba(30,50,90,0.1)_55%,transparent)]"
        style={{ width: u(54), height: u(12), marginLeft: u(-27), top: `calc(50% + ${u(15)})`, scaleX: floor }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={swap}
      />

      {/* kutu */}
      <motion.div className="absolute inset-0" animate={{ opacity: open ? 0 : 1 }} transition={swap}>
        <div
          role="group"
          tabIndex={open ? -1 : 0}
          aria-label={`Quantum Plus 3D görünüm: yükseklik ${H} cm, genişlik ${W} cm, derinlik ${D} cm. Sürükleyerek ya da sol ve sağ ok tuşlarıyla çevirin.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => end(true)}
          onPointerCancel={() => end(false)}
          onKeyDown={onKeyDown}
          className={cn(
            s.focus,
            "absolute inset-0 touch-pan-y select-none rounded-[28px]",
            open ? "pointer-events-none" : "cursor-grab active:cursor-grabbing"
          )}
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={cubeRef}
            className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
            style={{ transform }}
          >
            {/* ön: front.jpg (%3 kırpma) */}
            <div className={cn(FACE, "bg-white")} style={box(W, H, `translateZ(${u(D / 2)})`)}>
              <Image
                src={IMAGES.front.src}
                alt=""
                width={IMAGES.front.w}
                height={IMAGES.front.h}
                sizes="300px"
                loading="lazy"
                draggable={false}
                className="absolute left-[-3%] top-[-2%] h-[104%] w-[106%] max-w-none select-none object-cover"
              />
              <Shade o={shFront} />
            </div>
            {/* sağ: side.jpg aynalı (siyah panel kenarı öne gelsin) */}
            <div className={cn(FACE, "bg-white")} style={box(D, H, `rotateY(90deg) translateZ(${u(W / 2)})`)}>
              <Image
                src={IMAGES.side.src}
                alt=""
                width={IMAGES.side.w}
                height={IMAGES.side.h}
                sizes="320px"
                loading="lazy"
                draggable={false}
                className="absolute left-[-3%] top-[-3%] h-[106%] w-[106%] max-w-none -scale-x-100 select-none object-cover"
              />
              <Shade o={shRight} />
            </div>
            {/* arka: mat, ortada ek yeri çizgisi */}
            <div className={cn(FACE, MATTE)} style={box(W, H, `rotateY(180deg) translateZ(${u(D / 2)})`)}>
              <Seam />
              <Shade o={shBack} />
            </div>
            {/* sol: side.jpg olduğu gibi */}
            <div className={cn(FACE, "bg-white")} style={box(D, H, `rotateY(-90deg) translateZ(${u(W / 2)})`)}>
              <Image
                src={IMAGES.side.src}
                alt=""
                width={IMAGES.side.w}
                height={IMAGES.side.h}
                sizes="320px"
                loading="lazy"
                draggable={false}
                className="absolute left-[-3%] top-[-3%] h-[106%] w-[106%] max-w-none select-none object-cover"
              />
              <Shade o={shLeft} />
            </div>

            {/* kapağın altı: kartuş yuvaları ipucu (kapak kalkınca bir an görünür) */}
            <div
              className="absolute left-1/2 top-1/2 rounded-[8px] bg-[linear-gradient(180deg,#D7E0EB,#C3CEDB)] [backface-visibility:hidden]"
              style={box(W - 2, D - 2, `rotateX(90deg) translateZ(${u(H / 2 - 4)})`)}
            >
              <div className="absolute inset-[12%] grid grid-cols-2 gap-[10%]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="rounded-full bg-[linear-gradient(90deg,#FFFFFF,#E6ECF3)] shadow-[0_2px_0_rgba(11,15,23,0.08)]" />
                ))}
              </div>
            </div>

            {/* üst kapak: kaldırılabilir */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
              animate={{ y: open ? -40 : 0 }}
              transition={lift}
            >
              <motion.div
                className={cn(FACE, MATTE, "left-0 top-0 rounded-[12px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)]")}
                style={box(W, D, `rotateX(90deg) translateZ(${u(H / 2)})`)}
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.45, delay: open ? 0.85 : 0.3 }}
              >
                <div className="absolute inset-x-[8%] top-[46%] h-px bg-[rgba(11,15,23,0.06)]" />
              </motion.div>
            </motion.div>

            {/* 3D ölçü çizgileri */}
            <DimLine
              label={`${H} cm`}
              vertical
              active={dim === "h"}
              style={{
                width: 20,
                height: u(H),
                marginLeft: -10,
                marginTop: u(-H / 2),
                transform: `translateX(calc(var(--u) * ${-W / 2} - 16px)) translateZ(${u(D / 2)})`,
              }}
            />
            <DimLine
              label={`${W} cm`}
              active={dim === "w"}
              style={{
                width: u(W),
                height: 20,
                marginLeft: u(-W / 2),
                marginTop: -10,
                transform: `translateY(calc(var(--u) * ${H / 2} + 16px)) translateZ(${u(D / 2)})`,
              }}
            />
            <DimLine
              label={`${D} cm`}
              active={dim === "d"}
              style={{
                width: u(D),
                height: 20,
                marginLeft: u(-D / 2),
                marginTop: -10,
                transform: `rotateY(90deg) translateY(calc(var(--u) * ${H / 2} + 16px)) translateZ(${u(W / 2)})`,
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* açık kapak: open.jpg beyaz çerçevede (sağ-alttaki başıboş harfler kırpılır) */}
      <motion.div
        aria-hidden={!open}
        className={cn("absolute inset-0 flex items-center justify-center", !open && "pointer-events-none")}
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.96 }}
        transition={{ duration: open ? 0.6 : 0.35, ease: EASE, delay: open ? 1.2 : 0 }}
      >
        <OpenPhoto />
      </motion.div>

      {/* alt yuva: ipucu ya da açıklama */}
      <div className="absolute inset-x-0 bottom-0 flex min-h-11 items-end justify-center px-4">{children}</div>

      {/* sürükleme ipucu */}
      <p
        aria-hidden
        className={cn(
          s.micro,
          "pointer-events-none absolute left-1/2 top-1 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(11,15,23,0.1)] bg-white/80 px-3 py-1.5 text-[color:var(--qa-fg)] transition-opacity duration-500",
          dragged || open ? "opacity-0" : "opacity-100"
        )}
      >
        <Hand className="h-3.5 w-3.5" strokeWidth={2} />
        Sürükleyin
      </p>
    </div>
  );
}

function Shade({ o }: { o: MotionValue<number> }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(11,15,23,0.9),rgba(11,15,23,0.55))]"
      style={{ opacity: o }}
    />
  );
}

function Seam() {
  return (
    <span aria-hidden className="absolute inset-x-0 top-1/2">
      <span className="block h-px bg-[rgba(11,15,23,0.1)]" />
      <span className="block h-px bg-white/90" />
    </span>
  );
}

/** Kutu düzleminde yaşayan ölçü çizgisi; etiketin arka yüzde okunur bir kopyası var */
function DimLine({ label, vertical, active, style }: { label: string; vertical?: boolean; active: boolean; style: CSSProperties }) {
  const line = vertical ? "left-1/2 top-0 h-full w-px -translate-x-1/2" : "left-0 top-1/2 h-px w-full -translate-y-1/2";
  const glow = vertical ? "left-1/2 top-0 h-full w-[5px] -translate-x-1/2" : "left-0 top-1/2 h-[5px] w-full -translate-y-1/2";
  const tick = vertical ? "left-1/2 h-px w-[11px] -translate-x-1/2" : "top-1/2 h-[11px] w-px -translate-y-1/2";
  const grad = vertical ? "bg-[linear-gradient(0deg,#FF3DC8,#8B5CF6_45%,#22D3EE)]" : "bg-[linear-gradient(90deg,#FF3DC8,#8B5CF6_45%,#22D3EE)]";
  const tag = (back: boolean): ReactNode => (
    <span
      className={cn(
        s.mono,
        "absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border bg-white px-2 py-[3px] text-[10.5px] leading-[1.3] tracking-[0.12em] text-[#0B0F17] transition-[border-color] duration-300 [backface-visibility:hidden]",
        active ? "border-[#8B5CF6]" : "border-[rgba(11,15,23,0.1)]"
      )}
      style={{
        transform: `translate(-50%, -50%) ${back ? "rotateY(180deg) " : ""}${vertical ? "rotate(-90deg)" : ""}`,
      }}
    >
      {label}
    </span>
  );
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 [transform-style:preserve-3d]" style={style}>
      <span className={cn("absolute rounded-full transition-opacity duration-300", glow, grad, active ? "opacity-25" : "opacity-0")} />
      <span className={cn("absolute", line, grad)} />
      <span className={cn("absolute bg-[#FF3DC8]", tick, vertical ? "bottom-0" : "left-0")} />
      <span className={cn("absolute bg-[#22D3EE]", tick, vertical ? "top-0" : "right-0")} />
      {tag(false)}
      {tag(true)}
    </div>
  );
}

/** open.jpg: sağdaki ~%4 (x 362–377) kırpılır, sağ kenar ve sağ-alt köşe yumuşatılır */
const OPEN_VISIBLE_W = 362;

function OpenPhoto() {
  const m = featherMask({ t: 2, r: 6, b: 4, l: 2 }, 18);
  return (
    <Frame className="h-[calc(var(--H)*1.12)]" innerClassName="h-full">
      <div className="relative h-full" style={{ aspectRatio: `${OPEN_VISIBLE_W} / ${IMAGES.open.h}` }}>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
        >
          <Image
            src={IMAGES.open.src}
            alt="Kapağı açılmış Quantum Plus: filtre kartuşları gövdenin üstünde, düzenli bir sırada"
            width={IMAGES.open.w}
            height={IMAGES.open.h}
            sizes="320px"
            loading="lazy"
            draggable={false}
            className="absolute left-0 top-0 h-full max-w-none select-none"
            style={{ width: `${(IMAGES.open.w / OPEN_VISIBLE_W) * 100}%` }}
          />
        </div>
      </div>
    </Frame>
  );
}
