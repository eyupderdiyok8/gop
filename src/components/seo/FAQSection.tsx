"use client";

import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

interface Props {
  faqs: FAQ[];
  locationName: string;
}

export function FAQSection({ faqs, locationName }: Props) {
  if (!faqs || faqs.length === 0) return null;

  // Generate JSON-LD
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
      {/* Inject FAQ Schema */}
      <script
        id={`faq-schema-${locationName}`}
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
            <Disclosure key={index}>
              {({ open }) => (
                <div className={`rounded-xl border transition-colors ${open ? 'border-brand-aqua bg-brand-aqua/5' : 'border-border bg-card hover:border-brand-aqua/40'}`}>
                  <Disclosure.Button className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none">
                    <span className="font-semibold text-foreground pr-4 font-heading">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-brand-aqua transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed prose prose-teal">
                      <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
