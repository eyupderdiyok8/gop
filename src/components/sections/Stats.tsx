"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "Mutlu Müşteri", desc: "Gaziosmanpaşa & İstanbul'da" },
  { value: 8, suffix: "+", label: "Yıllık Deneyim", desc: "Sektörde güvenilir isim" },
  { value: 98, suffix: "%", label: "Memnuniyet Oranı", desc: "Google yorumları" },
  { value: 7, suffix: "/24", label: "Acil Servis", desc: "Aynı gün hizmet garantisi" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="section-padding gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-brand-aqua/5 pointer-events-none" />
      <div className="container-tight relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-brand-aqua-light font-semibold text-sm uppercase tracking-widest mb-3">
            Rakamlarla Biz
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
            Güven Kazanan Sayılar
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm"
            >
              <p className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-1">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-semibold text-brand-aqua-light mb-1 text-sm">{stat.label}</p>
              <p className="text-white/50 text-xs">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

