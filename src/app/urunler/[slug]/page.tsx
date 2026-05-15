import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Check,
   ChevronLeft,
   MessageCircle,
   ShieldCheck,
   Zap,
   Droplets,
   Settings,
   Star,
   Truck,
   ArrowRight
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";

interface ProductPageProps {
   params: Promise<{ slug: string }>;
}

const iconMap: Record<string, any> = {
   zap: Zap,
   shield: ShieldCheck,
   droplet: Droplets,
   settings: Settings,
};

// Sayfanın güncel kalmasını sağla
export const revalidate = 0;

export default async function ProductDetailPage({ params }: ProductPageProps) {
   const { slug } = await params;
   const supabase = await createClient();
   const { data: product } = await supabase
      .from("products")
      .select("*, category:product_categories(*)")
      .eq("slug", slug)
      .single();

   if (!product) notFound();

   const features = product.features || [];
   const gallery = [product.main_image, ...(product.gallery || [])].filter(Boolean);

   return (
      <div className="bg-background min-h-screen">
         {/* Top Navigation / Breadcrumb */}
         <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
               <Link href="/urunler" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-aqua transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Tüm Ürünler
               </Link>
               <div className="hidden sm:flex items-center gap-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{product.category?.name}</span>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-xs font-bold text-brand-navy truncate max-w-[200px]">{product.name}</span>
               </div>
               <Button asChild size="sm" className="gradient-teal text-white border-0">
                  <a href={`https://wa.me/905531142734?text=Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`}>
                     Hızlı Teklif
                  </a>
               </Button>
            </div>
         </div>

         <main className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                  {/* Left: Gallery */}
                  <div className="space-y-6">
                     <div className="aspect-square rounded-[3rem] overflow-hidden bg-muted border border-border group relative">
                        <img
                           src={product.main_image || "https://placeholder.com/800x800"}
                           alt={product.name}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-8 left-8 flex flex-col gap-2">
                           {product.is_highlight && (
                              <Badge className="bg-amber-500 text-white border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                                 Günün Fırsatı
                              </Badge>
                           )}
                           {product.badge && (
                              <Badge className={`${product.badge_color || 'bg-brand-aqua'} text-white border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg`}>
                                 {product.badge}
                              </Badge>
                           )}
                        </div>
                     </div>

                     {gallery.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                           {gallery.map((img: string, i: number) => (
                              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border cursor-pointer hover:border-brand-aqua transition-all">
                                 <img src={img} alt={`${product.name} - ${i}`} className="w-full h-full object-cover" />
                              </div>
                           ))}
                        </div>
                     )}

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-2xl border border-border flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                              <Truck className="w-5 h-5 text-brand-aqua" />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-brand-navy">Ücretsiz Montaj</p>
                              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Tüm İstanbul</p>
                           </div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-2xl border border-border flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                              <ShieldCheck className="w-5 h-5 text-brand-aqua" />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-brand-navy">2 Yıl Garanti</p>
                              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Yerinde Servis Destekli</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right: Info */}
                  <div className="flex flex-col">
                     <div className="mb-8">
                        <span className="text-xs font-black text-brand-aqua uppercase tracking-[0.3em] mb-3 block">
                           {product.category?.name}
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-brand-navy mb-4 tracking-tight leading-tight">
                           {product.name}
                        </h1>
                        <p className="text-xl text-muted-foreground italic leading-relaxed">
                           {product.tagline}
                        </p>

                        <div className="flex items-center gap-2 mt-6">
                           <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                           </div>
                           <span className="text-sm font-bold text-brand-navy">5.0</span>
                           <span className="text-sm text-muted-foreground">(240+ Müşteri Memnuniyeti)</span>
                        </div>
                     </div>

                     <div className="p-8 rounded-[2.5rem] bg-brand-navy text-white mb-10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-aqua/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                           <div className="flex items-baseline gap-3 mb-6">
                              <span className="text-4xl font-black">
                                 {product.price ? `₺${product.price.toLocaleString('tr-TR')}` : 'Teklif Al'}
                              </span>
                              {product.old_price && (
                                 <span className="text-xl text-white/30 line-through">₺{product.old_price.toLocaleString('tr-TR')}</span>
                              )}
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Button asChild size="lg" className="w-full bg-brand-aqua hover:bg-brand-aqua text-white border-0 h-14 rounded-2xl font-bold">
                                 <a href={`https://wa.me/905531142734?text=Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`}>
                                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp'tan Sor
                                 </a>
                              </Button>
                              <Button asChild size="lg" className="w-full border border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white h-14 rounded-2xl font-bold shadow-none">
                                 <Link href="/iletisim">Fiyat Teklifi İste</Link>
                              </Button>
                           </div>

                           <p className="text-[10px] text-white/40 text-center mt-6 uppercase tracking-widest font-bold">
                              Kredi Kartına 9 Taksit İmkanı • Ücretsiz Kurulum Dahil
                           </p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-sm font-bold text-brand-navy uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-brand-aqua" /> Öne Çıkan Özellikler
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                           {product.specs?.map((spec: string, i: number) => (
                              <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                 <div className="w-5 h-5 rounded-lg bg-brand-aqua/10 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-brand-aqua" />
                                 </div>
                                 {spec}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>

               {/* Detailed Features Cards */}
               {features.length > 0 && (
                  <section className="py-24 border-t border-border mt-24">
                     <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4 text-brand-aqua border-brand-aqua/20">Teknoloji & Konfor</Badge>
                        <h2 className="text-3xl font-heading font-extrabold text-brand-navy">Neden {product.name}?</h2>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f: any, i: number) => {
                           const Icon = iconMap[f.icon] || Droplets;
                           return (
                              <div key={i} className="p-8 rounded-[2rem] bg-muted/30 border border-border group hover:bg-white hover:shadow-xl hover:border-brand-aqua/20 transition-all duration-500">
                                 <div className="w-14 h-14 rounded-2xl gradient-teal text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                    <Icon className="w-8 h-8" />
                                 </div>
                                 <h4 className="text-xl font-heading font-black text-brand-navy mb-3">{f.title}</h4>
                                 <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                              </div>
                           );
                        })}
                     </div>
                  </section>
               )}

               {/* Description & Specs Table */}
               <section className="py-24 border-t border-border">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                     <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-2xl font-heading font-extrabold text-brand-navy">Ürün Hakkında Detaylı Bilgi</h3>
                        <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
                           {product.description?.split('\n').map((line: string, i: number) => (
                              <p key={i} className="mb-4">{line}</p>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="p-8 rounded-[2rem] bg-brand-navy text-white">
                           <h3 className="text-xl font-heading font-bold mb-6">Teknik Tablo</h3>
                           <div className="space-y-4">
                              {product.specs?.map((spec: string, i: number) => {
                                 const [label, val] = spec.includes(':') ? spec.split(':') : [spec, ''];
                                 return (
                                    <div key={i} className="flex flex-col pb-3 border-b border-white/10 last:border-0 last:pb-0">
                                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
                                       <span className="text-sm font-medium mt-1">{val || '✓'}</span>
                                    </div>
                                 )
                              })}
                           </div>
                        </div>

                        <div className="p-8 rounded-[2rem] border border-dashed border-border text-center">
                           <Droplets className="w-10 h-10 text-brand-aqua mx-auto mb-4" />
                           <h4 className="font-bold text-brand-navy mb-2 text-sm">Destek Lazım mı?</h4>
                           <p className="text-xs text-muted-foreground mb-6">Hangi cihazın size uygun olduğuna karar veremediyseniz uzman ekibimizden yardım alabilirsiniz.</p>
                           <Button asChild variant="link" className="text-brand-aqua font-black">
                              <Link href="/iletisim">Bize Danışın <ArrowRight className="ml-2 w-4 h-4" /></Link>
                           </Button>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         </main>

         <CtaBand />
      </div>
   );
}
