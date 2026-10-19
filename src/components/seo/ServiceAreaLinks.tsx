import Link from "next/link";
import { MapPin } from "lucide-react";
import { SERVICE_DISTRICTS, districtUrl } from "@/lib/seo/serviceAreas";
import { isCoreService } from "@/lib/seo/indexPolicy";

// Ana sayfa ve hizmet sayfalarından ilçe sayfalarına iç link verir.
// serviceSlug ana hizmetlerden biriyse linkler ilçe × hizmet sayfalarına gider.
export function ServiceAreaLinks({
  serviceSlug,
  serviceTitle,
}: {
  serviceSlug?: string;
  serviceTitle?: string;
}) {
  const linksToService = isCoreService(serviceSlug);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-navy mb-3">
          {serviceTitle ? `${serviceTitle} Hizmet Bölgelerimiz` : "Hizmet Bölgelerimiz"}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Sultançiftliği&apos;ndeki merkezimizden İstanbul Avrupa Yakası&apos;nda aşağıdaki ilçelere düzenli servis veriyoruz.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SERVICE_DISTRICTS.map((d) => (
            <Link
              key={d.slug}
              href={districtUrl(d.slug, serviceSlug)}
              className="group flex items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-brand-aqua/40 hover:shadow-md transition-all"
            >
              <MapPin className="w-4 h-4 text-brand-aqua flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground group-hover:text-brand-aqua transition-colors">
                {d.name} {linksToService && serviceTitle ? serviceTitle : "Su Arıtma"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
