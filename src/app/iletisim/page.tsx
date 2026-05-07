"use client";

import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { MultiStepRandevuForm } from "@/components/public/MultiStepRandevuForm";
import type { Metadata } from "next";

const contactItems = [
  {
    icon: Phone,
    label: "Telefon",
    value: "0530 479 47 22",
    href: "tel:+905304794722",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "0530 479 47 22",
    href: "https://wa.me/905304794722",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Sarıgöl Mah. Mehmetçik Cad. No:8, Gaziosmanpaşa / İstanbul",
    href: null,
  },
  {
    icon: Clock,
    label: "Çalışma Saatleri",
    value: "Pzt–Cmt: 08:00–19:00",
    href: null,
  },
];

export default function IletisimPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
            ✦ Fiyat Teklifi & Randevu
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5">
            İletişim
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Gaziosmanpaşa ve çevre ilçelerde su arıtma hizmetleri için randevu alın,
            24 saat içinde dönüş yapıyoruz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Contact info – Sol */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-heading font-bold text-2xl text-brand-navy mb-2">Bize Ulaşın</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                En hızlı yanıt WhatsApp üzerinden. Acil servis talepleriniz için direkt arayabilirsiniz.
              </p>
            </div>

            <div className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-brand-aqua/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-brand-aqua/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-brand-aqua" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5 uppercase tracking-wide">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-brand-navy hover:text-brand-aqua transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground/75">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden border border-border h-56">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47965.73640782768!2d27.468892!3d40.977989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b5f0f5f5f5f5f5%3A0x0!2zVGVraXJkYcSf!5e0!3m2!1str!2str!4v1650000000000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SuArıtmaServis34 Konumu"
              />
            </div>
          </div>

          {/* Randevu Formu – Sağ */}
          <div className="lg:col-span-3">
            <p className="text-sm text-muted-foreground mb-6">
              Aşağıdaki formu kullanarak hızlıca randevu oluşturabilirsiniz.
              E-posta ve telefon numaranıza doğrulama kodu gönderilecektir.
            </p>
            <MultiStepRandevuForm />
          </div>
        </div>
      </section>
    </>
  );
}
