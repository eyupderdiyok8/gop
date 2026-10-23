"use client";

import type { CSSProperties, ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IMAGES, KEYS as KEY_NAMES, LEAK } from "../data";
import { FeatheredPhoto, IrisGradient, Temsili, featherMask, useSvgId } from "./primitives";
import { Seg7 } from "./Seg7";
import { SPECTRUM } from "./tokens";
import s from "./theme.module.css";
import st from "./Hikayeler.module.css";

/**
 * Hikâye kartlarının vektör mikro sahneleri (viewBox 0 0 320 300).
 * Döngüler CSS'tir; kart duraklayınca üst kapsayıcıya verilen .paused hepsini dondurur.
 * Simüle durumlar "Temsilî" etiketlidir. Kaçak sahnesi mekanik zinciri gösterir (pamuk şişer, mandal atar,
 * su yolu kapanır; data.ts LEAK). Selenoid valfle bağı yoktur; valf bu sahnede çizilmez.
 */

const v = (vars: Record<string, string>) => vars as CSSProperties;
const SANS = { fontFamily: "var(--font-qa-sans), ui-sans-serif, sans-serif" } as CSSProperties;
const MONO = { fontFamily: "var(--font-qa-mono), ui-monospace, monospace" } as CSSProperties;

/** %2 mat doku: 48 px deterministik gürültü PNG (filtre yok) */
const NOISE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAHjElEQVR42j2YC44cOQxDaZf/9v2vq4BPPUEQ7E5PtUuiSIqO4osVR0NVn2Zcrdix1bTUY8RS19BRi6Udl2eLWpToUbWiRIkXm2dWjDi6kl6sKNpR4ypuvJixo4R0ooWi6nHUFwrF4aehHlsfP7XoOrG1dXT0xSepamnr6VOJrR5d/naNpSiuRNeVhasoOlEkHY14UVWiyQWckJZGfOqSFP6/L7rLk/xyTbn+E1Xdr3JxcaQaBsd1VxW9GKH43Jda7Bhx5ResGDxDOe4o3O0MxQ5DYuB6tLgqmjKARU9yMa7AbzJersGtfjH1cdChGn9tgbunUmWsP/C+YWB8hmvuKvrUQiqUIn3GyQMsMsoG59PQ0Isn9/T01P0b0PURU1ILoy9NfxI7fKgn0SDGUdPzKVH9lA/avODEjCe3vLVi/n/4hqLH5UkfXqOHoX0wzz/7u88QxtAXS1cVmM1G10/jfnCC34qqxmfmmA8yrmbNohu/rMs88eifB+1iDDSkNQaTF7mAGCoxtFVja8LizvvB2uwKd/DpQFp35eo9rY9jPCvJ+ml83ujNz7u4KsaVIppWggHRh+A8eEO1QxzoibTY/9ufUeO4w2j6orgkPw/MBlQIMMyRETeSWiOM/6WXCXCeQY0uHzggYNen67GGdZEDn7AGJVv9lGQubhlxjt/gamI9+FA8sqjaDO1I0fhr/Dk2CnpwISeWPsBLnu1o8mculZH5uKsOXTesN1gdw2iWkKYGhKwA5vHbNDwb95+vKLomKzC5CEN1XKs9ZSOkqhrNJoUG0rbyRY0RDmB7gGkV+DNrnoH7lbJRLn0+B3V0/dyyYE/+lX3Gn22advUG0XZmgI5HK9NhR7MFoqFJZ1UNN8KvYqLyax1Y9AMf3Xx0gGPB8+4RazLSbVyt9Wgw3Yc8THAbGLkDG//mHLtvi2Jj+/SosTOixhcGZjvYFlfD+NofNaLgO4/fWCcTszd1H1OwH8lP4mpNjNcAHThUtLC8p8lKcSc3rgHTiOWvwyCLrKLsg0E+RJdqWmigx+fOjLiB8NSVBuuhYVNUwCryCL12kqIdvZrO5pWF5ekZUj+1bJuouTNDVaZf0t+1cpS5/EDdxu36G9ouIVRsUIrpifNuHLXz2wrNrWS/6kvka6RJb/zcdmciLrxnYw7uqmNp3oGei491t9lHB5KFPdgyzLKHfcafyBqUFE0+ELeFTabS+dL97er1M4WWcBEMCn5my/h+Fl5xry7YMSwqb2N1Wu3gr9/qsK8Mm0JYlhddI0ubHpw5HPpQgCltynvDWxuC3exbj8qVTL7K5kV0C/16Hwt3ufzWkhwsqkwTFWA6SYISw8xadtNCfhleN2QK2RHjYt2bTzocSeq6m4akFluioh0Lq9iNHRt+Qj1g4+r/FjyU65EbYeD0GQiK6YjfFCLYi4J53zQ0Xr3p/aL9TVdWwRLNlJ+LLHYx0oIVBW4fdM72juEooyT3h+vmlm5ej85BYQA/YoxNtAgtKmmI6VY8Rnxh20R0o3mw7O4LDRuK3fipVe0eH4MVk7PfbpzVL/CX7Ns84CadKq3O1Gcl5RABGL+7aFDykUQeO03IcObv7FioyKogYlx2b2FRsFSwCAHPJF5NBzCvJmuAfFrobcOs8vNauKjOXl8EoOmqClUjHJjTgMgzsXm/3+HDvRC0nEkLRtBY7ofQfBNOH+ncFNn1UkrK/hkDwTsRPS9RvyC6N9sv8e1f3B1svoJNpiEsXGAQDUSYrvy3264Xj2R6c2Atv31lGzPT3a75fzFjV9aBssWLAlQ+euBXI3LYSRd8TtRXlV/MfTWJKofx2pi5NXik5LjmZY9PutOBe00oia+lxeBW6XJk0A61Kl/1/ppAZQEtVv1izI/tkZD6mI8Qo1/mS6u0EjoOm9YyFcmYR922tIUaG3HWTM/jxm9POcHtH98L2lhEtMuSdcUfwb6iheaKGqGr/XxeXCs6Wj5gPOFJIfYW7jwkPPLHhT3+ezGSx7FerMqMGt01HcTfuW5M+ONktvAXr/RKsmik/44Z/MGwYdyBNUuJw2WzNxhn4vOLAlsujgTL04cIIHlT6xyXxKzKddKwgieui15ZBIbFE+sXPj9xP5vpQOyE3GCVGOjgOFGvYdnsAM/AXr9+Oh/s58qC/+gz752mudEgXxrhgxOtTPWANtlfzjqFPJq0HVwTHwFx46rcrTm2QY6PMGdsvNVY8uL9No3DHWGSMhe+3rivXcKBjcCRiyDs6wZR7GIaHeW/1IbvZxQyRL4syjBS8irNnSdNeXATvmC8mJGNzkm0/HJ1yjNtjpt03phYQO6KAF7ZTZULq5Ee/1fIIiekhewM+uyqg9t3NrVvcFPJrKW8bF2cylTAjgvMzdW3cJ00ZIvfa6b97QgTIv+JgWvGZKwn2U+u6JEXxrwI9Fx4F4QPocQK8J/JTezDpq2UX6rT+hsuabBw81w82VHR5t8ATGOvYe8OLhiDq94jz0zy3YGEbCSUYF5UiOA/JfImTchS7uAsbyvVrswfvidf/LNDyEcuIGNwPfcsZjoTeHtHFa6C8xcWhCXaOd2XV+jNHe4Ebh7+A3lnkDFVhMEQAAAAAElFTkSuQmCC";

