"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Droplet, Gauge, GlassWater, Maximize2, Power, Settings, Sparkles, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chapter, EASE, Headline, Reveal } from "../prada-v2/primitives";
import s from "../prada-v2/v2.module.css";
import p from "./pantech.module.css";

const SECTION = "relative scroll-mt-16 px-5 py-[12vh] md:px-10";

function SectionHead({ no, label, title, text }: { no: string; label: string; title: string; text: string }) {
  return (
    <>
      <Chapter no={no} label={label} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <Headline text={title} className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] text-white" />
        <p className="max-w-md text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-right">{text}</p>
      </div>
    </>
  );
}

/* ───────── 01 · Tanksız tasarım ───────── */

const BENEFITS = [
  { icon: Maximize2, t: "Daha az yer kaplar", d: "Denge tankı olmadığı için mutfakta minimum alan." },
  { icon: Wrench, t: "Kolay montaj", d: "Tank bağlantısı olmadan sade bir kurulum." },
  { icon: Sparkles, t: "Modern ve şık tasarım", d: "Siyah cam ön panel, beyaz kompakt gövde." },
  { icon: Gauge, t: "Yüksek verimlilik", d: "600 GPD RO membran ile yüksek arıtma kapasitesi." },
];

export function Tankless() {
  const ref = useRef<HTMLDivElement>(null);
  const play = useInView(ref, { margin: "100px 0px" });

  return (
    <section id="tanksiz" className={cn(s.cv, SECTION)}>
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          no="01"
          label="Tanksız Tasarım"
          title="Daha kompakt, *daha özgür.*"
          text="Denge tankı kullanmaz, minimum alan kaplar. Modern tasarımıyla her mutfağa uyum sağlar."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* Tanklı - tanksız karşılaştırma */}
          <Reveal>
            <div ref={ref} className={cn("rounded-[28px] border border-white/[0.07] bg-gradient-to-b from-[#0d0d0d] to-[#060606] p-6 md:p-8", !play && p.paused)}>
              <svg viewBox="0 0 520 260" className="h-auto w-full" role="img" aria-label="Tanklı sistem ile tanksız Pantech karşılaştırması">
                <line x1="20" y1="226" x2="500" y2="226" stroke="rgba(255,255,255,0.12)" />
                {/* Klasik tanklı */}
                <rect x="40" y="96" width="78" height="130" rx="12" fill="#151515" stroke="rgba(255,255,255,0.25)" />
                <g className={p.tankFade} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x="132" y="76" width="92" height="150" rx="40" fill="#1b1b1b" stroke="rgba(255,255,255,0.35)" strokeDasharray="4 5" />
                  <text x="178" y="158" textAnchor="middle" className={s.mono} fill="rgba(255,255,255,0.55)" fontSize="11">TANK</text>
                </g>
                <text x="132" y="250" textAnchor="middle" className={s.mono} fill="rgba(255,255,255,0.5)" fontSize="11" letterSpacing="1.5">
                  KLASİK TANKLI
                </text>
                {/* ok */}
                <path d="M262 150 H300 M290 140 L302 150 L290 160" stroke="#3ea6ff" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Pantech */}
                <rect x="352" y="70" width="64" height="156" rx="14" fill="#f2f4f7" />
                <rect x="358" y="76" width="44" height="144" rx="10" fill="#050505" />
                <circle cx="380" cy="122" r="13" fill="#0b4f9e" />
                <text x="380" y="126" textAnchor="middle" className={p.led} fontSize="11">88</text>
                {[0, 1, 2].map((i) => (
                  <rect key={i} x={367 + i * 10} y="150" width="6" height="22" rx="2" fill="#3ea6ff" opacity="0.85" />
                ))}
                <text x="384" y="250" textAnchor="middle" className={s.mono} fill="#9be7ff" fontSize="11" letterSpacing="1.5">
                  PANTECH · TANKSIZ
                </text>
              </svg>
              <p className="mt-4 text-center text-[15px] text-white/60">
                Tank yok, ekstra bağlantı yok. Cihazın tamamı tek bir kompakt gövdede.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {BENEFITS.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3ea6ff]/12 text-[#7fe0ff]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-white">{t}</p>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-white/55">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 02 · 4 aşamalı filtreleme ───────── */

const STAGES = [
  { no: "01", name: "PP Sediment Filtre", img: "/images/pantech/filtre-pp.webp", w: 155, h: 415, desc: "Sudaki tortu, kum, pas ve askıda katı maddeleri tutar." },
  { no: "02", name: "CTO Karbon Filtre", img: "/images/pantech/filtre-cto.webp", w: 160, h: 415, desc: "Klor, koku ve zararlı organik maddeleri azaltır." },
  { no: "03", name: "600 GPD RO Membran", img: "/images/pantech/filtre-ro.webp", w: 300, h: 525, desc: "Suyun içindeki ağır metaller, kimyasallar ve zararlı yapıların arıtılmasını sağlar." },
  { no: "04", name: "Easywell Post Carbon", img: "/images/pantech/filtre-post.webp", w: 140, h: 475, desc: "Suyun tadını ve kokusunu düzenleyerek daha berrak bir içim sağlar." },
];

export function Filtration() {
  const ref = useRef<HTMLDivElement>(null);
  const play = useInView(ref, { margin: "100px 0px" });

  return (
    <section id="filtreleme" className={cn(s.cv, SECTION)}>
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          no="02"
          label="Filtreleme"
          title="Her damlada *4 aşama.*"
          text="Şebeke suyu musluğa ulaşmadan önce dört ayrı kademeden geçer; her damlada daha temiz, daha sağlıklı su."
        />

        <div ref={ref} className={cn("relative mt-14", !play && p.paused)}>
          {/* Kartlar arasında akan su (masaüstü) */}
          <svg aria-hidden className="pointer-events-none absolute left-0 top-[118px] hidden h-4 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 4">
            <line x1="4" y1="2" x2="96" y2="2" stroke="rgba(62,166,255,0.18)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
            <line x1="4" y1="2" x2="96" y2="2" stroke="#7fe0ff" strokeWidth="2" className={p.flow} vectorEffect="non-scaling-stroke" />
          </svg>

          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((st, i) => (
              <Reveal key={st.no} delay={i * 0.08} className="h-full">
                <li className="flex h-full flex-col rounded-[28px] border border-white/[0.07] bg-gradient-to-b from-[#0e0e0e] to-[#070707] p-5">
                  <div className="relative mx-auto flex h-[240px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black">
                    <div aria-hidden className="absolute inset-x-[15%] bottom-0 h-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(62,166,255,0.22),transparent)]" />
                    <Image src={st.img} alt={st.name} width={st.w} height={st.h} className="relative h-[210px] w-auto rounded-lg object-contain" />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <span className={cn(s.mono, "flex h-9 w-9 items-center justify-center rounded-full border border-[#3ea6ff] text-[11px] font-semibold text-[#7fe0ff]")}>
                      {st.no}
                    </span>
                    <h3 className="text-lg font-semibold leading-tight tracking-tight text-white">{st.name}</h3>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/55">{st.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───────── 03 · Dijital LED ekran (etkileşimli) ───────── */

type Part = "tds" | "work" | "fill" | "filter" | "touch";

const FEATURES: { key: Part; t: string; d: string }[] = [
  { key: "tds", t: "TDS değeri", d: "Suyun TDS değeri ön paneldeki ekranda görünür." },
  { key: "work", t: "Cihaz çalışma durumu", d: "Cihazın çalışıp çalışmadığını tek bakışta görürsünüz." },
  { key: "filter", t: "Filtre değişim uyarısı", d: "PPC, RO ve T33 göstergeleri filtre durumunu takip etmenizi sağlar." },
  { key: "fill", t: "Su dolum / arıza uyarısı", d: "Dolum ve kontrol uyarıları panelde ayrı ayrı yanar." },
  { key: "touch", t: "Dokunmatik kontrol paneli", d: "Tüm kontroller şık, dokunmatik bir arayüzde." },
];

function PanelButton({ label, on, icon }: { label?: string; on: boolean; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-[#1f6fd6] text-white transition-all duration-500 md:h-10 md:w-10",
          on ? cn(p.glow, "scale-110 bg-[#3ea6ff]") : "opacity-70"
        )}
      >
        {icon}
      </span>
      {label && <span className={cn("text-[9px] font-bold tracking-wide transition-colors md:text-[10px]", on ? "text-white" : "text-white/55")}>{label}</span>}
    </div>
  );
}

export function LedPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Part>("tds");
  const [manual, setManual] = useState(false);

  // Kullanıcı seçmediyse özellikler sırayla vurgulanır
  useEffect(() => {
    if (!inView || manual || reduce) return;
    const id = setInterval(() => {
      setActive((a) => FEATURES[(FEATURES.findIndex((f) => f.key === a) + 1) % FEATURES.length].key);
    }, 2600);
    return () => clearInterval(id);
  }, [inView, manual, reduce]);

  const pick = (k: Part) => {
    setActive(k);
    setManual(true);
  };
  const is = (k: Part) => active === k;

  return (
    <section id="ekran" className={cn(s.cv, SECTION)}>
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          no="03"
          label="Dijital LED Ekran"
          title="Her şey *tek ekranda.*"
          text="Tüm bilgileri tek ekranda kolayca takip edin. Bir özelliğe dokunun, panelde nerede olduğunu görün."
        />

        <div ref={ref} className="mt-14 grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* Ön panel kopyası */}
          <Reveal className="mx-auto">
            <div className="relative w-[min(78vw,300px)] rounded-[34px] border-[6px] border-[#eef1f5] bg-gradient-to-b from-[#0b0b0d] to-[#040405] px-6 pb-7 pt-8 shadow-[0_40px_120px_-30px_rgba(62,166,255,0.45)]">
              <Image src="/images/prada-v2/logo-amblem.webp" alt="" width={320} height={226} className="mx-auto h-10 w-auto opacity-90" />
              <button
                type="button"
                onClick={() => pick("tds")}
                aria-label="TDS değeri"
                className={cn(
                  "relative mx-auto mt-6 flex h-36 w-36 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#3b8be0,#0d3f86_55%,#06224d)] transition-all duration-500 md:h-40 md:w-40",
                  is("tds") ? "scale-105 shadow-[0_0_60px_rgba(62,166,255,0.75)]" : "shadow-[0_0_24px_rgba(62,166,255,0.35)]"
                )}
              >
                <span className="flex flex-col items-center">
                  <span className={cn(p.led, "text-5xl font-bold leading-none md:text-6xl")}>88</span>
                  <span className="mt-1 text-[10px] font-bold tracking-widest text-white/85">TDS</span>
                </span>
              </button>

              <div className="mt-7 grid grid-cols-4 gap-2" role="group" aria-label="Durum ikonları">
                <button type="button" onClick={() => pick("work")} aria-label="Yıkama göstergesi">
                  <PanelButton label="FLUSH" on={is("work")} icon={<Droplet className="h-4 w-4" />} />
                </button>
                <button type="button" onClick={() => pick("work")} aria-label="Çalışma durumu">
                  <PanelButton label="WORK" on={is("work")} icon={<Settings className="h-4 w-4" />} />
                </button>
                <button type="button" onClick={() => pick("fill")} aria-label="Su dolum uyarısı">
                  <PanelButton label="FULL" on={is("fill")} icon={<GlassWater className="h-4 w-4" />} />
                </button>
                <button type="button" onClick={() => pick("fill")} aria-label="Arıza kontrol uyarısı">
                  <PanelButton label="CHECK" on={is("fill")} icon={<Check className="h-4 w-4" />} />
                </button>
              </div>

              <button type="button" onClick={() => pick("filter")} aria-label="Filtre göstergeleri" className="mt-7 grid w-full grid-cols-3 gap-4">
                {["PPC", "RO", "T33"].map((f, i) => (
                  <span key={f} className="flex flex-col items-center gap-2">
                    <span className="relative h-16 w-8 overflow-hidden rounded-md bg-[#0b2a52]">
                      <motion.span
                        className="absolute inset-x-0 bottom-0 rounded-md bg-gradient-to-t from-[#1f8fff] to-[#7fe0ff]"
                        animate={{ height: is("filter") ? ["100%", `${92 - i * 18}%`] : "100%", opacity: is("filter") ? 1 : 0.75 }}
                        transition={{ duration: 0.9, ease: EASE }}
                      />
                    </span>
                    <span className={cn("text-[11px] font-bold transition-colors", is("filter") ? "text-white" : "text-white/60")}>{f}</span>
                  </span>
                ))}
              </button>

              <button type="button" onClick={() => pick("touch")} aria-label="Dokunmatik kontroller" className="mt-7 flex w-full justify-around">
                <PanelButton on={is("touch")} icon={<Power className="h-4 w-4" />} />
                <PanelButton on={is("touch")} icon={<Droplet className="h-4 w-4" />} />
              </button>
            </div>
          </Reveal>

          <ul className="grid gap-2">
            {FEATURES.map((f) => (
              <li key={f.key}>
                <button
                  type="button"
                  onClick={() => pick(f.key)}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-all duration-500",
                    is(f.key) ? "border-[#3ea6ff]/60 bg-[#3ea6ff]/[0.07]" : "border-white/[0.06] bg-transparent hover:border-white/15"
                  )}
                >
                  <span className={cn("block text-lg font-semibold tracking-tight transition-colors", is(f.key) ? "text-white" : "text-white/60")}>{f.t}</span>
                  <span
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500",
                      is(f.key) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <span className="overflow-hidden text-[15px] leading-relaxed text-white/60">
                      <span className="block pt-1.5">{f.d}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────── 04 · Gelişmiş teknoloji (iç görünüm) ───────── */

export function Inside() {
  return (
    <section id="teknoloji" className={cn(s.cv, SECTION, "overflow-hidden")}>
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Chapter no="04" label="Gelişmiş Teknoloji" />
          <Headline text="Ters ozmozun *gücü,* sade bir gövdede." className="mt-8 text-[clamp(2.4rem,5.6vw,5rem)] leading-[0.98] text-white" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/60">
              Ters ozmoz teknolojisi ile şebeke suyunu arıtarak daha temiz, sağlıklı ve güvenilir su sağlar. Filtreler, membran ve
              elektronik aksam, beyaz kompakt gövdenin içinde düzenli bir şekilde yerleşir.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {["Ters ozmoz (RO)", "Şehir şebeke suyu", "220 V AC · 96 W", "4 kartuş"].map((t) => (
                <li key={t} className={cn(s.mono, "rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/75")}>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal y={40}>
          <div className="relative">
            <div aria-hidden className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(62,166,255,0.25),rgba(62,166,255,0.07)_55%,transparent)]" />
            <motion.div initial={{ scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }}>
              <Image
                src="/images/pantech/cihaz-ic.webp"
                alt="Pantech iç görünüm: filtreler, membran ve bağlantılar"
                width={870}
                height={1066}
                className="h-auto w-full"
              />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── 05 · Ölçüler ve teknik özellikler ───────── */

const SPEC = [
  ["Ürün açıklaması", "Evsel su arıtma cihazı"],
  ["Tasarım", "Tanksız"],
  ["Filtreleme", "4 aşamalı · PP, CTO, RO, post carbon"],
  ["Membran", "600 GPD RO"],
  ["Nominal güç", "96 W"],
  ["Çalışma voltajı", "220 V AC"],
  ["Çalışma frekansı", "50 Hz"],
  ["Uygun su kaynağı", "Şehir şebeke suyu"],
  ["Giriş su sıcaklığı", "5 – 38 °C"],
  ["Ortam sıcaklığı", "4 – 40 °C"],
  ["Ürün ölçüleri", "Y 38 × G 15 × D 47 cm"],
];

export function Specs() {
  return (
    <section id="teknik" className={cn(s.cv, SECTION)}>
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          no="05"
          label="Ölçüler ve Teknik"
          title="İnce gövde, *net ölçüler.*"
          text="Sadece 15 cm genişliğiyle dar alanlara rahatça yerleşir."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className={cn(s.blueprint, "relative flex items-center justify-center overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#050505] px-14 pb-16 pt-10")}>
              <div className="relative w-[min(56vw,250px)]">
                <Image src="/images/pantech/cihaz-on-kesik.webp" alt="Pantech ölçüleri: yükseklik 38 cm, genişlik 15 cm, derinlik 47 cm" width={554} height={991} className="h-auto w-full" />
                {/* Yükseklik */}
                <div className="absolute -left-9 bottom-[1%] top-[1%] flex w-4 flex-col items-center">
                  <span className="h-px w-4 bg-[#7fe0ff]" />
                  <span className="w-px flex-1 bg-[#7fe0ff]/80" />
                  <span className="h-px w-4 bg-[#7fe0ff]" />
                  <span className={cn(s.mono, "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180 bg-[#050505] px-0.5 py-2 text-[11px] text-white [writing-mode:vertical-rl]")}>
                    38 cm
                  </span>
                </div>
                {/* Genişlik (ön yüz) */}
                <div className="absolute left-[1%] top-[calc(100%+16px)] flex h-4 w-[83%] items-center">
                  <span className="h-4 w-px bg-[#7fe0ff]" />
                  <span className="h-px flex-1 bg-[#7fe0ff]/80" />
                  <span className="h-4 w-px bg-[#7fe0ff]" />
                  <span className={cn(s.mono, "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-2 text-[11px] text-white")}>15 cm</span>
                </div>
              </div>
              <span className={cn(s.mono, "absolute right-5 top-5 rounded-full border border-white/10 bg-black px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-white/70")}>
                Derinlik 47 cm
              </span>
            </div>
          </Reveal>

          <dl className="border-t border-white/10">
            {SPEC.map(([k, v], i) => (
              <motion.div
                key={k}
                className="grid grid-cols-[130px_1fr] gap-4 border-b border-white/10 py-3.5 md:grid-cols-[170px_1fr]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -6% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
              >
                <dt className={cn(s.mono, "pt-0.5 text-[10.5px] uppercase tracking-[0.18em] text-white/50")}>{k}</dt>
                <dd className="text-[16px] font-medium text-white/90">{v}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ───────── 06 · Kutu içeriği ───────── */

/** x/y: kutu-icerigi.webp üzerindeki konum (%) */
const ITEMS = [
  { name: "Pantech cihaz", desc: "Dijital LED ekranlı, tanksız ana gövde.", x: 36, y: 50 },
  { name: "PP sediment filtre", desc: "Tortu, kum ve pası tutan ilk kademe.", x: 48, y: 27 },
  { name: "CTO karbon filtre", desc: "Klor, koku ve organik maddeleri azaltır.", x: 58.3, y: 27 },
  { name: "600 GPD RO membran", desc: "Ters ozmoz sisteminin kalbi.", x: 49.5, y: 70 },
  { name: "Bağlantı hortumu", desc: "Şebeke ve musluk bağlantısı için.", x: 74, y: 28 },
  { name: "Güç adaptörü", desc: "220 V priz bağlantısı.", x: 93, y: 27 },
  { name: "SUS304 paslanmaz musluk", desc: "Kutusunda, paslanmaz çelik musluk.", x: 70.5, y: 64 },
  { name: "Filtre anahtarı", desc: "Filtre değişimini kolaylaştırır.", x: 91, y: 62 },
  { name: "Bağlantı parçaları", desc: "Vana, rakor ve montaj aparatları.", x: 86, y: 90 },
];

export function Box() {
  const [active, setActive] = useState(0);
  return (
    <section id="kutu" className={cn(s.cv, SECTION, "overflow-hidden")}>
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          no="06"
          label="Kutu İçeriği"
          title="Kutudan *eksiksiz* çıkar."
          text="Cihaz, filtreler, membran, musluk ve bağlantı parçaları… Kurulum için gereken her şey aynı sette."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-14">
          <Reveal>
            <div className="relative">
              <Image
                src="/images/pantech/kutu-icerigi.webp"
                alt="Pantech kutu içeriği: cihaz, filtreler, membran, hortum, adaptör, musluk ve bağlantı parçaları"
                width={1400}
                height={933}
                className="h-auto w-full select-none"
                draggable={false}
              />
              {ITEMS.map((it, i) => (
                <button
                  key={it.name}
                  type="button"
                  aria-label={it.name}
                  aria-pressed={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-1.5"
                  style={{ left: `${it.x}%`, top: `${it.y}%` }}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className={cn(s.ping, "absolute inset-0 rounded-full", active === i ? "bg-[#3ea6ff]/60" : "bg-white/35")} style={{ animationDelay: `${i * 0.2}s` }} />
                    <span
                      className={cn(
                        s.mono,
                        "relative flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-300",
                        active === i ? "border-[#3ea6ff] bg-[#3ea6ff] text-white" : "border-white/60 bg-black/80 text-white group-hover:border-white"
                      )}
                    >
                      {i + 1}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          <ol className="divide-y divide-white/10 border-y border-white/10">
            {ITEMS.map((it, i) => (
              <li key={it.name}>
                <button type="button" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} className="group flex w-full items-start gap-4 py-3.5 text-left">
                  <span className={cn(s.mono, "mt-0.5 w-6 shrink-0 text-[12px]", active === i ? "text-[#3ea6ff]" : "text-white/50")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className={cn("block text-[16px] font-medium transition-colors", active === i ? "text-white" : "text-white/60 group-hover:text-white/85")}>{it.name}</span>
                    <span className={cn("grid transition-[grid-template-rows,opacity] duration-500", active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                      <span className="overflow-hidden text-[14px] leading-relaxed text-white/50">
                        <span className="block pt-1">{it.desc}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
