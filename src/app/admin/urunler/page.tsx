"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product, ProductCategory } from "@/lib/types";
import { 
  Plus, 
  Search, 
  Package, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { ProductFormModal } from "@/components/admin/urunler/ProductFormModal";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminUrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [formModal, setFormModal] = useState<{ open: boolean; item?: Product | null }>({ open: false });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch Categories
    const { data: cats } = await supabase
      .from("product_categories")
      .select("*")
      .order("display_order");
    setCategories(cats ?? []);

    // Fetch Products
    const { data: prods } = await supabase
      .from("products")
      .select("*, category:product_categories(*)")
      .order("created_at", { ascending: false });
    setProducts(prods ?? []);
    
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Ürünü silmek istediğinizden emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         (p.tagline ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "all" || p.category_id === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Ürün Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} ürün kataloğunuzda aktif</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, item: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-aqua hover:bg-brand-aqua text-slate-900 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün adı veya açıklama ile ara..."
            className="w-full bg-white border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-aqua/40 transition outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCat("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCat === "all" 
              ? "bg-brand-aqua/20 border-brand-aqua text-brand-aqua" 
              : "bg-white border-white/10 text-slate-500 hover:text-slate-900"
            }`}
          >
            Tümü
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedCat === cat.id 
                ? "bg-brand-aqua/20 border-brand-aqua text-brand-aqua" 
                : "bg-white border-white/10 text-slate-500 hover:text-slate-900"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-brand-aqua/20 border-t-brand-aqua rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center gap-3 text-center">
          <Package className="w-12 h-12 text-slate-200" />
          <p className="text-slate-400">Görüntülenecek ürün bulunamadı</p>
          <button onClick={() => setFormModal({ open: true, item: null })} className="text-brand-aqua text-sm hover:underline">İlk ürününüzü oluşturun</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group relative bg-white border border-slate-200 rounded-[2rem] p-4 flex flex-col gap-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-black/20 border border-slate-100">
                {p.main_image ? (
                  <img src={p.main_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {p.is_highlight && (
                    <span className="bg-amber-500 text-slate-900 text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Öne Çıkan</span>
                  )}
                  {p.badge && (
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${p.badge_color || 'bg-brand-aqua text-slate-900'}`}>
                      {p.badge}
                    </span>
                  )}
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setFormModal({ open: true, item: p })}
                    className="w-10 h-10 rounded-full bg-white text-brand-navy flex items-center justify-center hover:scale-110 transition-transform"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="w-10 h-10 rounded-full bg-red-500 text-slate-900 flex items-center justify-center hover:scale-110 transition-transform"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/urunler/${p.slug}`}
                    target="_blank"
                    className="w-10 h-10 rounded-full bg-brand-aqua text-slate-900 flex items-center justify-center hover:scale-110 transition-transform"
                    title="Görüntüle"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Product Detail */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-aqua uppercase tracking-widest">{p.category?.name || 'Kategorisiz'}</span>
                  <div className="flex items-center gap-1">
                    {p.is_active ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-aqua" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                </div>
                <h3 className="text-slate-900 font-bold leading-tight group-hover:text-brand-aqua transition-colors line-clamp-2">{p.name}</h3>
                <p className="text-slate-400 text-xs line-clamp-1 italic">{p.tagline}</p>
                
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-auto">
                   <div className="flex flex-col">
                      <span className="text-slate-900 font-extrabold text-lg">
                        {p.price ? `₺${p.price.toLocaleString('tr-TR')}` : 'Teklif Al'}
                      </span>
                      {p.old_price && (
                        <span className="text-slate-400 text-[10px] line-through">₺{p.old_price.toLocaleString('tr-TR')}</span>
                      )}
                   </div>
                   <div className="text-[10px] text-slate-900/20">
                     {format(new Date(p.created_at), "d MMM yyyy", { locale: tr })}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formModal.open && (
        <ProductFormModal
          item={formModal.item}
          categories={categories}
          onClose={() => setFormModal({ open: false })}
          onSaved={() => { setFormModal({ open: false }); fetchData(); }}
        />
      )}
    </div>
  );
}
