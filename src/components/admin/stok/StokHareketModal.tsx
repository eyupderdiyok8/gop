"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { X, ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import type { InventoryItem, Technician } from "@/lib/types";

const schema = z.object({
  hareket_turu: z.enum(["giris", "cikis"]),
  miktar: z.coerce.number().int().min(1, "En az 1 adet"),
  aciklama: z.string().optional(),
  yapan_kullanici: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSaved: () => void;
}

export function StokHareketModal({ item, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teknisyenler, setTeknisyenler] = useState<Technician[]>([]);

  useEffect(() => {
    createClient().from("technicians").select("*").eq("aktif", true).order("ad_soyad").then(({ data }) => setTeknisyenler(data ?? []));
  }, []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema) as any,
    defaultValues: { hareket_turu: "giris", miktar: 1 },
  });

  const hareket = watch("hareket_turu");

  const onSubmit = async (data: FormData) => {
    if (data.hareket_turu === "cikis" && data.miktar > item.adet) {
      setError("Stokta bu kadar ürün yok!");
      return;
    }
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("inventory_movements").insert({
      inventory_id: item.id,
      hareket_turu: data.hareket_turu,
      miktar: data.miktar,
      aciklama: data.aciklama || null,
      yapan_kullanici: data.yapan_kullanici || null,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">Stok Hareketi</h2>
            <p className="text-sm text-slate-500 mt-0.5">{item.urun_adi}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 bg-white">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Mevcut Stok */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">Mevcut Stok</span>
            <span className={`text-2xl font-bold ${item.adet <= item.min_stok_esigi ? "text-red-600" : "text-slate-900"}`}>
              {item.adet} adet
            </span>
          </div>

          {/* Hareket Türü */}
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all ${
                hareket === "giris"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <input type="radio" value="giris" {...register("hareket_turu")} className="sr-only" />
              <ArrowDown className="w-4 h-4" />
              <span className="text-sm font-medium">Stok Girişi</span>
            </label>
            <label
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all ${
                hareket === "cikis"
                  ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <input type="radio" value="cikis" {...register("hareket_turu")} className="sr-only" />
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">Stok Çıkışı</span>
            </label>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Miktar *</label>
            <input
              type="number" {...register("miktar")} min={1}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 transition"
            />
            {errors.miktar && <p className="text-red-500 text-xs mt-1">{errors.miktar.message as string}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Açıklama</label>
            <input
              {...register("aciklama")}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 transition"
              placeholder="ör: Servis #123 için kullanıldı"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">İşlemi Yapan</label>
            <select
              {...register("yapan_kullanici")}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 transition appearance-none"
            >
              <option value="">Seçin (Opsiyonel)</option>
              {teknisyenler.map((t) => (
                <option key={t.id} value={t.ad_soyad}>{t.ad_soyad}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition"
            >
              İptal
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 px-4 py-3 rounded-xl bg-brand-aqua hover:bg-brand-aqua text-white text-base font-bold shadow-lg shadow-brand-aqua/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {saving ? "Kaydediliyor..." : hareket === "giris" ? "Giriş Yap" : "Çıkış Yap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
