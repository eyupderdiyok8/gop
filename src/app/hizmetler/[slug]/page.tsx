import { notFound } from "next/navigation";
import { SERVICES_DATA } from "@/lib/constants/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  ArrowRight,
  Phone,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Droplets,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { FAQSection } from "@/components/seo/FAQSection";
import { CtaBand } from "@/components/sections/CtaBand";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) return { title: "Hizmet Bulunamadı" };

  return {
    title: `${service.title} | SuArıtmaServis34 Gaziosmanpaşa`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) notFound();

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative gradient-hero pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/50 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/hizmetler" className="hover:text-white transition-colors">Hizmetler</Link>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <span className="text-white font-medium">{service.badge}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
                ✦ Uzman {service.badge} Hizmeti
              </Badge>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-white/80 text-lg sm:text-xl max-w-xl leading-relaxed mb-10">
                {service.shortDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gradient-teal text-white border-0 h-14 px-8 shadow-xl">
                  <Link href="/iletisim">Hemen Teklif Al <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white bg-transparent h-14 px-8 hover:bg-white/10">
                  <a href="tel:+905304794722"><Phone className="mr-2 w-4 h-4" /> Bizi Arayın</a>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative aspect-square rounded-[3rem] bg-gradient-to-br from-brand-aqua/20 to-blue-500/10 border border-white/10 p-8 flex items-center justify-center">
                <div className="w-48 h-48 rounded-3xl gradient-teal shadow-2xl flex items-center justify-center animate-float">
                  <Icon className="w-24 h-24 text-white" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-4 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-brand-aqua" />
                </div>
                <div className="absolute bottom-1/4 -right-4 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-brand-aqua" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left side: Detailed Info */}
            <div className="lg:col-span-8 space-y-12">
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-navy mb-6">Hizmet Detayları</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {service.longDesc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="w-8 h-8 rounded-full bg-brand-aqua/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-brand-aqua" />
                      </div>
                      <span className="text-sm font-medium text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.benefits.map((benefit, i) => {
                  const BIcon = benefit.icon;
                  return (
                    <div key={i} className="p-6 rounded-3xl bg-card border border-border hover:shadow-lg transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-brand-aqua/10 flex items-center justify-center mb-6 group-hover:bg-brand-aqua transition-colors duration-300">
                        <BIcon className="w-6 h-6 text-brand-aqua group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-heading font-bold text-brand-navy mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side: Contact Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
              <div className="bg-brand-navy rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-aqua/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-xl font-heading font-bold mb-4 relative z-10">Bölge Servis Hattı</h3>
                <p className="text-white/60 text-sm mb-8 relative z-10">
                  Gaziosmanpaşa ve tüm çevre ilçelerde 7/24 Teknik Destek ve Hemen bizi arayın.
                </p>
                <div className="space-y-4 relative z-10">
                  <a href="tel:+905304794722" className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-brand-aqua transition-all group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg">0530 479 47 22</span>
                  </a>
                  <a href="https://wa.me/905304794722" className="flex items-center gap-4 p-4 bg-[#25D366]/10 rounded-2xl hover:bg-[#25D366] transition-all group">
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center group-hover:bg-white/20">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold">WhatsApp Destek</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular Section */}
      <section className="py-24 bg-muted/20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <FAQSection faqs={service.faqs} locationName={service.title} />
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
