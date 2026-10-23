"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { TEL, WA } from "./contact";
import s from "./v2.module.css";

/** Hero'dan sonra beliren, kapanış bölümünde çekilen yüzen arama çubuğu */
export function Dock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      const end = document.getElementById("iletisim");
      const atEnd = end ? end.getBoundingClientRect().top < h * 0.7 : false;
      setShow(window.scrollY > h * 0.6 && !atEnd);
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
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))]"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <div className="pointer-events-auto flex w-full max-w-[520px] items-center gap-2 rounded-full border border-white/10 bg-[#121212]/95 p-1.5 pl-3 shadow-[0_20px_60px_rgba(0,0,0,0.65)] md:w-auto md:gap-2.5">
            {/* Fiyat sayfada gösterilmiyor; fiyat bilgisi telefonla veriliyor */}
            <div className="mr-auto flex items-center gap-2.5 md:mr-5">
              <Image src="/images/prada-v2/logo-amblem.webp" alt="" width={320} height={226} className="h-8 w-auto" />
              <div className="hidden leading-tight sm:block">
                <p className="text-[14px] font-semibold tracking-tight text-white">3.2 Prada</p>
                <p className={cn(s.mono, "text-[9.5px] uppercase tracking-[0.2em] text-white/55")}>Bilgi & sipariş</p>
              </div>
            </div>
            <a
              href={TEL}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-[#ffe9e6] md:px-5"
            >
              <Phone className="h-4 w-4" /> Ara
            </a>
            <a
              href={WA}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-[#062b14] transition hover:brightness-95 md:px-5"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
