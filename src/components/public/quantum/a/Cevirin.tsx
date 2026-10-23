"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PackageOpen, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIMENSIONS } from "../data";
import { ChipButton, Chapter, Headline, Reveal, Section } from "./primitives";
import { CubeStage, DIM_VIEW, LID_YAW, VIEWS, type CubeApi, type Dim, type View } from "./Cevirin.Cube";
import { EASE } from "./tokens";
import s from "./theme.module.css";

/**
 * 04 · Tasarım — parmakla çevrilen 3D kutu, gerçek ölçüler ve "kapağı kaldır" anı.
 * Sticky/useScroll yok; bu yüzden content-visibility açık.
 */

const ANGLES: { v: View; label: string }[] = [
  { v: "on", label: "Ön" },
  { v: "34", label: "3/4" },
  { v: "yan", label: "Yan" },
];

const DIMS: { k: Dim; label: string; value: number }[] = [
  { k: "h", label: "Yükseklik", value: DIMENSIONS.height },
  { k: "w", label: "Genişlik", value: DIMENSIONS.width },
  { k: "d", label: "Derinlik", value: DIMENSIONS.depth },
];

export function Cevirin() {
  const [open, setOpen] = useState(false);
  const [dim, setDim] = useState<Dim | null>(null);
  const [view, setView] = useState<View | null>(null);
  const cube = useRef<CubeApi>(null);

  const toggleLid = () => {
    if (open) {
      setOpen(false);
      cube.current?.release();
    } else {
      cube.current?.snap(LID_YAW);
      setDim(null);
      setView(null);
      setOpen(true);
    }
  };

  const pickAngle = (v: View) => {
    setOpen(false);
    setView(v);
    cube.current?.snap(VIEWS[v]);
  };

  const pickDim = (k: Dim) => {
    const next = dim === k ? null : k;
    setDim(next);
    setOpen(false);
    if (next) {
      setView(DIM_VIEW[next]);
      cube.current?.snap(VIEWS[DIM_VIEW[next]]);
    }
  };

  return (
    <Section
      id="cevirin"
      cv={1150}
      className="bg-[linear-gradient(180deg,#E6F0FB_0%,#E6F0FB_28%,#CFE4FA_80%,#F4F8FD_100%)]"
    >
      <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 md:px-8 lg:pb-28 lg:pt-32">
        <div className="grid gap-y-7 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-12">
          {/* metin */}
          <div className="lg:col-start-1 lg:row-start-2">
            <Chapter no="04" label="Tasarım" />
            <Headline text="Parmağınızla *çevirin.*" className="mt-5 leading-[0.95]" />
            <Reveal>
              <p className="mt-6 max-w-[38ch] text-[17px] leading-[1.55] text-[color:var(--qa-fg-2)]">
                Modern tasarım, mat ve dayanıklı kasa, siyah cam ön panel. Hangi açıdan bakarsanız bakın, aynı sakin duruş.
              </p>
            </Reveal>
          </div>

          {/* sahne */}
          <div className="relative -mx-4 md:mx-0 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:self-center">
            <CubeStage ref={cube} open={open} dim={dim} onFree={() => setView(null)}>
              <p aria-live="polite" className="text-center text-[15px] leading-[1.45] text-[color:var(--qa-fg-2)]">
                <AnimatePresence>
                  {open && (
                    <motion.span
                      key="cap"
                      className="inline-block"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 1.5 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                      <strong className="font-semibold text-[color:var(--qa-fg)]">Kapağın altında:</strong> filtreler üstte, düzenli bir sırada.
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
            </CubeStage>
          </div>

          {/* açı çipleri + kapak */}
          <Reveal className="lg:col-start-1 lg:row-start-3" delay={0.05}>
            <div className="flex flex-wrap items-center justify-center gap-1.5 lg:justify-start lg:gap-2">
              <div role="group" aria-label="Görüş açısı" className="flex gap-1.5 lg:gap-2">
                {ANGLES.map((a) => (
                  <ChipButton key={a.v} active={!open && view === a.v} onClick={() => pickAngle(a.v)} className="min-w-[52px] px-3">
                    {a.label}
                  </ChipButton>
                ))}
              </div>
              <ChipButton
                active={open}
                aria-pressed={undefined}
                onClick={toggleLid}
                className={cn("gap-1.5 px-3.5", open ? "" : "border-transparent [background:linear-gradient(#fff,#fff)_padding-box,var(--qa-iris)_border-box]")}
              >
                {open ? <Package className="h-4 w-4" strokeWidth={1.8} /> : <PackageOpen className="h-4 w-4" strokeWidth={1.8} />}
                {open ? "Kapağı kapat" : "Kapağı kaldır"}
              </ChipButton>
            </div>
          </Reveal>

          {/* ölçüler: 3D çizgiyi vurgular */}
          <Reveal className="lg:col-start-1 lg:row-start-4" delay={0.1}>
            <ul className="grid grid-cols-3 gap-2 lg:max-w-[440px]">
              {DIMS.map((d) => {
                const on = dim === d.k;
                return (
                  <li key={d.k}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => pickDim(d.k)}
                      className={cn(
                        s.focus,
                        "flex min-h-[64px] w-full flex-col items-start justify-center gap-1 rounded-[18px] border px-3 py-2.5 text-left transition-[background-color,border-color] duration-300",
                        on
                          ? "border-transparent [background:linear-gradient(#fff,#fff)_padding-box,var(--qa-iris)_border-box]"
                          : "border-[color:var(--qa-line-2)] bg-white/70 hover:border-[color:var(--qa-fg-2)]"
                      )}
                    >
                      <span className={cn(s.mono, "text-[9.5px] uppercase leading-none tracking-[0.18em] text-[color:var(--qa-fg-2)]")}>{d.label}</span>
                      <span className="text-[19px] font-semibold leading-none tracking-[-0.03em] text-[color:var(--qa-fg)]">
                        {d.value} <span className="text-[14px] font-medium text-[color:var(--qa-fg-2)]">cm</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
