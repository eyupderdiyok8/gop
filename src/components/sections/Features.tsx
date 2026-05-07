"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Wrench, ShieldCheck, Star, Headphones } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Bölgesel Hizmet",
    desc: "Gaziosmanpaşa ve tüm çevre ilçelerde hızlı servis ve aynı gün teslimat.",
  },
  {
    icon: Clock,
    title: "Aynı Gün Servis",
    desc: "Acil arıza durumlarında aynı gün yerinde servis desteği.",
  },
  {
    icon: Wrench,
    title: "Uzman Montaj",
    desc: "Sertifikalı teknisyenler tarafından titiz kurulum ve test.",
  },
  {
    icon: ShieldCheck,
    title: "2 Yıl Garanti",
    desc: "Tüm ürün ve işçilik için kapsamlı garanti güvencesi.",
  },
  {
    icon: Star,
    title: "Kaliteli Markalar",
    desc: "TSE belgeli, uluslararası markaların yetkili satıcısı.",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    desc: "WhatsApp ve telefon ile her zaman yanınızdayız.",
  },
];

export function Features() {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">
            Neden SuArıtmaServis34?
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy mb-4">
            Fark Yaratanlar
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Sadece cihaz satmıyoruz — temiz suya erişim için baştan sona çözüm sunuyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-brand-aqua/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-aqua/10 flex items-center justify-center mb-4 group-hover:bg-brand-aqua/20 transition-colors">
                <feature.icon className="w-6 h-6 text-brand-aqua" />
              </div>
              <h3 className="font-heading font-semibold text-brand-navy mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

