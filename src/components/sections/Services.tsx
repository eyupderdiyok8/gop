"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Wrench, RotateCcw, Zap, ArrowRight } from "lucide-react";

const services = [
  {
    id: "satis",
    icon: ShoppingCart,
    badge: "En Popüler",
    badgeColor: "bg-brand-aqua text-white",
    title: "Su Arıtma Satışı",
    desc: "Ev, ofis ve işyerinize özel filtrasyon sistemleri. Reverse Osmosis, undersink, tezgah üstü ve inline modeller.",
    items: ["Ev tipi RO sistemler", "Ofis tipi damacana alternatifi", "Tezgah üstü kompakt modeller", "Endüstriyel çözümler"],
    href: "/urunler",
    cta: "Ürünleri İncele",
    accent: "teal",
  },
  {
    id: "montaj",
    icon: Wrench,
    badge: "Uzman Ekip",
    badgeColor: "bg-brand-navy text-white",
    title: "Montaj & Kurulum",
    desc: "Sertifikalı teknisyenlerimiz, cihazınızı en verimli şekilde kurarak test eder ve kullanımı öğretir.",
    items: ["Keşif ve tespit ziyareti", "Aynı gün kurulum imkânı", "Su analizi raporu", "Kullanım eğitimi"],
    href: "/hizmetler/su-aritma-montaj",
    cta: "Detayları Gör",
    accent: "navy",
  },
  {
    id: "bakim",
    icon: RotateCcw,
    badge: "Düzenli Bakım",
    badgeColor: "bg-amber-500 text-white",
    title: "Periyodik Bakım",
    desc: "Yılda bir veya iki kez yapılan filtre değişimi ve sistem kontrolü ile cihazınız her zaman tam verimde çalışır.",
    items: ["Filtre seti değişimi", "Membran kontrolü", "Sistem basınç testi", "Bakım hatırlatma servisi"],
    href: "/hizmetler/filtre-degisimi",
    cta: "Bakım Planları",
    accent: "amber",
  },
  {
    id: "ariza",
    icon: Zap,
    badge: "Acil Servis",
    badgeColor: "bg-red-500 text-white",
    title: "Arıza Servisi",
    desc: "Cihazınızda sorun mu var? Gaziosmanpaşa ve tüm çevre ilçelerde aynı gün müdahale garantisiyle yanınızdayız.",
    items: ["Aynı gün müdahale", "Orijinal yedek parça", "Garanti kapsamı", "Fiyat şeffaflığı"],
    href: "/hizmetler/su-aritma-servisi",
    cta: "Hemen Ara",
    accent: "red",
  },
];

export function Services() {
  return (
    <section className="section-padding bg-muted/40">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">
            Hizmetlerimiz
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy mb-4">
            Her İhtiyacınız İçin<br className="hidden sm:block" /> Eksiksiz Çözüm
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Satıştan servise, montajdan bakıma kadar su arıtma sistemlerinde tek adres.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-7 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-navy/8 flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-brand-navy" />
                </div>
                <Badge className={`text-xs font-medium ${service.badgeColor} border-0`}>
                  {service.badge}
                </Badge>
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-navy mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{service.desc}</p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-aqua flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full border-border hover:border-brand-aqua/40 hover:bg-brand-aqua/5 group">
                <Link href={service.href}>
                  {service.cta}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

