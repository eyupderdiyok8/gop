"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE, TEL, WA } from "../data";
import { TouchKey, WaGlyph } from "./primitives";
import s from "./theme.module.css";

/**
 * Siyah cam kapsül: dalış sahnesi bitince belirir, final (#son) görününce çekilir. Fiyat asla yok.
 * Yüksekliği 60px + 12px + güvenli alan; içerik payı için --qa-dock-space kullanılır.
 */
export function Dock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      const dive = document.getElementById("camin-icine") ?? document.getElementById("guc-acik");
      const end = document.getElementById("son");
      // dalış sahnesinin altındaki tuşlar dock alanından yukarı çıkınca belirir (tuşların üstüne binmez)
      const passed = dive ? dive.getBoundingClientRect().bottom <= h - 120 : window.scrollY > h;
      const atEnd = end ? end.getBoundingClientRect().top < h * 0.85 : false;
      setShow(passed && !atEnd);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))] md:justify-end md:px-6"
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className={cn(
              s.ink,
              "pointer-events-auto flex w-[min(92vw,420px)] items-center gap-1 rounded-full border border-white/10 bg-[rgba(6,7,10,0.94)] p-1.5 pl-4 shadow-[0_18px_50px_-12px_rgba(6,7,10,0.55)] md:w-auto md:gap-2"
            )}
          >
            <div className="mr-auto flex flex-col gap-1.5 pr-2">
              <span className={cn(s.micro, "text-[10px] text-white/70")}>Bilgi alın</span>
              {/* 3 segmentlik LED: sırayla yanıp söner (dock yalnızca görünürken var) */}
              <span aria-hidden className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(s.blink, "h-[5px] w-3.5 rounded-[2px] bg-[linear-gradient(90deg,#34E37A,#2EE6D6)]")}
                    style={{ "--d": `${i * 0.35}s`, "--dur": "1.4s" } as CSSProperties}
                  />
                ))}
              </span>
            </div>
            <TouchKey
              href={TEL}
              label={`${PHONE} numarasını arayın`}
              ring="iris"
              caption="Ara"
            >
              <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </TouchKey>
            <TouchKey
              href={WA}
              external
              label="WhatsApp'tan yazın"
              ring="soft"
              caption="WhatsApp"
              // dar ekranda yalnızca simge (kapsül 375px'e sığsın)
              className="max-[419px]:pr-0 [&>span:last-child]:max-[419px]:hidden"
            >
              <WaGlyph className="h-5 w-5 text-[#25D366]" />
            </TouchKey>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
