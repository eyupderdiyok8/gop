"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Customer, Device, Appointment, CustomerNote } from "@/lib/types";
import {
  ArrowLeft, Phone, Mail, MapPin, Cpu, Wrench, CalendarDays,
  MessageSquare, Plus, Trash2, ChevronRight, Edit2, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MusteriFormModal } from "./MusteriFormModal";
import { CihazFormModal } from "@/components/admin/musteriler/CihazFormModal";
import { HizliIslemModal } from "@/components/admin/musteriler/HizliIslemModal";
import { FinansListesi } from "@/app/admin/finans/FinansListesi";
import { Wallet } from "lucide-react";

interface Props {
  customer: Customer;
  devices: (Device & { service_records: any[]; filter_plans: any[] })[];
  appointments: Appointment[];
  notes: CustomerNote[];
  totalIncome?: number;
}

const statusColors: Record<string, string> = {
  bekliyor: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  onaylandi: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  tamamlandi: "bg-brand-aqua/15 text-brand-aqua border-brand-aqua/20",
  iptal: "bg-red-500/15 text-red-400 border-red-500/20",
  devam_ediyor: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

const statusLabels: Record<string, string> = {
  bekliyor: "Bekliyor", onaylandi: "Onaylandı", tamamlandi: "Tamamlandı",
  iptal: "İptal", devam_ediyor: "Devam Ediyor",
};

type Tab = "cihazlar" | "servis" | "randevular" | "notlar";

export function CustomerDetailClient({ customer, devices, appointments, notes: initialNotes, totalIncome = 0 }: Props) {
  const [tab, setTab] = useState<Tab>("servis");
  const [editModal, setEditModal] = useState(false);
  const [hizliIslemModal, setHizliIslemModal] = useState(false);
  const [cihazModal, setCihazModal] = useState<{ open: boolean; device?: any }>({ open: false });
  const [notes, setNotes] = useState<CustomerNote[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const allServiceRecords = devices.flatMap((d) =>
    (d.service_records ?? []).map((s: any) => ({
      ...s,
      device: d,
    }))
  ).sort((a, b) => new Date(b.servis_tarihi).getTime() - new Date(a.servis_tarihi).getTime());

  const addNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("customer_notes")
      .insert({ customer_id: customer.id, icerik: newNote.trim() })
      .select()
      .single();
    if (data) setNotes([data, ...notes]);
    setNewNote("");
    setAddingNote(false);
  };

  const deleteNote = async (id: string) => {
    const supabase = createClient();
    await supabase.from("customer_notes").delete().eq("id", id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "servis", label: "Servis Geçmişi", icon: Wrench, count: allServiceRecords.length },
    { id: "randevular", label: "Randevular", icon: CalendarDays, count: appointments.length },
    { id: "notlar", label: "Notlar", icon: MessageSquare, count: notes.length },
  ];

  const [provisioning, setProvisioning] = useState(false);
  const hasAccount = !!(customer as any).user_id;

  const handleProvision = async () => {
    if (!customer.email) {
      alert("Hesap oluşturmak için müşterinin e-posta adresi kayıtlı olmalıdır.");
      return;
    }
    if (!confirm("Bu müşteri için otomatik giriş hesabı oluşturulacak ve şifre WhatsApp/Email ile gönderilecektir. Onaylıyor musunuz?")) return;

    setProvisioning(true);
    try {
      const res = await fetch("/api/admin/customers/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          ad: customer.ad,
          telefon: customer.telefon,
          email: customer.email
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hesap oluşturulamadı");
      alert("Hesap başarıyla oluşturuldu ve bilgiler müşteriye gönderildi.");
      window.location.reload();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setProvisioning(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/musteriler" className="flex items-center gap-1.5 hover:text-brand-navy transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Müşteriler
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{customer.ad}</span>
      </div>

      {/* Müşteri Başlık Kartı - Bu kısım koyu kalabilir (gradient olduğu için) */}
      <div className="bg-gradient-to-br from-brand-aqua/30 to-[#0f1c26] border border-brand-aqua/15 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        {hasAccount && (
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-aqua/20 text-brand-aqua text-[10px] font-bold tracking-widest uppercase rounded-bl-xl border-l border-b border-brand-aqua/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-aqua animate-pulse" />
            Aktif Müşteri Paneli
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-aqua to-brand-aqua flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {customer.ad.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">{customer.ad}</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <a href={`tel:${customer.telefon}`} className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition">
                  <Phone className="w-3.5 h-3.5 text-brand-aqua" /> {customer.telefon}
                </a>
                {customer.email && (
                  <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition">
                    <Mail className="w-3.5 h-3.5 text-brand-aqua" /> {customer.email}
                  </a>
                )}
                {customer.adres && (
                  <span className="flex items-center gap-1.5 text-sm text-white/80">
                    <MapPin className="w-3.5 h-3.5 text-brand-aqua" /> {customer.adres}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHizliIslemModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-aqua hover:bg-brand-aqua/90 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-brand-aqua/20"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni İşlem Ekle
            </button>
            <button
              onClick={() => setEditModal(true)}
              className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              <Edit2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {(customer.islem_1 || customer.islem_tarihi) && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="bg-brand-aqua text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-md">
              <Wrench className="w-4 h-4 text-white" />
              <span className="font-bold">Son İşlem:</span>
              <span className="font-medium">{[customer.islem_1, customer.islem_2, customer.islem_3].filter(Boolean).join(", ") || "Belirtilmemiş"}</span>
            </div>
            {customer.islem_tarihi && (
              <div className="bg-[#0f1c26]/50 text-white border border-white/10 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-sm">
                <CalendarDays className="w-4 h-4 text-brand-aqua" />
                <span className="font-medium">{format(new Date(customer.islem_tarihi), "d MMM yyyy", { locale: tr })}</span>
              </div>
            )}
          </div>
        )}

        {customer.notlar && (
          <p className="mt-4 text-sm text-white/70 bg-white/5 rounded-lg px-3 py-2 border-l-2 border-brand-aqua/40 w-fit max-w-2xl">
            {customer.notlar}
          </p>
        )}

        {/* Özet İstatistikler */}
        <div className="flex gap-10 mt-6 pt-6 border-t border-white/10">
          {[
            { label: "Servis Kaydı", value: allServiceRecords.length },
            { label: "Randevu", value: appointments.length },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white leading-none mb-1">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-brand-aqua/80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id
              ? "bg-white text-brand-navy shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? "bg-brand-aqua/10 text-brand-aqua" : "bg-slate-200 text-slate-500"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab İçerikleri */}
      <div className="min-h-[400px]">
        {tab === "servis" && (
          <div className="space-y-3">
            {allServiceRecords.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl py-16 text-center">
                <Wrench className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">Servis kaydı yok</p>
              </div>
            ) : (
              allServiceRecords.map((s: any) => (
                <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {s.device?.marka} {s.device?.model}
                      </p>
                      <p className="text-slate-900 font-medium">{s.aciklama}</p>
                      {s.teknisyen && <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-brand-aqua" /> Teknisyen: {s.teknisyen}
                      </p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusColors[s.durum]}`}>
                        {statusLabels[s.durum]}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {format(new Date(s.servis_tarihi), "d MMM yyyy", { locale: tr })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "randevular" && (
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl py-16 text-center">
                <CalendarDays className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">Randevu kaydı yok</p>
              </div>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-900 font-bold">{a.hizmet_turu}</p>
                      {a.teknisyen && <p className="text-xs text-slate-500 mt-1">Teknisyen: {a.teknisyen}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusColors[a.durum]}`}>
                        {statusLabels[a.durum]}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {format(new Date(a.randevu_tarihi), "d MMM yyyy HH:mm", { locale: tr })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "notlar" && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Bu müşteri için yeni bir not ekleyin..."
                rows={3}
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
              />
              <div className="flex justify-end mt-2 pt-2 border-t border-slate-200">
                <button
                  onClick={addNote}
                  disabled={!newNote.trim() || addingNote}
                  className="px-4 py-2 bg-brand-aqua text-white text-sm font-bold rounded-lg transition disabled:opacity-40 shadow-sm"
                >
                  {addingNote ? "Ekleniyor..." : "Notu Kaydet"}
                </button>
              </div>
            </div>

            {notes.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl py-16 text-center">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">Henüz not eklenmemiş</p>
              </div>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-aqua/30 transition shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-700 leading-relaxed flex-1 whitespace-pre-wrap">{n.icerik}</p>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                    <CalendarDays className="w-3 h-3 text-slate-300" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {format(new Date(n.created_at), "d MMM yyyy HH:mm", { locale: tr })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modaller */}
      {editModal && (
        <MusteriFormModal
          item={customer}
          onClose={() => setEditModal(false)}
          onSaved={() => { setEditModal(false); window.location.reload(); }}
        />
      )}
      {hizliIslemModal && (
        <HizliIslemModal
          customer={customer}
          onClose={() => setHizliIslemModal(false)}
        />
      )}
    </div>
  );
}
