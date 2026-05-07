import { Badge } from "@/components/ui/badge";
import { ArrowDown, Droplets, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface HeroProps {
  title: string;
  subtitle: string;
  tdsValue?: number;
  locationName: string;
  breadcrumbs?: BreadcrumbItem[];
  imageUrl?: string;
}

export function HeroSection({ title, subtitle, tdsValue, locationName, breadcrumbs, imageUrl }: HeroProps) {
  // Generate JSON-LD for breadcrumbs if provided
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"
      },
      ...breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"}${item.url}`
      }))
    ]
  } : null;

  return (
    <section className="relative gradient-hero pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
      {breadcrumbSchema && (
        <script
          id={`breadcrumb-schema-${Math.random().toString(36).substring(7)}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="max-w-6xl mx-auto flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-white/50 mb-10 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white transition-colors flex items-center justify-center">
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
          
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={item.url} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/30" />
                {isLast ? (
                  <span className="font-medium text-white capitalize" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.url} className="hover:text-white transition-colors capitalize">
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs mx-auto flex w-fit items-center gap-2">
          📍 {locationName} Bölge Servisi
        </Badge>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl mb-6">
          {title}
        </h1>
        <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>
        
        {imageUrl && (
          <div className="relative max-w-2xl mx-auto mb-10 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-aqua/50 to-blue-500/50 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-brand-navy rounded-2xl overflow-hidden border border-white/10 shadow-2xl skew-y-1 group-hover:skew-y-0 transition-transform duration-500">
               <img 
                src={imageUrl} 
                alt={`${locationName} Su Arıtma`} 
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {tdsValue !== undefined && tdsValue > 0 && (
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mx-auto">
            <div className="w-12 h-12 rounded-full bg-brand-aqua/20 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-brand-aqua-light" />
            </div>
            <div className="text-left">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                Bölgesel Su Sertlik Durumu
              </p>
              <p className="text-white font-bold text-lg">
                <span className="text-amber-300">{tdsValue} TDS</span> Ortalama Seviye
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white/40" />
      </div>
    </section>
  );
}
