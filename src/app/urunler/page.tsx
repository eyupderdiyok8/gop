import { createClient } from "@/lib/supabase/server";
import { Product, ProductCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ProductListClient } from "@/components/public/urunler/ProductListClient";
import { CtaBand } from "@/components/sections/CtaBand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Su Arıtma Cihazları | Sultangazi ve İstanbul Avrupa Yakası",
  description: "Ev, ofis ve iş yerleri için su arıtma cihazlarını inceleyin. Sultangazi merkezli montaj, filtre değişimi ve teknik servis desteği.",
  alternates: {
    canonical: "/urunler",
  },
};

// Sayfanın periyodik olarak güncellenmesini sağla (1 saat)
export const revalidate = 3600;

export default async function UrunlerPage() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("display_order");
    
  const { data: products } = await supabase
    .from("products")
    .select("*, category:product_categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
            Sultangazi Merkezli Montaj ve Servis
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-6 tracking-tight">
            Akıllı Su Teknolojileri <br/> <span className="text-brand-aqua">Ürün Kataloğu</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Sultangazi ve İstanbul Avrupa Yakası&apos;nda ihtiyacınıza uygun cihaz seçimi, profesyonel montaj ve periyodik bakım desteği.
          </p>
          
          <ProductListClient 
            initialProducts={(products || []) as (Product & { category: ProductCategory | null })[]}
            categories={(categories || []) as ProductCategory[]}
          />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
