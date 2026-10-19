"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Chapter, Headline, Reveal } from "./primitives";
import s from "./v2.module.css";

/** x/y: set.webp üzerindeki konum (%) */
const ITEMS = [
  { name: "Şeffaf kırmızı kasa", desc: "Siyah gövdeli, şeffaf koruyucu kasa.", x: 25, y: 60 },
  { name: "Filtre seti", desc: "PP sediment, GAC ve CTO karbon ön filtreler ile post karbon filtre.", x: 51, y: 61 },
  { name: "3.2 G metal tank", desc: "Arıtılmış suyu ihtiyaç anına kadar saklayan dayanıklı tank.", x: 46, y: 17 },
  { name: "80 GPD membran", desc: "Reverse osmosis sisteminin kalbi olan membran.", x: 62, y: 87 },
  { name: "Lüks paslanmaz musluk", desc: "Kutusunda gelen, şık ve dayanıklı paslanmaz çelik musluk.", x: 80.5, y: 72 },
  { name: "Bağlantı hortumu ve vana", desc: "Şebeke bağlantısı için hortum ve giriş vanası.", x: 81.5, y: 35 },
  { name: "Montaj parçaları", desc: "Pul, vida ve bağlantı aparatları.", x: 93, y: 81 },
];

export function BoxContents() {
  const [active, setActive] = useState(0);

  return (
    <section id="kutu" className={cn(s.cv, "relative scroll-mt-16 overflow-hidden px-5 py-[12vh] md:px-10")}>
      <div className="mx-auto max-w-[1440px]">
        <Chapter no="06" label="Kutu İçeriği" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Headline text="Kutuyu açın, *her şey* hazır." className="text-[clamp(2.7rem,7.4vw,6.4rem)] leading-[0.95] text-white" />
          <p className="max-w-md text-base leading-relaxed text-white/55 lg:justify-self-end lg:text-right">
            Kasa, filtreler, membran, tank, musluk ve bağlantı parçaları… Kurulum için gereken her şey aynı setten çıkar.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <Reveal>
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-x-[8%] inset-y-[14%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,40,40,0.2),rgba(255,40,40,0.06)_55%,transparent)]"
              />
              <Image
                src="/images/prada-v2/set.webp"
                alt="3.2 Prada set içeriği: kasa, filtreler, tank, membran, musluk, hortum ve montaj parçaları"
                width={1000}
                height={667}
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
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
                  style={{ left: `${it.x}%`, top: `${it.y}%` }}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span
                      className={cn(
                        s.ping,
                        "absolute inset-0 rounded-full",
                        active === i ? "bg-[#ff3b3b]/60" : "bg-white/35"
                      )}
                      style={{ animationDelay: `${i * 0.25}s` }}
                    />
                    <span
                      className={cn(
                        s.mono,
                        "relative flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-300",
                        active === i
                          ? "border-[#ff3b3b] bg-[#ff3b3b] text-white"
                          : "border-white/60 bg-black/80 text-white group-hover:border-white"
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
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-start gap-4 py-4 text-left"
                >
                  <span
                    className={cn(
                      s.mono,
                      "mt-0.5 w-6 shrink-0 text-[12px] transition-colors duration-300",
                      active === i ? "text-[#ff3b3b]" : "text-white/50"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block text-[17px] font-medium transition-colors duration-300",
                        active === i ? "text-white" : "text-white/60 group-hover:text-white/85"
                      )}
                    >
                      {it.name}
                    </span>
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-500",
                        active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <span className="overflow-hidden text-[14px] leading-relaxed text-white/50">
                        <span className="block pt-1">{it.desc}</span>
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                      active === i ? "scale-100 bg-[#ff3b3b]" : "scale-0 bg-white"
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
