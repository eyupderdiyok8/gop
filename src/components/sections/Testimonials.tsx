"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  photo?: string;       // URL to customer photo
  mediaType?: "image" | "video";
  mediaSrc?: string;    // URL to review image or YouTube embed URL
  mediaThumb?: string;  // Thumbnail for video
};

const testimonials: Testimonial[] = [
  {
    name: "Ahmet Yılmaz",
    location: "Gaziosmanpaşa Merkez",
    rating: 5,
    text: "Çok memnun kaldım. Montaj ekibi son derece profesyoneldi, hiç dağınıklık bırakmadılar. Suyu içtikten sonra farkı hemen hissettim.",
    date: "Ocak 2026",
  },
  {
    name: "Fatma Kaya",
    location: "Bağcılar",
    rating: 5,
    text: "Daha önce damacana kullanıyordum. Bu sistemi aldıktan sonra hem daha sağlıklı su içiyoruz hem de aylık masrafımız azaldı. Tavsiye ederim.",
    date: "Şubat 2026",
    mediaType: "image",
    mediaSrc: "/testimonials/su-aritma-servisi-musteri-yorumlari1.jpeg",
  },
  {
    name: "Mehmet Demir",
    location: "Eyüp",
    rating: 5,
    text: "Filtre değişimi için aradım, aynı gün geldiler. Hızlı ve güvenilir servis. Fiyatlar da makul. Yıllardır kullanıyorum, sorun yok.",
    date: "Mart 2026",
    mediaType: "video",
    mediaSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mediaThumb: "/testimonials/su-aritma-servisi-musteri-yorumlari2.jpeg",
  },
  {
    name: "Selin Arslan",
    location: "Sultangazi",
    rating: 5,
    text: "Ofisimiz için 2 adet aldık. Damacana dönemini kapattık. Ekip her konuda yardımcı oldu, bakım hatırlatmaları da çok iş görüyor.",
    date: "Mart 2026",
    mediaType: "image",
    mediaSrc: "/testimonials/su-aritma-servisi-musteri-yorumlari2.jpeg",
  },
  {
    name: "Hasan Çelik",
    location: "Küçükköy",
    rating: 5,
    text: "Garanti kapsamında arıza servisi istedim, 3 saat içinde geldiler. Bu hız ve özen gerçekten takdire şayan. Teşekkürler.",
    date: "Nisan 2026",
  },
  {
    name: "Ayşe Türk",
    location: "Karadolap",
    rating: 5,
    text: "Fiyat almak için aradım, çok detaylı bilgi verdiler. Satışa odaklanmak yerine gerçekten neye ihtiyacım olduğunu sordular. Güven veriyor.",
    date: "Nisan 2026",
    mediaType: "image",
    mediaSrc: "/testimonials/su-aritma-servisi-musteri-yorumlari3.jpeg",
  },
];

export function Testimonials() {
  const [lightbox, setLightbox] = useState<{ src: string; type: "image" | "video" } | null>(null);
  const mediaItems = testimonials.filter(t => t.mediaType && t.mediaSrc);

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
            Müşteri Yorumları
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy mb-4">
            Onlar Anlatsın
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Gaziosmanpaşa ve çevre semtlerdeki yüzlerce müşterimizden gelen gerçek deneyimler.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 font-heading font-bold text-brand-navy">4.9</span>
            <span className="text-muted-foreground text-sm">/ Google'da 120+ yorum</span>
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Media preview if available */}
              {t.mediaType && t.mediaSrc && (
                <button
                  onClick={() => setLightbox({ src: t.mediaSrc!, type: t.mediaType! })}
                  className="relative w-full h-44 bg-muted overflow-hidden group block"
                  aria-label={`${t.name} yorumunun fotoğrafını/videosunu görüntüle`}
                >
                  {t.mediaType === "image" ? (
                    <img
                      src={t.mediaSrc}
                      alt={`${t.name} müşteri yorumu`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x300/1e3a5f/ffffff?text=${encodeURIComponent(t.name)}`;
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={t.mediaThumb || `https://placehold.co/600x300/1e3a5f/ffffff?text=Video+Yorum`}
                        alt={`${t.name} video yorumu`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/600x300/1e3a5f/ffffff?text=Video`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-brand-aqua fill-brand-aqua ml-1" />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute top-2 right-2 bg-brand-aqua text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {t.mediaType === "video" ? "Video" : "Fotoğraf"}
                  </div>
                </button>
              )}

              <div className="p-6">
                <Quote className="w-8 h-8 text-brand-aqua/25 mb-4" />
                <p className="text-foreground/75 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-heading font-bold text-sm">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{t.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
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
              className="max-w-4xl w-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.type === "image" ? (
                <img
                  src={lightbox.src}
                  alt="Müşteri yorumu"
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={lightbox.src + "?autoplay=1"}
                    className="absolute inset-0 w-full h-full rounded-2xl"
                    allow="autoplay; fullscreen"
                    allowFullScreen
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
