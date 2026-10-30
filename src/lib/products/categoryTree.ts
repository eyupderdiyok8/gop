import type { ProductCategory } from "@/lib/types";

export type CategoryNode = ProductCategory & { depth: number };

/** Kategorileri ağaç sırasında düz liste olarak döner: her ana kategorinin hemen ardından alt kategorileri gelir */
export function flattenCategoryTree(categories: ProductCategory[]): CategoryNode[] {
  const byOrder = [...categories].sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name, "tr"));
  const ids = new Set(categories.map((c) => c.id));
  const out: CategoryNode[] = [];
  const seen = new Set<string>();
  const walk = (parentId: string | null, depth: number) => {
    for (const c of byOrder) {
      const p = c.parent_id && ids.has(c.parent_id) ? c.parent_id : null;
      if (p !== parentId || seen.has(c.id)) continue;
      seen.add(c.id);
      out.push({ ...c, depth });
      walk(c.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}

/** Bir kategori ve altındaki tüm kategorilerin id'leri */
export function categoryWithDescendants(categories: ProductCategory[], id: string): Set<string> {
  const result = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) {
      if (c.parent_id && result.has(c.parent_id) && !result.has(c.id)) {
        result.add(c.id);
        grew = true;
      }
    }
  }
  return result;
}

/** "Filtreler › Membran Filtreler" biçiminde tam yol */
export function categoryPath(categories: ProductCategory[], id: string | null | undefined): string {
  const names: string[] = [];
  let cur = categories.find((c) => c.id === id);
  const guard = new Set<string>();
  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id);
    names.unshift(cur.name);
    cur = cur.parent_id ? categories.find((c) => c.id === cur!.parent_id) : undefined;
  }
  return names.join(" › ");
}