function SceneSvg({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden viewBox="0 0 320 300" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

function DropPath({ x, y, className, style, fill }: { x: number; y: number; className?: string; style?: CSSProperties; fill: string }) {
  return (
    <path
      d={`M${x} ${y} c0 0 -7 9.5 -7 14.5 a7 7 0 0 0 14 0 c0 -5 -7 -14.5 -7 -14.5z`}
      fill={fill}
      className={className}
      style={style}
    />
  );
}

/* ───────── 1 · Su kaçak sensörü (mekanik) ───────── */

/**
 * Kesit çizim: hortum yerdeki sensörün içinden geçer. Rakordan damlayan su sensöre ulaşır,
 * içerideki pamuk şişer, mandal atar, kapak yukarı fırlayıp su yolunu kapatır (LEAK.line).
 * Valfle bağı yoktur; yalnızca bu mekanik zincir. Zamanlama hikâyenin 4,5 sn'sine sığar.
 */
const LK = {
  /** sensör gövdesi ve kesit penceresi */
  body: { x: 132, y: 146, w: 156, h: 122 },
  win: { x: 144, y: 158, w: 132, h: 98 },
  /** su yolu (kanal) ve hortum ekseni */
  ch: { y: 178, h: 28 },
  hoseY: 192,
  /** kapak (kanalın altında bekler, yukarı fırlayınca kanalı tıkar), mandal pimi */
  gate: { x: 226, y: 211, w: 24, h: 36, rise: -32 },
  pin: { x: 212, y: 224 },
  /** rakor (sızıntı noktası) */
  fit: { x: 26, y: 53, w: 26, h: 22 },
  floor: 268,
  t: { seep: 1.95, swell: 2.1, trip: 2.6, gate: 2.74, closed: 2.8 },
} as const;
const sec = (n: number) => `${n}s`;

function LeakScene() {
  const id = useSvgId("leak");
  const { body, win, ch, gate, pin, fit, floor, hoseY, t } = LK;
  const dropX = fit.x + fit.w / 2;
  const dropY = fit.y + fit.h;
  // hortumdaki akış çizgileri (her 18 birimde bir; akış 18 birim kayıp döngüye girer)
  const dashes = Array.from({ length: 14 }, (_, i) => `M${84 + i * 18} ${hoseY}h8`).join(" ");
  return (
    <>
      <SceneSvg>
        <defs>
          <linearGradient id={`${id}-drop`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A5F3FC" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F1F4F8" />
            <stop offset="1" stopColor="#8A919C" />
          </linearGradient>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#353B45" />
            <stop offset="1" stopColor="#22262D" />
          </linearGradient>
          {/* akış yalnızca yatay hortum ve kanal boyunca görünür */}
          <clipPath id={`${id}-flow`}>
            <rect x={100} y={hoseY - 6} width={230} height={12} />
          </clipPath>
        </defs>

        {/* zemin */}
        <line x1={6} y1={floor} x2={314} y2={floor} stroke={`url(#${id}-floor)`} strokeWidth={1.2} />
        <line x1={40} y1={282} x2={280} y2={282} stroke={`url(#${id}-floor)`} strokeOpacity={0.45} />
        <line x1={70} y1={296} x2={250} y2={296} stroke={`url(#${id}-floor)`} strokeOpacity={0.25} />

        {/* hortum: soldan gelir, aşağı iner, sensörün içinden geçip cihaza gider */}
        <g fill="none" strokeLinecap="round">
          <path
            d={`M-10 ${fit.y + fit.h / 2} H62 Q80 ${fit.y + fit.h / 2} 80 ${fit.y + fit.h / 2 + 18} V${hoseY - 20} Q80 ${hoseY} 100 ${hoseY} H${body.x + 2}`}
            stroke="#F5F7FA"
            strokeOpacity={0.2}
            strokeWidth={11}
          />
          <path d={`M${body.x + body.w - 2} ${hoseY} H330`} stroke="#F5F7FA" strokeOpacity={0.2} strokeWidth={11} />
          <path d={`M-10 ${fit.y + fit.h / 2 - 4} H62 Q76 ${fit.y + fit.h / 2 - 4} 76 ${fit.y + fit.h / 2 + 14}`} stroke="#fff" strokeOpacity={0.12} strokeWidth={1.5} />
        </g>
        {/* rakor: sızıntı buradan */}
        <rect x={fit.x} y={fit.y} width={fit.w} height={fit.h} rx={4} fill="#2B3036" stroke="#fff" strokeOpacity={0.3} />
        <path d={`M${fit.x + 6} ${fit.y + 5} v12 M${fit.x + 13} ${fit.y + 5} v12 M${fit.x + 20} ${fit.y + 5} v12`} stroke="#fff" strokeOpacity={0.14} />

        {/* hortumda akan su: kapak kapanınca durur */}
        <g className={s.fadeOut} style={v({ "--d": sec(t.gate + 0.04), "--dur": "0.35s" })}>
          <g clipPath={`url(#${id}-flow)`}>
            <path d={dashes} className={st.flow} stroke="#67E8F9" strokeOpacity={0.85} strokeWidth={3.4} strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* damla: rakorda oluşur, düşer */}
        <g className={st.dropFall} style={v({ "--d": "0.95s", "--fy": `${floor - dropY - 21}px` })}>
          <DropPath x={dropX} y={dropY} fill={`url(#${id}-drop)`} className={cn(st.dropForm, st.top)} style={v({ "--d": "0.3s" })} />
        </g>

        {/* yerde yayılan su: sensörün altına kadar ulaşır */}
        <ellipse
          cx={dropX + 62}
          cy={floor}
          rx={78}
          ry={5}
          fill="#22D3EE"
          fillOpacity={0.35}
          className={st.spread}
          style={{ ...v({ "--d": "1.55s" }), transformBox: "fill-box", transformOrigin: "0% 50%" }}
        />
        <g className={cn(st.splash, st.bottom)} style={v({ "--d": "1.55s" })}>
          <path d={`M${dropX - 4} ${floor - 3} q-6 -13 -17 -13`} stroke="#67E8F9" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <path d={`M${dropX + 4} ${floor - 3} q6 -13 17 -13`} stroke="#67E8F9" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <circle cx={dropX - 14} cy={floor - 22} r={2} fill="#67E8F9" />
          <circle cx={dropX + 15} cy={floor - 25} r={1.6} fill="#67E8F9" />
        </g>

        {/* sensör gövdesi + kesit penceresi */}
        <ellipse cx={body.x + body.w / 2} cy={floor + 1} rx={body.w / 2 + 6} ry={6} fill="#000" fillOpacity={0.5} />
        <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={20} fill={`url(#${id}-body)`} stroke="#fff" strokeOpacity={0.25} />
        <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={12} fill="#0B0D11" stroke="#fff" strokeOpacity={0.08} />
        {/* tabandaki su girişleri */}
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <rect key={k} x={body.x + 22 + k * 20} y={floor - 7} width={10} height={3.5} rx={1.75} fill="#0B0D11" />
        ))}

        {/* kanal: içinden su geçer; kapanınca kapağın ötesi boşalır */}
        <rect x={win.x} y={ch.y} width={win.w} height={ch.h} fill="#1B1F24" />
        <path d={`M${win.x} ${ch.y} H${win.x + win.w} M${win.x} ${ch.y + ch.h} H${win.x + win.w}`} stroke="#fff" strokeOpacity={0.16} />
        <rect x={win.x} y={ch.y + 4} width={gate.x - win.x} height={ch.h - 8} fill="#22D3EE" fillOpacity={0.45} />
        <rect
          x={gate.x}
          y={ch.y + 4}
          width={win.x + win.w - gate.x}
          height={ch.h - 8}
          fill="#22D3EE"
          fillOpacity={0.45}
          className={s.fadeOut}
          style={v({ "--d": sec(t.gate + 0.06), "--dur": "0.5s" })}
        />

        {/* sızan su pencerenin tabanını doldurur */}
        <rect
          x={win.x + 3}
          y={win.y + win.h - 10}
          width={win.w - 6}
          height={7}
          rx={3.5}
          fill="#22D3EE"
          fillOpacity={0.5}
          className={s.fadeIn}
          style={v({ "--d": sec(t.seep), "--dur": "0.35s" })}
        />

        {/* pamuk: suyu çekince şişer, mandalın ucunu iter */}
        <g className={st.swell} style={v({ "--d": sec(t.swell) })}>
          <circle cx={170} cy={240} r={8} fill="#F5F7FA" fillOpacity={0.92} />
          <circle cx={183} cy={235} r={10} fill="#F5F7FA" fillOpacity={0.92} />
          <circle cx={197} cy={240} r={8} fill="#F5F7FA" fillOpacity={0.92} />
          <rect x={162} y={238} width={43} height={10} rx={5} fill="#F5F7FA" fillOpacity={0.92} />
        </g>

        {/* kapak: yay yüklü, mandal bırakınca kanala fırlar ve su yolunu kapatır */}
        <g className={st.gate} style={v({ "--d": sec(t.gate), "--gy": `${gate.rise}px` })}>
          <rect x={gate.x} y={gate.y} width={gate.w} height={gate.h} rx={4} fill={`url(#${id}-steel)`} />
          <path d={`M${gate.x + 4} ${gate.y + 7} h${gate.w - 8} M${gate.x + 4} ${gate.y + 12} h${gate.w - 8}`} stroke="#06070A" strokeOpacity={0.3} />
        </g>

        {/* mandal: pimin etrafında döner, kapağı bırakır */}
        <g className={st.trip} style={v({ "--d": sec(t.trip), "--ox": `${pin.x}px`, "--oy": `${pin.y}px`, "--rot": "22deg" })}>
          <path d={`M${pin.x - 20} ${pin.y} H${gate.x + 10}`} stroke="#FFB020" strokeWidth={4} strokeLinecap="round" />
        </g>
        <circle cx={pin.x} cy={pin.y} r={3.6} fill="#06070A" stroke="#FFB020" strokeWidth={1.8} />

        {/* algılama ve kapanma anı: amber çerçeve, kapakta tek nabız */}
        <rect
          x={win.x}
          y={win.y}
          width={win.w}
          height={win.h}
          rx={12}
          fill="none"
          stroke="#FFB020"
          strokeWidth={2}
          className={s.fadeIn}
          style={v({ "--d": sec(t.seep), "--dur": "0.3s" })}
        />
        <circle
          cx={gate.x + gate.w / 2}
          cy={ch.y + ch.h / 2}
          r={18}
          fill="none"
          stroke="#FFB020"
          strokeWidth={2}
          className={s.pulseOnce}
          style={v({ "--d": sec(t.gate + 0.1), "--dur": "0.9s" })}
        />

        <text x={body.x + body.w / 2} y={body.y - 12} fontSize={12} fontWeight={600} textAnchor="middle" fill="#fff" fillOpacity={0.75} style={SANS}>
          Sensör (kesit)
        </text>
      </SceneSvg>

      {/* durum çipi (simülasyon): Normal → Kaçak algılandı → Su yolu kapandı */}
      <div aria-hidden className="absolute left-0 top-0 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] pl-2.5 pr-3 text-[12px] font-semibold">
          <span className="relative h-2 w-2">
            <span className={cn(s.fadeOut, "absolute inset-0 rounded-full bg-[#34E37A]")} style={v({ "--d": sec(t.seep), "--dur": "0.25s" })} />
            <span className={cn(s.fadeIn, "absolute inset-0 rounded-full bg-[#FFB020]")} style={v({ "--d": sec(t.seep), "--dur": "0.25s" })} />
          </span>
          <span className="grid">
            <span className={cn(s.fadeOut, "[grid-area:1/1]")} style={v({ "--d": sec(t.seep), "--dur": "0.25s" })}>
              Normal
            </span>
            <span className={cn(s.fadeOut, "[grid-area:1/1]")} style={v({ "--d": sec(t.closed), "--dur": "0.2s" })}>
              <span className={cn(s.fadeIn, "block text-[#FFB020]")} style={v({ "--d": sec(t.seep), "--dur": "0.25s" })}>
                Kaçak algılandı
              </span>
            </span>
            <span className={cn(s.fadeIn, "[grid-area:1/1]")} style={v({ "--d": sec(t.closed + 0.05), "--dur": "0.25s" })}>
              Su yolu kapandı
            </span>
          </span>
        </span>
        <Temsili />
      </div>
    </>
  );
}

