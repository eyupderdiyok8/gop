"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";
import type { Technician } from "@/lib/types";

const schema = z.object({
  device_id: z.string().min(1, "Cihaz seçin"),
  aciklama: z.string().min(5, "Açıklama en az 5 karakter"),
  durum: z.enum(["bekliyor", "devam_ediyor", "tamamlandi", "iptal"]),
  teknisyen: z.string().optional(),
  servis_tarihi: z.string().min(1, "Tarih girin"),
  notlar: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  item?: any;
  onClose: () => void;
  onSaved: () => void;
}

export function ServisFormModal({ item, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [teknisyenler, setTeknisyenler] = useState<Technician[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("devices").select("id, marka, model, customers(ad)").then(({ data }) => setDevices(data ?? []));
    supabase.from("technicians").select("*").eq("aktif", true).order("ad_soyad").then(({ data }) => setTeknisyenler(data ?? []));
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          device_id: item.device_id,
          aciklama: item.aciklama,
          durum: item.durum,
          teknisyen: item.teknisyen ?? "",
          servis_tarihi: item.servis_tarihi,
          notlar: item.notlar ?? "",
        }
      : { durum: "bekliyor", servis_tarihi: new Date().toISOString().split("T")[0] },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    const payload = { ...data, teknisyen: data.teknisyen || null, notlar: data.notlar || null };
    const supabase = createClient();
    const { error: err } = item
      ? await supabase.from("service_records").update(payload).eq("id", item.id)
      : await supabase.from("service_records").insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
          <h2 className="text-lg font-heading font-bold text-slate-900">{item ? "Kaydı Düzenle" : "Yeni Servis Kaydı"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 bg-white overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Cihaz *</label>
            <select
              {...register("device_id")}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition appearance-none"
            >
              <option value="">Cihaz seçin...</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {(d.customers as any)?.ad} — {d.marka} {d.model}
                </option>
              ))}
            </select>
            {errors.device_id && <p className="text-red-500 text-xs mt-1">{errors.device_id.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Açıklama *</label>
            <textarea
              {...register("aciklama")}
              rows={3}
              placeholder="Yapılan işlem, sorun, notlar..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition resize-none"
            />
            {errors.aciklama && <p className="text-red-500 text-xs mt-1">{errors.aciklama.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Durum</label>
              <select
                {...register("durum")}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition appearance-none"
              >
                {[["bekliyor", "Bekliyor"], ["devam_ediyor", "Devam Ediyor"], ["tamamlandi", "Tamamlandı"], ["iptal", "İptal"]].map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Servis Tarihi *</label>
              <input
                type="date"
                {...register("servis_tarihi")}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Teknisyen</label>
            <select
              {...register("teknisyen")}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition appearance-none"
            >
              <option value="">Atanmadı</option>
              {teknisyenler.map((t) => (
                <option key={t.id} value={t.ad_soyad}>{t.ad_soyad}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Ek Notlar</label>
            <textarea
              {...register("notlar")}
              rows={2}
              placeholder="Ek bilgi..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg bg-brand-aqua hover:bg-brand-aqua text-white text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-brand-aqua/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
