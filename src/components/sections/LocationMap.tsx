import { MapPin, Navigation, Phone, Star } from "lucide-react";
import { BUSINESS_LOCATION, GOOGLE_PROFILE } from "@/lib/business";

/** Ana sayfa: işletmenin Google Haritalar konumu, adres ve yol tarifi */
export function LocationMap() {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">Bize Ulaşın</p>
            <h2 className="font-heading font-bold text-3xl text-brand-navy mb-4">Sultangazi&apos;deyiz</h2>
            <p className="flex items-start gap-3 text-muted-foreground leading-relaxed">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-aqua" />
              {BUSINESS_LOCATION.address}
            </p>
            <a
              href={GOOGLE_PROFILE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-brand-navy hover:text-brand-aqua"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{GOOGLE_PROFILE.rating}</span>
              <span className="text-muted-foreground">· {GOOGLE_PROFILE.reviewCount} Google yorumu</span>
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={GOOGLE_PROFILE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full gradient-teal px-6 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                <Navigation className="h-4 w-4" /> Yol tarifi al
              </a>
              <a
                href="tel:+905531142734"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-brand-navy hover:border-brand-aqua/50"
              >
                <Phone className="h-4 w-4" /> 0553 114 27 34
              </a>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-[420px]">
            <iframe
              src={BUSINESS_LOCATION.mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Su Arıtma Teknik Servis 34 konumu"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
