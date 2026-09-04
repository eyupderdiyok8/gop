import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, MapPin, Heart } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Hakkımızda | SuArıtmaServis34 Sultangazi",
  description:
    "2016'dan beri Sultangazi ve İstanbul Avrupa Yakası'nda su arıtma cihazı, montaj, filtre değişimi ve teknik servis hizmetleri sunuyoruz.",
  alternates: {
    canonical: "/hakkimizda",
  },
};

const values = [
  {
    icon: Award,
    title: "Kalite & Güvenilirlik",
    desc: "TSE belgeli ürünler, sertifikalı teknisyenler ve şeffaf fiyat politikası ile hizmet veriyoruz.",
  },
  {
    icon: Users,
    title: "Müşteri Odaklılık",
    desc: "Her müşterinin ihtiyacı farklıdır. Önce dinliyor, sonra en doğru çözümü öneriyoruz.",
  },
  {
    icon: MapPin,
    title: "Bölgeye Hakimiz",
    desc: "Sultangazi ve yakın ilçelerdeki farklı bina, basınç ve kullanım koşullarına uygun yerel çözümler sunuyoruz.",
  },
  {
    icon: Heart,
    title: "Uzun Vadeli İlişki",
    desc: "Satış sonrası bakım ve servis ile müşterilerimizle uzun dönemli ilişki kuruyoruz.",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
            2016&apos;dan Beri
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5">
            Hakkımızda
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            2016&apos;dan beri Sultangazi ve İstanbul Avrupa Yakası&apos;nda su arıtma hizmetleri sunuyoruz.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">Hikayemiz</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy mb-6">
              Sultangazi&apos;den Avrupa Yakası&apos;na
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                2016 yılında başladığımız yolculuğu bugün Sultançiftliği&apos;ndeki merkezimizden sürdürüyoruz. Ev ve iş yerlerinin
                farklı su tüketimi, basınç ve bakım ihtiyaçlarına uygun çözümler geliştiriyoruz.
              </p>
              <p>
                Sultangazi başta olmak üzere Gaziosmanpaşa, Eyüpsultan, Bayrampaşa ve Esenler&apos;e uzanan servis ağımızla
                cihaz satışı, montaj, filtre değişimi ve arıza tespiti hizmetleri veriyoruz.
              </p>
              <p>
                Her ev ve iş yerinin ihtiyacı farklıdır. Bu nedenle su basıncı, TDS, sertlik ölçümü, tüketim ve kurulum alanını
                birlikte değerlendirerek uygun sistemi öneriyoruz.
              </p>
            </div>
            <Button asChild className="mt-8 gradient-teal text-white border-0 hover:opacity-90">
              <Link href="/iletisim">Bize Ulaşın <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "2016", label: "Kuruluş Yılı" },
              { value: "1", label: "Hizmet Noktası" },
              { value: "10+", label: "Yıllık Deneyim" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border p-6 bg-card text-center hover:border-brand-aqua/30 transition-colors">
                <p className="font-heading font-extrabold text-4xl text-brand-navy mb-2">{s.value}</p>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">Değerlerimiz</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy">
              Bizi Biz Yapan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-aqua/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-brand-aqua" />
                </div>
                <h3 className="font-heading font-semibold text-brand-navy mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

