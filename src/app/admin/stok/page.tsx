"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { StokFormModal } from "@/components/admin/stok/StokFormModal";
import { StokHareketModal } from "@/components/admin/stok/StokHareketModal";
import type { InventoryItem, InventoryMovement } from "@/lib/types";
import {
  Plus, Search, Package, AlertTriangle,
  ArrowDown, ArrowUp, Edit2, Trash2, History, X, ChevronDown, ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const KATEGORILER = ["Tümü", "Filtre", "Membran", "Tank", "Pompa", "Aksesuar", "Kimyasal", "Elektrik", "Boru & Bağlantı", "Diğer"];

export default function StokPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Tümü");
  const [formModal, setFormModal] = useState<{ open: boolean; item?: InventoryItem | null }>({ open: false });
  const [hareketModal, setHareketModal] = useState<{ open: boolean; item?: InventoryItem }>({ open: false });
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [sortField, setSortField] = useState<"urun_adi" | "adet" | "kategori">("urun_adi");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("inventory")
      .select("*")
      .order(sortField, { ascending: sortDir === "asc" });
    setItems(data ?? []);
    setLoading(false);
  }, [sortField, sortDir]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const fetchMovements = async (item: InventoryItem) => {
    setHistoryItem(item);
    setLoadingMovements(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("inventory_movements")
      .select("*")
      .eq("inventory_id", item.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setMovements(data ?? []);
    setLoadingMovements(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("inventory").delete().eq("id", id);
    fetchItems();
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = items.filter((item) => {
    const matchSearch = item.urun_adi.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === "Tümü" || item.kategori === kategori;
    return matchSearch && matchKategori;
  });

  const kritikCount = items.filter((i) => i.adet <= i.min_stok_esigi).length;

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />;
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Stok Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} ürün</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, item: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-aqua hover:bg-brand-aqua text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-brand-aqua/20"
        >
          <Plus className="w-4 h-4" /> Ürün Ekle
        </button>
      </div>

      {/* Kritik Stok Uyarısı */}
      {kritikCount > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <span className="font-bold">{kritikCount} ürün</span> minimum stok seviyesinin altında!
          </p>
        </div>
      )}

      {/* Filtreler */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/40 focus:ring-1 focus:ring-brand-aqua/20 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {KATEGORILER.map((k) => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                kategori === k
                  ? "bg-brand-aqua/10 text-brand-aqua border border-brand-aqua"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th
                  className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-900/60 transition select-none"
                  onClick={() => toggleSort("urun_adi")}
                >
                  Ürün Adı <SortIcon field="urun_adi" />
                </th>
                <th
                  className="text-left px-4 py-4 text-xs font-medium text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-900/60 transition select-none"
                  onClick={() => toggleSort("kategori")}
                >
                  Kategori <SortIcon field="kategori" />
                </th>
                <th
                  className="text-right px-4 py-4 text-xs font-medium text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-900/60 transition select-none"
                  onClick={() => toggleSort("adet")}
                >
                  Stok <SortIcon field="adet" />
                </th>
                <th className="text-right px-4 py-4 text-xs font-medium text-slate-400 uppercase tracking-wide">Min. Eşik</th>
                <th className="text-right px-4 py-4 text-xs font-medium text-slate-400 uppercase tracking-wide">Birim Fiyat</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Yükleniyor...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Ürün bulunamadı
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const kritik = item.adet <= item.min_stok_esigi;
                  return (
                    <tr key={item.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {kritik && (
                            <span title="Kritik stok">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                            </span>
                          )}
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-medium">{item.urun_adi}</span>
                            {item.marka && <span className="text-slate-400 text-xs">{item.marka}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-50 text-slate-900/60 text-xs px-2.5 py-1 rounded-full">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`font-bold text-base ${
                            kritik ? "text-red-600" : "text-slate-900"
                          }`}
                        >
                          {item.adet}
                        </span>
                        {kritik && (
                          <span className="ml-2 text-[10px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded-full font-bold uppercase">
                            Kritik
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-400 text-sm">{item.min_stok_esigi}</td>
                      <td className="px-4 py-4 text-right text-slate-700 text-sm">
                        {item.birim_fiyat.toFixed(2)} ₺
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setHareketModal({ open: true, item })}
                            className="p-2 text-slate-400 hover:text-brand-aqua hover:bg-brand-aqua/10 rounded-lg transition-all"
                            title="Stok Hareketi"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => fetchMovements(item)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Hareket Geçmişi"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setFormModal({ open: true, item })}
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hareket Geçmişi Modal */}
      {historyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setHistoryItem(null)} />
          <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                {historyItem.urun_adi} — Hareket Geçmişi
              </h3>
            </div>
            <button onClick={() => setHistoryItem(null)} className="text-slate-400 hover:text-slate-900 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs text-slate-400 font-medium">Tür</th>
                  <th className="text-right px-4 py-3 text-xs text-slate-400 font-medium">Miktar</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-medium">Açıklama</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-400 font-medium">Yapan</th>
                  <th className="text-right px-6 py-3 text-xs text-slate-400 font-medium">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingMovements ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Yükleniyor...</td></tr>
                ) : movements.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Hareket kaydı yok</td></tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          {m.hareket_turu === "giris" ? (
                            <span className="flex items-center gap-1.5 text-xs bg-brand-aqua/15 text-brand-aqua border border-brand-aqua/20 px-2 py-1 rounded-full">
                              <ArrowDown className="w-3 h-3" /> Giriş
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-1 rounded-full">
                              <ArrowUp className="w-3 h-3" /> Çıkış
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">{m.miktar}</td>
                      <td className="px-4 py-3 text-slate-500">{m.aciklama ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{m.yapan_kullanici ?? "—"}</td>
                      <td className="px-6 py-3 text-right text-slate-400 text-xs">
                        {format(new Date(m.created_at), "d MMM yyyy HH:mm", { locale: tr })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Modaller */}
      {formModal.open && (
        <StokFormModal
          item={formModal.item}
          onClose={() => setFormModal({ open: false })}
          onSaved={() => { setFormModal({ open: false }); fetchItems(); }}
        />
      )}
      {hareketModal.open && hareketModal.item && (
        <StokHareketModal
          item={hareketModal.item}
          onClose={() => setHareketModal({ open: false })}
          onSaved={() => { setHareketModal({ open: false }); fetchItems(); }}
        />
      )}
    </div>
  );
}
