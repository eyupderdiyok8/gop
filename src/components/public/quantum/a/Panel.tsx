"use client";

import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { DISPLAY, KEYS } from "../data";
import { Bezel, Chapter, Chip, ChipButton, Headline, IrisGradient, KeyName, Micro, Reveal, Section, Temsili, useLive, useSvgId } from "./primitives";
import { GLASS_PATH, PanelTwin, TWIN_TARGETS, TWIN_VIEWBOX, twinPct, type TwinPart } from "./PanelTwin";
import { useReducedPref } from "./CaminIcine.hooks";
import { IRIS, IRIS_STOPS } from "./tokens";
import s from "./theme.module.css";

/**
 * Panel: ön yüzün çalışan dijital ikizi. Soldaki On/Off ekranı kapatıp yeniden açar (açılış baştan oynar),
 * sağdaki Function göstergeler ve özellikler arasında gezinir (temsilî demo).
 * Masaüstünde özellikler iki yanda, bağlantı çizgileriyle hedefe bağlanır; mobilde altta tek kart + çip sırası.
 */

const SUB =
  "Dijital LED ekran, TDS takibi, filtre takibi ve dokunmatik kontrol. Aşağıdaki panel, cihazın ön yüzünün dijital kopyası: dokunarak gezin.";

type Box = { x: number; y: number; w: number; h: number };

type Feat = {
  part: TwinPart;
  name: string;
  desc: string;
  /** masaüstü kart: taraf ve dikey konum (cam kutusunun %'si) */
  side: "l" | "r";
  y: number;
  /** bağlantı çizgisinin ucu (cam kutusunun %'si) */
  tx: number;
  ty: number;
  /** ikiz üzerindeki dokunma alanı (viewBox birimi); tuş bölgesi On/Off ve Function düğmelerine ait */
  hit?: Box;
};

/** Sıra = Function döngüsü: tüm cam → halka → LED'ler → tuşlar */
const FEATS: Feat[] = [
  {
    part: "glass",
    name: "Dijital LED ekran",
    desc: "Siyah cam ön panel; tüm bilgiler tek bakışta.",
    side: "l",
    y: 16,
    tx: 1.5,
    ty: 16,
    hit: { x: 88, y: 116, w: 164, h: 142 },
  },
  {
    part: "ring",
    name: "TDS takibi",
    desc: "Suyun TDS değeri halkanın ortasında. Merak ettiğinizde bakmanız yeter.",
    side: "l",
    y: 40,
    tx: 24.2,
    ty: 39.9,
    hit: TWIN_TARGETS.ring,
  },
  {
    part: "leds",
    name: "Göstergeler ve filtre takibi",
    desc: "DEPO, ÜRETİM, ATIK, SERVİS: dört LED gösterge ve filtre takibi aynı panelde.",
    side: "r",
    y: 56,
    tx: 68.2,
    ty: 65.3,
    hit: { x: 84, y: 442, w: 162, h: 92 },
  },
  {
    part: "keys",
    name: "Dokunmatik kontrol",
    desc: "Solda On/Off, sağda Function: iki yuvarlak tuş da dokunmatik. Burada da çalışıyorlar; deneyin.",
    side: "r",
    y: 84,
    tx: 65.4,
    ty: 75.5,
  },
];

const LEVELS = [5, 4, 4, 4];
const BOOT_MS = 2700;
const CYCLE_MS = 3000;
/** On/Off'a dokununca ekranın karanlık kaldığı süre; sonra açılış baştan oynar */
const OFF_MS = 650;
const V = TWIN_VIEWBOX.glass;
const keyPos = (cx: number, cy: number) => ({ left: `${((cx - V.x) / V.w) * 100}%`, top: `${((cy - V.y) / V.h) * 100}%` });

type Measure = { w: number; h: number; edges: number[] };

