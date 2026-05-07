import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, MapPin, Heart } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Hakkımızda – SuArıtmaServis34 Gaziosmanpaşa Su Arıtma",
  description:
    "Gaziosmanpaşa ve çevre ilçelerde su arıtma çözümleri sunuyoruz. Sertifikalı ekip, güvenilir servis, kaliteli ürünler.",
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
    desc: "Gaziosmanpaşa ve çevre ilçe su şebekesini iyi biliriz. İstanbul'un yoğun kireçli suyuna yerel çözümler.",
  },
  {
    icon: Heart,
    title: "Uzun Vadeli İlişki",
    desc: "Satış sonrası bakım ve servis ile müşterilerimizle uzun dönemli ilişki kuruyoruz.",
  },
];

const team = [
  { name: "Ali Kaya", title: "Kurucu & Genel Müdür", exp: "15 yıl" },
  { name: "Murat Şahin", title: "Teknik Servis Müdürü", exp: "10 yıl" },
  { name: "Zeynep Arslan", title: "Satış & Müşteri Hizmetleri", exp: "6 yıl" },
  { name: "Can Yıldırım", title: "Baş Teknisyen", exp: "8 yıl" },
];

export default function HakkimizdaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
            ✦ 2016'dan Beri
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5">
            Hakkımızda
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Gaziosmanpaşa ve çevre ilçelerde temiz suya erişimi kolaylaştırmak için 8 yıldır çalışıyoruz.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">Hikayemiz</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy mb-6">
              Gaziosmanpaşa'ın Su Kaynağı
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                2016 yılında Gaziosmanpaşa'da küçük bir ofisle başladık. İstanbul'un yoğun kireçli su sorununu yakından gördükten sonra
                insanlara kaliteli, erişilebilir su arıtma çözümleri sunmaya karar verdik.
              </p>
              <p>
                Bugün 500'ü aşkın mutlu müşteri ve Sultangazi, Eyüp, Bağcılar'a uzanan hizmet ağımızla bölgenin en güvenilir su arıtma
                firması olmayı sürdürüyoruz. Ekibimiz çevre, sağlık ve teknolojiyi bir araya getiriyor.
              </p>
              <p>
                Her ev ve işyerinin suya olan ihtiyacı farklıdır. Bu yüzden standart paket yerine, ücretsiz su analizi
                ile size özel en doğru sistemi öneriyoruz.
              </p>
            </div>
            <Button asChild className="mt-8 gradient-teal text-white border-0 hover:opacity-90">
              <Link href="/iletisim">Bize Ulaşın <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "2016", label: "Kuruluş Yılı" },
              { value: "500+", label: "Mutlu Müşteri" },
              { value: "2", label: "Hizmet Noktası" },
              { value: "8+", label: "Yıllık Deneyim" },
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

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">Ekibimiz</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy">
              Uzman Kadromuz
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center rounded-2xl border border-border bg-card p-6 hover:border-brand-aqua/30 transition-colors">
                <div className="w-16 h-16 rounded-full gradient-navy flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-heading font-bold text-2xl">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-brand-navy">{member.name}</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-2">{member.title}</p>
                <Badge variant="outline" className="text-xs text-brand-aqua border-brand-aqua/30">
                  {member.exp} deneyim
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

