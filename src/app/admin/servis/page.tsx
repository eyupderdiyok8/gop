"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ServiceRecord } from "@/lib/types";
import { Plus, Search, Wrench, Edit2, Trash2, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ServisFormModal } from "@/components/admin/servis/ServisFormModal";

const STATUS_COLORS: Record<string, string> = {
  bekliyor: "bg-amber-50 text-amber-600 border-amber-200",
  devam_ediyor: "bg-blue-50 text-blue-600 border-blue-200",
  tamamlandi: "bg-emerald-50 text-emerald-600 border-emerald-200",
  iptal: "bg-rose-50 text-rose-600 border-rose-200",
};

const STATUS_LABELS: Record<string, string> = {
  bekliyor: "Bekliyor",
  devam_ediyor: "Devam Ediyor",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};

export default function ServisPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("tumu");
  const [formModal, setFormModal] = useState<{ open: boolean; item?: any }>({ open: false });

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("service_records")
      .select("*, devices(marka, model, seri_no, customers(ad, telefon))")
      .order("created_at", { ascending: false });
    if (statusFilter !== "tumu") query = query.eq("durum", statusFilter);
    const { data } = await query;
    setRecords(data ?? []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const deleteRecord = async (id: string) => {
    if (!confirm("Servis kaydını silmek istediğinizden emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("service_records").delete().eq("id", id);
    fetchRecords();
  };

  const filtered = records.filter((r) => {
    const term = search.toLowerCase();
    return (
      (r.devices?.customers?.ad ?? "").toLowerCase().includes(term) ||
      r.aciklama.toLowerCase().includes(term) ||
      (r.teknisyen ?? "").toLowerCase().includes(term)
    );
  });

  const counts = {
    tumu: records.length,
    bekliyor: records.filter((r) => r.durum === "bekliyor").length,
    devam_ediyor: records.filter((r) => r.durum === "devam_ediyor").length,
    tamamlandi: records.filter((r) => r.durum === "tamamlandi").length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Servis Kayıtları</h1>
          <p className="text-slate-500 text-sm mt-1">{records.length} kayıt</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-aqua hover:bg-brand-aqua text-white rounded-xl text-sm font-medium transition shadow-lg shadow-brand-aqua/20"
        >
          <Plus className="w-4 h-4" /> Yeni Kayıt
        </button>
      </div>

      {/* Durum filtreleri */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "tumu", label: "Tümü", count: counts.tumu },
          { key: "bekliyor", label: "Bekliyor", count: counts.bekliyor },
          { key: "devam_ediyor", label: "Devam Ediyor", count: counts.devam_ediyor },
          { key: "tamamlandi", label: "Tamamlandı", count: counts.tamamlandi },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
              statusFilter === f.key
                ? "bg-brand-aqua/10 text-brand-aqua border-brand-aqua"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${statusFilter === f.key ? "bg-brand-aqua/20" : "bg-slate-50"}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Arama */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Müşteri, açıklama, teknisyen..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/40 focus:ring-1 focus:ring-brand-aqua/20 transition"
        />
      </div>

      {/* Tablo */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Müşteri / Cihaz", "Açıklama", "Teknisyen", "Tarih", "Durum", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400">Yükleniyor...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Wrench className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400">Servis kaydı bulunamadı</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/3 transition">
                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-medium">{r.devices?.customers?.ad ?? "—"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{r.devices?.marka} {r.devices?.model}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-slate-700 truncate">{r.aciklama}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{r.teknisyen ?? "—"}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {format(new Date(r.servis_tarihi), "d MMM yyyy", { locale: tr })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[r.durum]}`}>
                        {STATUS_LABELS[r.durum]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setFormModal({ open: true, item: r })} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteRecord(r.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formModal.open && (
        <ServisFormModal
          item={formModal.item}
          onClose={() => setFormModal({ open: false })}
          onSaved={() => { setFormModal({ open: false }); fetchRecords(); }}
        />
      )}
    </div>
  );
}
