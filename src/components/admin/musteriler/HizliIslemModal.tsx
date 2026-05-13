"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/lib/types";

interface Props {
  customer: Customer;
  onClose: () => void;
}

const ODEME_OPTIONS = ["", "Kredi Kartı", "Havale", "Nakit", "Borç"];
const GUN_OPTIONS = [
  { label: "Seçiniz", value: 0 },
  { label: "90 Gün", value: 90 },
  { label: "180 Gün", value: 180 },
  { label: "360 Gün", value: 360 },
];

export function HizliIslemModal({ customer, onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teknisyenler, setTeknisyenler] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("technicians").select("*").eq("aktif", true).order("ad_soyad").then(({ data }) => setTeknisyenler(data ?? []));
  }, []);

  const [formData, setFormData] = useState({
    islem_tarihi: new Date().toISOString().split("T")[0],
    sonraki_islem_gun: 0,
    islem_1: "",
    islem_2: "",
    islem_3: "",
    odeme_yontemi: "",
    islem_tutari: "",
    teknisyen: customer.teknisyen || "",
    sonraki_islem_tarihi: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    const tutar = parseFloat(formData.islem_tutari) || 0;

    const payload = {
      islem_tarihi: formData.islem_tarihi || null,
      sonraki_islem_gun: formData.sonraki_islem_gun || null,
      islem_1: formData.islem_1 || null,
      islem_2: formData.islem_2 || null,
      islem_3: formData.islem_3 || null,
      odeme_yontemi: formData.odeme_yontemi || null,
      islem_tutari: tutar || null,
      teknisyen: formData.teknisyen || null,
      sonraki_islem_tarihi: formData.sonraki_islem_tarihi || null,
    };

    const supabase = createClient();

    // 1. Müşteri tablosunu güncelle
    const { error: err } = await supabase
      .from("customers")
      .update(payload)
      .eq("id", customer.id);

    if (err) {
      setSaving(false);
      setError(err.message);
      return;
    }

    // 2. Finansal işlem (transaction) oluştur (Eğer tutar varsa)
    if (tutar > 0) {
      await supabase.from("transactions").insert({
        tur: "gelir",
        kategori: formData.islem_1 || "Servis İşlemi",
        tutar: tutar,
        tarih: formData.islem_tarihi || new Date().toISOString().split("T")[0],
        aciklama: `${customer.ad} - Hizli İşlem (${formData.islem_1 || ''} ${formData.islem_2 || ''})`,
        durum: formData.odeme_yontemi === "Borç" ? "bekliyor" : "odendi",
        customer_id: customer.id,
        yapan_kullanici: formData.teknisyen || "Admin"
      });
    }

    // 3. Servis Kaydı oluştur
    await supabase.from("service_records").insert({
      customer_id: customer.id,
      servis_tarihi: formData.islem_tarihi || new Date().toISOString().split("T")[0],
      sonraki_servis_tarihi: formData.sonraki_islem_tarihi || null,
      aciklama: `${[formData.islem_1, formData.islem_2, formData.islem_3].filter(Boolean).join(", ") || 'Genel Servis / Bakım'}`,
      durum: "tamamlandi",
      teknisyen: formData.teknisyen || null,
      notlar: formData.odeme_yontemi ? `Ödeme: ${formData.odeme_yontemi} - ${tutar} TL` : null
    });

    setSaving(false);
    onClose();
    window.location.reload();
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <h2 className="text-lg font-heading font-bold text-slate-900">
            Yeni İşlem Ekle (Hızlı)
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar bg-white flex-1">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">İşlem Tarihi</label>
                <input
                  type="date"
                  name="islem_tarihi"
                  value={formData.islem_tarihi}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Sonraki İşlem Tarihi</label>
                <input
                  type="date"
                  name="sonraki_islem_tarihi"
                  value={formData.sonraki_islem_tarihi}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Teknisyen</label>
                <select
                  name="teknisyen"
                  value={formData.teknisyen}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {teknisyenler.map((t) => (
                    <option key={t.id} value={t.ad_soyad}>{t.ad_soyad}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">1. İşlem</label>
                <input
                  type="text"
                  name="islem_1"
                  placeholder="Örn: Filtre Değişimi"
                  value={formData.islem_1}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">2. İşlem</label>
                <input
                  type="text"
                  name="islem_2"
                  placeholder="Örn: Bakım"
                  value={formData.islem_2}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">3. İşlem</label>
                <input
                  type="text"
                  name="islem_3"
                  placeholder="Diğer..."
                  value={formData.islem_3}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Ödeme Yöntemi</label>
                <select name="odeme_yontemi" value={formData.odeme_yontemi} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none">
                  {ODEME_OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt || "Seçiniz"}</option>)}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">İşlem Tutarı (₺)</label>
                <input
                  type="number"
                  name="islem_tutari"
                  placeholder="0.00"
                  value={formData.islem_tutari}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-aqua/50 outline-none"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={saving} 
            className="bg-brand-aqua hover:bg-brand-aqua/90 text-white min-w-[120px]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Kaydediliyor..." : "İşlemi Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
