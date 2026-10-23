"use client";

import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { Pointer, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chapter, Headline, KeyFace, Reveal, Section, useSvgId } from "./primitives";
import { SetStage } from "./SetKutu.Stage";
import { SET_ITEMS, popDelay } from "./SetKutu.items";
import { EASE, LED } from "./tokens";
import s from "./theme.module.css";

/**
 * 06 · Set — "Bir kutu. Koca bir set."
 * Kapak kalkar, numaralı tuşlar belirir, liste satırları aynı anda LED tikle işaretlenir.
 * Satıra ya da tuşa dokunmak kamerayı o parçaya yaklaştırır.
 * Not: useScroll içerdiği için content-visibility kullanılmaz.
 */
/** İki sütunlu listede tek sayıda parça kalırsa sonuncusu tam satır olur */
const LAST_WIDE = SET_ITEMS.length % 2 === 1;

export function SetKutu() {
  const [active, setActive] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const pinned = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lidTap = useMotionValue(0);

  const onReveal = useCallback(() => setRevealed(true), []);
  const onOpen = useCallback(() => {
    animate(lidTap, 1, { duration: 1.15, ease: EASE });
  }, [lidTap]);

  // dokunuş: seç / aynı parçaya tekrar dokununca bırak
  const select = (i: number | null) => {
    if (i !== null && !revealed) onOpen();
    const next = i === null || pinned.current === i ? null : i;
    pinned.current = next;
    setActive(next);
    return next;
  };

  const tapRow = (i: number) => {
    if (select(i) === null) return;
    // dar ekranda fotoğraf listenin üstünde: görünmüyorsa ona kaydır
    const el = stageRef.current;
    const r = el?.getBoundingClientRect();
    if (el && r && (r.top < 56 || r.bottom > window.innerHeight)) {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
    }
  };

  // fareyle gezinme önizler, liste dışına çıkınca sabitlenen seçime döner
  const hover = (i: number) => {
    if (revealed) setActive(i);
  };
  const leave = () => setActive(pinned.current);

  const item = active === null ? null : SET_ITEMS[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && active !== null) select(null);
  };

  return (
    <Section id="set" className="bg-[linear-gradient(180deg,#F4F8FD_0%,#EDF4FC_55%,#E6F0FB_100%)]">
      <div className="mx-auto max-w-[1240px] px-4 pb-24 pt-24 md:px-8 lg:pb-32 lg:pt-32" onKeyDown={onKeyDown}>
        <div className="grid gap-y-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end lg:gap-x-14">
          <div>
            <Chapter no="06" label="Set" />
            <Headline text="Bir kutu. *Koca bir set.*" className="mt-5" />
          </div>
          <Reveal>
            <p className="max-w-[36ch] text-[17px] leading-[1.55] text-[color:var(--qa-fg-2)]">
              Kapağı kaldırın, kutudan çıkan her parçayı tek tek inceleyin.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div ref={stageRef}>
            <SetStage
              active={active}
              shown={revealed}
              lidTap={lidTap}
              onOpen={onOpen}
              onReveal={onReveal}
              onSelect={select}
            />
            {/* ipucu; dar ekranda seçili parçanın künyesi aynı yerde (fotoğrafı örtmesin) */}
            <div className="mt-4 flex min-h-[68px] items-start justify-center md:min-h-0 lg:justify-start">
              {item ? (
                <motion.div
                  key={item.id}
                  className="w-full rounded-[16px] border border-[rgba(11,15,23,0.08)] bg-white px-4 py-2.5 shadow-[0_14px_30px_-22px_rgba(30,60,120,0.5)] md:hidden"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="text-[14px] font-semibold leading-tight tracking-[-0.01em] text-[color:var(--qa-fg)]">
                    <span className={cn(s.mono, s.irisText, "mr-1.5 text-[11px]")}>{String((active ?? 0) + 1).padStart(2, "0")}</span>
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-[1.4] text-[color:var(--qa-fg-2)]">{item.desc}</p>
                </motion.div>
              ) : null}
              <p
                className={cn(
                  "flex items-center gap-2 pt-1 text-[14px] leading-[1.45] text-[color:var(--qa-fg-2)]",
                  item && "max-md:hidden"
                )}
              >
                <Pointer aria-hidden className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                <span className="lg:hidden">Bir numaraya dokunun, o parçayı yakından görün.</span>
                <span className="hidden lg:inline">Listede gezinin ya da bir numaraya tıklayın: kamera o parçaya yaklaşır.</span>
              </p>
            </div>
          </div>

          <div>
            <ol
              aria-label="Kutu içeriği"
              className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-1 lg:gap-1"
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") leave();
              }}
            >
              {SET_ITEMS.map((it, i) => {
                const on = active === i;
                return (
                  <li key={it.id} className={cn(LAST_WIDE && i === SET_ITEMS.length - 1 && "col-span-2 lg:col-span-1")}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => tapRow(i)}
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") hover(i);
                      }}
                      className={cn(
                        s.focus,
                        "relative flex min-h-[52px] w-full items-center gap-2.5 rounded-[16px] border px-2.5 py-2 text-left transition-[background-color,border-color,box-shadow] duration-300 sm:gap-3 sm:px-3 lg:min-h-[60px] lg:gap-4 lg:rounded-[18px] lg:px-4 lg:py-3",
                        on
                          ? "border-[rgba(11,15,23,0.08)] bg-white shadow-[0_18px_40px_-26px_rgba(30,60,120,0.5)]"
                          : "border-[rgba(11,15,23,0.05)] bg-white/55 hover:bg-white/85 lg:border-transparent lg:bg-transparent"
                      )}
                    >
                      {on && <span aria-hidden className={cn(s.irisLine, "absolute inset-y-3 left-0 w-[2px] rounded-full")} />}
                      <LedCheck on={revealed} delay={popDelay(i)} />
                      <span className="min-w-0 flex-1 text-[13.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-[color:var(--qa-fg)] sm:text-[15px] lg:text-[17px]">
                        <span className={cn(s.mono, "mr-1.5 text-[10.5px] font-normal tracking-[0.1em] text-[color:var(--qa-fg-2)] lg:mr-3 lg:text-[11px]")}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {it.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <Reveal>
              <p className="mt-6 flex items-center gap-3 text-[15px] leading-[1.45] text-[color:var(--qa-fg-2)]">
                <KeyFace ring="iris" size={38}>
                  <Wrench className="h-4 w-4" strokeWidth={2} />
                </KeyFace>
                Kurulumu Su Arıtma Teknik Servis ekibi yapar.
              </p>
            </Reveal>
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {active !== null ? `${SET_ITEMS[active].name}: ${SET_ITEMS[active].desc}` : ""}
        </p>
      </div>
    </Section>
  );
}

/** LED onay kutusu: siyah cam kare, işaret belirirken tik çizilerek yanar */
function LedCheck({ on, delay }: { on: boolean; delay: number }) {
  const id = useSvgId("chk");
  const d = "M6.6 12.4l3.6 3.6 7.3-7.9";
  const style = { "--d": `${delay}s`, "--dur": "0.45s" } as CSSProperties;
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-[22px] sm:w-[22px] lg:h-6 lg:w-6">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={LED.on} />
          <stop offset="1" stopColor={LED.on2} />
        </linearGradient>
      </defs>
      <rect x={1} y={1} width={22} height={22} rx={7} fill="#0D0F14" />
      <path d={d} fill="none" stroke={LED.off} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      {on && (
        <>
          <path d={d} fill="none" stroke={LED.glow} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className={s.draw} style={style} />
          <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className={s.draw} style={style} />
        </>
      )}
    </svg>
  );
}
