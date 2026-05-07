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

interface Props {
  customer: Customer;
  devices: (Device & { service_records: any[]; filter_plans: any[] })[];
  appointments: Appointment[];
  notes: CustomerNote[];
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

export function CustomerDetailClient({ customer, devices, appointments, notes: initialNotes }: Props) {
  const [tab, setTab] = useState<Tab>("cihazlar");
  const [editModal, setEditModal] = useState(false);
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
    { id: "cihazlar", label: "Cihazlar", icon: Cpu, count: devices.length },
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
      <div className="flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin/musteriler" className="flex items-center gap-1.5 hover:text-white/70 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Müşteriler
        </Link>
        <span>/</span>
        <span className="text-white/70">{customer.ad}</span>
      </div>

      {/* Müşteri Başlık Kartı */}
      <div className="bg-gradient-to-br from-brand-aqua/30 to-[#0f1c26] border border-brand-aqua/15 rounded-2xl p-6 relative overflow-hidden">
        {hasAccount && (
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-aqua/20 text-brand-aqua text-[10px] font-bold tracking-widest uppercase rounded-bl-xl border-l border-b border-brand-aqua/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-aqua animate-pulse" />
            Aktif Müşteri Paneli
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-aqua to-brand-aqua flex items-center justify-center text-white font-bold text-xl">
              {customer.ad.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">{customer.ad}</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <a href={`tel:${customer.telefon}`} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-brand-aqua transition">
                  <Phone className="w-3.5 h-3.5" /> {customer.telefon}
                </a>
                {customer.email && (
                  <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-brand-aqua transition">
                    <Mail className="w-3.5 h-3.5" /> {customer.email}
                  </a>
                )}
                {customer.adres && (
                  <span className="flex items-center gap-1.5 text-sm text-white/60">
                    <MapPin className="w-3.5 h-3.5" /> {customer.adres}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hasAccount && (
              <button
                onClick={handleProvision}
                disabled={provisioning}
                className="flex items-center gap-2 px-4 py-2 bg-brand-aqua hover:bg-brand-aqua text-white rounded-xl text-xs font-bold transition disabled:opacity-50 shadow-lg shadow-brand-aqua/20"
              >
                {provisioning ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                Panel Oluştur
              </button>
            )}
            <button
              onClick={() => setEditModal(true)}
              className="p-2.5 text-white/40 hover:text-white hover:bg-white/8 rounded-xl transition"
            >
              <Edit2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {customer.notlar && (
          <p className="mt-4 text-sm text-white/50 bg-white/5 rounded-lg px-3 py-2 border-l-2 border-brand-aqua/40 w-fit max-w-2xl">
            {customer.notlar}
          </p>
        )}

        {/* Özet İstatistikler */}
        <div className="flex gap-6 mt-6 pt-6 border-t border-white/8">
          {[
            { label: "Cihaz", value: devices.length },
            { label: "Servis Kaydı", value: allServiceRecords.length },
            { label: "Randevu", value: appointments.length },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id
                ? "bg-brand-aqua/20 text-brand-aqua border border-brand-aqua/20"
                : "text-white/50 hover:text-white"
              }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-brand-aqua/20" : "bg-white/8"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab İçerikleri */}
      {tab === "cihazlar" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setCihazModal({ open: true })}
              className="flex items-center gap-2 px-4 py-2 bg-brand-aqua/20 hover:bg-brand-aqua/30 text-brand-aqua rounded-xl text-sm font-medium transition border border-brand-aqua/20"
            >
              <Plus className="w-3.5 h-3.5" /> Cihaz Ekle
            </button>
          </div>
          {devices.length === 0 ? (
            <div className="bg-white/5 border border-white/8 rounded-2xl py-12 text-center">
              <Cpu className="w-10 h-10 text-white/10 mx-auto mb-2" />
              <p className="text-white/30 text-sm">Kayıtlı cihaz yok</p>
            </div>
          ) : (
            devices.map((d) => (
              <div key={d.id} className="bg-white/5 border border-white/8 rounded-xl p-5 hover:border-white/15 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{d.marka} {d.model}</p>
                    {d.seri_no && <p className="text-xs text-white/40 mt-1">S/N: {d.seri_no}</p>}
                    {d.satin_alma_tarihi && (
                      <p className="text-xs text-white/40">
                        Satın Alım: {format(new Date(d.satin_alma_tarihi), "d MMM yyyy", { locale: tr })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-bold text-white">{d.service_records?.length ?? 0}</p>
                      <p className="text-xs text-white/30">Servis</p>
                    </div>
                    {d.filter_plans?.[0] && (
                      <div>
                        <p className="text-xs text-amber-400 font-medium">
                          {format(new Date(d.filter_plans[0].sonraki_degisim), "d MMM", { locale: tr })}
                        </p>
                        <p className="text-xs text-white/30">Filtre</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "servis" && (
        <div className="space-y-3">
          {allServiceRecords.length === 0 ? (
            <div className="bg-white/5 border border-white/8 rounded-2xl py-12 text-center">
              <Wrench className="w-10 h-10 text-white/10 mx-auto mb-2" />
              <p className="text-white/30 text-sm">Servis kaydı yok</p>
            </div>
          ) : (
            allServiceRecords.map((s: any) => (
              <div key={s.id} className="bg-white/5 border border-white/8 rounded-xl p-5 hover:border-white/15 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/50 mb-1">
                      {s.device?.marka} {s.device?.model}
                    </p>
                    <p className="text-white">{s.aciklama}</p>
                    {s.teknisyen && <p className="text-xs text-white/40 mt-1">Teknisyen: {s.teknisyen}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[s.durum]}`}>
                      {statusLabels[s.durum]}
                    </span>
                    <span className="text-xs text-white/30">
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
            <div className="bg-white/5 border border-white/8 rounded-2xl py-12 text-center">
              <CalendarDays className="w-10 h-10 text-white/10 mx-auto mb-2" />
              <p className="text-white/30 text-sm">Randevu kaydı yok</p>
            </div>
          ) : (
            appointments.map((a) => (
              <div key={a.id} className="bg-white/5 border border-white/8 rounded-xl p-5 hover:border-white/15 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{a.hizmet_turu}</p>
                    {a.teknisyen && <p className="text-xs text-white/40 mt-1">Teknisyen: {a.teknisyen}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[a.durum]}`}>
                      {statusLabels[a.durum]}
                    </span>
                    <span className="text-sm text-white/50">
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
          {/* Not Ekle */}
          <div className="bg-white/5 border border-white/8 rounded-xl p-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Yeni not ekle..."
              rows={3}
              className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={addNote}
                disabled={!newNote.trim() || addingNote}
                className="px-4 py-2 bg-brand-aqua hover:bg-brand-aqua text-white text-sm rounded-lg transition disabled:opacity-40"
              >
                {addingNote ? "Ekleniyor..." : "+ Not Ekle"}
              </button>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="bg-white/5 border border-white/8 rounded-2xl py-12 text-center">
              <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-2" />
              <p className="text-white/30 text-sm">Henüz not eklenmemiş</p>
            </div>
          ) : (
            notes.map((n) => (
              <div key={n.id} className="group bg-white/5 border border-white/8 rounded-xl p-4 hover:border-white/15 transition">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-white/80 flex-1">{n.icerik}</p>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-white/30 mt-2">
                  {format(new Date(n.created_at), "d MMM yyyy HH:mm", { locale: tr })}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modaller */}
      {editModal && (
        <MusteriFormModal
          item={customer}
          onClose={() => setEditModal(false)}
          onSaved={() => { setEditModal(false); window.location.reload(); }}
        />
      )}
      {cihazModal.open && (
        <CihazFormModal
          customerId={customer.id}
          device={cihazModal.device}
          onClose={() => setCihazModal({ open: false })}
          onSaved={() => { setCihazModal({ open: false }); window.location.reload(); }}
        />
      )}
    </div>
  );
}
