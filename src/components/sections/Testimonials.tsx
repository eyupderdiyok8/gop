"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GOOGLE_PROFILE } from "@/lib/business";

type Review = {
  name: string;
  text: string;
  date: string;
  rating: number;
};

/** Google Haritalar'daki gerçek yorumlardan seçki; metinler olduğu gibi */
const reviews: Review[] = [
  {
    name: "Pirayeniz",
    rating: 5,
    date: "Ekim 2026",
    text: "Çok beyefendi insanlar, ayrıca çok hızlı ve sorunsuz bir işlem oldu, fiyatı arıtmanın kalitesine göre de çok çok iyi, aile de sırayla herkes taktırdı, severek içiyoruz tadı da güzel şükür damacanlardan kurtulduk ellerinize sağlık teşekkür ederiz.",
  },
  {
    name: "Öner Tiryaki",
    rating: 5,
    date: "Ağustos 2026",
    text: "Yetkili arkadaş çok nazik, konusuna,işine hakim,tecrübeli, dinleyen,anlayan,uygulayan mütevazi bir insan, uygun fiyata kaliteli hizmet için Burak beye çok teşekkür ederim, hayırlı işler, bol kazançlar dilerim.",
  },
  {
    name: "Murat Coşkun",
    rating: 5,
    date: "Ağustos 2026",
    text: "Malatya’dan su arıtma ürünü siparişi verdim. Ürünler beklediğimden daha özenli paketlenmiş şekilde geldi. Kurulumunu kendim yaptım, ürünlerin bağlantıları ve kullanımı gayet anlaşılırdı. Sipariş öncesinde ve sonrasında her konuda yardımcı oldular. Hem ürün kalitesinden hem de ilgilerinden memnun kaldım. Uzakta olmamıza rağmen alışveriş süreci çok rahat geçti. Teşekkür ederim.",
  },
  {
    name: "Hüseyin Ulaş",
    rating: 5,
    date: "Eylül 2026",
    text: "Cihazı yenilemek istedik aynı gün gelip yenilediler bu işte profosyonel ve müşteri memnuniyeti odaklı çalışıyorlar öneririm.",
  },
  {
    name: "Yusuf Türkoğlu",
    rating: 5,
    date: "Eylül 2026",
    text: "Zamaninda ve hizli bir şekilde gelip arıtma filtresi değişimi yapıldı. Aritmadaki diğer problemlerinde tespiti yapili tamiri yapıldı teşekkürler",
  },
  {
    name: "Mevlüt Yılmaz",
    rating: 5,
    date: "Ağustos 2026",
    text: "Antalya’dan sipariş verdim, ürünler kısa sürede ve güzel paketlenmiş şekilde elime ulaştı. Gelen ürünleri kendim taktım, montaj konusunda da herhangi bir sıkıntı yaşamadım. Ürünlerin kalitesi gayet güzel, iletişimleri de ilgili ve yardımcı oldular. Alışverişten memnun kaldım, teşekkür ederim. Gönül rahatlığıyla tavsiye ederim.",
  },
  {
    name: "Cihat Şekerci",
    rating: 5,
    date: "Ekim 2026",
    text: "Güler yüzlü ilgili ve işini düzgün yapan bir usta Memnun kaldım gönül rahatlığıyla tavsiye ederim",
  },
  {
    name: "Hamid Muradi",
    rating: 5,
    date: "Eylül 2026",
    text: "Kağıthaneye çağırdık aynı gün geldiler arıza mizi çözüp filtre değiştirdiler",
  },
];

/** Kurulumlarımızdan fotoğraf ve video */
const media: { type: "image" | "video"; src: string; thumb: string; label: string; vertical?: boolean }[] = [
  { type: "image", src: "/testimonials/su-aritma-servisi-musteri-yorumlari1.jpeg", thumb: "/testimonials/su-aritma-servisi-musteri-yorumlari1.jpeg", label: "Tezgah altı su arıtma kurulumu" },
  { type: "video", src: "https://www.youtube.com/embed/zjKagH_Oygg", thumb: "/testimonials/su-aritma-servisi-musteri-yorumlari2.jpeg", label: "Kurulum videosu", vertical: true },
  { type: "image", src: "/testimonials/su-aritma-servisi-musteri-yorumlari3.jpeg", thumb: "/testimonials/su-aritma-servisi-musteri-yorumlari3.jpeg", label: "Mutfak dolabına su arıtma montajı" },
];

function GoogleG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}

export function Testimonials() {
  const [lightbox, setLightbox] = useState<{ src: string; type: "image" | "video"; vertical?: boolean } | null>(null);
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
          <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">Müşteri Yorumları</p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy mb-4">Onlar Anlatsın</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Google Haritalar&apos;da müşterilerimizin bıraktığı yorumlardan bazıları.
          </p>
          <a
            href={GOOGLE_PROFILE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm transition hover:border-brand-aqua/40 hover:shadow-md"
          >
            <GoogleG className="w-5 h-5" />
            <span className="font-heading font-bold text-brand-navy">{GOOGLE_PROFILE.rating}</span>
            <span className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="text-sm text-muted-foreground">{GOOGLE_PROFILE.reviewCount} Google yorumu</span>
          </a>
        </motion.div>

        {/* Yorum kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {reviews.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
              className="flex flex-col bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex" aria-label={`${t.rating} yıldız`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <GoogleG className="w-4 h-4" />
              </div>
              <blockquote className="flex-1 text-foreground/75 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-navy flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-heading font-bold text-sm">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-brand-navy text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">Google yorumu · {t.date}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}

          {/* Tüm yorumlar */}
          <motion.a
            href={GOOGLE_PROFILE.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-aqua/40 bg-brand-aqua/[0.04] p-6 text-center transition hover:bg-brand-aqua/[0.08]"
          >
            <GoogleG className="w-8 h-8" />
            <p className="font-heading text-4xl font-bold text-brand-navy">{GOOGLE_PROFILE.rating}</p>
            <p className="text-sm text-muted-foreground">{GOOGLE_PROFILE.reviewCount} yorumun tamamını Google&apos;da okuyun</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-aqua">
              Tüm yorumlar
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </motion.a>
        </div>

        {/* Kurulumlarımızdan */}
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-navy/60 mb-5">Kurulumlarımızdan</p>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {media.map((m) => (
            <button
              key={m.src}
              onClick={() => setLightbox({ src: m.src, type: m.type, vertical: m.vertical })}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/70 group"
              aria-label={`${m.label}: büyüt`}
            >
              <Image
                src={m.thumb}
                alt={m.label}
                fill
                sizes="(max-width: 768px) 33vw, 360px"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {m.type === "video" && (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-brand-aqua fill-brand-aqua ml-0.5" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Büyük görünüm */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
              onClick={() => setLightbox(null)}
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn("flex items-center justify-center w-full", lightbox.vertical ? "max-w-sm" : "max-w-4xl")}
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.type === "image" ? (
                <Image
                  src={lightbox.src}
                  alt="Su arıtma kurulumu"
                  width={1200}
                  height={1600}
                  sizes="100vw"
                  className="w-auto max-w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="relative w-full" style={{ paddingTop: lightbox.vertical ? "177.78%" : "56.25%" }}>
                  <iframe
                    src={lightbox.src + "?autoplay=1"}
                    className="absolute inset-0 w-full h-full rounded-2xl"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title="Kurulum videosu"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
