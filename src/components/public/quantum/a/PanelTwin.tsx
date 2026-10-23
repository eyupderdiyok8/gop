"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DISPLAY, IMAGES } from "../data";
import { IrisGradient, useLive, useSvgId } from "./primitives";
import { Seg7 } from "./Seg7";
import { LED } from "./tokens";
import s from "./theme.module.css";

/**
 * Ön panelin vektör ikizi. Koordinatlar hero.jpg pikselleriyle aynıdır (viewBox 0 0 690 770),
 * bu yüzden fotoğrafın üstüne birebir oturur. crop="glass" yalnızca cam bölgesini gösterir.
 * NSF rozeti bilerek çizilmez. Ortada rakam yerine "--" yanar (gerçek ölçüm gibi okunmasın).
 */

export const TWIN_VIEWBOX = {
  full: { x: 0, y: 0, w: IMAGES.hero.w, h: IMAGES.hero.h },
  glass: { x: 18, y: 76, w: 324, h: 652 },
} as const;
export type TwinCrop = keyof typeof TWIN_VIEWBOX;

/** Cam dörtgeni: sol-üst, sağ-üst, sağ-alt, sol-alt */
export const GLASS_QUAD = [
  [24, 92],
  [337, 80],
  [337, 725],
  [22, 682],
] as const;

/** Etkileşim hedefleri (viewBox birimi). Panel bölümündeki gerçek <button>'lar bunlara oturur. */
export const TWIN_TARGETS = {
  ring: { x: 92, y: 262, w: 150, h: 160 },
  leds: { x: 84, y: 442, w: 162, h: 104 },
  keys: { x: 88, y: 530, w: 148, h: 68 },
  glass: { x: 22, y: 80, w: 315, h: 645 },
} as const;
export type TwinPart = keyof typeof TWIN_TARGETS;

/** viewBox kutusunu kırpılmış çerçeveye göre yüzdeye çevirir (absolute yerleşim için) */
export function twinPct(box: { x: number; y: number; w: number; h: number }, crop: TwinCrop = "glass") {
  const v = TWIN_VIEWBOX[crop];
  return {
    left: `${((box.x - v.x) / v.w) * 100}%`,
    top: `${((box.y - v.y) / v.h) * 100}%`,
    width: `${(box.w / v.w) * 100}%`,
    height: `${(box.h / v.h) * 100}%`,
  };
}

/** Köşeleri yuvarlatılmış dörtgen yolu */
function roundedQuad(pts: readonly (readonly [number, number])[], r: number) {
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[(i - 1 + n) % n];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[(i + 1) % n];
    const l1 = Math.hypot(cx - px, cy - py);
    const l2 = Math.hypot(nx - cx, ny - cy);
    const a = [cx + ((px - cx) / l1) * r, cy + ((py - cy) / l1) * r];
    const b = [cx + ((nx - cx) / l2) * r, cy + ((ny - cy) / l2) * r];
    d += `${i === 0 ? "M" : "L"}${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${cx} ${cy} ${b[0].toFixed(1)} ${b[1].toFixed(1)} `;
  }
  return d + "Z";
}

export const GLASS_PATH = roundedQuad(GLASS_QUAD, 10);

const DEFAULT_LEVELS = [5, 4, 4, 4] as const;
const d = (sec: number, extra?: CSSProperties) => ({ "--d": `${sec}s`, ...extra }) as CSSProperties;

