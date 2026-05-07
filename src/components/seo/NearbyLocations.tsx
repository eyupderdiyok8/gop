"use client";

import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Neighbor {
  il: string;
  ilce: string;
  mahalle: string | null;
  slug: string;
}

export function NearbyLocations({
  neighbors,
  currentLocationName
}: {
  neighbors: Neighbor[];
  currentLocationName: string;
}) {
  if (!neighbors || neighbors.length === 0) return null;

  return (
    <section className="py-20 bg-muted/20 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-navy mb-4">
            {currentLocationName} ve Çevresindeki Hizmet Noktalarımız
          </h2>
          <p className="text-muted-foreground">
            Gaziosmanpaşa, Sultangazi, Eyüp ve tüm çevre ilçelerde aynı gün servis garantisi.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {neighbors.map((n, i) => {
            const locName = n.mahalle ? `${n.mahalle} Mahallesi` : n.ilce;
            return (
              <motion.div
                key={n.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/${n.slug}`}
                  className="group flex flex-col p-4 bg-card rounded-2xl border border-border hover:border-brand-aqua/40 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-aqua/10 flex items-center justify-center mb-3 group-hover:bg-brand-aqua/20 transition-colors">
                    <MapPin className="w-5 h-5 text-brand-aqua" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-brand-aqua transition-colors capitalize">
                    {locName}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center justify-between text-xs font-medium text-brand-aqua">
                    <span>Servis Çağır</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
