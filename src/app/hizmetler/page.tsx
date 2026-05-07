import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Droplets } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { SERVICES_DATA } from "@/lib/constants/services";

export const metadata: Metadata = {
  title: "Hizmetlerimiz – Su Arıtma Satış, Montaj, Bakım & Servis",
  description:
    "Gaziosmanpaşa ve çevre ilçelerde su arıtma cihazı satışı, profesyonel montaj, periyodik filtre bakımı ve acil arıza servisi. Hizmetlerimiz için bizi arayın.",
};

export default function HizmetlerPage() {
  const allServices = Object.values(SERVICES_DATA);

  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
            ✦ Gaziosmanpaşa & İstanbul Bölgesi
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5">
            Hizmetlerimiz
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Su arıtma sistemlerinde satıştan servise, montajdan bakıma — her şey tek çatı altında.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-teal text-white border-0 hover:opacity-90 h-12">
              <Link href="/iletisim">Servis Talep Et <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent h-12">
              <a href="tel:+905304794722"><Phone className="mr-2 w-4 h-4" /> 0530 479 47 22</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-brand-navy mb-4">Profesyonel Su Arıtma Çözümleri</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              İhtiyacınıza uygun hizmeti seçerek detaylı bilgi alabilir ve anında randevu oluşturabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={`/hizmetler/${service.slug}`}
                  className="group relative bg-card border border-border rounded-[2rem] p-8 hover:border-brand-aqua/40 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-aqua/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-aqua/10 transition-colors" />

                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl gradient-teal text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-3 text-brand-aqua border-brand-aqua/20 bg-brand-aqua/5">
                        {service.badge}
                      </Badge>
                      <h3 className="text-xl font-heading font-bold text-brand-navy mb-3 group-hover:text-brand-aqua transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {service.shortDesc}
                      </p>
                      <div className="flex items-center text-brand-aqua font-bold text-sm">
                        <span>Hizmet Detayları</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-aqua/10 mb-6">
            <Droplets className="w-8 h-8 text-brand-aqua" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-brand-navy mb-4">Size En Uygun Hizmet Hangisi?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Cihazınızın markası ne olursa olsun, Gaziosmanpaşa ve tüm çevre ilçelere profesyonel servis desteği sağlıyoruz.
          </p>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/iletisim">Bize Danışın</Link>
          </Button>
        </div>
      </section>

      <CtaBand />
    </>
  );
}


