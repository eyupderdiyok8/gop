"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MessageCircle } from "lucide-react";

export function CtaBand() {
  return (
    <section className="section-padding gradient-teal relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="container-tight relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            7/24 Yanınızdayız
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-4 leading-relaxed">
            Gaziosmanpaşa ve çevre semtlerde <strong>aynı gün servis garantisi</strong> ile hızlı çözüm sunuyoruz.
            Günde 24 saat, haftada 7 gün ulaşılabilir tek su arıtma firmasıyız.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-5 py-2 mb-8">
            <span className="text-amber-300 text-lg">⚡</span>
            <span className="text-white text-sm font-semibold">Arayan her müşteriye gün içinde dönüş yapıyoruz</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-brand-aqua hover:bg-white/90 shadow-lg font-semibold h-12 px-8"
            >
              <Link href="/#randevu">
                Randevu Al
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 bg-transparent h-12 px-8 backdrop-blur-sm"
            >
              <a href="tel:+905304794722">
                <Phone className="mr-2 w-4 h-4" />
                0530 479 47 22
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg font-semibold h-12 px-8 border-0"
            >
              <a
                href="https://wa.me/905304794722?text=Merhaba,%20su%20arıtma%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 w-4 h-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          <p className="text-white/60 text-sm mt-6">
            Aynı gün servis garantisi · 7/24 acil destek
          </p>
        </motion.div>
      </div>
    </section>
  );
}