/* ───────── 2 · Paslanmaz musluk ───────── */

function FaucetScene() {
  const id = useSvgId("tap");
  return (
    <SceneSvg>
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1F4F8" />
          <stop offset="0.45" stopColor="#C9CED6" />
          <stop offset="1" stopColor="#8A919C" />
        </linearGradient>
        <linearGradient id={`${id}-drop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0FBFF" />
          <stop offset="1" stopColor="#67E8F9" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151820" />
          <stop offset="1" stopColor="#06070A" />
        </linearGradient>
      </defs>

      {/* tezgâh */}
      <rect x={-20} y={262} width={360} height={40} fill={`url(#${id}-top)`} />
      <line x1={-20} y1={262} x2={340} y2={262} stroke="#fff" strokeOpacity={0.14} />
      <ellipse cx={118} cy={263} rx={34} ry={5} fill="#000" fillOpacity={0.55} />

      {/* kuğu boyunlu musluk: çelik gradyan, ince parlak kenar */}
      <rect x={97} y={243} width={42} height={20} rx={6} fill={`url(#${id}-steel)`} />
      <path d="M118 176 l30 -20" stroke={`url(#${id}-steel)`} strokeWidth={8} strokeLinecap="round" />
      <path d="M118 248 V112 C118 44 214 44 214 108 V120" fill="none" stroke={`url(#${id}-steel)`} strokeWidth={14} strokeLinecap="round" />
      <path d="M113 238 V113 C113 52 162 41 196 58" fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={2.2} strokeLinecap="round" />
      <rect x={206} y={118} width={16} height={9} rx={2.5} fill="#8A919C" />

      {/* ağır çekim damla ve halka */}
      <g className={st.drip} style={v({ "--fy": "117px" })}>
        <DropPath x={214} y={128} fill={`url(#${id}-drop)`} className={cn(st.dripForm, st.top)} />
      </g>
      <ellipse cx={214} cy={264} rx={34} ry={6} fill="none" stroke="#67E8F9" strokeWidth={1.6} className={cn(st.ripple, st.box)} />

      {/* parıltılar */}
      <g transform="translate(170 46)">
        <path d="M0 -10 L2.2 -2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2 -2.2Z" fill="#fff" className={cn(st.twinkle, st.box)} />
      </g>
      <g transform="translate(104 150)">
        <path d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6Z" fill="#fff" className={cn(st.twinkle, st.box)} style={v({ "--d": "1.3s" })} />
      </g>
    </SceneSvg>
  );
}

/* ───────── 3 · Dokunmatik kontrol ───────── */

/** Paneldeki sıra: solda On/Off, sağda Function */
const KEYS = [
  { x: 96, label: KEY_NAMES.power, hint: "Kapat / aç", tap: st.tapA, lit: st.litA },
  { x: 224, label: KEY_NAMES.function, hint: "Sonraki gösterge", tap: st.tapB, lit: st.litB },
] as const;

function TouchScene() {
  const id = useSvgId("keys");
  return (
    <SceneSvg>
      <defs>
        <radialGradient id={`${id}-face`} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#151922" />
          <stop offset="1" stopColor="#05060A" />
        </radialGradient>
        {/* parmak aşağıya doğru kaybolur */}
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.65" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {KEYS.map((k) => (
        <g key={k.label}>
          <circle cx={k.x} cy={150} r={58} fill="none" stroke="#2F6BFF" strokeOpacity={0.18} strokeWidth={10} />
          <circle cx={k.x} cy={150} r={50} fill={`url(#${id}-face)`} stroke="#2F6BFF" strokeWidth={3} />
          <circle cx={k.x} cy={150} r={47} fill="#2F6BFF" fillOpacity={0.3} className={k.lit} />
          <text x={k.x} y={155.5} fontSize={15} fontWeight={700} letterSpacing={0.3} textAnchor="middle" fill="#fff" style={SANS}>
            {k.label}
          </text>
          <text x={k.x} y={232} fontSize={10} textAnchor="middle" fill="#fff" fillOpacity={0.5} letterSpacing={1.2} style={MONO}>
            {k.hint.toLocaleUpperCase("tr")}
          </text>
          <circle cx={k.x} cy={150} r={50} fill="none" stroke="#38BDF8" strokeWidth={2.5} className={cn(k.tap, st.box)} />
        </g>
      ))}

      {/* parmak ucu: aşağıdan gelir, önce On/Off sonra Function */}
      <g className={cn(st.finger, st.box)} style={v({ "--fx": "128px" })}>
        <g transform="translate(96 152)">
          <path d="M-18 130 V10 a18 18 0 0 1 36 0 V130" fill={`url(#${id}-body)`} stroke={`url(#${id}-edge)`} strokeWidth={1.5} />
          <path d="M-8 6 a8 8 0 0 1 16 0 v7 h-16z" fill="#fff" fillOpacity={0.16} />
          <circle cx={0} cy={-2} r={9} fill="#fff" fillOpacity={0.22} />
        </g>
      </g>
    </SceneSvg>
  );
}

