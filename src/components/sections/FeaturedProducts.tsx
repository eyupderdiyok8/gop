import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Droplets, Check } from "lucide-react";

export async function FeaturedProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:product_categories(*)")
    .eq("is_active", true)
    .eq("is_highlight", true)
    .limit(3)
    .order("created_at", { ascending: false });

  if (!products || products.length === 0) return null;

  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-aqua font-semibold text-sm uppercase tracking-widest mb-3">
            Öne Çıkan Ürünler
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-navy mb-4">
            İhtiyacınıza Özel Sistem
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Ev, ofis veya küçük işletme — herkes için doğru arıtma sistemi burada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={`rounded-[2.5rem] border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                product.is_highlight
                  ? "border-brand-aqua/40 shadow-lg ring-1 ring-brand-aqua/20 bg-brand-aqua/[0.02]"
                  : "border-border bg-card"
              }`}
            >
              <div className="relative group/card overflow-hidden">
                {/* Product Image Section */}
                <div className={`relative aspect-[4/3] overflow-hidden ${product.is_highlight ? "gradient-navy" : "bg-muted"}`}>
                  <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
                  {product.main_image ? (
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                       <Droplets className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Icon & Badge Overlay */}
                  <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-brand-aqua" />
                    </div>
                    {product.badge && (
                      <Badge className={`text-[10px] font-bold border-0 uppercase tracking-tighter ${product.badge_color || 'bg-brand-aqua text-white'}`}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <span className="text-[10px] font-black text-brand-aqua uppercase tracking-[0.2em] mb-1 block">
                      {product.category?.name}
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-brand-navy mb-2 group-hover:text-brand-aqua transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium text-brand-aqua italic mb-4">
                      {product.tagline}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {product.specs?.slice(0, 4).map((spec: string, i: number) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-brand-aqua flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="font-heading font-extrabold text-2xl text-brand-navy">
                        {product.price ? `₺${product.price.toLocaleString('tr-TR')}` : 'Teklif Al'}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Montaj Dahil</p>
                    </div>
                    <Button
                      asChild
                      className="rounded-full w-12 h-12 p-0 gradient-teal text-white border-0 hover:scale-110 transition-transform shadow-lg"
                    >
                      <Link href={`/urunler/${product.slug}`}>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="rounded-2xl px-8 border-brand-navy/10 hover:border-brand-aqua/40 hover:bg-brand-aqua/5">
            <Link href="/urunler">
              Tüm Ürünleri Gör
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
