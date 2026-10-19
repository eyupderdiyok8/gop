import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

type FeaturedProduct = {
  title: string;
  /** Kısa alt başlık, fiyat içermez */
  subtitle: string;
  image?: string;
  /** Ürün tanıtım sayfası; boşsa kart "Yakında" olarak gösterilir */
  href?: string;
};

// Ana sayfadaki 4 sabit ürün. Yeni bir ürün sayfası hazır olunca ilgili
// satıra title, image ve href girmek yeterli.
const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    title: "3.2 Prada",
    subtitle: "Şeffaf kasa · 5 aşamalı filtreleme",
    image: "/images/urunler/prada-3-2.webp",
    href: "/3-2-su-aritma-cihazi",
  },
  { title: "Yeni Ürün", subtitle: "Tanıtım sayfası hazırlanıyor" },
  { title: "Yeni Ürün", subtitle: "Tanıtım sayfası hazırlanıyor" },
  { title: "Yeni Ürün", subtitle: "Tanıtım sayfası hazırlanıyor" },
];

function ProductCard({ product }: { product: FeaturedProduct }) {
  const ready = Boolean(product.href && product.image);

  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,var(--secondary)_70%)]">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        {ready ? (
          <Image
            src={product.image!}
            alt={`${product.title} su arıtma cihazı`}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-contain p-5 sm:p-8 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-navy/20">
            <Droplets className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        )}
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
            ready ? "bg-brand-aqua text-white" : "bg-brand-navy/10 text-brand-navy/50"
          )}
        >
          {ready ? "Yeni" : "Yakında"}
        </span>
      </div>

      <div className="px-1 pt-4 sm:pt-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={cn(
              "font-heading font-bold text-lg sm:text-xl leading-tight",
              ready ? "text-brand-navy group-hover:text-brand-aqua transition-colors" : "text-brand-navy/40"
            )}
          >
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{product.subtitle}</p>
        </div>
        {ready && (
          <span className="hidden sm:flex shrink-0 w-10 h-10 rounded-full gradient-teal text-white items-center justify-center shadow-md transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </>
  );

  const cardClass =
    "group block rounded-[2rem] border bg-card p-3 sm:p-4 transition-all duration-300";

  return ready ? (
    <Link
      href={product.href!}
      className={cn(cardClass, "border-brand-aqua/30 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-aqua/60")}
    >
      {body}
    </Link>
  ) : (
    <div className={cn(cardClass, "border-dashed border-border")} aria-disabled="true">
      {body}
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {FEATURED_PRODUCTS.map((product, i) => (
            <ProductCard key={product.href ?? `yakinda-${i}`} product={product} />
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
