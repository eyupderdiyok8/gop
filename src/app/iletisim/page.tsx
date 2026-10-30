import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { HeroHelpMenu } from "@/components/public/HeroHelpMenu";
import { BUSINESS_LOCATION } from "@/lib/business";

export const metadata: Metadata = {
  title: "İletişim | SuArıtmaServis34 Sultangazi Su Arıtma Servisi",
  description:
    "Sultangazi ve İstanbul Avrupa Yakası'nda su arıtma servisi, filtre değişimi ve yeni cihaz için telefon veya WhatsApp'tan bize ulaşın.",
  openGraph: {
    title: "İletişim – SuArıtmaServis34 Sultangazi",
    description:
      "Su arıtma satış, montaj, bakım ve acil servis için bize ulaşın. Telefon ve WhatsApp üzerinden hızlı destek.",
  },
  alternates: {
    canonical: "/iletisim",
  },
};

const contactItems = [
  {
    icon: Phone,
    label: "Telefon",
    value: "0553 114 27 34",
    href: "tel:+905531142734",
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "0553 114 27 34",
    href: "https://wa.me/905531142734",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Sultançiftliği Mah. Eski Edirne Asfaltı Cad. No:461, 34265 Sultangazi / İstanbul",
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
            ✦ Fiyat Teklifi & Servis
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5">
            İletişim
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Sultangazi ve İstanbul Avrupa Yakası&apos;nda su arıtma hizmetleri için bize telefon veya
            WhatsApp&apos;tan ulaşın.
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

          </div>

          {/* Yardım menüsü – Sağ (ana sayfa hero'sundaki ile aynı) */}
          <div className="lg:col-span-3">
            <HeroHelpMenu />
          </div>
        </div>
        {/* Harita: tam genişlikte, ince yatay şerit */}
        <div className="max-w-6xl mx-auto mt-12 overflow-hidden rounded-2xl border border-border h-64 sm:h-80">
          <iframe
            src={BUSINESS_LOCATION.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Su Arıtma Teknik Servis 34 konumu"
          />
        </div>
      </section>
    </>
  );
}
