import { ChevronDown } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

interface Props {
  faqs: FAQ[];
  locationName: string;
}

// Cevaplar <details> içinde HTML'de her zaman bulunur; böylece arama motorları kapalı
// sorulardaki metni de görür ve FAQPage şeması görünür içerikle örtüşür.
export function FAQSection({ faqs, locationName }: Props) {
  if (!faqs || faqs.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-brand-navy mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-muted-foreground">
            {locationName} bölgesi için müşterilerimizden gelen en yaygın sorular.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-border bg-card transition-colors hover:border-brand-aqua/40 open:border-brand-aqua open:bg-brand-aqua/5"
            >
              <summary className="flex w-full cursor-pointer list-none items-center justify-between px-6 py-5 text-left focus:outline-none [&::-webkit-details-marker]:hidden">
                <span className="font-semibold text-foreground pr-4 font-heading">{faq.q}</span>
                <ChevronDown className="h-5 w-5 text-brand-aqua transition-transform duration-300 flex-shrink-0 group-open:rotate-180" />
              </summary>
              <div
                className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed prose prose-teal"
                dangerouslySetInnerHTML={{ __html: faq.a }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
