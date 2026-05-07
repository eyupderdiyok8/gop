import { createClient } from "@/lib/supabase/server";
import { Product, ProductCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ProductListClient } from "@/components/public/urunler/ProductListClient";
import { CtaBand } from "@/components/sections/CtaBand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Kataloğu – Su Arıtma Cihazları Gaziosmanpaşa & İstanbul",
  description: "Ev, ofis ve endüstriyel su arıtma çözümleri. En iyi fiyatlar, ücretsiz montaj ve 2 yıl garantili ürünlerimizi inceleyin.",
};

// Sayfanın her zaman güncel kalmasını sağla (veya belirli bir süre cache'le)
export const revalidate = 0;

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
            ✦ %100 NSF Onaylı & Garantili
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white mb-6 tracking-tight">
            Akıllı Su Teknolojileri <br/> <span className="text-brand-aqua">Ürün Kataloğu</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Gaziosmanpaşa ve çevre ilçelerde en iyi fiyat garantisi ve profesyonel montaj desteğiyle sağlıklı suya kavuşun.
          </p>
          
          <ProductListClient 
            initialProducts={(products || []) as any} 
            categories={categories || []} 
          />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
