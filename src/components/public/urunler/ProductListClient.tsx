"use client";

import { useState } from "react";
import { Product, ProductCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Droplets } from "lucide-react";
import Link from "next/link";

interface ProductListClientProps {
  initialProducts: (Product & { category: ProductCategory | null })[];
  categories: ProductCategory[];
}

export function ProductListClient({ initialProducts, categories }: ProductListClientProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredProducts = activeTab === "all" 
    ? initialProducts 
    : initialProducts.filter(p => p.category_id === activeTab);

  return (
    <>
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
         <button
           onClick={() => setActiveTab("all")}
           className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
             activeTab === "all" 
             ? "bg-brand-aqua text-white border-brand-aqua" 
             : "bg-white/5 border-white/10 text-white/60 hover:text-white"
           }`}
         >
           Tüm Ürünler
         </button>
         {categories.map(cat => (
           <button
             key={cat.id}
             onClick={() => setActiveTab(cat.id)}
             className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
               activeTab === cat.id 
               ? "bg-brand-aqua text-white border-brand-aqua" 
               : "bg-white/5 border-white/10 text-white/60 hover:text-white"
             }`}
           >
             {cat.name}
           </button>
         ))}
      </div>

      {/* Product Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-aqua/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
               <Droplets className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
               <p className="text-muted-foreground font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/urunler/${product.slug}`}
                  className={`group relative flex flex-col rounded-[2.5rem] border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                    product.is_highlight ? "border-brand-aqua/30 bg-brand-aqua/[0.02]" : "border-border bg-card"
                  }`}
                >
                  {/* Image Area */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.main_image ? (
                      <img 
                        src={product.main_image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                        <Droplets className="w-16 h-16" />
                      </div>
                    )}
                    
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start pointer-events-none">
                      {product.is_highlight && (
                        <Badge className="bg-amber-500 text-white border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                          Günün Fırsatı
                        </Badge>
                      )}
                      {product.badge && (
                        <Badge className={`${product.badge_color || 'bg-brand-aqua'} text-white border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider`}>
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <span className="text-[10px] font-black text-brand-aqua uppercase tracking-[0.2em] mb-1 block">
                        {product.category?.name}
                      </span>
                      <h3 className="text-2xl font-heading font-bold text-brand-navy mb-2 group-hover:text-brand-aqua transition-colors leading-tight text-brand-navy">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        {product.tagline}
                      </p>
                    </div>

                    <ul className="space-y-2.5 mb-8 flex-1">
                      {product.specs?.slice(0, 4).map((spec, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-5 h-5 rounded-full bg-brand-aqua/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-brand-aqua" />
                          </div>
                          {spec}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-border mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-widest">Peşin Fiyatına</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-brand-navy">
                            {product.price ? `₺${product.price.toLocaleString('tr-TR')}` : 'Fiyat Sorun'}
                          </span>
                          {product.old_price && (
                             <span className="text-sm text-muted-foreground/50 line-through">₺{product.old_price.toLocaleString('tr-TR')}</span>
                          )}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full gradient-teal text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all opacity-100 group-hover:opacity-100">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