/* ───────── 4 · TDS takip ───────── */

function RingScene() {
  const id = useSvgId("tds");
  const c = { x: 160, y: 132, r: 92 };
  return (
    <>
      <SceneSvg>
        <defs>
          <IrisGradient id={`${id}-ring`} x1={1} y1={0} x2={0} y2={1} />
          <IrisGradient id={`${id}-line`} x1={1} x2={0} />
        </defs>
        <circle cx={c.x} cy={c.y} r={c.r} fill="none" stroke="#14171D" strokeWidth={12} />
        <circle cx={c.x} cy={c.y} r={c.r} fill="none" stroke={`url(#${id}-ring)`} strokeWidth={30} strokeOpacity={0.12} />
        <circle cx={c.x} cy={c.y} r={c.r} fill="none" stroke={`url(#${id}-ring)`} strokeWidth={12} />
        {/* kuyruklu yıldız: baş + soluk kuyruk */}
        <g className={s.spin} style={v({ "--dur": "3.6s" })}>
          <circle cx={c.x} cy={c.y} r={c.r} fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray="0.12 0.88" strokeDashoffset={0.12} />
          <circle cx={c.x} cy={c.y} r={c.r} fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray="0.035 0.965" />
        </g>
        <text x={c.x} y={c.y - 36} fontSize={14} fontWeight={600} textAnchor="middle" fill="#fff" style={SANS}>
          TDS
        </text>
        {/* orta: segment kovalamacası, sonra rakam yerine "--" (ölçüm gösterilmez) */}
        <Seg7 value="--" mode="chase" glow={false} x={c.x - 34} y={c.y - 22} width={68} height={44} preserveAspectRatio="xMidYMid meet" />
        <line x1={102} y1={254} x2={218} y2={254} stroke={`url(#${id}-line)`} strokeWidth={7} strokeLinecap="round" />
      </SceneSvg>
      <div aria-hidden className="absolute left-0 top-0">
        <Temsili />
      </div>
    </>
  );
}

