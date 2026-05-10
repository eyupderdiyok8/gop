"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Customer } from "@/lib/types";
import { Plus, Search, Users, Phone, Mail, MapPin, ChevronRight, Edit2, Trash2, LayoutGrid, List, Wallet, UserCheck, Calendar, Wrench } from "lucide-react";
import Link from "next/link";
import { MusteriFormModal } from "@/components/admin/musteriler/MusteriFormModal";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function MusterilerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [formModal, setFormModal] = useState<{ open: boolean; item?: Customer | null }>({ open: false });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch customers with their devices and transactions
    const { data } = await supabase
      .from("customers")
      .select(`
        *,
        devices(id),
        transactions(tur, tutar, durum)
      `)
      .order("created_at", { ascending: false });

    // Process data to calculate totals
    const processed = (data ?? []).map(c => {
      // Calculate from transactions table
      let paid = c.transactions
        ?.filter((t: any) => t.tur === "gelir" && t.durum === "odendi")
        .reduce((sum: number, t: any) => sum + (Number(t.tutar) || 0), 0) || 0;
      
      let remaining = c.transactions
        ?.filter((t: any) => t.tur === "gelir" && t.durum === "bekliyor")
        .reduce((sum: number, t: any) => sum + (Number(t.tutar) || 0), 0) || 0;

      // Fallback: If no transactions but customer has an islem_tutari
      if (paid === 0 && remaining === 0 && c.islem_tutari > 0) {
        if (c.odeme_yontemi === "Borç") {
          remaining = Number(c.islem_tutari);
        } else {
          paid = Number(c.islem_tutari);
        }
      }

      return {
        ...c,
        deviceCount: c.devices?.length || 0,
        paid,
        remaining
      };
    });

    setCustomers(processed);
    setLoading(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("musteriler_view_mode");
    if (saved === "list" || saved === "grid") setViewMode(saved as any);
    fetchCustomers();
  }, [fetchCustomers]);

  const toggleView = (mode: "list" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("musteriler_view_mode", mode);
  };
  const deleteCustomer = async (id: string) => {
    if (!confirm("Müşteriyi silmek istediğinizden emin misiniz? İlgili tüm cihazlar ve servis kayıtları da silinecektir.")) return;
    const supabase = createClient();
    await supabase.from("customers").delete().eq("id", id);
    fetchCustomers();
  };

  const filtered = customers.filter(
    (c) =>
      c.ad.toLowerCase().includes(search.toLowerCase()) ||
      c.telefon.includes(search)
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Müşteriler</h1>
          <p className="text-slate-500 text-sm mt-1">{customers.length} müşteri kayıtlı</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, item: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-aqua hover:bg-brand-aqua text-slate-900 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Müşteri
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Müşteri", value: customers.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Bu Ay Yeni Kayıt", value: customers.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length, icon: Calendar, color: "text-brand-aqua", bg: "bg-brand-aqua/10" },
          { label: "Cihaz Sayısı", value: customers.reduce((acc, c) => acc + (c.deviceCount || 0), 0), icon: UserCheck, color: "text-brand-aqua", bg: "bg-brand-aqua/10" },
          { label: "Toplam Alacak", value: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(customers.reduce((acc, c) => acc + (c.remaining || 0), 0)), icon: Wallet, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim, telefon veya email ile ara..."
            className="w-full bg-white border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-white/30 focus:outline-none focus:border-brand-aqua/40 transition"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-white/10">
          <button
            onClick={() => toggleView("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-brand-aqua text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
            title="Grid Görünümü"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleView("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-brand-aqua text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
            title="Liste Görünümü"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Müşteri İçeriği */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-brand-aqua/20 border-t-brand-aqua rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center gap-3">
          <Users className="w-12 h-12 text-slate-200" />
          <p className="text-slate-400">Müşteri bulunamadı</p>
          <button
            onClick={() => setFormModal({ open: true, item: null })}
            className="text-sm text-brand-aqua hover:text-brand-aqua transition"
          >
            İlk müşterinizi ekleyin →
          </button>
        </div>
      ) : viewMode === "list" ? (
        <div className="grid gap-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="group bg-white border border-slate-200 rounded-xl px-6 py-4 flex items-center gap-4 hover:bg-slate-50 hover:border-white/15 transition-all"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-aqua to-brand-aqua flex items-center justify-center flex-shrink-0 text-slate-900 font-bold text-sm">
                {c.ad.slice(0, 1).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-semibold truncate">{c.ad}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="w-3 h-3" /> {c.telefon}
                  </span>
                  {c.adres && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 truncate max-w-xs">
                      <MapPin className="w-3 h-3 flex-shrink-0" /> {c.adres}
                    </span>
                  )}
                  {c.islem_1 && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-brand-aqua bg-brand-aqua/5 px-2 py-0.5 rounded border border-brand-aqua/10">
                      <Wrench className="w-3 h-3 flex-shrink-0" /> {c.islem_1} {c.islem_tarihi ? `- ${format(new Date(c.islem_tarihi), "d MMM", { locale: tr })}` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Tarih */}
              <div className="text-right text-xs text-slate-400 flex-shrink-0 hidden sm:block">
                {format(new Date(c.created_at), "d MMM yyyy", { locale: tr })}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setFormModal({ open: true, item: c })}
                  className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCustomer(c.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link
                  href={`/admin/musteriler/${c.id}`}
                  className="p-2 text-slate-400 hover:text-brand-aqua hover:bg-brand-aqua/10 rounded-lg transition-all"
                  title="Detay"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c, i) => {
            const colors = [
              "from-blue-600 to-indigo-700",
              "from-brand-aqua to-brand-aqua",
              "from-amber-500 to-brand-aqua",
              "from-rose-500 to-pink-600",
              "from-violet-600 to-purple-700",
              "from-cyan-500 to-blue-600"
            ];
            const color = colors[i % colors.length];

            return (
              <div
                key={c.id}
                className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:border-brand-aqua/40 hover:shadow-2xl hover:shadow-brand-aqua/5 transition-all duration-300"
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                        {c.ad.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-bold text-lg leading-tight group-hover:text-brand-aqua transition-colors">{c.ad}</h3>
                        <p className="text-slate-400 text-xs font-mono mt-1">M-{c.id.slice(0, 4).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="px-3 py-1 bg-brand-aqua/10 text-brand-aqua rounded-full text-[10px] font-bold uppercase tracking-wider border border-brand-aqua/20">
                        Aktif
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/10 flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> Bireysel
                    </span>
                    {c.islem_1 && (
                      <span className="px-3 py-1 bg-brand-aqua/10 text-brand-aqua rounded-lg text-xs font-medium border border-brand-aqua/20 flex items-center gap-1.5 truncate max-w-[180px]" title={[c.islem_1, c.islem_2].filter(Boolean).join(", ")}>
                        <Wrench className="w-3 h-3 flex-shrink-0" /> 
                        <span className="truncate">{c.islem_1}</span>
                        {c.islem_tarihi && <span className="opacity-70 whitespace-nowrap">({format(new Date(c.islem_tarihi), "d MMM", { locale: tr })})</span>}
                      </span>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Phone className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-medium">{c.telefon}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <MapPin className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-medium truncate" title={c.adres}>{c.adres || "Adres bilgisi yok"}</span>
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Cihaz</p>
                      <p className="text-sm font-bold text-slate-900">{c.deviceCount}</p>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Ödenen</p>
                      <p className="text-sm font-bold text-emerald-600">₺{c.paid.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Kalan</p>
                      <p className={`text-sm font-bold ${c.remaining > 0 ? 'text-rose-600' : 'text-slate-400'}`}>₺{c.remaining.toLocaleString('tr-TR')}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/musteriler/${c.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-brand-aqua hover:text-white text-slate-700 rounded-xl text-xs font-semibold transition-all border border-slate-200"
                    >
                      <ChevronRight className="w-4 h-4" /> Görüntüle
                    </Link>
                    <button
                      onClick={() => setFormModal({ open: true, item: c })}
                      className="p-2.5 bg-slate-50 hover:bg-amber-100 text-slate-400 hover:text-amber-600 rounded-xl transition-all border border-slate-200"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                       onClick={() => deleteCustomer(c.id)}
                      className="p-2.5 bg-slate-50 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-xl transition-all border border-slate-200"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formModal.open && (
        <MusteriFormModal
          item={formModal.item}
          onClose={() => setFormModal({ open: false })}
          onSaved={() => { setFormModal({ open: false }); fetchCustomers(); }}
        />
      )}
    </div>
  );
}
