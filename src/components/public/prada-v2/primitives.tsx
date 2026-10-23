"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import s from "./v2.module.css";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Görünür alana girince belirerek yükselir (yalnızca opacity/transform: GPU dostu) */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** "*yıldızlı*" kısımları ince, renkli vurguya çevirir */
export function parseAccent(text: string) {
  return text
    .split("*")
    .map((t, i) => ({ text: t, accent: i % 2 === 1 }))
    .filter((seg) => seg.text.length > 0);
}

const wordVariants = {
  hidden: { y: "112%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

/** Kelimeleri maskeden yukarı kaydırarak açan başlık */
export function Headline({
  text,
  as = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const Tag = as === "h3" ? motion.h3 : motion.h2;
  return (
    <Tag
      className={cn("font-semibold tracking-[-0.045em] text-balance", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {parseAccent(text).map((seg, si) =>
        seg.text.split(/(\s+)/).map((w, wi) =>
          w.trim() === "" ? (
            w
          ) : (
            <span
              key={`${si}-${wi}`}
              className="-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-bottom"
            >
              <motion.span
                variants={wordVariants}
                className={cn("inline-block", seg.accent && cn(s.accent, "font-light tracking-[-0.04em]"))}
              >
                {w}
              </motion.span>
            </span>
          )
        )
      )}
    </Tag>
  );
}

/** Bölüm numarası etiketi: "02 —— Yolculuk" */
export function Chapter({ no, label, className }: { no: string; label: string; className?: string }) {
  return (
    <div
      className={cn(
        s.mono,
        "flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/55",
        className
      )}
    >
      <span className="text-[color:var(--p2-red,#ff3b3b)]">{no}</span>
      <span className="h-px w-10 bg-white/20" />
      <span>{label}</span>
    </div>
  );
}
