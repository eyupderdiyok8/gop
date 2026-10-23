"use client";

import { useId, useState, type ComponentPropsWithRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion, type UseInViewOptions } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE, TEL, WA, waLink } from "../data";
import { EASE, IRIS, IRIS_DEEP, IRIS_STOPS } from "./tokens";
import s from "./theme.module.css";

export type World = "pearl" | "ink";

/** Görünürken ve hareket azaltılmamışken true: sonsuz döngüleri bununla açıp kapatın */
export function useLive(ref: RefObject<Element | null>, opts: { margin?: UseInViewOptions["margin"]; once?: boolean } = {}) {
  const inView = useInView(ref, { margin: opts.margin ?? "120px 0px", once: opts.once });
  const reduce = useReducedMotion();
  return inView && !reduce;
}

/** SVG url(#id) içinde güvenle kullanılabilen benzersiz kimlik */
export function useSvgId(prefix = "qa") {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/* ───────── Bölüm ───────── */

type SectionProps = Omit<ComponentPropsWithRef<"section">, "id"> & {
  id: string;
  theme?: World;
  /** content-visibility:auto + tahmini yükseklik (px). Sticky / useScroll sahnelerinde vermeyin. */
  cv?: number;
  /** overflow: clip (sticky'yi bozmaz). Varsayılan açık. */
  clip?: boolean;
};

/** Bölüm sarmalayıcısı: data-theme başlığın rengini belirler, dünya değişkenlerini kurar */
export function Section({ id, theme = "pearl", cv, clip = true, className, style, children, ...rest }: SectionProps) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={cn(
        s.section,
        theme === "ink" ? s.ink : s.pearl,
        theme === "ink" ? "bg-[#06070A] text-[#F5F7FA]" : "bg-[#F4F8FD] text-[#0B0F17]",
        "relative isolate",
        clip && "overflow-clip",
        cv && s.cv,
        className
      )}
      style={cv ? ({ "--qa-cis": `${cv}px`, ...style } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </section>
  );
}

/* ───────── Hareket ───────── */

/** Görünür alana girince belirerek yükselir. Hareket azaltılınca yalnızca solar (MotionRoot). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* ───────── Başlık ───────── */

type Token = { w: string; accent: boolean; ai: number };

/** "*yıldızlı*" kısımları vurgu olarak işaretler; ai = vurgulu kelime sırası (iris akışı için) */
function tokenize(text: string) {
  const out: Token[] = [];
  let ai = 0;
  text.split("*").forEach((part, i) => {
    const accent = i % 2 === 1;
    part.split(/(\s+)/).forEach((w) => {
      if (!w) return;
      if (w.trim() === "") out.push({ w, accent: false, ai: -1 });
      else out.push({ w, accent, ai: accent ? ai++ : -1 });
    });
  });
  return { tokens: out, accents: ai };
}

const SIZES = {
  hero: "text-[clamp(2.7rem,11.5vw,4.4rem)] md:text-[clamp(4.4rem,6.6vw,7.5rem)]",
  section: "text-[clamp(2.5rem,7vw,6rem)]",
  none: "",
} as const;

const wordVariants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

/**
 * Kelimeleri maskeden yükselten başlık. *vurgu* = ince ağırlık + iris dolgu + tek seferlik parıltı.
 * intro: CSS ile ilk karede başlar (hero h1 için; JS beklemez).
 */
export function Headline({
  text,
  as = "h2",
  size = "section",
  intro = false,
  delay = 0,
  className,
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
  intro?: boolean;
  delay?: number;
  className?: string;
  id?: string;
}) {
  const [seen, setSeen] = useState(false);
  const { tokens, accents } = tokenize(text);
  const base = cn(
    "font-semibold leading-[0.95] tracking-[-0.045em] text-balance text-[color:var(--qa-fg)]",
    SIZES[size],
    className
  );

  let wi = 0;
  const words = tokens.map((t, i) => {
    if (t.ai === -1 && t.w.trim() === "") return t.w;
    const order = wi++;
    const accentStyle =
      t.accent &&
      ({
        "--qa-gs": `${Math.max(1, accents) * 100}%`,
        "--qa-gp": accents > 1 ? `${(t.ai / (accents - 1)) * 100}%` : "0%",
        "--qa-sd": `${delay + order * 0.055 + 0.55}s`,
      } as CSSProperties);
    const inner = t.accent ? (
      <span className={cn(s.accent, (intro || seen) && s.shimmer)} style={accentStyle || undefined}>
        {t.w}
      </span>
    ) : (
      t.w
    );
    return (
      <span
        key={i}
        className="-mb-[0.16em] -mt-[0.1em] inline-block overflow-hidden pb-[0.16em] pt-[0.1em] align-bottom"
      >
        {intro ? (
          <span className={s.introMask} style={{ "--d": `${delay + order * 0.06}s` } as CSSProperties}>
            {inner}
          </span>
        ) : (
          <motion.span variants={wordVariants} className="inline-block">
            {inner}
          </motion.span>
        )}
      </span>
    );
  });

  if (intro) {
    const Tag = as;
    return (
      <Tag id={id} className={base}>
        {words}
      </Tag>
    );
  }

  const Tag = as === "h1" ? motion.h1 : as === "h3" ? motion.h3 : motion.h2;
  return (
    <Tag
      id={id}
      className={base}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      onViewportEnter={() => setSeen(true)}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {words}
    </Tag>
  );
}

/* ───────── Etiketler ───────── */

/** Bölüm etiketi: "01 —— Panel" (numara iris, etiket mono) */
export function Chapter({ no, label, className }: { no: string; label: string; className?: string }) {
  return (
    <p className={cn(s.micro, "flex items-center gap-3 text-[color:var(--qa-fg-2)]", className)}>
      <span className={cn(s.irisText, "font-semibold")}>{no}</span>
      <span aria-hidden className="h-px w-10 bg-[color:var(--qa-line-2)]" />
      <span>{label}</span>
    </p>
  );
}

/** Üst etiket çipi (ör. "Yeni · Quantum Plus · Dijital Su Arıtma") */
export function Eyebrow({ children, className, dot = true }: { children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <p
      className={cn(
        s.micro,
        "inline-flex items-center gap-2.5 rounded-full border border-[color:var(--qa-line-2)] bg-[color:var(--qa-chip)] px-3.5 py-2 text-[color:var(--qa-fg)]",
        className
      )}
    >
      {dot && <span aria-hidden className={cn(s.irisLine, "h-1.5 w-1.5 rounded-full")} />}
      {children}
    </p>
  );
}

/** Mono mikro etiket (DEPO / ÜRETİM dili) */
export function Micro({ children, className, as = "span" }: { children: ReactNode; className?: string; as?: "span" | "p" }) {
  const Tag = as;
  return <Tag className={cn(s.micro, "text-[color:var(--qa-fg-2)]", className)}>{children}</Tag>;
}

/**
 * Tuş adı ("On/Off", "Function"): mono etiketlerin büyük harf dönüşümünü kapatır,
 * böylece ad her yerde birebir yazıldığı gibi görünür.
 */
export function KeyName({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("normal-case tracking-[0.08em] text-[color:var(--qa-fg)]", className)}>{children}</span>;
}

/** Statik çip */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        s.micro,
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--qa-line-2)] bg-[color:var(--qa-chip)] px-3 py-1.5 text-[color:var(--qa-fg)]",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Seçilebilir çip (açı, özellik, ölçü). En az 44px dokunma alanı. */
export function ChipButton({
  active = false,
  className,
  children,
  ...rest
}: Omit<ComponentPropsWithRef<"button">, "type"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        s.micro,
        s.focus,
        "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 transition-[background-color,color,border-color] duration-300",
        active
          ? "border-transparent bg-[color:var(--qa-btn)] text-[color:var(--qa-btn-fg)]"
          : "border-[color:var(--qa-line-2)] bg-[color:var(--qa-chip)] text-[color:var(--qa-fg)] hover:border-[color:var(--qa-fg-2)]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Simüle ekran/demolar için küçük "Temsilî" etiketi */
export function Temsili({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        s.micro,
        "inline-flex items-center rounded-full border border-current/25 px-2 py-0.5 text-[9px] tracking-[0.18em] opacity-75",
        className
      )}
    >
      Temsilî
    </span>
  );
}

