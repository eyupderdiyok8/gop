"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, ShieldCheck, Banknote, Truck } from "lucide-react";

const steps = [
  {
    icon: RefreshCw,
    title: "Eski Cihazınızı Alalım",
    desc: "Markası ve modeli ne olursa olsun, çalışır veya arızalı tüm su arıtma cihazlarını değerinde alıyoruz.",
  },
  {
    icon: Truck,
    title: "Ücretsiz Söküm & Teslimat",
    desc: "Eski cihazınızı yerinden ücretsiz söküyor, yeni cihazınızı aynı gün kurulum dahil teslim ediyoruz.",
  },
  {
    icon: ShieldCheck,
    title: "Yeni Cihaz Garantisi",
    desc: "2 yıl full garanti, NSF onaylı filtreler ve ücretsiz ilk bakım ile yeni cihazınız güvende.",
  },
  {
    icon: Banknote,
    title: "Takas İndirimi",
    desc: "Eski cihazınızın değerini yeni cihaz fiyatından düşüyoruz. Peşin veya taksitli ödeme imkanı.",
  },
];

export function DeviceRenewal() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-600 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
            <span className="animate-pulse">🔥</span>
            Sınırlı Süre Kampanyası
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-navy mb-4">
            Eski Cihazınızı Alalım,{" "}
            <span className="text-brand-aqua">Yenisini Verelim</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Eski su arıtma cihazınızı takas edin, indirimli fiyatla yepyeni ve
            yüksek performanslı bir cihaza sahip olun. Marka ve model fark
            etmez!
          </p>
        </motion.div>

        {/* Campaign Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 rounded-3xl overflow-hidden shadow-2xl border border-border"
        >
          <img
            src="/images/cihaz-yenileme-kampanyasi.jpg"
            alt="Eski cihazınızı alalım, yenisini verelim - Su arıtma cihazı yenileme kampanyası"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:border-brand-aqua/40 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl gradient-teal text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-brand-navy mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="gradient-teal text-white border-0 hover:opacity-90 h-12 px-8 text-base font-semibold shadow-lg"
          >
            <Link href="/cihaz-yenileme">
              Kampanya Detayları
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