export function PanelTwin({
  variant = "twin",
  crop = "full",
  boot = false,
  idle = true,
  active = null,
  levels = DEFAULT_LEVELS,
  logo = true,
  mark = true,
  off = false,
  sheen,
  center,
  className,
  children,
}: {
  /** Boşta cam parlaması (varsayılan: idle). Cam ekranı doldurmuyorsa kapatın: bant cam kenarını keskin gösterir. */
  sheen?: boolean;
  /** twin: tam vektör panel · overlay: hero.jpg üstüne bindirme (cam dolgusu/logo yok, açılışta siyah yama) */
  variant?: "twin" | "overlay";
  crop?: TwinCrop;
  /** Açılış animasyonu (görünür olunca bir kez). Yeniden oynatmak için key değiştirin. */
  boot?: boolean;
  /** Boşta döngüler: halkada kuyruklu yıldız, tepe segment yanıp sönmesi, tuş nabzı, cam parlaması */
  idle?: boolean;
  /** Vurgulanan parça: diğerleri kısılır, hedefe iris çerçeve çizilir */
  active?: TwinPart | null;
  /** LED sütun seviyeleri (0–6), soldan sağa DEPO, ÜRETİM, ATIK, SERVİS */
  levels?: readonly number[];
  logo?: boolean;
  mark?: boolean;
  /** On/Off ile kapatılmış ekran: yalnızca cam ve sönük tuş halkaları kalır */
  off?: boolean;
  /** Halkanın ortası (viewBox biriminde SVG içerik). Verilmezse TDS etiketi ve "--". */
  center?: ReactNode;
  className?: string;
  /** Ek SVG katmanları (viewBox biriminde) */
  children?: ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const live = useLive(ref, { margin: "60px 0px" });
  const id = useSvgId("twin");
  const v = TWIN_VIEWBOX[crop];
  const overlay = variant === "overlay";
  const { ring, digits, underline, bars, segments, keys } = DISPLAY;
  const dim = (part: TwinPart) =>
    ({
      opacity: off ? (part === "keys" ? 0.38 : 0) : active && active !== part && active !== "glass" ? 0.32 : 1,
      transition: `opacity ${off ? 0.22 : 0.45}s ease`,
    }) as CSSProperties;
  const fade = (sec: number) => (boot ? { className: s.fadeIn, style: d(sec) } : {});
  const sans = { fontFamily: "var(--font-qa-sans), ui-sans-serif, sans-serif" } as CSSProperties;

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`}
      preserveAspectRatio="none"
      className={cn(!live && s.paused, className)}
    >
      <defs>
        <IrisGradient id={`${id}-ring`} x1={1} y1={0} x2={0} y2={1} />
        <IrisGradient id={`${id}-line`} x1={1} x2={0} />
        <linearGradient id={`${id}-led`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LED.on2} />
          <stop offset="1" stopColor={LED.on} />
        </linearGradient>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6CC8FF" />
          <stop offset="1" stopColor="#2F7BFF" />
        </linearGradient>
        <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#8E97A3" />
        </linearGradient>
        <linearGradient id={`${id}-spec`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={GLASS_PATH} />
        </clipPath>
      </defs>

      {/* Cam */}
      {!overlay && <path d={GLASS_PATH} fill="#06070A" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />}

      {/* Açılışta fotoğraftaki ekran içeriğini örten yama (yalnızca overlay) */}
      {overlay && boot && (
        <rect x={86} y={262} width={160} height={338} rx={6} fill="#050506" className={s.fadeOut} style={d(2.1, { "--dur": "0.5s" } as CSSProperties)} />
      )}

      <g clipPath={`url(#${id}-clip)`}>
        {/* Logo ve marka yazısı */}
        {!overlay && logo && (
          <g style={dim("glass")} {...fade(0.15)}>
            <image href="/images/prada-v2/logo-amblem.webp" x={117} y={129} width={104} height={73} preserveAspectRatio="xMidYMid meet" />
            <g style={{ ...sans, fontWeight: 800 }} fill={`url(#${id}-blue)`} textAnchor="middle">
              <text x={168.5} y={216} fontSize={19} textLength={122} lengthAdjust="spacingAndGlyphs">
                SU ARITMA
              </text>
              <text x={169} y={235} fontSize={15} textLength={122} lengthAdjust="spacingAndGlyphs">
                TEKNİK SERVİS
              </text>
            </g>
            <text
              x={165}
              y={249.5}
              fontSize={7.6}
              textAnchor="middle"
              fill="#fff"
              fillOpacity={0.9}
              textLength={148}
              lengthAdjust="spacingAndGlyphs"
              style={{ ...sans, fontWeight: 600 }}
            >
              SAĞLIKLI SU, GÜVENİLİR HİZMET
            </text>
          </g>
        )}

        {/* Halka */}
        <g style={dim("ring")}>
          {boot && <circle cx={ring.cx} cy={ring.cy} r={3} fill="#fff" className={s.pulseOnce} style={d(0.35, { "--dur": "0.6s" } as CSSProperties)} />}
          {!overlay && <circle cx={ring.cx} cy={ring.cy} r={ring.r} fill="none" stroke="#14171d" strokeWidth={ring.stroke} />}
          <circle
            cx={ring.cx}
            cy={ring.cy}
            r={ring.r}
            fill="none"
            stroke={`url(#${id}-ring)`}
            strokeWidth={ring.stroke}
            strokeLinecap="round"
            pathLength={1}
            transform={`rotate(-90 ${ring.cx} ${ring.cy})`}
            className={boot ? s.draw : undefined}
            style={boot ? d(0.5, { "--dur": "0.8s" } as CSSProperties) : undefined}
          />
          {/* parıltı: geniş, soluk kopya */}
          <circle cx={ring.cx} cy={ring.cy} r={ring.r} fill="none" stroke={`url(#${id}-ring)`} strokeWidth={ring.stroke * 2.4} strokeOpacity={0.12} {...fade(1)} />
          {idle && (
            <circle
              cx={ring.cx}
              cy={ring.cy}
              r={ring.r}
              fill="none"
              stroke="#fff"
              strokeWidth={ring.stroke + 1}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.05 0.95"
              className={s.spin}
              style={{ "--dur": "6s", opacity: 0.9 } as CSSProperties}
            />
          )}

          {center ??
            (!overlay && (
              <g {...fade(0.9)}>
                <text x={ring.cx} y={302} fontSize={11} textAnchor="middle" fill="#fff" style={{ ...sans, fontWeight: 600 }}>
                  TDS
                </text>
              </g>
            ))}
          {!center && (!overlay || boot) && (
            <Seg7
              value="--"
              mode={boot ? "chase" : "static"}
              loops={boot ? 1 : undefined}
              delay={0.9}
              glow={false}
              x={digits.x}
              y={digits.y}
              width={digits.w}
              height={digits.h}
              preserveAspectRatio="xMidYMid meet"
              // ölçüm gösterilmez: rakam yerine "--" yanar
              className={overlay ? s.fadeOut : undefined}
              style={overlay ? d(1.6, { "--dur": "0.3s" } as CSSProperties) : undefined}
            />
          )}

          {/* Alt çizgi */}
          <line
            x1={underline.x1}
            y1={underline.y1}
            x2={underline.x2}
            y2={underline.y2}
            stroke={`url(#${id}-line)`}
            strokeWidth={underline.width}
            strokeLinecap="round"
            className={boot ? s.growX : undefined}
            style={boot ? d(2.0) : undefined}
          />
        </g>

        {/* LED göstergeler */}
        <g style={dim("leds")}>
          {!overlay && (
            <g {...fade(1.1)}>
              <path
                d="M156 426 h13 l-1.6 14 h-9.8 z M158.4 431.5 q2 1.6 4 0 t4 0 M159 435.5 q1.8 1.4 3.6 0 t3.6 0"
                fill="none"
                stroke="#3EA6FF"
                strokeWidth={1.4}
                strokeLinejoin="round"
              />
              <g fill="#fff" fontSize={8.5} textAnchor="middle" style={{ ...sans, fontWeight: 700 }}>
                {bars.map((b) => (
                  <text key={b.label} x={b.x + b.w / 2} y={b.top - 9}>
                    {b.label}
                  </text>
                ))}
              </g>
            </g>
          )}
          {bars.map((b, bi) => {
            const step = (b.bottom - b.top) / segments;
            const level = Math.max(0, Math.min(segments, levels[bi] ?? 0));
            return (
              <g key={b.label}>
                {Array.from({ length: segments }, (_, si) => {
                  const fromBottom = segments - 1 - si;
                  const on = fromBottom < level;
                  const top = fromBottom === level - 1;
                  const y = b.top + si * step + 1;
                  const h = step - 3.2;
                  return (
                    <g key={si}>
                      <rect x={b.x} y={y} width={b.w} height={h} rx={2.2} fill="#2B3036" />
                      {on && (
                        <g
                          className={boot ? s.segIn : idle && top ? s.blink : undefined}
                          style={
                            boot
                              ? d(1.2 + bi * 0.08 + fromBottom * 0.06)
                              : idle && top
                                ? ({ "--dur": `${1.3 + bi * 0.37}s`, "--d": `${bi * 0.2}s` } as CSSProperties)
                                : undefined
                          }
                        >
                          <rect x={b.x - 2} y={y - 2} width={b.w + 4} height={h + 4} rx={3.5} fill={LED.glow} />
                          <rect x={b.x} y={y} width={b.w} height={h} rx={2.2} fill={`url(#${id}-led)`} />
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Dokunmatik tuşlar: solda On/Off, sağda Function (fotoğraftaki baskı farklı olsa da gerçek adları bunlar) */}
        <g style={dim("keys")}>
          {keys.map((k, i) => (
            <g key={k.label}>
              {!overlay && (
                <>
                  <circle cx={k.cx} cy={k.cy} r={k.r} fill="#080A0E" stroke="#2F6BFF" strokeWidth={2.4} {...fade(1.1)} />
                  <circle cx={k.cx} cy={k.cy} r={k.r + 3} fill="none" stroke="#2F6BFF" strokeOpacity={0.22} strokeWidth={5} {...fade(1.1)} />
                  <text
                    x={k.cx}
                    y={k.cy + 2.8}
                    fontSize={k.label.length > 6 ? 7.4 : 8.2}
                    textAnchor="middle"
                    fill="#fff"
                    style={{ ...sans, fontWeight: 700 }}
                    {...fade(1.1)}
                  >
                    {k.label}
                  </text>
                </>
              )}
              {boot && (
                <circle cx={k.cx} cy={k.cy} r={k.r} fill="none" stroke="#38BDF8" strokeWidth={2.5} className={s.pulseOnce} style={d(1.9 + i * 0.12, { "--dur": "0.9s" } as CSSProperties)} />
              )}
              {idle && (
                <circle cx={k.cx} cy={k.cy} r={k.r} fill="none" stroke="#38BDF8" strokeWidth={2} className={s.pulse} style={d(3 + i * 2, { "--dur": "4s" } as CSSProperties)} />
              )}
            </g>
          ))}
        </g>

        {/* B12 Platinum işareti */}
        {!overlay && mark && (
          <g style={dim("glass")} {...fade(1.5)}>
            <text x={208} y={655} fontSize={58} fill={`url(#${id}-chrome)`} style={{ ...sans, fontWeight: 800 }}>
              B
            </text>
            <text x={246} y={662} fontSize={27} fill="#3EA6FF" style={{ ...sans, fontWeight: 700 }}>
              12
            </text>
            <text
              x={209}
              y={680}
              fontSize={16}
              fill="#F2F4F7"
              textLength={70}
              lengthAdjust="spacingAndGlyphs"
              style={{ ...sans, fontWeight: 500, fontStyle: "italic" }}
            >
              Platinum
            </text>
          </g>
        )}

        {/* Cam parlaması: soldan sağa geçen ışık bandı */}
        {(sheen ?? idle) && (
          <g transform="skewX(-14)">
            <rect x={-140} y={60} width={110} height={700} fill={`url(#${id}-spec)`} className={s.sweep} style={{ "--dur": "8s", "--sx1": "720px", "--d": "1s" } as CSSProperties} />
          </g>
        )}
        {boot && (
          <g transform="skewX(-14)">
            <rect x={-140} y={60} width={110} height={700} fill={`url(#${id}-spec)`} className={s.sweepOnce} style={{ "--dur": "1.1s", "--sx1": "720px" } as CSSProperties} />
          </g>
        )}
      </g>

      {/* Vurgulanan parçanın iris çerçevesi */}
      {active &&
        (active === "glass" ? (
          <path key="glass" d={GLASS_PATH} fill="none" stroke={`url(#${id}-line)`} strokeWidth={3} pathLength={1} className={s.draw} style={{ "--dur": "0.7s" } as CSSProperties} />
        ) : (
          <rect
            key={active}
            x={TWIN_TARGETS[active].x}
            y={TWIN_TARGETS[active].y}
            width={TWIN_TARGETS[active].w}
            height={TWIN_TARGETS[active].h}
            rx={18}
            fill="none"
            stroke={`url(#${id}-line)`}
            strokeWidth={2.5}
            pathLength={1}
            className={s.draw}
            style={{ "--dur": "0.6s" } as CSSProperties}
          />
        ))}

      {children}
    </svg>
  );
}
