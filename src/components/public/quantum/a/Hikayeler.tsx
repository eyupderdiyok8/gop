"use client";

import { useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Pointer } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURES } from "../data";
import { Chapter, Headline, Micro, Reveal, Section, Sticker, TouchKey } from "./primitives";
import { Seg7 } from "./Seg7";
import { STORIES, type Story } from "./Hikayeler.scenes";
import { EASE } from "./tokens";
import s from "./theme.module.css";
import st from "./Hikayeler.module.css";

/**
 * 05 · Detaylar — Instagram dilinde hikâye kartı. 4,5 sn'lik LED çubuk bitince sonraki hikâye.
 * Dokun: sol üçte bir geri, gerisi ileri · kaydır · basılı tut = dur · ok tuşları.
 * Görünmezken, basılı tutulurken ya da klavyeyle odaklanınca durur; hareket azaltılınca kendiliğinden ilerlemez.
 */

const N = STORIES.length;
const HOLD_MS = 220;
const LED_GRAD = "bg-[linear-gradient(90deg,#34E37A,#2EE6D6)]";
const pad = (n: number) => String(n).padStart(2, "0");

export function Hikayeler() {
  // nav: her geçişte artar. Slayt anahtarı buna bağlı; hızlı dokunuşlarda aynı hikâye çıkış animasyonu
  // bitmeden geri gelirse AnimatePresence eski (çıkan) öğeyi yeniden kullanıp görünmez bırakmasın.
  const [{ i, nav }, setView] = useState({ i: 0, nav: 0 });
  const setI = (k: number) => setView((v) => ({ i: k, nav: v.nav + 1 }));
  const [userPaused, setUserPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [kbFocus, setKbFocus] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number; timer: number; held: boolean } | null>(null);
  const inView = useInView(cardRef, { margin: "0px" });

  // Hareket azaltılınca çubuk animasyonu CSS'te kapanır, animationend gelmez: kendiliğinden ilerlemez
  const playing = !userPaused && !kbFocus;
  const running = playing && inView && !holding;
  const story = STORIES[i];
  const pearl = story.world === "pearl";

  const step = (d: number) => setView((v) => ({ i: (v.i + d + N) % N, nav: v.nav + 1 }));

  const togglePlay = () => {
    if (playing) {
      setUserPaused(true);
    } else {
      setUserPaused(false);
      setKbFocus(false);
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("button, a")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = { x: e.clientX, y: e.clientY, timer: 0, held: false };
    p.timer = window.setTimeout(() => {
      p.held = true;
      setHolding(true);
    }, HOLD_MS);
    press.current = p;
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p) return;
    press.current = null;
    window.clearTimeout(p.timer);
    if (p.held) {
      setHolding(false);
      return;
    }
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      step(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
      const r = e.currentTarget.getBoundingClientRect();
      step(e.clientX - r.left < r.width / 3 ? -1 : 1);
    }
  };

  const onPointerCancel = () => {
    const p = press.current;
    if (p) window.clearTimeout(p.timer);
    press.current = null;
    setHolding(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      step(e.key === "ArrowRight" ? 1 : -1);
    }
  };

  // Klavyeyle karta odaklanınca durur (WCAG 2.2.2); fareyle tıklama durdurmaz
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    let kb = false;
    try {
      kb = e.currentTarget.matches(":focus-visible");
    } catch {
      kb = false;
    }
    if (kb) setKbFocus(true);
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKbFocus(false);
  };

  const controls = (
    <Controls i={i} onPrev={() => step(-1)} onNext={() => step(1)} />
  );

  return (
    <Section id="hikayeler" cv={1400} className="bg-[linear-gradient(180deg,#F4F8FD_0%,#EDF3FB_55%,#F4F8FD_100%)]">
      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-24 md:px-8 lg:pb-32 lg:pt-32">
        <Chapter no="05" label="Detaylar" />
        <Headline text="Detaylar, *hikâye* hâlinde." className="mt-5 leading-[0.95]" />
        <Reveal>
          <p className="mt-5 flex items-start gap-2 text-[15px] leading-[1.5] text-[color:var(--qa-fg-2)]">
            <Pointer aria-hidden className="mt-[3px] h-4 w-4 shrink-0" strokeWidth={1.8} />
            Sağa dokunun, sonraki detay. Basılı tutun, durun.
          </p>
        </Reveal>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {`Detay ${i + 1} / ${N}: ${story.title}. ${story.body}`}
        </p>

        <div className="mt-10 grid justify-items-center gap-6 lg:mt-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:justify-items-start lg:gap-x-20">
          <Reveal className="relative">
            {/* kartın arkasında iris halesi */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[-14%] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.18),rgba(34,211,238,0.08)_55%,transparent)]"
            />

            <div
              ref={cardRef}
              role="region"
              aria-roledescription="hikâye"
              aria-label="Quantum Plus detay hikâyeleri. Sol ve sağ ok tuşlarıyla gezinin."
              tabIndex={0}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              onContextMenu={(e) => e.preventDefault()}
              className={cn(
                s.focus,
                "relative isolate aspect-[9/16] w-[min(92vw,360px,40.5svh)] cursor-pointer touch-pan-y select-none overflow-hidden rounded-[28px] bg-[#06070A] shadow-[0_40px_90px_-40px_rgba(6,7,10,0.6),0_0_0_1px_rgba(11,15,23,0.06)] [-webkit-touch-callout:none] lg:w-[min(380px,48svh)]"
              )}
            >
              {/* slaytlar: kart durunca tüm sahne döngüleri donar */}
              <div className={cn("absolute inset-0", !running && s.paused)}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`${story.key}-${nav}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <Slide story={story} index={i} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* üst: LED ilerleme + hesap satırı */}
              <div className={cn(pearl ? s.pearl : s.ink, "absolute inset-x-0 top-0 z-20 text-[color:var(--qa-fg)]")}>
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-500",
                    pearl
                      ? "bg-[linear-gradient(180deg,rgba(244,248,253,0.85),transparent)]"
                      : "bg-[linear-gradient(180deg,rgba(6,7,10,0.72),transparent)]"
                  )}
                />
                <div aria-hidden className="relative flex gap-1.5 px-3 pt-3">
                  {STORIES.map((x, k) => (
                    <span key={x.key} className="relative h-[4px] flex-1 overflow-hidden rounded-[2px] bg-[color:var(--qa-led-off)]">
                      {k < i && <span className={cn("absolute inset-0", LED_GRAD)} />}
                      {k === i && (
                        <span
                          key={nav}
                          className={cn("absolute inset-0", LED_GRAD, st.fill)}
                          style={{ animationPlayState: running ? "running" : "paused" }}
                          onAnimationEnd={(e) => {
                            if (e.target === e.currentTarget) step(1);
                          }}
                        />
                      )}
                    </span>
                  ))}
                </div>

                <div className="relative flex items-center gap-2.5 py-1 pl-3 pr-1.5">
                  <span aria-hidden className="flex h-8 w-8 shrink-0 rounded-full p-[1.5px] [background:var(--qa-iris-ring)]">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
                      <Image
                        src="/images/prada-v2/logo-amblem.webp"
                        alt=""
                        width={320}
                        height={226}
                        sizes="24px"
                        loading="lazy"
                        className="h-auto w-[70%]"
                      />
                    </span>
                  </span>
                  <span className="text-[13.5px] font-semibold tracking-[-0.01em]">Quantum Plus</span>
                  <span className={cn(s.micro, "text-[color:var(--qa-fg-2)]")}>şimdi</span>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? "Hikâyeleri duraklat" : "Hikâyeleri oynat"}
                    className={cn(s.focus, "ml-auto flex h-11 w-11 items-center justify-center rounded-full motion-reduce:hidden")}
                  >
                    {playing ? (
                      <Pause className="h-[18px] w-[18px]" fill="currentColor" strokeWidth={0} />
                    ) : (
                      <Play className="h-[18px] w-[18px]" fill="currentColor" strokeWidth={0} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* masaüstü: büyük başlık + tüm detaylar listesi */}
          <div className="hidden w-full max-w-[540px] lg:block">
            <Micro>Detay</Micro>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${story.key}-${nav}`}
                aria-hidden
                className="mt-4 min-h-[2em] text-[clamp(2.4rem,3.6vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {story.title}
              </motion.p>
            </AnimatePresence>

            <ol className="mt-9 border-t border-[color:var(--qa-line)]">
              {STORIES.map((x, k) => (
                <li key={x.key} className="border-b border-[color:var(--qa-line)]">
                  <button
                    type="button"
                    onClick={() => setI(k)}
                    aria-current={k === i ? "step" : undefined}
                    className={cn(
                      s.focus,
                      "flex min-h-12 w-full items-center gap-4 py-3 text-left transition-colors duration-300",
                      k === i ? "text-[color:var(--qa-fg)]" : "text-[color:var(--qa-fg-2)] hover:text-[color:var(--qa-fg)]"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-[18px] w-[5px] shrink-0 rounded-[2px] transition-colors duration-300",
                        k === i ? "bg-[linear-gradient(180deg,#2EE6D6,#34E37A)]" : k < i ? "bg-[#34E37A]/45" : "bg-[#DCE3EC]"
                      )}
                    />
                    <span className={cn(s.micro, "w-6 shrink-0")}>{pad(k + 1)}</span>
                    <span className="text-[17px] font-medium tracking-[-0.01em]">{x.title}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-8">{controls}</div>
          </div>

          {/* mobil: kartın altında ok tuşları */}
          <div className="lg:hidden">{controls}</div>
        </div>

        {/* Tüm özellikler: hikâyelerde anlatılmayanlar (ör. selenoid valf) yalnızca burada, iddiasız listelenir */}
        <Reveal className="mt-16 lg:mt-24">
          <div className="border-t border-[color:var(--qa-line)] pt-8">
            <h3 className={cn(s.micro, "font-normal text-[color:var(--qa-fg-2)]")}>Tüm özellikler</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[color:var(--qa-line-2)] bg-white/70 px-3.5 text-[14px] font-medium tracking-[-0.01em] text-[color:var(--qa-fg)]"
                >
                  <span aria-hidden className={cn("h-[5px] w-3 shrink-0 rounded-[2px]", LED_GRAD)} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── Tek hikâye ───────── */

function Slide({ story, index }: { story: Story; index: number }) {
  const pearl = story.world === "pearl";
  const { Scene } = story;
  return (
    <div
      role="group"
      aria-roledescription="slayt"
      aria-label={`${index + 1} / ${N}`}
      className={cn(
        "absolute inset-0",
        pearl
          ? cn(s.pearl, "bg-[linear-gradient(180deg,#F4F8FD,#E6F0FB_55%,#CFE4FA)] text-[#0B0F17]")
          : cn(s.ink, "bg-[#06070A] text-[#F5F7FA]")
      )}
    >
      {story.glow && <div aria-hidden className="absolute inset-0" style={{ background: story.glow }} />}

      <div className={cn("absolute inset-x-0 bottom-[31%] top-[15%] px-[7%]", story.frame)}>
        <div className="relative flex h-full w-full items-center justify-center">
          <Scene />
        </div>
      </div>

      {/* altyazı: düz gradyan perde (bulanıklık yok) */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 px-5 pb-6 pt-16",
          pearl
            ? "bg-[linear-gradient(180deg,transparent,rgba(244,248,253,0.94)_42%)]"
            : "bg-[linear-gradient(180deg,transparent,rgba(6,7,10,0.94)_42%)]"
        )}
      >
        <div className="absolute right-4 top-3">
          <Sticker rotate={story.rotate} delay={0.35}>
            {story.sticker}
          </Sticker>
        </div>
        <h3 className="text-[clamp(1.2rem,5vw,1.4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">{story.title}</h3>
        <p className="mt-2 text-[15px] leading-[1.45] text-[color:var(--qa-fg-2)]">{story.body}</p>
      </div>
    </div>
  );
}

/* ───────── Ok tuşları + LED sayaç ───────── */

function Controls({ i, onPrev, onNext }: { i: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <TouchKey label="Önceki detay" onClick={onPrev} ring="soft">
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </TouchKey>
      <span aria-hidden className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#06070A] px-4">
        <Seg7 key={i} value={pad(i + 1)} mode="flicker" className="h-5 w-auto" />
        <span className={cn(s.micro, "text-white/55")}>/ {pad(N)}</span>
      </span>
      <TouchKey label="Sonraki detay" onClick={onNext} ring="iris">
        <ChevronRight className="h-5 w-5" strokeWidth={2} />
      </TouchKey>
    </div>
  );
}
