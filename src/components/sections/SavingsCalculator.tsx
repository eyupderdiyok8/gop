"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, Droplets, Users, Calculator, ChevronRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DAMACANA_FIYAT = 180; // ₺ per 19L
const DAMACANA_LITRE = 19;
const YILLIK_BAKIM = 1500; // ₺ yıllık filtre/bakım maliyeti tahmini
const DEFAULT_MAKINE_FIYAT = 10000;

export function SavingsCalculator() {
  const [kisi, setKisi] = useState(4);
  const [litre, setLitre] = useState(2); // günlük kişi başı litre
  const [makineFiyat, setMakineFiyat] = useState(10000);
  const [carboyPrice, setCarboyPrice] = useState(180);
  const [maintenancePrice, setMaintenancePrice] = useState(1500);
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        // Fetch specific settings
        const { data: settings } = await supabase.from("site_settings").select("*");
        if (settings) {
          settings.forEach(s => {
            const val = Number(s.value);
            if (isNaN(val)) return;
            if (s.key === "carboy_price") setCarboyPrice(val);
            if (s.key === "maintenance_price") setMaintenancePrice(val);
          });
        }

        // Device price always from inventory
        const { data: invData } = await supabase
          .from("inventory")
          .select("birim_fiyat")
          .eq("kategori", "Su Arıtma Cihazı")
          .gt("birim_fiyat", 0)
          .order("birim_fiyat", { ascending: false })
          .limit(1);

        if (invData && invData.length > 0) {
          setMakineFiyat(Number(invData[0].birim_fiyat));
        }
      } catch {
        // fallbacks
      } finally {
        setLoadingPrice(false);
      }
    })();
  }, []);

  // Hesaplamalar
  const gunlukTuketim = kisi * litre; // litre/gün
  const aylikTuketim = gunlukTuketim * 30;
  const aylikDamacana = Math.ceil(aylikTuketim / DAMACANA_LITRE);
  const aylikMaliyet = aylikDamacana * carboyPrice;
  const yillikMaliyet = aylikMaliyet * 12;
  const yillikBakimValue = maintenancePrice;
  const yillikNetMaliyet = yillikMaliyet; // damacana maliyeti
  const amortisman = makineFiyat / (aylikMaliyet - yillikBakimValue / 12); // ay
  const besYillikTasarruf = yillikNetMaliyet * 5 - makineFiyat - yillikBakimValue * 5;

  const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Dekoratif arka plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-aqua/5 blur-3xl translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl -translate-x-1/3 translate-y-1/2" />
      </div>

      <div className="container-tight relative">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">
            Tasarruf Analizi
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Damacana Yerine Su Arıtma:{" "}
            <span className="text-brand-aqua">Ne Kadar Kazanırsınız?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hane bilgilerinizi girin; kaç ayda amortismana ulaşacağınızı ve 5 yılda
            ne kadar tasarruf edeceğinizi anında hesaplayalım.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Hesaplayıcı Formu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 space-y-8"
          >
            <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-aqua" />
              Bilgilerinizi Girin
            </h3>

            {/* Kişi sayısı */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-aqua" /> Hane Kişi Sayısı
                </label>
                <span className="text-2xl font-bold text-brand-aqua">{kisi}</span>
              </div>
              <input
                type="range"
                min={1} max={10} step={1}
                value={kisi}
                onChange={(e) => setKisi(Number(e.target.value))}
                className="w-full cursor-pointer accent-brand-aqua"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 kişi</span><span>10 kişi</span>
              </div>
            </div>

            {/* Günlük tüketim */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-brand-aqua" /> Kişi Başı Günlük Su (L)
                </label>
                <span className="text-2xl font-bold text-brand-aqua">{litre}L</span>
              </div>
              <input
                type="range"
                min={1} max={5} step={0.5}
                value={litre}
                onChange={(e) => setLitre(Number(e.target.value))}
                className="w-full cursor-pointer accent-brand-aqua"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 L</span><span>5 L</span>
              </div>
            </div>

            {/* Referans bilgiler */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-xs text-muted-foreground border border-border">
              <p className="flex justify-between">
                <span>Damacana fiyatı (19L)</span>
                <strong className="text-foreground">{carboyPrice} ₺</strong>
              </p>
              <p className="flex justify-between">
                <span>Cihaz fiyatı</span>
                <strong className="text-foreground">
                  {loadingPrice ? "Yükleniyor..." : `${fmt(makineFiyat)} ₺`}
                </strong>
              </p>
              <p className="flex justify-between">
                <span>Yıllık bakım/filtre tahmini</span>
                <strong className="text-foreground">{fmt(yillikBakimValue)} ₺</strong>
              </p>

            </div>
          </motion.div>

          {/* Sonuçlar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Aylık maliyet kartları */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2">Aylık Damacana Harcamanız</p>
                <p className="text-3xl font-bold text-red-600">{fmt(aylikMaliyet)} ₺</p>
                <p className="text-xs text-red-400 mt-1">{aylikDamacana} damacana / ay</p>
              </div>
              <div className="bg-brand-aqua/10 border border-brand-aqua/20 rounded-2xl p-5">
                <p className="text-xs font-medium text-brand-aqua uppercase tracking-wide mb-2">Cihazla Aylık Maliyet</p>
                <p className="text-3xl font-bold text-brand-aqua">{fmt(yillikBakimValue / 12)} ₺</p>
                <p className="text-xs text-brand-aqua mt-1">sadece bakım/filtre</p>
              </div>
            </div>

            {/* Amortisman */}
            <div className="bg-gradient-to-br from-brand-navy to-[#1a3a4a] rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm uppercase tracking-wide font-medium">Geri Ödeme Süresi</p>
                  <p className="text-5xl font-extrabold font-heading mt-1">
                    {amortisman > 0 && isFinite(amortisman)
                      ? `${Math.ceil(amortisman)} ay`
                      : "—"}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-8 h-8 text-brand-aqua" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/50 text-xs">Yıllık tasarruf</p>
                  <p className="text-xl font-bold text-brand-aqua mt-1">
                    {fmt(yillikMaliyet - yillikBakimValue)} ₺
                  </p>
                </div>
                <div>
                  <p className="text-white/50 text-xs">5 yılda net kazanç</p>
                  <p className={`text-xl font-bold mt-1 ${besYillikTasarruf > 0 ? "text-brand-aqua" : "text-white/60"}`}>
                    {besYillikTasarruf > 0 ? `${fmt(besYillikTasarruf)} ₺` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Güvenlik notu */}
            <div className="flex items-start gap-3 text-xs text-muted-foreground bg-muted/40 border border-border rounded-xl p-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-aqua" />
              <p>
                Hesaplama damacana fiyatı, kişi başı su tüketimi ve tahmini bakım maliyetleri ({fmt(yillikBakimValue)} ₺) baz alınarak yapılmıştır.
                Gerçek değerler farklılık gösterebilir. Fiyat teklifi için bizi arayın.
              </p>
            </div>

            {/* CTA */}
            <a
              href="/iletisim"
              className="flex items-center justify-between w-full bg-brand-aqua hover:bg-brand-aqua text-white rounded-2xl px-6 py-4 font-semibold transition group"
            >
              <span>Fiyat Teklifi Al</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
