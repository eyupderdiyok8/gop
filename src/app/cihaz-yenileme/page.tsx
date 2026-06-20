"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Banknote,
  Truck,
  Check,
  HelpCircle,
  Star,
  Zap,
  Droplets,
  Clock,
} from "lucide-react";
import { FAQSection } from "@/components/seo/FAQSection";
import { CtaBand } from "@/components/sections/CtaBand";

const benefits = [
  {
    icon: Banknote,
    title: "Takas İndirimi",
    desc: "Eski cihazınızın değeri yeni cihaz fiyatından düşülür. Ne kadar eski olursa olsun, mutlaka bir değer biçilir.",
  },
  {
    icon: Truck,
    title: "Ücretsiz Söküm & Kurulum",
    desc: "Eski cihazınızın sökülmesi ve yeni cihazınızın montajı tamamen ücretsizdir. Tek seferde tamamlanır.",
  },
  {
    icon: ShieldCheck,
    title: "2 Yıl Full Garanti",
    desc: "Yeni cihazınız 2 yıl boyunca firmamız garantisi altındadır. Parça ve işçilik dahil.",
  },
  {
    icon: Zap,
    title: "Aynı Gün Teslimat",
    desc: "Randevu gününüzde eski cihazınızı alıp, yenisini aynı gün kurulum dahil teslim ediyoruz.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Bize Ulaşın",
    desc: "Telefon, WhatsApp veya form ile mevcut cihazınızın marka, model ve durumunu bildirin.",
  },
  {
    step: "2",
    title: "Değer Tespiti",
    desc: "Teknik ekibimiz cihazınızın değerini belirler ve size takas indirimi ile yeni cihaz teklifi sunar.",
  },
  {
    step: "3",
    title: "Randevu & Kurulum",
    desc: "Onay sonrası aynı gün veya uygun olduğunuz gün ücretsiz söküm ve kurulum yapılır.",
  },
  {
    step: "4",
    title: "Keyifle Kullanın",
    desc: "Yeni cihazınızdan taze, sağlıklı su içmeye başlayın. Bakım hatırlatmaları otomatik gelir.",
  },
];

const includedFeatures = [
  "NSF ve ISO sertifikalı filtre sistemi",
  "8-12 aşamalı mineral dengeli filtrasyon",
  "Basınç düşürücü regülatör",
  "Paslanmaz çelik musluk",
  "Ücretsiz su TDS analizi",
  "2 yıl full garanti",
  "İlk yıl ücretsiz periyodik bakım",
  "Otomatik filtre hatırlatma servisi",
];

const faqs = [
  {
    q: "Hangi markaların cihazını kabul ediyorsunuz?",
    a: "Tüm marka ve modelleri kabul ediyoruz. Aquamelon, Aqua Soft, LG, Samsung, İhlas, Aura, Life, Natural ve daha fazlası — çalışır veya arızalı fark etmez.",
  },
  {
    q: "Eski cihazım arızalı, yine de takas yapabilir miyim?",
    a: "Evet! Arızalı cihazlar da takas kapsamındadır. Cihazın durumuna göre bir değer belirlenir ve yeni cihaz fiyatından düşülür.",
  },
  {
    q: "Takas indirimi ne kadar oluyor?",
    a: "İndirim tutarı eski cihazınızın marka, model, yaş ve durumuna göre değişir. Detaylı bilgi için bize ulaşın, ücretsiz değerlendirme yapalım.",
  },
  {
    q: "Söküm ve kurulum gerçekten ücretsiz mi?",
    a: "Evet, kampanya kapsamında eski cihazın sökülmesi ve yeni cihazın montajı tamamen ücretsizdir. Gizli maliyet yoktur.",
  },
  {
    q: "Taksit imkanı var mı?",
    a: "Evet, kredi kartına 12 aya varan taksit seçenekleri mevcuttur. Peşin ödemede ekstra indirim uygulanır.",
  },
  {
    q: "Yeni cihazımın filtresi ne zaman değişecek?",
    a: "Yeni cihazınızın ilk filtre değişimi 6-8 ay sonra otomatik hatırlatma ile tarafımızdan yapılır. İlk bakım ücretsizdir.",
  },
];

