"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/lib/types";

const schema = z.object({
  ad: z.string().min(2, "Ad en az 2 karakter"),
  telefon: z.string().min(10, "Geçerli bir telefon numarası girin"),
  telefon2: z.string().optional().or(z.literal("")),
  adres: z.string().optional(),
  islem_tarihi: z.string().optional(),
  islem_1: z.string().optional(),
  islem_2: z.string().optional(),
  islem_3: z.string().optional(),
  odeme_yontemi: z.string().optional(),
  sonraki_islem_gun: z.coerce.number().optional().or(z.literal(0)),
  islem_tutari: z.coerce.number().optional().or(z.literal(0)),
});

type FormData = z.infer<typeof schema>;

interface Props {
  item?: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}

const ISLEM_OPTIONS = ["", "Cihaz satışı", "Filtre değişimi", "Bakım", "Diğer"];
const ODEME_OPTIONS = ["", "Kredi Kartı", "Havale", "Nakit", "Borç"];
const GUN_OPTIONS = [
  { label: "Seçiniz", value: 0 },
  { label: "90 Gün", value: 90 },
  { label: "180 Gün", value: 180 },
  { label: "360 Gün", value: 360 },
];

export function MusteriFormModal({ item, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: item
      ? {
        ad: item.ad,
        telefon: item.telefon,
        telefon2: item.telefon2 || "",
        adres: item.adres || "",
        islem_tarihi: item.islem_tarihi || "",
        islem_1: item.islem_1 || "",
        islem_2: item.islem_2 || "",
        islem_3: item.islem_3 || "",
        odeme_yontemi: item.odeme_yontemi || "",
        sonraki_islem_gun: item.sonraki_islem_gun || 0,
        islem_tutari: item.islem_tutari || 0,
      }
      : {
        ad: "",
        telefon: "",
        telefon2: "",
        adres: "",
        islem_tarihi: new Date().toISOString().split("T")[0], // Bugün
        islem_1: "",
        islem_2: "",
        islem_3: "",
        odeme_yontemi: "",
        sonraki_islem_gun: 0,
        islem_tutari: 0,
      },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    
    const payload = {
      ...data,
      adres: data.adres || null,
      telefon2: data.telefon2 || null,
      islem_tarihi: data.islem_tarihi || null,
      islem_1: data.islem_1 || null,
      islem_2: data.islem_2 || null,
      islem_3: data.islem_3 || null,
      odeme_yontemi: data.odeme_yontemi || null,
      sonraki_islem_gun: data.sonraki_islem_gun || null,
      islem_tutari: data.islem_tutari || null,
    };

    const supabase = createClient();

    // Sadece yeni kayıtta dönen ID'yi almak için select().single() kullanıyoruz.
    const { data: savedCustomer, error: err } = item
      ? await supabase.from("customers").update(payload).eq("id", item.id).select().single()
      : await supabase.from("customers").insert(payload).select().single();

    if (err) {
      setSaving(false);
      setError(err.message);
      return;
    }

    // YENİ Müşteri ise ve tutar girilmişse finans tablosuna Gelir olarak ekle
    if (!item && data.islem_tutari && data.islem_tutari > 0 && savedCustomer) {
      await supabase.from("transactions").insert({
        tur: "gelir",
        kategori: data.islem_1 || "Diğer",
        tutar: data.islem_tutari,
        tarih: data.islem_tarihi || new Date().toISOString().split("T")[0],
        aciklama: `${data.ad} - Yeni Müşteri Kaydı`,
        durum: data.odeme_yontemi === "Borç" ? "bekliyor" : "odendi",
        customer_id: savedCustomer.id
      });
    }

    setSaving(false);
    onSaved();
  };

  const Field = ({ label, name, type = "text", placeholder, required = false }: any) => (
    <div>
      <label className="text-xs font-medium text-slate-500 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition"
      />
      {errors[name as keyof FormData] && (
        <p className="text-red-500 text-xs mt-1">{(errors[name as keyof FormData] as any)?.message}</p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options }: any) => (
    <div>
      <label className="text-xs font-medium text-slate-500 mb-1.5 block">{label}</label>
      <select
        {...register(name)}
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50 focus:ring-1 focus:ring-brand-aqua/20 transition"
      >
        {options.map((opt: any, i: number) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : (opt || "Seçiniz")}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <h2 className="text-lg font-heading font-bold text-slate-900">
            {item ? "Müşteriyi Düzenle" : "Yeni Müşteri Ekle"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 overflow-y-auto custom-scrollbar bg-white flex-1">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div>
              <h3 className="text-sm font-semibold text-brand-navy mb-4 border-b pb-2">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Ad Soyad" name="ad" placeholder="Ahmet Yılmaz" required />
                <Field label="1. Telefon" name="telefon" placeholder="0555 555 55 55" required />
                <Field label="2. Telefon" name="telefon2" placeholder="0555 555 55 56" />
                <div className="md:col-span-2">
                  <Field label="Adres" name="adres" placeholder="Gaziosmanpaşa, İstanbul" />
                </div>
              </div>
            </div>

            {/* İşlem Bilgileri */}
            <div>
              <h3 className="text-sm font-semibold text-brand-navy mb-4 border-b pb-2">İşlem & Ödeme Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="İşlem Tarihi" name="islem_tarihi" type="date" />
                <SelectField label="Sonraki İşlem (Gün)" name="sonraki_islem_gun" options={GUN_OPTIONS} />
                
                <SelectField label="1. İşlem" name="islem_1" options={ISLEM_OPTIONS} />
                <SelectField label="2. İşlem" name="islem_2" options={ISLEM_OPTIONS} />
                <SelectField label="3. İşlem" name="islem_3" options={ISLEM_OPTIONS} />
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <SelectField label="Ödeme Yöntemi" name="odeme_yontemi" options={ODEME_OPTIONS} />
                  </div>
                  <div className="flex-1">
                    <Field label="İşlem Tutarı (₺)" name="islem_tutari" type="number" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit as any)}
            disabled={saving} 
            className="bg-brand-aqua hover:bg-brand-aqua/90 text-white min-w-[120px]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
