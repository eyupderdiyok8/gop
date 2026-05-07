"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";
import type { InventoryItem } from "@/lib/types";

const schema = z.object({
  urun_adi: z.string().min(1, "Ürün adı zorunlu"),
  marka: z.string().optional(),
  kategori: z.string().min(1, "Kategori zorunlu"),
  adet: z.coerce.number().int().min(0, "Adet 0 veya üzeri olmalı"),
  min_stok_esigi: z.coerce.number().int().min(1, "En az 1"),
  birim_fiyat: z.coerce.number().min(0, "Fiyat 0 veya üzeri"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  item?: InventoryItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const KATEGORILER = [
  "Su Arıtma Cihazı", "Filtre", "Membran", "Tank", "Pompa", "Aksesuar",
  "Kimyasal", "Elektrik", "Boru & Bağlantı", "Diğer",
];

export function StokFormModal({ item, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema) as any,
    defaultValues: item
      ? {
        urun_adi: item.urun_adi,
        marka: item.marka ?? "",
        kategori: item.kategori,
        adet: item.adet,
        min_stok_esigi: item.min_stok_esigi,
        birim_fiyat: item.birim_fiyat,
      }
      : { kategori: "Filtre", marka: "", adet: 0, min_stok_esigi: 5, birim_fiyat: 0 },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = item
      ? await supabase.from("inventory").update(data).eq("id", item.id)
      : await supabase.from("inventory").insert(data);
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-heading font-bold text-slate-900">
            {item ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h2>
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

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Ürün Adı *</label>
            <input
              {...register("urun_adi")}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition"
              placeholder="ör: 5 Mikron Sediment Filtresi"
            />
            {errors.urun_adi && <p className="text-red-500 text-xs mt-1">{errors.urun_adi.message as string}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Marka</label>
            <input
              {...register("marka")}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition"
              placeholder="ör: LG, Vontron, vb."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Kategori *</label>
            <select
              {...register("kategori")}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition appearance-none"
            >
              {KATEGORILER.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Stok Adedi</label>
              <input
                type="number" {...register("adet")}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 transition"
              />
              {errors.adet && <p className="text-red-500 text-xs mt-1">{errors.adet.message as string}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Min. Eşik</label>
              <input
                type="number" {...register("min_stok_esigi")}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Birim Fiyat ₺</label>
              <input
                type="number" step="0.01" {...register("birim_fiyat")}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 transition"
              />
            </div>
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
              className="flex-1 px-4 py-3 rounded-xl bg-brand-aqua hover:bg-brand-aqua text-white text-base font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-brand-aqua/20"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
