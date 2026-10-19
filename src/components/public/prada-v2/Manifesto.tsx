"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { Chapter, parseAccent } from "./primitives";
import s from "./v2.module.css";

const TEXT =
  "Musluğunuzdan akan su, bardağınıza ulaşmadan önce *beş ayrı* kademeden geçer. Kum ve pas tutulur, klor ve koku giderilir, membran çözünmüş maddeleri süzer. Geriye yalnızca *berrak* ve lezzetli su kalır.";

const WORDS = parseAccent(TEXT).flatMap((seg) =>
  seg.text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ w, accent: seg.accent }))
);

/** Kaydırdıkça kelime kelime aydınlanan paragraf */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const n = WORDS.length;

  return (
    <section id="felsefe" className={cn(s.cv, "relative px-5 py-[16vh] md:px-10 md:py-[22vh]")}>
      <div className="mx-auto max-w-6xl">
        <Chapter no="01" label="Tanışma" />
        <p
          ref={ref}
          className="mt-10 text-[clamp(1.85rem,4.6vw,4.2rem)] font-medium leading-[1.1] tracking-[-0.035em] text-white"
        >
          {WORDS.map((item, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / n, Math.min(1, (i + 1.5) / n)]} accent={item.accent}>
              {item.w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={cn(accent && cn(s.serif, s.accent, "italic tracking-[-0.015em]"))}>
        {children}
      </motion.span>{" "}
    </>
  );
}
