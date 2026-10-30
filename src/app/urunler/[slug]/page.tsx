import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Product, ProductCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Zap, Droplets, Settings, ArrowRight, Phone, type LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { ProductImageGallery } from "@/components/public/urunler/ProductImageGallery";
import { formatTechnicalText } from "@/lib/products/formatTechnicalText";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com";
const PHONE = "0553 114 27 34";
const TEL = "tel:+905531142734";
const waLink = (productName: string) =>
  "https://wa.me/905531142734?text=" + encodeURIComponent(`Merhaba, ${productName} ürünü hakkında bilgi almak istiyorum.`);

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, tagline, description, main_image, meta_title, meta_description, category:product_categories(name)")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Ürün Bulunamadı" };

  const category = product.category as { name: string } | { name: string }[] | null;
  const categoryName = category ? (Array.isArray(category) ? category[0]?.name : category.name) : undefined;
  const productName = formatTechnicalText(product.name);
  // Panelde girilen SEO başlığı ve açıklaması öncelikli
  const title = product.meta_title || `${productName} – ${categoryName || "Su Arıtma Cihazı"}`;
  const description =
    product.meta_description ||
    product.tagline ||
    product.description?.slice(0, 160) ||
    `${productName} su arıtma cihazı. Sultangazi merkezli montaj ve servis desteği.`;

  return {
    title,
    description,
    openGraph: {
      title: `${productName} – SuArıtmaServis34`,
      description,
      images: product.main_image ? [{ url: product.main_image, width: 1200, height: 1200, alt: productName }] : [],
    },
    alternates: { canonical: `/urunler/${slug}` },
  };
}

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shield: ShieldCheck,
  droplet: Droplets,
  settings: Settings,
};

/** "Etiket: değer" biçimindeki teknik satırı ikiye ayırır */
function splitSpec(spec: string) {
  const text = formatTechnicalText(spec);
  const i = text.indexOf(":");
  return i === -1 ? { label: text, value: "" } : { label: text.slice(0, i).trim(), value: text.slice(i + 1).trim() };
}

