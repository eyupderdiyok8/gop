"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Mutlu Müşteri", desc: "Sultangazi ve çevresinde" },
  { value: "10+", label: "Yıllık Deneyim", desc: "2016'dan beri hizmet" },
  { value: "4", label: "Temel Hizmet", desc: "Satış, montaj, bakım, servis" },
  { value: "6 Gün", label: "Servis Planlaması", desc: "Pazartesi-Cumartesi" },
];

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
                <span className="tabular-nums">{stat.value}</span>
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