/* ───────── 5 · Filtre takip ───────── */

const TUBE = { x0: 35, w: 30, step: 44, top: 78, h: 150 } as const;

function TubesScene() {
  const id = useSvgId("tubes");
  return (
    <>
      <SceneSvg>
        <defs>
          <linearGradient id={`${id}-scan`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.38" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {SPECTRUM.map((col, k) => {
          const x = TUBE.x0 + k * TUBE.step;
          const cx = x + TUBE.w / 2;
          return (
            <g key={col}>
              <rect x={x} y={TUBE.top} width={TUBE.w} height={TUBE.h} rx={TUBE.w / 2} fill="#0D0F14" stroke="#fff" strokeOpacity={0.12} />
              <rect x={x + 3} y={TUBE.top + 18} width={TUBE.w - 6} height={TUBE.h - 21} rx={(TUBE.w - 6) / 2} fill={col} />
              <rect x={x + 3} y={TUBE.top + 18} width={TUBE.w - 6} height={TUBE.h - 21} rx={(TUBE.w - 6) / 2} fill={`url(#${id}-shine)`} />
              <line x1={x + 8} y1={TUBE.top + 19} x2={x + TUBE.w - 8} y2={TUBE.top + 19} stroke="#fff" strokeOpacity={0.6} strokeWidth={1.5} strokeLinecap="round" />
              <rect x={x + 6} y={TUBE.top + 24} width={4} height={TUBE.h - 36} rx={2} fill="#fff" fillOpacity={0.2} />
              <text x={cx} y={TUBE.top + TUBE.h + 22} fontSize={10} textAnchor="middle" fill="#fff" fillOpacity={0.55} letterSpacing={1.5} style={MONO}>
                {`0${k + 1}`}
              </text>
              {/* tarama geçince tik */}
              <circle cx={cx} cy={TUBE.top - 22} r={10.5} fill="#0D0F14" stroke="#34E37A" strokeOpacity={0.45} />
              <path
                d={`M${cx - 4.5} ${TUBE.top - 22} l3 3.2 l6 -6.6`}
                fill="none"
                stroke="#34E37A"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                className={s.draw}
                style={v({ "--d": `${(0.54 + k * 0.294).toFixed(2)}s`, "--dur": "0.3s" })}
              />
            </g>
          );
        })}
        <rect x={8} y={44} width={28} height={200} fill={`url(#${id}-scan)`} className={st.scan} style={v({ "--d": "0.35s", "--sx": "284px" })} />
      </SceneSvg>
      <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <Temsili />
      </div>
    </>
  );
}

