"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";
import type { Appointment, Technician } from "@/lib/types";

const schema = z.object({
  musteri_adi: z.string().min(2, "Ad en az 2 karakter"),
  musteri_telefon: z.string().min(10, "Geçerli telefon"),
  musteri_email: z.string().email("Geçerli email").optional().or(z.literal("")),
  musteri_adres: z.string().optional().or(z.literal("")),
  hizmet_turu: z.string().min(1, "Hizmet türü seçin"),
  randevu_tarihi: z.string().min(1, "Tarih/saat seçin"),
  teknisyen: z.string().optional(),
  durum: z.enum(["bekliyor", "onaylandi", "tamamlandi", "iptal"]),
  notlar: z.string().optional(),
  notify: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

const HIZMET_TURLERI = [
  "Filtre Değişimi", "Arıza Giderme",
  "Kurulum", "Fiyat Teklifi", "Diğer",
];



interface Props {
  item?: Appointment | null;
  onClose: () => void;
  onSaved: () => void;
}

export function RandevuFormModal({ item, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teknisyenler, setTeknisyenler] = useState<Technician[]>([]);

  useEffect(() => {
    createClient().from("technicians").select("*").eq("aktif", true).order("ad_soyad").then(({ data }) => setTeknisyenler(data ?? []));
  }, []);

  const defaultDateTime = item
    ? item.randevu_tarihi.slice(0, 16)
    : (() => {
      const d = new Date();
      d.setMinutes(0, 0, 0);
      d.setHours(d.getHours() + 1);
      return d.toISOString().slice(0, 16);
    })();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: item
      ? {
        musteri_adi: item.musteri_adi,
        musteri_telefon: item.musteri_telefon,
        musteri_email: item.musteri_email ?? "",
        musteri_adres: item.musteri_adres ?? "",
        hizmet_turu: item.hizmet_turu,
        randevu_tarihi: defaultDateTime,
        teknisyen: item.teknisyen ?? "",
        durum: item.durum,
        notlar: item.notlar ?? "",
        notify: false,
      }
      : { durum: "bekliyor", randevu_tarihi: defaultDateTime, notify: true },
  });

  const watchStatus = watch("durum");

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    const payload = {
      ...data,
      musteri_email: data.musteri_email || null,
      musteri_adres: data.musteri_adres || null,
      teknisyen: data.teknisyen || null,
      notlar: data.notlar || null,
      randevu_tarihi: new Date(data.randevu_tarihi).toISOString(),
    };
    const supabase = createClient();
    const { data: savedData, error: err } = item
      ? await supabase.from("appointments").update(payload).eq("id", item.id).select().single()
      : await supabase.from("appointments").insert(payload).select().single();

    if (err) {
      setSaving(false);
      setError(err.message);
      return;
    }

    // 2. Bildirim Gönder (Eğer onaylandı durumundaysa ve notify seçiliyse)
    if (data.durum === "onaylandi" && data.notify && savedData) {
      setNotifying(true);
      try {
        await fetch("/api/admin/appointments/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId: savedData.id })
        });
      } catch (notifyErr) {
        console.error("Notification trigger error:", notifyErr);
      }
      setNotifying(false);
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f1c26] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 sticky top-0 bg-[#0f1c26] z-10">
          <h2 className="text-lg font-heading font-bold text-white">
            {item ? "Randevuyu Düzenle" : "Yeni Randevu"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}

          {[
            { label: "Müşteri Adı *", name: "musteri_adi", type: "text", placeholder: "Ahmet Yılmaz" },
            { label: "Telefon *", name: "musteri_telefon", type: "tel", placeholder: "0530 479 47 22" },
            { label: "E-posta", name: "musteri_email", type: "email", placeholder: "ahmet@email.com" },
            { label: "Adres", name: "musteri_adres", type: "text", placeholder: "Mahalle, sokak..." },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">{label}</label>
              <input type={type} {...register(name as any)} placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-aqua/50 transition" />
              {errors[name as keyof FormData] && (
                <p className="text-red-400 text-xs mt-1">{(errors[name as keyof FormData] as any)?.message}</p>
              )}
            </div>
          ))}

          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Hizmet Türü *</label>
            <select {...register("hizmet_turu")} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-aqua/50 transition">
              <option value="" className="bg-[#0f1c26]">Seçin...</option>
              {HIZMET_TURLERI.map((h) => <option key={h} value={h} className="bg-[#0f1c26]">{h}</option>)}
            </select>
            {errors.hizmet_turu && <p className="text-red-400 text-xs mt-1">{errors.hizmet_turu.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Tarih & Saat *</label>
              <input type="datetime-local" {...register("randevu_tarihi")}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-aqua/50 transition" />
              {errors.randevu_tarihi && <p className="text-red-400 text-xs mt-1">{errors.randevu_tarihi.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Teknisyen</label>
              <select {...register("teknisyen")} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-aqua/50 transition">
                <option value="" className="bg-[#0f1c26]">Atanmadı</option>
                {teknisyenler.map((t) => <option key={t.id} value={t.ad_soyad} className="bg-[#0f1c26]">{t.ad_soyad}</option>)}
              </select>
            </div>
          </div>

          {item && (
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Durum</label>
              <select {...register("durum")} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-aqua/50 transition">
                {["bekliyor", "onaylandi", "tamamlandi", "iptal"].map((s) => (
                  <option key={s} value={s} className="bg-[#0f1c26]">
                    {s === "bekliyor" ? "Bekliyor" : s === "onaylandi" ? "Onaylandı" : s === "tamamlandi" ? "Tamamlandı" : "İptal"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Notlar</label>
            <textarea {...register("notlar")} rows={2} placeholder="Ek bilgi..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-aqua/50 transition resize-none" />
          </div>

          {watchStatus === "onaylandi" && (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("notify")}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500/50 transition"
                />
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  Müşteriye WhatsApp/Email ile bilgi gönder
                </span>
              </label>
              <p className="text-[11px] text-blue-400/70 leading-relaxed ml-7 font-medium">
                * Müşteriye randevu saati ve teknisyen bilgisini içeren onay mesajı iletilecektir.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition">İptal</button>
            <button type="submit" disabled={saving || notifying} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-aqua hover:bg-brand-aqua text-white text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-60">
              {(saving || notifying) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Kaydediliyor..." : notifying ? "Haber Veriliyor..." : "Kaydet ve Onayla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
