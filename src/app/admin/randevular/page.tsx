"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Appointment } from "@/lib/types";
import {
  CalendarDays, Plus, Search, Filter as FilterIcon,
  Clock, CheckCircle, XCircle, AlertCircle, Loader2,
  Phone, Mail, Edit2, Trash2, ChevronDown, MessageCircle
} from "lucide-react";
import { format, parseISO, isSameDay, startOfWeek, addDays } from "date-fns";
import { tr } from "date-fns/locale";
import { RandevuFormModal } from "@/components/admin/randevular/RandevuFormModal";

const STATUS_COLORS: Record<string, string> = {
  bekliyor: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  onaylandi: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  tamamlandi: "bg-brand-aqua/15 text-brand-aqua border-brand-aqua/25",
  iptal: "bg-red-500/15 text-red-400 border-red-500/25",
};

const STATUS_LABELS: Record<string, string> = {
  bekliyor: "Bekliyor",
  onaylandi: "Onaylandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};

const STATUS_ICONS: Record<string, any> = {
  bekliyor: AlertCircle,
  onaylandi: CheckCircle,
  tamamlandi: CheckCircle,
  iptal: XCircle,
};



export default function RandevularPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("tumu");
  const [teknisyenFilter, setTeknisyenFilter] = useState("Tümü");
  const [viewMode, setViewMode] = useState<"liste" | "haftalik">("liste");
  const [formModal, setFormModal] = useState<{ open: boolean; item?: Appointment | null }>({ open: false });
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [filterTeknisyenler, setFilterTeknisyenler] = useState<string[]>(["Tümü"]);

  useEffect(() => {
    createClient().from("technicians").select("ad_soyad").eq("aktif", true).order("ad_soyad").then(({ data }) => setFilterTeknisyenler(["Tümü", ...(data?.map(t => t.ad_soyad) ?? [])]));
  }, []);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("appointments")
      .select("*")
      .order("randevu_tarihi", { ascending: true });

    if (statusFilter !== "tumu") query = query.eq("durum", statusFilter);
    if (teknisyenFilter !== "Tümü") query = query.eq("teknisyen", teknisyenFilter);

    const { data } = await query;
    setAppointments(data ?? []);
    setLoading(false);
  }, [statusFilter, teknisyenFilter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // Realtime abonelik
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("appointments-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, fetchAppointments)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAppointments]);

  const updateStatus = async (id: string, durum: string) => {
    const supabase = createClient();
    const { data: updated } = await supabase.from("appointments").update({ durum }).eq("id", id).select().single();
    
    if (durum === "onaylandi" && updated) {
      // Otomatik bildirim gönder
      fetch("/api/admin/appointments/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id })
      });
    }
    
    fetchAppointments();
  };

  const sendManualNotify = async (id: string) => {
    const res = await fetch("/api/admin/appointments/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: id })
    });
    if (res.ok) alert("Bilgilendirme gönderildi!");
    else alert("Gönderim sırasında bir hata oluştu.");
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Randevuyu silmek istediğinizden emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("appointments").delete().eq("id", id);
    fetchAppointments();
  };

  const filtered = appointments.filter((a) => {
    const term = search.toLowerCase();
    return (
      a.musteri_adi.toLowerCase().includes(term) ||
      a.musteri_telefon.includes(term) ||
      (a.musteri_email ?? "").toLowerCase().includes(term) ||
      a.hizmet_turu.toLowerCase().includes(term)
    );
  });

  // Haftalık görünüm
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const counts = {
    tumu: appointments.length,
    bekliyor: appointments.filter((a) => a.durum === "bekliyor").length,
    onaylandi: appointments.filter((a) => a.durum === "onaylandi").length,
    tamamlandi: appointments.filter((a) => a.durum === "tamamlandi").length,
    iptal: appointments.filter((a) => a.durum === "iptal").length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Randevular</h1>
          <p className="text-slate-500 text-sm mt-1">{appointments.length} randevu</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            {(["liste", "haftalik"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  viewMode === m ? "bg-brand-aqua/20 text-brand-aqua" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {m === "liste" ? "Liste" : "Haftalık"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFormModal({ open: true, item: null })}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-aqua hover:bg-brand-aqua text-slate-900 rounded-xl text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> Randevu Ekle
          </button>
        </div>
      </div>

      {/* Durum Filtreleri */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "tumu", label: "Tümü", count: counts.tumu },
          { key: "bekliyor", label: "Bekliyor", count: counts.bekliyor },
          { key: "onaylandi", label: "Onaylandı", count: counts.onaylandi },
          { key: "tamamlandi", label: "Tamamlandı", count: counts.tamamlandi },
          { key: "iptal", label: "İptal", count: counts.iptal },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
              statusFilter === f.key
                ? "bg-brand-aqua/20 text-brand-aqua border-brand-aqua/30"
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

      {/* Arama ve Teknisyen */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Müşteri, telefon, email..."
            className="w-full bg-white border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-white/30 focus:outline-none focus:border-brand-aqua/40 transition"
          />
        </div>
        <select
          value={teknisyenFilter}
          onChange={(e) => setTeknisyenFilter(e.target.value)}
          className="bg-white border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/40 transition"
        >
          {filterTeknisyenler.map((t) => (
            <option key={t} value={t} className="bg-[#0f1c26]">{t}</option>
          ))}
        </select>
      </div>

      {/* Haftalık Görünüm */}
      {viewMode === "haftalik" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="text-slate-500 hover:text-slate-900 transition px-3 py-1.5 rounded-lg hover:bg-white">← Önceki</button>
            <span className="text-sm text-slate-900 font-medium">
              {format(weekStart, "d MMM", { locale: tr })} — {format(addDays(weekStart, 6), "d MMM yyyy", { locale: tr })}
            </span>
            <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="text-slate-500 hover:text-slate-900 transition px-3 py-1.5 rounded-lg hover:bg-white">Sonraki →</button>
          </div>
          <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-40">
            {weekDays.map((day) => {
              const dayAppts = filtered.filter((a) => isSameDay(parseISO(a.randevu_tarihi), day));
              const isToday = isSameDay(day, new Date());
              return (
                <div key={day.toISOString()} className={`p-3 ${isToday ? "bg-brand-aqua/8" : ""}`}>
                  <div className={`text-xs font-semibold mb-2 ${isToday ? "text-brand-aqua" : "text-slate-400"}`}>
                    <p>{format(day, "EEE", { locale: tr })}</p>
                    <p className={`text-lg ${isToday ? "text-brand-aqua" : "text-slate-700"}`}>{format(day, "d")}</p>
                  </div>
                  <div className="space-y-1">
                    {dayAppts.map((a) => (
                      <div
                        key={a.id}
                        className={`text-xs p-1.5 rounded-md cursor-pointer border ${STATUS_COLORS[a.durum]}`}
                        onClick={() => setFormModal({ open: true, item: a })}
                      >
                        <p className="font-medium truncate">{format(parseISO(a.randevu_tarihi), "HH:mm")}</p>
                        <p className="truncate opacity-80">{a.musteri_adi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste Görünümü */}
      {viewMode === "liste" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-aqua animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <CalendarDays className="w-12 h-12 text-slate-200" />
              <p className="text-slate-400 text-sm">Randevu bulunamadı</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((a) => {
                const StatusIcon = STATUS_ICONS[a.durum] ?? AlertCircle;
                return (
                  <div key={a.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/3 transition">
                    {/* Zaman */}
                    <div className="w-20 text-center flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {format(parseISO(a.randevu_tarihi), "HH:mm")}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {format(parseISO(a.randevu_tarihi), "d MMM", { locale: tr })}
                      </p>
                    </div>

                    {/* Müşteri */}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-medium truncate">{a.musteri_adi}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Phone className="w-3 h-3" /> {a.musteri_telefon}
                        </span>
                        {a.musteri_email && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Mail className="w-3 h-3" /> {a.musteri_email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hizmet */}
                    <div className="hidden md:block flex-shrink-0 w-40">
                      <p className="text-sm text-slate-700 truncate">{a.hizmet_turu}</p>
                      {a.teknisyen && <p className="text-xs text-slate-400 mt-0.5">{a.teknisyen}</p>}
                    </div>

                    {/* Durum */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[a.durum]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_LABELS[a.durum]}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {a.durum === "bekliyor" && (
                        <button
                          onClick={() => updateStatus(a.id, "onaylandi")}
                          className="p-2 text-slate-400 hover:text-brand-aqua hover:bg-brand-aqua/10 rounded-lg transition"
                          title="Onayla"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {a.durum === "onaylandi" && (
                        <button
                          onClick={() => sendManualNotify(a.id)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                          title="WhatsApp/Email Tekrar Gönder"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setFormModal({ open: true, item: a })}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(a.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {formModal.open && (
        <RandevuFormModal
          item={formModal.item}
          onClose={() => setFormModal({ open: false })}
          onSaved={() => { setFormModal({ open: false }); fetchAppointments(); }}
        />
      )}
    </div>
  );
}