/* ───────── 6 · Mat, dayanıklı kasa (inci) ───────── */

function MatteScene() {
  const m = featherMask(8);
  return (
    <FeatheredPhoto
      src={IMAGES.side.src}
      width={IMAGES.side.w}
      height={IMAGES.side.h}
      sizes="300px"
      feather={8}
      alt="Quantum Plus'ın mat beyaz yan yüzeyi"
      className="w-full max-w-[300px]"
    >
      {/* ışık bandı + mat doku, fotoğrafla aynı yumuşatma maskesinde */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden"
        style={{ maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
      >
        <div
          className={cn(s.sweep, "absolute inset-y-0 left-[-45%] w-[45%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.6),transparent)]")}
          style={v({ "--dur": "5.5s", "--sx1": "330%", "--d": "0.4s" })}
        />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: `url(${NOISE})`, backgroundSize: "48px 48px" }} />
      </div>
    </FeatheredPhoto>
  );
}

/* ───────── Veriler ───────── */

export type Story = {
  key: string;
  title: string;
  body: string;
  sticker: string;
  rotate: number;
  world: "ink" | "pearl";
  /** mürekkep zeminde sahneye özgü renk halesi */
  glow?: string;
  Scene: ComponentType;
  /** sahne alanı yerleşimi */
  frame?: string;
};

export const STORIES: Story[] = [
  {
    key: "kacak",
    title: LEAK.name,
    body: LEAK.line,
    sticker: "Kendiliğinden",
    rotate: -7,
    world: "ink",
    glow: "radial-gradient(90% 55% at 72% 88%, rgba(255,176,32,0.16), transparent 62%), radial-gradient(70% 45% at 20% 12%, rgba(34,211,238,0.1), transparent 60%)",
    Scene: LeakScene,
  },
  {
    key: "musluk",
    title: "Paslanmaz musluk",
    body: "Setin en parlak parçası.",
    sticker: "Parıl parıl",
    rotate: 6,
    world: "ink",
    glow: "radial-gradient(80% 55% at 62% 38%, rgba(201,206,214,0.16), transparent 62%)",
    Scene: FaucetScene,
  },
  {
    key: "dokunmatik",
    title: "Dokunmatik kontrol",
    body: `Basmayın, dokunun. Solda ${KEY_NAMES.power}, sağda ${KEY_NAMES.function}.`,
    sticker: "Tık değil, dokun",
    rotate: -5,
    world: "ink",
    glow: "radial-gradient(85% 50% at 50% 42%, rgba(47,107,255,0.24), transparent 62%)",
    Scene: TouchScene,
  },
  {
    key: "tds",
    title: "TDS takip",
    body: "TDS değeri ekranda. Sormanıza gerek yok, bakmanız yeter.",
    sticker: "Bak ve gör",
    rotate: 7,
    world: "ink",
    glow: "radial-gradient(75% 50% at 50% 36%, rgba(139,92,246,0.26), transparent 62%), radial-gradient(60% 40% at 50% 70%, rgba(34,211,238,0.1), transparent 60%)",
    Scene: RingScene,
  },
  {
    key: "filtre",
    title: "Filtre takip",
    body: "Filtrelerin durumu panelde, takipte.",
    sticker: "Takipte",
    rotate: -6,
    world: "ink",
    glow: "radial-gradient(90% 50% at 50% 44%, rgba(91,108,255,0.2), transparent 62%)",
    Scene: TubesScene,
  },
  {
    key: "kasa",
    title: "Mat, dayanıklı kasa",
    body: "Modern tasarım, sade duruş.",
    sticker: "Mat beyaz",
    rotate: 5,
    world: "pearl",
    Scene: MatteScene,
    frame: "px-[10%]",
  },
];
