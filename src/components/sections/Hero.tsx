"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Phone, ShieldCheck, Star, Droplets } from "lucide-react";
import { MultiStepRandevuForm } from "@/components/public/MultiStepRandevuForm";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero border-none">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      {/* Decorative circles */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-brand-aqua/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/15 backdrop-blur-sm px-3 py-1.5 text-[11px] sm:text-xs font-medium tracking-wide leading-relaxed text-center whitespace-normal sm:whitespace-nowrap">
                ⚡ Gaziosmanpaşa & Çevresi Aynı Gün Servis
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            >
              Gaziosmanpaşa{" "}
              <span className="text-brand-aqua-light">Su Arıtma</span>{" "}
              Çözümleri
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl"
            >
              İstanbul Gaziosmanpaşa ve çevre semtlerde ev, ofis ve işyeriniz için profesyonel su arıtma sistemleri.
              Uzman montaj, yıllık bakım garantisi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Button
                asChild
                size="lg"
                className="gradient-teal text-white border-0 hover:opacity-90 shadow-lg font-semibold h-12 px-6"
              >
                <Link href="/#randevu">
                  Randevu Al
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent h-12 px-6 backdrop-blur-sm"
              >
                <a href="tel:+905531142734">
                  <Phone className="mr-2 w-4 h-4" />
                  0553 114 27 34
                </a>
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-x-6 gap-y-3"
            >
              {[
                { icon: ShieldCheck, text: "2 Yıl Garanti" },
                { icon: Star, text: "500+ Mutlu Müşteri" },
                { icon: Droplets, text: "%99.9 Saflık" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/70 text-sm">
                  <Icon className="w-4 h-4 text-brand-aqua-light" />
                  {text}
                </div>
              ))}
              <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                <span className="w-4 h-4 text-amber-300 text-base leading-none">⚡</span>
                7/24 Acil Servis
              </div>
            </motion.div>
          </div>

          {/* Right – Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end py-8 lg:p-8 w-full"
            id="randevu"
          >
            <div className="w-full relative z-20 max-w-md lg:max-w-none">
              <MultiStepRandevuForm />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute -bottom-px left-0 right-0 w-full overflow-hidden">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto">
          <path d="M0 80L60 68C120 57 240 34 360 28C480 23 600 34 720 40C840 46 960 46 1080 40C1200 34 1320 23 1380 17L1440 11V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="var(--secondary)" />
        </svg>
      </div>
    </section>
  );
}