export function Panel() {
  const secRef = useRef<HTMLElement>(null);
  const twinRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<Set<number>>(new Set());
  const reduce = useReducedPref();
  const live = useLive(twinRef, { margin: "0px" });
  const seen = useInView(twinRef, { once: true, margin: "60px 0px" });
  const gid = useSvgId("panel");

  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [bootKey, setBootKey] = useState(0);
  const [booting, setBooting] = useState(true);
  const [levels, setLevels] = useState<number[]>(LEVELS);
  const [off, setOff] = useState(false);
  const [taps, setTaps] = useState({ power: 0, fn: 0 });
  /** ekran okuyucu duyurusu: yalnızca kullanıcı etkileşiminden sonra */
  const [say, setSay] = useState("");
  const [m, setM] = useState<Measure | null>(null);

  // Cam parlaması kaydırmayla kayar (bulanıklık yok)
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start end", "end start"] });
  const sheenX = useTransform(scrollYProgress, [0.15, 0.85], ["-85%", "85%"]);

  // Açılış görünür olunca oynar (ikiz görünmezken donar); bitince vurgu başlar
  useEffect(() => {
    if (!seen || !booting) return;
    const t = window.setTimeout(() => setBooting(false), BOOT_MS);
    return () => window.clearTimeout(t);
  }, [seen, booting, bootKey]);

  // LED tırmanışı zamanlayıcıları sökülürken temizlenir
  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach((t) => window.clearTimeout(t));
      set.clear();
    };
  }, []);

  // Masaüstü bağlantı çizgileri için cam kutusu ve kart kenarları
  useEffect(() => {
    const el = glassRef.current;
    if (!el) return;
    const measure = () => {
      const edges = FEATS.map((f, i) => {
        const c = cardRefs.current[i];
        if (!c) return 0;
        return f.side === "l" ? c.offsetLeft + c.offsetWidth : c.offsetLeft;
      });
      setM({ w: el.clientWidth, h: el.clientHeight, edges });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.clear();
  };
  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  };

  /** LED sütunları alttan yeniden tırmanır (sütunlar arası 80 ms) */
  const climb = () => {
    clearTimers();
    if (reduce) {
      setLevels(LEVELS);
      return;
    }
    setLevels([0, 0, 0, 0]);
    LEVELS.forEach((lv, c) => {
      for (let k = 1; k <= lv; k++) {
        later(() => setLevels((prev) => prev.map((v, j) => (j === c ? Math.max(v, k) : v))), 160 + c * 80 + k * 75);
      }
    });
  };

  const go = (i: number, user: boolean) => {
    // ekran kapalıyken (On/Off) seçim beklemez; açılış zamanlayıcısı da bozulmaz
    if (off) return;
    setActive(i);
    if (user) {
      setTouched(true);
      setBooting(false);
      setSay(`${FEATS[i].name}. ${FEATS[i].desc}`);
    }
    if (FEATS[i].part === "leds") climb();
  };

  const buzz = () => {
    // Android'de kısa titreşim; iOS yok sayar
    navigator.vibrate?.(10);
  };

  /** Sağ tuş · Function: sonraki gösterge/özellik (ekran kapalıyken tepki vermez) */
  const pressFunction = () => {
    buzz();
    setTaps((t) => ({ ...t, fn: t.fn + 1 }));
    if (off) return;
    go((active + 1) % FEATS.length, true);
  };

  /** Sol tuş · On/Off: ekran kararır, kısa süre sonra açılış baştan oynar */
  const pressPower = () => {
    buzz();
    setTaps((t) => ({ ...t, power: t.power + 1 }));
    if (off) return;
    clearTimers();
    setLevels(LEVELS);
    setTouched(true);
    setBooting(false);
    setOff(true);
    setSay(`${KEYS.power}: panel kapandı, yeniden açılıyor.`);
    later(() => {
      setOff(false);
      setBootKey((k) => k + 1);
      setBooting(true);
    }, OFF_MS);
  };

  // Görünürken ve ilk dokunuşa kadar her 3 sn'de bir sonraki özellik
  const tick = useEffectEvent(() => go((active + 1) % FEATS.length, false));
  useEffect(() => {
    if (!live || touched || booting || off) return;
    const t = window.setTimeout(() => tick(), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [live, touched, booting, off, active]);

  const feat = FEATS[active];
  const shown = booting || off ? null : feat.part;

  return (
    <Section ref={secRef} id="panel" theme="ink" className="px-4 pb-[16svh] pt-[14svh] md:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70svh] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(91,108,255,0.10),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl lg:mx-auto lg:text-center">
          <Chapter no="01" label="Panel" className="lg:justify-center" />
          <Headline text="Function tuşuna dokunun. *Gerisini görün.*" className="mt-6" />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-[16px] leading-[1.55] text-white/62 md:text-[17px] lg:mx-auto">{SUB}</p>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col items-center md:mt-16 lg:mt-20">
          <div ref={twinRef} className="relative isolate w-[min(76vw,300px)] lg:w-[min(26vw,340px,calc((100svh-150px)*0.5))]">
            {/* Alt ışıma: statik radyal elips */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-[40%] -inset-y-[12%] -z-10 bg-[radial-gradient(closest-side,rgba(91,108,255,0.12),transparent)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-[14%] left-1/2 -z-10 h-[30%] w-[190%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.18),rgba(34,211,238,0.08)_55%,transparent)]"
            />

            <Bezel sheen={false} innerClassName="aspect-[324/652]">
              <PanelTwin
                key={bootKey}
                crop="glass"
                boot={booting}
                off={off}
                active={shown}
                levels={levels}
                className="absolute inset-0 h-full w-full"
              >
                {/* cam dörtgeninin açılı kenarını gizle: çerçeve düz camı gösterir */}
                <path d={GLASS_PATH} fill="none" stroke="#06070A" strokeWidth={5} />
              </PanelTwin>
              {shown === "glass" && (
                <svg
                  key={`g${active}-${bootKey}`}
                  aria-hidden
                  viewBox={`0 0 ${V.w} ${V.h}`}
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <defs>
                    <IrisGradient id={`${gid}-glass`} x1={1} y1={0} x2={0} y2={1} />
                  </defs>
                  <rect
                    x={3}
                    y={3}
                    width={V.w - 6}
                    height={V.h - 6}
                    rx={20}
                    fill="none"
                    stroke={`url(#${gid}-glass)`}
                    strokeWidth={2.5}
                    pathLength={1}
                    className={s.draw}
                    style={{ "--dur": "0.8s" } as CSSProperties}
                  />
                </svg>
              )}
              <motion.span
                aria-hidden
                style={{ x: sheenX }}
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_36%,rgba(255,255,255,0.075)_50%,transparent_64%)]"
              />
            </Bezel>

            {/* Cam kutusu: dokunma alanları, bağlantılar ve masaüstü kartları (taşabilir) */}
            <div ref={glassRef} className="absolute inset-[10px]">
              {/* Simüle ekran etiketi: camın boş sağ üst köşesinde */}
              <Temsili className="pointer-events-none absolute right-2.5 top-2.5 bg-[#06070A] text-white/75" />
              {/* Parçaya dokunma (fare/dokunmatik). Klavye kartları ve çipleri kullanır. */}
              {FEATS.map((f, i) =>
                f.hit ? (
                  <button
                    key={f.part}
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onClick={() => go(i, true)}
                    className="absolute z-10 cursor-pointer rounded-[18px] transition-colors duration-300 hover:bg-white/[0.04]"
                    style={twinPct(f.hit, "glass")}
                  />
                ) : null
              )}

              {/* Gerçek tuşlar, en az 48px: solda On/Off (keys[0]), sağda Function (keys[1]) */}
              {DISPLAY.keys.map((k, i) => {
                const power = i === 0;
                const n = power ? taps.power : taps.fn;
                return (
                  <button
                    key={k.label}
                    type="button"
                    onClick={power ? pressPower : pressFunction}
                    aria-label={power ? `${KEYS.power}: paneli kapatıp yeniden açın` : `${KEYS.function}: sonraki gösterge`}
                    className={cn(
                      s.focus,
                      "absolute z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 hover:bg-white/[0.06] active:bg-white/[0.1]"
                    )}
                    style={keyPos(k.cx, k.cy)}
                  >
                    {n > 0 && <span key={n} aria-hidden className={s.tapRipple} />}
                  </button>
                );
              })}

              {/* Masaüstü: bağlantı çizgileri */}
              {m && m.w > 0 && (
                <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block">
                  {FEATS.map((f, i) => {
                    const c = connector(f, m.edges[i], m);
                    const on = i === active && !booting && !off;
                    return (
                      <g key={f.part}>
                        <path d={c.d} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1} />
                        <circle cx={c.xt} cy={c.yt} r={2.5} fill={on ? "#fff" : "rgba(255,255,255,0.3)"} />
                      </g>
                    );
                  })}
                  {!booting &&
                    !off &&
                    (() => {
                      const c = connector(feat, m.edges[active], m);
                      return (
                        <g key={`on${active}`}>
                          <defs>
                            <linearGradient id={`${gid}-wire`} gradientUnits="userSpaceOnUse" x1={c.x0} y1={c.yc} x2={c.xt} y2={c.yt}>
                              {IRIS.map((col, j) => (
                                <stop key={col} offset={IRIS_STOPS[j]} stopColor={col} />
                              ))}
                            </linearGradient>
                          </defs>
                          <path
                            d={c.d}
                            fill="none"
                            stroke={`url(#${gid}-wire)`}
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            pathLength={1}
                            className={s.draw}
                            style={{ "--dur": "0.55s" } as CSSProperties}
                          />
                          <circle cx={c.xt} cy={c.yt} r={6} fill="none" stroke="#fff" strokeOpacity={0.5} className={s.pulseOnce} />
                        </g>
                      );
                    })()}
                </svg>
              )}

              {/* Masaüstü: özellik kartları iki yanda */}
              {FEATS.map((f, i) => {
                const on = i === active;
                return (
                  <button
                    key={f.part}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    type="button"
                    aria-pressed={on}
                    onClick={() => go(i, true)}
                    className={cn(
                      s.focus,
                      "absolute hidden w-[clamp(200px,18vw,270px)] -translate-y-1/2 rounded-2xl p-3 transition-opacity duration-300 lg:block",
                      f.side === "l"
                        ? "right-[calc(100%+10px+clamp(40px,4.5vw,76px))] text-right"
                        : "left-[calc(100%+10px+clamp(40px,4.5vw,76px))] text-left",
                      on ? "opacity-100" : "opacity-55 hover:opacity-80"
                    )}
                    style={{ top: `${f.y}%` }}
                  >
                    <span className={cn(s.micro, "block", on ? s.irisText : "text-white/50")}>{`0${i + 1}`}</span>
                    <span className="mt-2 block text-[19px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#F5F7FA] xl:text-[21px]">
                      {f.name}
                    </span>
                    <span className="mt-1.5 block text-[14.5px] leading-[1.5] text-white/62">{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* İpuçları: soldaki tuşun ipucu solda, sağdakinin sağda */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <Chip>
              <span className="text-white/45">Sol</span>
              <KeyName>{KEYS.power}</KeyName>
              <span className="text-white/40">·</span>
              <span className="text-white/65">Kapat / aç</span>
            </Chip>
            <Chip>
              <span className="text-white/45">Sağ</span>
              <KeyName>{KEYS.function}</KeyName>
              <span className="text-white/40">·</span>
              <span className="text-white/65">Sonraki gösterge</span>
            </Chip>
          </div>

          {/* Mobil: tek açıklama kartı + özellik çipleri */}
          <div className="mt-6 w-full max-w-md lg:hidden">
            <div className="relative min-h-[156px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0D0F14] p-5">
              <span aria-hidden className={cn(s.irisLine, "absolute inset-x-6 top-0 h-px")} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.26 }}
                >
                  <Micro className="flex items-center gap-2">
                    <span className={s.irisText}>{`0${active + 1}`}</span>
                    <span>/ 04</span>
                  </Micro>
                  <p className="mt-2 text-[21px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#F5F7FA]">{feat.name}</p>
                  <p className="mt-1.5 text-[15px] leading-[1.55] text-white/62">{feat.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FEATS.map((f, i) => (
                <ChipButton key={f.part} active={i === active} onClick={() => go(i, true)} className="snap-start">
                  {f.name}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* Ekran okuyucu: yalnızca kullanıcı etkileşiminden sonra duyurulur */}
          <p className="sr-only" aria-live="polite">
            {say}
          </p>
        </div>
      </div>
    </Section>
  );
}

/** Kart kenarından hedefe: yatay çıkış, çerçevenin hemen dışında kırılım, hedefe düz çizgi (px) */
function connector(f: Feat, edge: number, m: Measure) {
  const yc = (f.y / 100) * m.h;
  const xt = (f.tx / 100) * m.w;
  const yt = (f.ty / 100) * m.h;
  const x0 = f.side === "l" ? edge + 14 : edge - 14;
  const xm = f.side === "l" ? -24 : m.w + 24;
  return { d: `M${x0} ${yc} H${xm} L${xt} ${yt}`, x0, yc, xt, yt };
}
