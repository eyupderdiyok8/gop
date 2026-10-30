"use client";

import { useState } from "react";
import { X, Loader2, Plus, Trash2, Check, Edit2, ArrowUp, ArrowDown, CornerDownRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product, ProductCategory } from "@/lib/types";
import { slugify } from "@/lib/slugify";
import { categoryWithDescendants, flattenCategoryTree } from "@/lib/products/categoryTree";

interface CategoryManagerModalProps {
  categories: ProductCategory[];
  products: Product[];
  onClose: () => void;
  onChanged: () => void;
}

type Draft = { name: string; slug: string; description: string; parent_id: string };
const EMPTY: Draft = { name: "", slug: "", description: "", parent_id: "" };

/** Ürün kategorilerini ve alt kategorilerini ekleme, düzenleme, sıralama ve silme */
export function CategoryManagerModal({ categories, products, onClose, onChanged }: CategoryManagerModalProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tree = flattenCategoryTree(categories);
  // 030 migration çalışmadıysa parent_id sütunu yoktur; alt kategori alanını gizleriz
  const hasParent = categories.length === 0 || categories.some((c) => "parent_id" in c);

  const countOf = (id: string) => products.filter((p) => p.category_id === id).length;
  const childrenOf = (id: string) => categories.filter((c) => c.parent_id === id);

  const run = async (fn: () => PromiseLike<{ error: { message: string } | null }>) => {
    setBusy(true);
    setError(null);
    const { error } = await fn();
    setBusy(false);
    if (error) {
      setError(error.message.includes("duplicate") ? "Bu adres (slug) başka bir kategoride kullanılıyor." : error.message);
      return false;
    }
    onChanged();
    return true;
  };

  const payload = (d: Draft) => {
    const name = d.name.trim();
    const base = { name, slug: slugify(d.slug || name), description: d.description.trim() || null };
    return hasParent ? { ...base, parent_id: d.parent_id || null } : base;
  };

  const add = async () => {
    const data = payload(draft);
    if (!data.name || !data.slug) return setError("Kategori adı gerekli.");
    const order = categories.reduce((m, c) => Math.max(m, c.display_order), 0) + 1;
    const ok = await run(() => createClient().from("product_categories").insert({ ...data, display_order: order }));
    if (ok) {
      setDraft((d) => ({ ...EMPTY, parent_id: d.parent_id }));
      setSlugTouched(false);
    }
  };

  const save = async (id: string) => {
    const data = payload(editDraft);
    if (!data.name || !data.slug) return setError("Kategori adı gerekli.");
    const ok = await run(() => createClient().from("product_categories").update(data).eq("id", id));
    if (ok) setEditingId(null);
  };

  const remove = async (cat: ProductCategory) => {
    const n = countOf(cat.id);
    const kids = childrenOf(cat.id).length;
    const notes = [
      n ? `${n} ürün kategorisiz kalır` : "",
      kids ? `${kids} alt kategori ana kategoriye dönüşür` : "",
    ].filter(Boolean);
    if (!confirm(`"${cat.name}" silinsin mi?${notes.length ? `\n\n${notes.join(", ")}.` : ""}`)) return;
    await run(() => createClient().from("product_categories").delete().eq("id", cat.id));
  };

  // Aynı seviyedeki komşu kategoriyle yer değiştirir
  const move = async (cat: ProductCategory, dir: -1 | 1) => {
    const siblings = tree.filter((c) => (c.parent_id ?? null) === (cat.parent_id ?? null));
    const i = siblings.findIndex((c) => c.id === cat.id);
    const other = siblings[i + dir];
    if (!other) return;
    const supabase = createClient();
    // Sıra numaraları eşitse önce ayrıştır
    const a = cat.display_order === other.display_order ? cat.display_order + dir : other.display_order;
    await run(async () => {
      const r1 = await supabase.from("product_categories").update({ display_order: a }).eq("id", cat.id);
      if (r1.error) return r1;
      return supabase.from("product_categories").update({ display_order: cat.display_order }).eq("id", other.id);
    });
  };

  const isFirstSibling = (cat: ProductCategory) =>
    tree.filter((c) => (c.parent_id ?? null) === (cat.parent_id ?? null))[0]?.id === cat.id;
  const isLastSibling = (cat: ProductCategory) => {
    const s = tree.filter((c) => (c.parent_id ?? null) === (cat.parent_id ?? null));
    return s[s.length - 1]?.id === cat.id;
  };

  const input =
    "w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-aqua/60 transition";

  // Üst kategori seçimi: düzenlenen kategori ve kendi alt dalları seçilemez
  const parentSelect = (value: string, onChange: (v: string) => void, excludeId?: string) => {
    const blocked = excludeId ? categoryWithDescendants(categories, excludeId) : new Set<string>();
    return (
      <select className={input} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Ana kategori (üst kategori yok)</option>
        {tree
          .filter((c) => !blocked.has(c.id))
          .map((c) => (
            <option key={c.id} value={c.id}>
              {"— ".repeat(c.depth)}
              {c.name}
            </option>
          ))}
      </select>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">Kategoriler</h2>
            <p className="text-xs text-slate-500">Ürünler sayfasındaki sekmeler bu sırayla görünür.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!hasParent && (
          <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Alt kategori eklemek için Supabase&apos;te <b>030_product_category_parent.sql</b> dosyasını çalıştırın.
          </p>
        )}

        {/* Yeni kategori */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Yeni kategori</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={input}
              placeholder="Kategori adı (ör. Membran Filtreler)"
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value, slug: slugTouched ? d.slug : slugify(e.target.value) }))
              }
            />
            <input
              className={input}
              placeholder="Adres (slug)"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setDraft((d) => ({ ...d, slug: e.target.value }));
              }}
            />
            {hasParent && (
              <div className="sm:col-span-2">{parentSelect(draft.parent_id, (v) => setDraft((d) => ({ ...d, parent_id: v })))}</div>
            )}
            <input
              className={`${input} sm:col-span-2`}
              placeholder="Kısa açıklama (isteğe bağlı)"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <button
            onClick={add}
            disabled={busy || !draft.name.trim()}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-aqua px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {draft.parent_id ? "Alt kategori ekle" : "Kategori ekle"}
          </button>
        </div>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        {/* Ağaç listesi */}
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
          {tree.map((cat) => (
            <li
              key={cat.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              style={{ paddingLeft: `${16 + cat.depth * 24}px` }}
            >
              {editingId === cat.id ? (
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  <input className={input} value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} />
                  <input className={input} value={editDraft.slug} onChange={(e) => setEditDraft((d) => ({ ...d, slug: e.target.value }))} />
                  {hasParent && (
                    <div className="sm:col-span-2">
                      {parentSelect(editDraft.parent_id, (v) => setEditDraft((d) => ({ ...d, parent_id: v })), cat.id)}
                    </div>
                  )}
                  <input
                    className={`${input} sm:col-span-2`}
                    placeholder="Kısa açıklama"
                    value={editDraft.description}
                    onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  {cat.depth > 0 && <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />}
                  <div className="min-w-0">
                    <p className={cat.depth ? "font-medium text-slate-800" : "font-semibold text-slate-900"}>{cat.name}</p>
                    <p className="truncate text-xs text-slate-400">
                      /{cat.slug} · {countOf(cat.id)} ürün{cat.description ? ` · ${cat.description}` : ""}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex shrink-0 items-center gap-1">
                {editingId === cat.id ? (
                  <>
                    <button onClick={() => save(cat.id)} disabled={busy} className="rounded-lg p-2 text-brand-aqua hover:bg-slate-100" title="Kaydet">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" title="Vazgeç">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => move(cat, -1)}
                      disabled={busy || isFirstSibling(cat)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                      title="Yukarı taşı"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => move(cat, 1)}
                      disabled={busy || isLastSibling(cat)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                      title="Aşağı taşı"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    {hasParent && (
                      <button
                        onClick={() => setDraft({ ...EMPTY, parent_id: cat.id })}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        title="Bu kategoriye alt kategori ekle"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditDraft({ name: cat.name, slug: cat.slug, description: cat.description ?? "", parent_id: cat.parent_id ?? "" });
                      }}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      title="Düzenle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(cat)} disabled={busy} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Sil">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
          {tree.length === 0 && <li className="p-6 text-center text-sm text-slate-400">Henüz kategori yok.</li>}
        </ul>
      </div>
    </div>
  );
}
