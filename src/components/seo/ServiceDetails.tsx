import { CheckCircle2 } from "lucide-react";
import type { ServiceDetail } from "@/lib/constants/services";

// Bölge × hizmet sayfalarında hizmete özel açıklama, kapsam ve avantajları gösterir.
export function ServiceDetails({ detail, locationName }: { detail: ServiceDetail; locationName: string }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-navy mb-4">
          {locationName} {detail.title}: Hizmet Kapsamı
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-4xl">{detail.longDesc}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="font-heading font-bold text-lg text-brand-navy mb-4">Neler Yapıyoruz?</h3>
            <ul className="space-y-3">
              {detail.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-brand-aqua flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {detail.benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-brand-aqua/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-aqua" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-brand-navy mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