/** Beyaz, hafif döndürülmüş etiket; görünür olunca yaylanarak gelir */
export function Sticker({
  children,
  rotate = -6,
  delay = 0,
  className,
}: {
  children: ReactNode;
  rotate?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[rgba(11,15,23,0.08)] bg-white px-3.5 py-1.5 text-[13px] font-semibold tracking-[-0.01em] text-[#0B0F17] shadow-[0_10px_24px_-12px_rgba(30,50,90,0.35)]",
        className
      )}
      initial={{ opacity: 0, scale: 0.6, rotate: rotate - 10 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 380, damping: 17, delay }}
    >
      {children}
    </motion.span>
  );
}

/** "QUANTUM PLUS" kelime markası: Unbounded, QUANTUM 300 / PLUS 700 iris */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn(s.wordmark, className)}>
      <span aria-hidden>
        QUANTUM <b>PLUS</b>
      </span>
      <span className="sr-only">Quantum Plus</span>
    </span>
  );
}

/* ───────── Yüzeyler ───────── */

/** Beyaz çerçeve kart (radius 28, ince çizgi, içi gök gradyanı). Fotoğraflar mürekkep bölümde yalnızca bunun içinde. */
export function Frame({ children, className, innerClassName }: { children: ReactNode; className?: string; innerClassName?: string }) {
  return (
    <div
      className={cn(
        s.pearl,
        "rounded-[28px] border border-[rgba(11,15,23,0.08)] bg-white p-2 text-[#0B0F17] shadow-[0_30px_60px_-34px_rgba(30,60,120,0.35)]",
        className
      )}
    >
      <div className={cn("relative overflow-hidden rounded-[21px] bg-[linear-gradient(180deg,#E6F0FB,#CFE4FA)]", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

/** Mat beyaz çerçeveli siyah cam (panel ikizi, final levhası) */
export function Bezel({
  children,
  className,
  innerClassName,
  radius = 30,
  sheen = true,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  radius?: number;
  sheen?: boolean;
}) {
  return (
    <div
      className={cn(s.ink, "bg-[linear-gradient(160deg,#EEF2F7,#DCE3EC)] p-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]", className)}
      style={{ borderRadius: radius }}
    >
      <div className={cn("relative overflow-hidden bg-[#06070A]", innerClassName)} style={{ borderRadius: radius - 10 }}>
        {children}
        {sheen && <span aria-hidden className={s.sheen} />}
      </div>
    </div>
  );
}

/* ───────── Fotoğraf ───────── */

type Feather = number | { t?: number; r?: number; b?: number; l?: number };

/** Kenar yumuşatma maskesi (% cinsinden). corner: sağ-alt köşeye ek yumuşatma (hero.jpg dikişi). */
export function featherMask(f: Feather = 6, corner = 0) {
  const { t = 0, r = 0, b = 0, l = 0 } = typeof f === "number" ? { t: f, r: f, b: f, l: f } : f;
  const layers = [
    `linear-gradient(to right, transparent, #000 ${l}%, #000 ${100 - r}%, transparent)`,
    `linear-gradient(to bottom, transparent, #000 ${t}%, #000 ${100 - b}%, transparent)`,
  ];
  if (corner) layers.push(`radial-gradient(circle at 100% 100%, transparent ${corner * 0.45}%, #000 ${corner}%)`);
  return layers.join(", ");
}

/**
 * Açık gök zeminli JPG'yi sayfaya eriten görsel. Varsayılan lazy; LCP için lcp verin (tek görsel).
 * children maskesiz üst katmandır (ör. ekran bindirmesi).
 */
export function FeatheredPhoto({
  src,
  alt,
  width,
  height,
  sizes,
  feather = 6,
  corner = 0,
  mask,
  lcp = false,
  className,
  imgClassName,
  imgStyle,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  feather?: Feather;
  corner?: number;
  /** tam özel CSS maske (feather/corner yerine) */
  mask?: string;
  lcp?: boolean;
  className?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  children?: ReactNode;
}) {
  const m = mask ?? featherMask(feather, corner);
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${width} / ${height}` }}>
      <div
        className="absolute inset-0"
        style={{ maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          draggable={false}
          {...(lcp ? { loading: "eager" as const, fetchPriority: "high" as const } : { loading: "lazy" as const })}
          className={cn("h-full w-full select-none object-cover", imgClassName)}
          style={imgStyle}
        />
      </div>
      {children}
    </div>
  );
}

/* ───────── Tuşlar ve CTA ───────── */

type Ring = "iris" | "cyan" | "soft" | "none";
const RING: Record<Ring, string> = { iris: s.ringIris, cyan: s.ringCyan, soft: s.ringSoft, none: s.ringNone };

/** Yuvarlak dokunmatik tuş yüzü (yalnızca görsel; bir <a>/<button> içine koyun) */
export function KeyFace({
  children,
  ring = "iris",
  size = 40,
  className,
}: {
  children?: ReactNode;
  ring?: Ring;
  size?: number;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn(s.key, RING[ring], className)} style={{ width: size, height: size }}>
      {children}
    </span>
  );
}

/** WhatsApp simgesi (lucide'da marka simgesi yok) */
export function WaGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.102-2.884-6.964C16.59 1.93 14.116 1.057 11.98 1.055 6.544 1.055 2.12 5.474 2.117 10.917c-.001 1.704.453 3.37 1.314 4.848l-.994 3.633 3.73-.978zm11.365-6.843c-.345-.173-2.042-1.008-2.359-1.123-.317-.116-.549-.173-.78.173-.231.347-.893 1.123-1.094 1.348-.201.23-.404.256-.75.083-.345-.172-1.46-.537-2.782-1.716-1.028-.918-1.722-2.052-1.924-2.396-.202-.345-.022-.531.15-.703.156-.154.345-.4.517-.6.173-.2.23-.346.346-.576.115-.23.057-.431-.03-.604-.086-.173-.78-1.88-1.069-2.575-.283-.679-.571-.587-.78-.598-.201-.01-.432-.011-.663-.011-.23 0-.605.086-.921.431-.317.346-1.21 1.182-1.21 2.879 0 1.698 1.237 3.337 1.409 3.568.173.23 2.433 3.714 5.895 5.207.824.356 1.467.568 1.968.728.828.263 1.58.226 2.176.136.663-.1 2.042-.832 2.33-1.637.288-.806.288-1.498.201-1.638-.086-.14-.317-.225-.663-.4z" />
    </svg>
  );
}

/**
 * Etkileşimli yuvarlak tuş (paneldeki On/Off ve Function tuşlarının dili). href varsa <a>, yoksa <button>.
 * Dokununca halka dalgası; caption görünür mono etiket.
 */
export function TouchKey({
  label,
  href,
  external,
  onClick,
  pressed,
  size = 48,
  ring = "iris",
  caption,
  captionAt = "right",
  className,
  faceClassName,
  children,
}: {
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  pressed?: boolean;
  size?: number;
  ring?: Ring;
  caption?: ReactNode;
  captionAt?: "right" | "below";
  className?: string;
  faceClassName?: string;
  children: ReactNode;
}) {
  const [tap, setTap] = useState(0);
  const body = (
    <>
      <span aria-hidden className={cn(s.key, RING[ring], faceClassName)} style={{ width: size, height: size }}>
        {children}
        {tap > 0 && <span key={tap} className={s.tapRipple} />}
      </span>
      {caption && <span className={cn(s.micro, "text-[color:var(--qa-fg)]")}>{caption}</span>}
    </>
  );
  const cls = cn(
    s.focus,
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full",
    caption && (captionAt === "below" ? "flex-col gap-2" : "gap-2.5 pr-3"),
    className
  );
  const onPointerDown = () => setTap((n) => n + 1);

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className={cls}
        onPointerDown={onPointerDown}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {body}
      </a>
    );
  }
  return (
    <button type="button" aria-label={label} aria-pressed={pressed} className={cls} onPointerDown={onPointerDown} onClick={onClick}>
      {body}
    </button>
  );
}

type CtaProps = {
  label?: ReactNode;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
  full?: boolean;
  className?: string;
};

const ctaBase =
  "group inline-flex items-center gap-3 rounded-full font-semibold tracking-[-0.01em] transition-[transform,background-color,border-color] duration-300 active:scale-[0.98]";

function ctaTone(variant: "solid" | "outline") {
  return variant === "solid"
    ? "bg-[color:var(--qa-btn)] text-[color:var(--qa-btn-fg)] shadow-[0_18px_40px_-20px_rgba(11,15,23,0.55)]"
    : "border border-[color:var(--qa-line-2)] bg-[color:var(--qa-chip)] text-[color:var(--qa-fg)] hover:border-[color:var(--qa-fg-2)]";
}

/** Arama düğmesi (tel:). Görünür etiket + ekran okuyucu için numara. */
export function CallButton({ label = "Bilgi almak için arayın", variant = "solid", size = "md", full, className }: CtaProps) {
  const lg = size === "lg";
  return (
    <a
      href={TEL}
      className={cn(
        ctaBase,
        s.focus,
        ctaTone(variant),
        lg ? "h-[60px] pl-2 pr-7 text-[17px]" : "h-[52px] pl-1.5 pr-5 text-[15px]",
        full && "w-full justify-center",
        className
      )}
    >
      <KeyFace ring="iris" size={lg ? 44 : 40}>
        <Phone className={lg ? "h-[18px] w-[18px]" : "h-4 w-4"} strokeWidth={2.2} />
      </KeyFace>
      <span>{label}</span>
      <span className="sr-only">: {PHONE}</span>
    </a>
  );
}

/** WhatsApp düğmesi. message verilirse sabit metinle waLink kullanılır. */
export function WhatsAppButton({
  label = "WhatsApp'tan yazın",
  message,
  variant = "outline",
  size = "md",
  full,
  className,
}: CtaProps & { message?: string }) {
  const lg = size === "lg";
  return (
    <a
      href={message ? waLink(message) : WA}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        ctaBase,
        s.focus,
        ctaTone(variant),
        lg ? "h-[60px] pl-2 pr-7 text-[17px]" : "h-[52px] pl-1.5 pr-5 text-[15px]",
        full && "w-full justify-center",
        className
      )}
    >
      <KeyFace ring="soft" size={lg ? 44 : 40}>
        <WaGlyph className={cn("text-[#25D366]", lg ? "h-5 w-5" : "h-[18px] w-[18px]")} />
      </KeyFace>
      <span>{label}</span>
    </a>
  );
}

/* ───────── SVG yardımcıları ───────── */

/** İris doğrusal gradyanı (<defs> içine). deep: inci üstü metin için koyu tonlar. */
export function IrisGradient({
  id,
  deep = false,
  x1 = 0,
  y1 = 0,
  x2 = 1,
  y2 = 0,
}: {
  id: string;
  deep?: boolean;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}) {
  const c = deep ? IRIS_DEEP : IRIS;
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      {c.map((col, i) => (
        <stop key={col} offset={IRIS_STOPS[i]} stopColor={col} />
      ))}
    </linearGradient>
  );
}
