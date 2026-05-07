"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";

const schema = z.object({
  marka: z.string().min(1, "Marka zorunlu"),
  model: z.string().min(1, "Model zorunlu"),
  seri_no: z.string().optional(),
  satin_alma_tarihi: z.string().optional(),
  // Filtre planı
  filtre_periyot: z.coerce.number().int().min(1).optional(),
  filtre_son_degisim: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  customerId: string;
  device?: any;
  onClose: () => void;
  onSaved: () => void;
}

export function CihazFormModal({ customerId, device, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema) as any,
    defaultValues: device
      ? { marka: device.marka, model: device.model, seri_no: device.seri_no ?? "", satin_alma_tarihi: device.satin_alma_tarihi ?? "" }
      : { filtre_periyot: 90 },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const devicePayload = {
      customer_id: customerId,
      marka: data.marka,
      model: data.model,
      seri_no: data.seri_no || null,
      satin_alma_tarihi: data.satin_alma_tarihi || null,
    };

    let deviceId = device?.id;

    if (device) {
      const { error: err } = await supabase.from("devices").update(devicePayload).eq("id", device.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { data: newDevice, error: err } = await supabase.from("devices").insert(devicePayload).select().single();
      if (err) { setError(err.message); setSaving(false); return; }
      deviceId = newDevice.id;
    }

    // Filtre planı ekleme
    if (!device && data.filtre_son_degisim && data.filtre_periyot) {
      await supabase.from("filter_plans").insert({
        device_id: deviceId,
        son_degisim_tarihi: data.filtre_son_degisim,
        periyot_gun: data.filtre_periyot,
      });
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f1c26] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <h2 className="text-lg font-heading font-bold text-white">
            {device ? "Cihazı Düzenle" : "Yeni Cihaz Ekle"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Marka *</label>
              <input {...register("marka")} placeholder="Samsung, LG..." className="input-field" />
              {errors.marka && <p className="text-red-400 text-xs mt-1">{errors.marka.message as string}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Model *</label>
              <input {...register("model")} placeholder="AQ-5000" className="input-field" />
              {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model.message as string}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Seri No</label>
            <input {...register("seri_no")} placeholder="SN123456" className="input-field" />
          </div>

          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Satın Alma Tarihi</label>
            <input type="date" {...register("satin_alma_tarihi")} className="input-field" />
          </div>

          {!device && (
            <div className="border-t border-white/8 pt-4 space-y-3">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Filtre Planı (İsteğe Bağlı)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/60 mb-1.5 block">Son Değişim</label>
                  <input type="date" {...register("filtre_son_degisim")} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-1.5 block">Periyot (gün)</label>
                  <input type="number" {...register("filtre_periyot")} className="input-field" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition">İptal</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-aqua hover:bg-brand-aqua text-white text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