export default function CihazYenilemePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative gradient-hero pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-red-500/20 text-red-300 border-red-400/30 px-4 py-1.5 text-xs tracking-wide font-bold">
              🔥 Sınırlı Süre Kampanyası
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Eski Cihazınızı Alalım
              <br />
              <span className="text-brand-aqua">Yenisini Verelim</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Su arıtma cihazınızı yenileme zamanı geldi! Eski cihazınızı
              takas edin, indirimli fiyatla yepyeni ve yüksek performanslı bir
              cihaza sahip olun.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="gradient-teal text-white border-0 hover:opacity-90 h-12 px-8 text-base font-semibold"
              >
                <Link href="/iletisim">
                  Hemen Teklif Al
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent h-12 px-8"
              >
                <a href="tel:+905531142734">
                  <Phone className="mr-2 w-4 h-4" />
                  0553 114 27 34
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Campaign Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img
              src="/images/cihaz-yenileme-kampanyasi.jpg"
              alt="Eski cihazınızı alalım yenisini verelim - Su arıtma cihazı yenileme kampanyası"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-navy mb-4">
              Neden Cihaz Yenileme Kampanyası?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Eski cihazınızı takas ederek elde edeceğiniz avantajlar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 hover:border-brand-aqua/40 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl gradient-teal text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <b.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-brand-navy mb-2">
                      {b.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-navy mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              4 kolay adımda yeni cihazınıza kavuşun
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full gradient-teal text-white flex items-center justify-center mx-auto mb-5 shadow-lg text-2xl font-heading font-extrabold">
                  {item.step}
                </div>
                <h3 className="font-heading font-bold text-lg text-brand-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading font-extrabold text-3xl text-brand-navy mb-4">
                Yeni Cihazınızla Birlikte Neler Dahil?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Kampanya kapsamında alacağınız yeni su arıtma cihazı ile
                birlikte gelen tüm hizmetler:
              </p>
              <div className="space-y-3">
                {includedFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-aqua/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-brand-aqua" />
                    </div>
                    <span className="text-foreground">{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-brand-navy to-brand-navy/90 rounded-3xl p-10 text-white"
            >
              <div className="text-center mb-8">
                <Droplets className="w-12 h-12 text-brand-aqua mx-auto mb-4" />
                <h3 className="font-heading font-extrabold text-2xl mb-2">
                  Hemen Başlayın
                </h3>
                <p className="text-white/60 text-sm">
                  Eski cihazınızın değerini öğrenmek için bize ulaşın
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:+905531142734"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-aqua/20 flex items-center justify-center group-hover:bg-white/20">
                    <Phone className="w-5 h-5 text-brand-aqua" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Hemen Arayın</p>
                    <p className="font-bold">0553 114 27 34</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/905531142734?text=Merhaba, cihaz yenileme kampanyası hakkında bilgi almak istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-[#25D366]/10 rounded-2xl hover:bg-[#25D366]/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center group-hover:bg-white/20">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">WhatsApp ile Yazın</p>
                    <p className="font-bold">Hızlı Cevap</p>
                  </div>
                </a>
                <Button
                  asChild
                  className="w-full gradient-teal text-white border-0 hover:opacity-90 h-12 font-semibold"
                >
                  <Link href="/iletisim">
                    Teklif Formu
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-extrabold text-3xl text-brand-navy mb-3">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-muted-foreground">
              Cihaz yenileme kampanyası hakkında merak edilenler
            </p>
          </div>
          <FAQSection
            faqs={faqs}
            locationName="Cihaz Yenileme Kampanyası"
          />
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
