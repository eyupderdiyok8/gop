/**
 * Ürünün kendi tanıtım sayfası (page_url) site içi yol olarak: "/pantech-su-aritma-cihazi".
 * Panelde tam adres de girilebildiği için kendi alan adımız ayıklanır; başka bir siteyi gösteriyorsa null döner.
 */
export function productPagePath(pageUrl: string | null | undefined): string | null {
  const raw = pageUrl?.trim();
  if (!raw) return null;
  const path = raw.replace(/^https?:\/\/(www\.)?suaritmaservis34\.com/i, "");
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path.replace(/\/+$/, "") || null;
}

/** Ürün bağlantısı: tanıtım sayfası varsa o, yoksa /urunler/<slug> */
export function productHref(product: { slug: string; page_url?: string | null }) {
  return productPagePath(product.page_url) ?? `/urunler/${product.slug}`;
}
