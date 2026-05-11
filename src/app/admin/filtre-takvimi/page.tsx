"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FilterPlan } from "@/lib/types";
import { Filter, AlertTriangle, Clock, CheckCircle, Plus, Bell, Edit2, Trash2 } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

type FilterWithRelations = FilterPlan & {
  devices: {
    marka: string;
    model: string;
    seri_no: string | null;
    customers: { ad: string; telefon: string; email: string | null } | null;
  } | null;
};

type View = "tumu" | "yaklasan" | "gecmis";

function urgencyLevel(sonraki: string) {
  const days = differenceInDays(parseISO(sonraki), new Date());
  if (days < 0) return "gecmis";
  if (days <= 7) return "kritik";
  if (days <= 14) return "yaklasan";
  return "normal";
}

const urgencyConfig = {
  gecmis: { label: "Süresi Geçmiş", color: "bg-red-500/15 text-red-400 border-red-500/20" },
  kritik: { label: "7 Gün İçinde", color: "bg-brand-aqua/15 text-brand-aqua border-brand-aqua/20" },
  yaklasan: { label: "14 Gün İçinde", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  normal: { label: "Planlandı", color: "bg-brand-aqua/15 text-brand-aqua border-brand-aqua/20" },
};

export default function FiltreTablimiPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("tumu");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    // 1. Fetch from filter_plans (Device-based)
    const { data: devicePlans } = await supabase
      .from("filter_plans")
      .select("*, devices(marka, model, seri_no, customers(ad, telefon, email))")
      .order("sonraki_degisim", { ascending: true });

    // 2. Fetch from customers (Customer-based)
    const { data: customerPlans } = await supabase
      .from("customers")
      .select("id, ad, telefon, email, islem_1, islem_2, islem_3, islem_tarihi, sonraki_islem_tarihi, teknisyen")
      .not("sonraki_islem_tarihi", "is", null)
      .order("sonraki_islem_tarihi", { ascending: true });

    const unifiedPlans: any[] = [
      ...((devicePlans as any[]) ?? []).map(p => ({
        id: p.id,
        type: 'device',
        customer_name: p.devices?.customers?.ad,
        customer_phone: p.devices?.customers?.telefon,
        device_info: `${p.devices?.marka} ${p.devices?.model}`,
        last_date: p.son_degisim_tarihi,
        next_date: p.sonraki_degisim,
        periyot: p.periyot_gun,
        teknisyen: p.teknisyen, // if exists
        raw: p
      })),
      ...((customerPlans as any[]) ?? []).map(c => ({
        id: c.id,
        type: 'customer',
        customer_name: c.ad,
        customer_phone: c.telefon,
        device_info: [c.islem_1, c.islem_2].filter(Boolean).join(", ") || "Genel Servis",
        last_date: c.islem_tarihi,
        next_date: c.sonraki_islem_tarihi,
        periyot: differenceInDays(parseISO(c.sonraki_islem_tarihi), parseISO(c.islem_tarihi || c.created_at)),
        teknisyen: c.teknisyen,
        raw: c
      }))
    ].sort((a, b) => new Date(a.next_date).getTime() - new Date(b.next_date).getTime());

    setPlans(unifiedPlans);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const sendNotification = async (plan: FilterWithRelations) => {
    setSendingId(plan.id);
    try {
      const res = await fetch("/api/bildirim/filtre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      if (res.ok) setSentIds((s) => new Set([...s, plan.id]));
    } catch {}
    setSendingId(null);
  };

  const markChanged = async (plan: FilterWithRelations) => {
    const today = new Date().toISOString().split("T")[0];
    const supabase = createClient();
    await supabase.from("filter_plans").update({
      son_degisim_tarihi: today,
      bildirim_gonderildi_7: false,
      bildirim_gonderildi_1: false,
    }).eq("id", plan.id);
    fetchPlans();
  };

  const deletePlan = async (plan: any) => {
    if (!confirm("Bu filtre değişim planını takvimden kaldırmak istediğinizden emin misiniz?")) return;
    const supabase = createClient();
    
    if (plan.type === 'customer') {
      // Müşteri bazlı ise sadece tarih alanını temizle
      const { error } = await supabase.from("customers").update({ sonraki_islem_tarihi: null }).eq("id", plan.id);
      if (!error) fetchPlans();
    } else {
      // Cihaz bazlı ise planı sil
      const { error } = await supabase.from("filter_plans").delete().eq("id", plan.id);
      if (!error) fetchPlans();
    }
  };

  const filtered = plans.filter((p) => {
    const u = urgencyLevel(p.next_date);
    if (view === "gecmis") return u === "gecmis";
    if (view === "yaklasan") return u === "kritik" || u === "yaklasan";
    return true;
  });

  const counts = {
    tumu: plans.length,
    yaklasan: plans.filter((p) => ["kritik", "yaklasan"].includes(urgencyLevel(p.next_date))).length,
    gecmis: plans.filter((p) => urgencyLevel(p.next_date) === "gecmis").length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900">Filtre Değişim Takvimi</h1>
        <p className="text-slate-500 text-sm mt-1">Tüm cihazların filtre değişim planları</p>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: "tumu" as View, label: "Tüm Planlar", count: counts.tumu, icon: Filter, color: "text-brand-aqua bg-brand-aqua/10" },
          { id: "yaklasan" as View, label: "Yaklaşan (≤14 gün)", count: counts.yaklasan, icon: Clock, color: "text-amber-400 bg-amber-500/10" },
          { id: "gecmis" as View, label: "Süre Aşımı", count: counts.gecmis, icon: AlertTriangle, color: "text-red-400 bg-red-500/10" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setView(s.id)}
            className={`text-left p-5 rounded-2xl border transition-all ${
              view === s.id
                ? "bg-slate-50 border-white/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.count}</p>
            <p className="text-slate-500 text-sm mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            {view === "tumu" ? "Tüm Planlar" : view === "yaklasan" ? "Yaklaşan Değişimler" : "Süresi Geçmiş"}
          </h2>
          <span className="text-xs text-slate-400">{filtered.length} kayıt</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-brand-aqua/20 border-t-brand-aqua rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Filter className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Bu kategoride plan yok</p>
            </div>
          ) : (
            filtered.map((plan: any) => {
              const u = urgencyLevel(plan.next_date);
              const cfg = urgencyConfig[u];
              const days = differenceInDays(parseISO(plan.next_date), new Date());
              const isSent = sentIds.has(plan.id);
              const sending = sendingId === plan.id;
 
              return (
                <div key={plan.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/3 transition">
                  {/* Urgency Indicator */}
                  <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${
                    u === "gecmis" ? "bg-red-500" : u === "kritik" ? "bg-brand-aqua" : u === "yaklasan" ? "bg-amber-500" : "bg-brand-aqua"
                  }`} />
 
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-900 font-medium truncate">
                        {plan.customer_name ?? "—"}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {plan.type === 'customer' && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">Müşteri Bazlı</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {plan.device_info}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-400">
                        Son işlem: {plan.last_date ? format(parseISO(plan.last_date), "d MMM yyyy", { locale: tr }) : "—"}
                      </span>
                      {plan.periyot > 0 && <span className="text-xs text-slate-400">Periyot: {plan.periyot} gün</span>}
                      {plan.teknisyen && <span className="text-xs text-slate-400 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-brand-aqua" /> {plan.teknisyen}</span>}
                    </div>
                  </div>
 
                  {/* Tarih */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${u === "gecmis" ? "text-red-400" : u === "kritik" ? "text-brand-aqua" : "text-slate-900"}`}>
                      {format(parseISO(plan.next_date), "d MMM yyyy", { locale: tr })}
                    </p>
                    <p className={`text-xs mt-0.5 ${days < 0 ? "text-red-400" : "text-slate-400"}`}>
                      {days < 0 ? `${Math.abs(days)} gün önce geçti` : days === 0 ? "Bugün!" : `${days} gün kaldı`}
                    </p>
                  </div>
 
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => sendNotification(plan)}
                      disabled={sending || isSent}
                      title="Bildirim Gönder"
                      className={`p-2 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                        isSent
                          ? "bg-brand-aqua/10 text-brand-aqua cursor-default"
                          : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                      } disabled:opacity-50`}
                    >
                      {isSent ? <CheckCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </button>
                    {plan.type === 'device' && (
                      <button
                        onClick={() => markChanged(plan)}
                        title="Filtre Değiştirildi"
                        className="p-2 rounded-lg bg-brand-aqua/10 text-brand-aqua hover:bg-brand-aqua/20 transition text-xs"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deletePlan(plan)}
                      title="Planı Sil"
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
