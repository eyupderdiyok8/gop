import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { ProductCategory } from "@/lib/types";
import { formatTechnicalText } from "@/lib/products/formatTechnicalText";
import type { MenuItem } from "./menuTypes";

/** Menüde gösterilecek en fazla ürün; fazlası "Tümü (n) →" bağlantısıyla kategoriye gider.
 *  Ana kategoride biraz daha fazla, alt kategoride az ürün gösterilir ki menü taşmasın. */
const MAX_IN_ROOT = 8;
const MAX_IN_SUB = 4;

type MenuProduct = { name: string; slug: string; category_id: string | null; page_url: string | null };

const productHref = (p: MenuProduct) => p.page_url || `/urunler/${p.slug}`;
const categoryHref = (c: ProductCategory) => `/urunler?kategori=${c.slug}`;

/**
 * Ürünler menüsünü admin panelindeki kategori ağacı ve aktif ürünlerden kurar.
 * Ana kategori = sol sütundaki sekme, alt kategori = başlık, ürünler = bağlantı. Boş kategoriler gösterilmez.
 * Veritabanı hazır değilse (031 çalışmadıysa ya da hiçbir üründe özel sayfa adresi yoksa) null döner
 * ve menü koddaki sabit listeyi kullanır.
 */
async function buildProductMenu(): Promise<MenuItem[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const [{ data: cats, error: catErr }, { data: prods, error: prodErr }] = await Promise.all([
    supabase.from("product_categories").select("*").order("display_order"),
    supabase.from("products").select("name, slug, category_id, page_url").eq("is_active", true).order("name"),
  ]);
  if (catErr || prodErr || !cats?.length || !prods) return null;

  const categories = cats as ProductCategory[];
  const products = prods as MenuProduct[];
  if (!products.some((p) => p.page_url)) return null;

  const byOrder = [...categories].sort((a, b) => a.display_order - b.display_order);
  const ids = new Set(categories.map((c) => c.id));
  const childrenOf = (id: string) => byOrder.filter((c) => c.parent_id === id);
  // Özel sayfası olan ürünler (tanıtım sayfaları) önce gelir
  const productsOf = (id: string) =>
    products.filter((p) => p.category_id === id).sort((a, b) => Number(!!b.page_url) - Number(!!a.page_url));

  const productLinks = (c: ProductCategory, max: number): MenuItem[] => {
    const list = productsOf(c.id);
    const links: MenuItem[] = list.slice(0, max).map((p) => ({ label: formatTechnicalText(p.name), href: productHref(p) }));
    if (list.length > max) links.push({ label: `Tümü (${list.length}) →`, href: categoryHref(c), more: true });
    return links;
  };

  const node = (c: ProductCategory, depth = 0): MenuItem | null => {
    const subs = childrenOf(c.id)
      .map((sub) => node(sub, depth + 1))
      .filter((x): x is MenuItem => x !== null);
    const children = [...subs, ...productLinks(c, depth === 0 ? MAX_IN_ROOT : MAX_IN_SUB)];
    if (children.length === 0) return null;
    return { label: c.name, href: categoryHref(c), children };
  };

  const roots = byOrder.filter((c) => !c.parent_id || !ids.has(c.parent_id));
  const menu = roots.map((c) => node(c)).filter((x): x is MenuItem => x !== null);
  return menu.length ? menu : null;
}

/** 5 dakikada bir yenilenir; panelde yapılan değişiklikler en geç bu sürede menüye yansır */
export const getProductMenu = unstable_cache(buildProductMenu, ["product-menu-v2"], { revalidate: 300, tags: ["product-menu"] });
