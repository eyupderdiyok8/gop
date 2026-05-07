"use client";

import { Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ServiceItem {
  id: string;
  slug: string;
  ad: string;
}

export function LocalServicesLinks({ 
  services, 
  baseUrl,
  currentServiceId
}: { 
  services: ServiceItem[]; 
  baseUrl: string;
  currentServiceId?: string;
}) {
  const filteredServices = currentServiceId 
    ? services.filter(s => s.id !== currentServiceId)
    : services;

  if (!filteredServices || filteredServices.length === 0) return null;

  return (
    <section className="py-12 bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="font-heading font-bold text-xl text-brand-navy mb-6">
          {currentServiceId ? "Diğer Hizmet Seçeneklerimiz" : "Bu Bölgedeki Hizmet Seçeneklerimiz"}
        </h3>
        <div className="flex flex-wrap gap-3">
          {filteredServices.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`${baseUrl}/${s.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted border border-border text-sm font-medium text-foreground hover:border-brand-aqua hover:bg-brand-aqua/5 transition-colors group"
              >
                <Wrench className="w-4 h-4 text-brand-aqua" />
                {s.ad}
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