// Sayfanın periyodik olarak güncellenmesini sağla (1 saat)
export const revalidate = 3600;

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*, category:product_categories(*)").eq("slug", slug).single();
  if (!data) notFound();
  const product = data as Product & { category: ProductCategory | null };
  // Kendi tanıtım sayfası olan ürün oraya yönlenir (aynı içeriğin iki adresi olmasın)
  if (product.page_url?.startsWith("/")) redirect(product.page_url);

  // Aynı kategoriden diğer ürünler (iç bağlantı)
  const { data: relatedData } = product.category_id
    ? await supabase
        .from("products")
        .select("*")
        .eq("category_id", product.category_id)
        .eq("is_active", true)
        .neq("id", product.id)
        .limit(4)
    : { data: [] };
  const related = (relatedData ?? []) as Product[];

  const features = product.features || [];
  const specs = product.specs || [];
  const gallery = [product.main_image, ...(product.gallery || [])].filter(Boolean) as string[];
  const productName = formatTechnicalText(product.name);
  const highlights = specs.slice(0, 6).map(splitSpec);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: product.meta_description || product.tagline || product.description?.slice(0, 300) || undefined,
    image: gallery.length ? gallery : undefined,
    category: product.category?.name,
    url: `${SITE_URL}/urunler/${product.slug}`,
    brand: { "@type": "Brand", name: "SuArıtmaServis34" },
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "TRY",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/urunler/${product.slug}`,
          },
        }
      : {}),
  };

  return (
    <div className="bg-background min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      {/* Sabit menünün altında içerik haritası */}
      <div className="pt-20 lg:pt-24">
        <BreadcrumbNav items={[{ name: "Ürünler", url: "/urunler" }, { name: productName, url: `/urunler/${product.slug}` }]} />
      </div>

      <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Görseller */}
            <ProductImageGallery product={product} gallery={gallery} />

            {/* Bilgi ve iletişim */}
            <div className="flex flex-col">
              {product.category?.name && (
                <span className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-aqua">{product.category.name}</span>
              )}
              <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-navy sm:text-4xl lg:text-5xl">
                {productName}
              </h1>
              {product.tagline && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{product.tagline}</p>}

              {highlights.length > 0 && (
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-aqua/10">
                        <Check className="h-3 w-3 text-brand-aqua" />
                      </span>
                      <span>
                        {h.value ? (
                          <>
                            <span className="text-muted-foreground">{h.label}:</span> <span className="font-medium">{h.value}</span>
                          </>
                        ) : (
                          h.label
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 rounded-[2rem] bg-brand-navy p-6 text-white shadow-xl sm:p-8">
                <div className="flex items-baseline gap-3">
                  {product.price ? (
                    <>
                      <span className="text-3xl font-black sm:text-4xl">₺{product.price.toLocaleString("tr-TR")}</span>
                      {product.old_price && (
                        <span className="text-lg text-white/40 line-through">₺{product.old_price.toLocaleString("tr-TR")}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold sm:text-3xl">Fiyat bilgisi için arayın</span>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
                  <ShieldCheck className="h-4 w-4 text-brand-aqua" /> Sultangazi merkezli montaj ve servis desteği
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button asChild size="lg" className="h-13 w-full rounded-2xl border-0 bg-brand-aqua font-bold text-white hover:bg-brand-aqua/85">
                    <a href={waLink(productName)} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon className="mr-2 h-5 w-5" /> WhatsApp&apos;tan Sor
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="h-13 w-full rounded-2xl border border-white/20 bg-transparent font-bold text-white shadow-none hover:bg-white/10 hover:text-white"
                  >
                    <a href={TEL}>
                      <Phone className="mr-2 h-4 w-4" /> {PHONE}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Öne çıkan özellik kartları */}
          {features.length > 0 && (
            <section className="mt-20 border-t border-border pt-16">
              <div className="mb-12 text-center">
                <Badge variant="outline" className="mb-4 border-brand-aqua/20 text-brand-aqua">
                  Teknoloji & Konfor
                </Badge>
                <h2 className="font-heading text-3xl font-extrabold text-brand-navy">Neden {productName}?</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {features.map((f, i) => {
                  const Icon = iconMap[f.icon] || Droplets;
                  return (
                    <div key={i} className="rounded-[2rem] border border-border bg-muted/30 p-7">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl gradient-teal text-white shadow-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 font-heading text-lg font-bold text-brand-navy">{f.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Açıklama ve teknik özellikler */}
          {(product.description || specs.length > 0) && (
            <section className="mt-20 grid grid-cols-1 gap-12 border-t border-border pt-16 lg:grid-cols-3">
              {product.description && (
                <div className={specs.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
                  <h2 className="mb-6 font-heading text-2xl font-extrabold text-brand-navy">Ürün Hakkında</h2>
                  <div className="space-y-4 leading-relaxed text-muted-foreground">
                    {product.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                  </div>
                </div>
              )}

              {specs.length > 0 && (
                <div className={product.description ? "" : "lg:col-span-3"}>
                  <h2 className="mb-6 font-heading text-2xl font-extrabold text-brand-navy">Teknik Özellikler</h2>
                  <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                    {specs.map(splitSpec).map((s, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 px-5 py-3 text-sm odd:bg-muted/30">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="text-right font-medium text-brand-navy">{s.value || <Check className="ml-auto h-4 w-4 text-brand-aqua" />}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </section>
          )}

          {/* Benzer ürünler */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-border pt-16">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="font-heading text-2xl font-extrabold text-brand-navy">Benzer Ürünler</h2>
                <Link href="/urunler" className="flex items-center gap-1 text-sm font-semibold text-brand-aqua hover:underline">
                  Tüm ürünler <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={r.page_url || `/urunler/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-square bg-white">
                      {r.main_image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- ürün görselleri Supabase'ten, optimize edilmeden sunuluyor
                        <img src={r.main_image} alt={formatTechnicalText(r.name)} loading="lazy" className="h-full w-full object-contain p-5" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground/20">
                          <Droplets className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-bold text-brand-navy group-hover:text-brand-aqua">{formatTechnicalText(r.name)}</h3>
                      {r.tagline && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{r.tagline}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <CtaBand />
    </div>
  );
}
