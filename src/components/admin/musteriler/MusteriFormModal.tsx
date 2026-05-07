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
  email: z.string().email("Geçerli email").optional().or(z.literal("")),
  adres: z.string().optional(),
  notlar: z.string().optional(),
  createAccount: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  item?: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MusteriFormModal({ item, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const hasAccount = !!(item as any)?.user_id;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: item
      ? {
        ad: item.ad,
        telefon: item.telefon,
        email: item.email ?? "",
        adres: item.adres ?? "",
        notlar: item.notlar ?? "",
        createAccount: false
      }
      : {
        ad: "",
        telefon: "",
        email: "",
        adres: "",
        notlar: "",
        createAccount: true
      },
  });

  const createAccountChecked = watch("createAccount");

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    const { createAccount, ...rest } = data;
    const payload = { ...rest, email: rest.email || null, adres: rest.adres || null, notlar: rest.notlar || null };

    const supabase = createClient();
    let customerId = item?.id;

    // 1. Müşteri Kaydı/Güncelleme
    const { data: savedData, error: err } = item
      ? await supabase.from("customers").update(payload).eq("id", item.id).select().single()
      : await supabase.from("customers").insert(payload).select().single();

    if (err) {
      setSaving(false);
      setError(err.message);
      return;
    }

    customerId = savedData.id;

    // 2. Hesap Oluşturma (Eğer seçiliyse ve email varsa)
    if (createAccount && data.email && customerId) {
      try {
        const provRes = await fetch("/api/admin/customers/provision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            ad: data.ad,
            telefon: data.telefon,
            email: data.email
          })
        });
        const provData = await provRes.json();
        if (!provRes.ok) throw new Error(provData.error || "Hesap oluşturulamadı");

        if (provData.password) {
          setGeneratedPassword(provData.password);
          return; // Modal kapanmasın şifreyi görsün
        }
      } catch (provErr: any) {
        setSaving(false);
        setError(`Müşteri kaydedildi ancak hesap oluşturulamadı: ${provErr.message}`);
        return;
      }
    }

    setSaving(false);
    if (!generatedPassword) onSaved();
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-heading font-bold text-slate-900">
            {item ? "Müşteriyi Düzenle" : "Yeni Müşteri Ekle"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar bg-white">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {generatedPassword && (
            <div className="bg-brand-aqua/10 border border-brand-aqua/20 text-brand-aqua rounded-xl p-5 mb-4 text-center">
              <p className="text-xs uppercase font-bold tracking-widest mb-2 opacity-60">GEÇİCİ ŞİFRE OLUŞTURULDU</p>
              <div className="text-2xl font-mono font-bold tracking-wider mb-3 text-slate-900">{generatedPassword}</div>
              <p className="text-[11px] leading-relaxed text-slate-600 mb-4 italic">
                Bu şifre müşteriye WhatsApp/Email ile gönderilmeye çalışıldı. <br /> Güvenlik için şifreyi kopyalayıp manuel olarak da iletebilirsiniz.
              </p>
              <Button type="button" onClick={onSaved} className="w-full bg-brand-aqua hover:bg-brand-aqua text-white shadow-lg shadow-brand-aqua/20 transition-all">Tamam, Kapat</Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Müşteri Adı Soyadı" name="ad" placeholder="Ahmet Yılmaz" required />
            </div>
            <Field label="Telefon" name="telefon" type="tel" placeholder="0530 479 47 22" required />
            <Field label="E-posta" name="email" type="email" placeholder="ahmet@email.com" />
          </div>

          <Field label="Adres" name="adres" placeholder="Gaziosmanpaşa, İstanbul" />

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Notlar</label>
            <textarea
              {...register("notlar")}
              rows={3}
              placeholder="Müşteri hakkında özel notlar..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-aqua/50 transition resize-none"
            />
          </div>

          {!hasAccount && (
            <div className="p-4 rounded-xl bg-brand-aqua/10 border border-brand-aqua/20 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("createAccount")}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-brand-aqua focus:ring-brand-aqua/50 transition"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Müşteri için giriş hesabı oluştur
                </span>
              </label>
              {createAccountChecked && (
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed ml-7">
                  * 8 haneli rastgele şifre oluşturulacak ve müşteriye WhatsApp/Email ile gönderilecektir. (Email alanı dolu olmalıdır)
                </p>
              )}
            </div>
          )}

          {hasAccount && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 italic">Bu müşterinin aktif bir paneli bulunmaktadır.</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition">
              İptal
            </button>
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

