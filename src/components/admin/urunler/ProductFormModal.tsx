"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, 
  Loader2, 
  Trash2, 
  Plus, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Droplets,
  Link as LinkIcon 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product, ProductCategory } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır"),
  slug: z.string().min(2, "Slug gereklidir"),
  tagline: z.string().optional().nullable().or(z.literal("")),
  category_id: z.string().min(1, "Kategori seçiniz"),
  price: z.number().optional().nullable(),
  old_price: z.number().optional().nullable(),
  description: z.string().optional().nullable().or(z.literal("")),
  badge: z.string().optional().nullable().or(z.literal("")),
  badge_color: z.string().optional().nullable().or(z.literal("")),
  is_active: z.boolean().default(true),
  is_highlight: z.boolean().default(false),
  main_image: z.string().optional().nullable().or(z.literal("")),
  gallery: z.array(z.string()).default([]),
  specs: z.array(z.string()).default([]),
  features: z.array(z.object({
    title: z.string(),
    icon: z.string(),
    desc: z.string()
  })).default([]),
  meta_title: z.string().optional().nullable().or(z.literal("")),
  meta_description: z.string().optional().nullable().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productSchema>;

const iconOptions = [
  { value: "zap", label: "Hızlı / Enerji", icon: Zap },
  { value: "shield", label: "Güvenli / Koruma", icon: ShieldCheck },
  { value: "droplet", label: "Su / Likit", icon: Droplets },
  { value: "settings", label: "Sistem / Ayar", icon: Settings },
];

interface ProductFormModalProps {
  item?: Product | null;
  categories: ProductCategory[];
  onClose: () => void;
  onSaved: () => void;
}

export function ProductFormModal({ item, categories, onClose, onSaved }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: item?.name ?? "",
      slug: item?.slug ?? "",
      tagline: item?.tagline ?? "",
      category_id: item?.category_id ?? "",
      price: item?.price ?? null,
      old_price: item?.old_price ?? null,
      description: item?.description ?? "",
      badge: item?.badge ?? "",
      badge_color: item?.badge_color ?? "bg-brand-aqua text-white",
      is_active: item?.is_active ?? true,
      is_highlight: item?.is_highlight ?? false,
      main_image: item?.main_image ?? "",
      gallery: item?.gallery ?? [],
      specs: item?.specs ?? [],
      features: item?.features ?? [],
      meta_title: item?.meta_title ?? "",
      meta_description: item?.meta_description ?? "",
    },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: "specs" as any
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features"
  });

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    const supabase = createClient();
    
    const payload = {
      ...values,
      updated_at: new Date().toISOString()
    };

    if (item) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", item.id);
      
      if (error) {
        alert("Güncelleme hatası: " + error.message);
      } else {
        // Stok senkronizasyonu
        await supabase.from("inventory").upsert({
          urun_adi: values.name,
          kategori: "Su Arıtma Cihazı",
          birim_fiyat: values.price || 0,
          marka: "SuArıtmaServis34"
        }, { onConflict: 'urun_adi' });
        
        onSaved();
      }
    } else {
      const { data: newProduct, error } = await supabase
        .from("products")
        .insert([payload])
        .select()
        .single();

      if (error) {
        alert("Ekleme hatası: " + error.message);
      } else {
        // Stok senkronizasyonu (Yeni ürün)
        await supabase.from("inventory").insert({
          urun_adi: values.name,
          kategori: "Su Arıtma Cihazı",
          adet: 0,
          min_stok_esigi: 5,
          birim_fiyat: values.price || 0,
          marka: "SuArıtmaServis34"
        });

        onSaved();
      }
    }
    setLoading(false);
  };

  const autoGenerateSlug = () => {
    const name = form.getValues("name");
    const slug = name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    form.setValue("slug", slug);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#14222c] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#14222c] z-10">
          <div>
            <h2 className="text-xl font-heading font-bold text-white">
              {item ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>
            <p className="text-white/40 text-xs mt-1">Ürün detaylarını ve görsellerini buradan yönetin.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 scrollbar-thin scrollbar-thumb-white/10">
          <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            
            {/* 1. Basic Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-aqua uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-aqua/10 flex items-center justify-center text-[10px]">01</span>
                Temel Bilgiler
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Ürün Adı</label>
                    <input 
                      {...form.register("name")} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition"
                      placeholder="Örn: SuArıtmaServis34 HomeRO Pro 7"
                    />
                    {form.formState.errors.name && <p className="text-red-400 text-[10px] ml-1">{form.formState.errors.name.message}</p>}
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1 flex items-center justify-between">
                      Ürün Slug (URL)
                      <button type="button" onClick={autoGenerateSlug} className="text-brand-aqua normal-case font-medium hover:underline flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" /> Otomatik Oluştur
                      </button>
                    </label>
                    <input 
                      {...form.register("slug")} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition"
                      placeholder="homero-pro-7"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Kategori</label>
                    <select 
                       {...form.register("category_id")}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition appearance-none"
                    >
                      <option value="" className="bg-[#14222c]">Kategori Seçin</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#14222c]">{cat.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Slogan / Kısa Açıklama</label>
                    <input 
                      {...form.register("tagline")} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition"
                      placeholder="7 Kademeli Mineral Dengeli Arıtma"
                    />
                 </div>
              </div>
            </div>

            {/* 2. Pricing & Status */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-aqua uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-aqua/10 flex items-center justify-center text-[10px]">02</span>
                Fiyat ve Durum
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase ml-1">Fiyat (₺)</label>
                  <input 
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition"
                    placeholder="4200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase ml-1">Eski Fiyat (İndirimlise)</label>
                  <input 
                    type="number"
                    step="0.01"
                    {...form.register("old_price", { valueAsNumber: true })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition"
                    placeholder="5100"
                  />
                </div>
                <div className="flex flex-col justify-center gap-2 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" {...form.register("is_active")} className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-brand-aqua focus:ring-brand-aqua/40 transition" />
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">Yayında</span>
                  </label>
                </div>
                <div className="flex flex-col justify-center gap-2 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" {...form.register("is_highlight")} className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-brand-aqua focus:ring-brand-aqua/40 transition" />
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">Öne Çıkan</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Rozet Metni (Örn: En Çok Satan)</label>
                    <input 
                      {...form.register("badge")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Rozet Rengi (CSS Class)</label>
                    <input 
                      {...form.register("badge_color")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition"
                    />
                 </div>
              </div>
            </div>

            {/* 3. Images */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-aqua uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-aqua/10 flex items-center justify-center text-[10px]">03</span>
                Görseller
              </h3>
              <div className="space-y-8">
                <ImageUpload 
                  label="Ana Ürün Görseli (Kapak)"
                  bucket="products"
                  value={form.watch("main_image") || ""}
                  onChange={(url) => form.setValue("main_image", url as string)}
                />
                
                <ImageUpload 
                  label="Ürün Galerisi (Çoklu Seçilebilir)"
                  bucket="products"
                  multiple
                  value={form.watch("gallery") || []}
                  onChange={(urls) => form.setValue("gallery", urls as string[])}
                />
              </div>
            </div>

            {/* 4. Specs & Features */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-aqua uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-aqua/10 flex items-center justify-center text-[10px]">04</span>
                Teknik Bilgi & Özellikler
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">TEKNİK ÖZELLİKLER (LİSTE)</label>
                  {specFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input 
                        {...form.register(`specs.${index}` as any)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                        placeholder="Örn: 12 L/sa üretim kapasitesi"
                      />
                      <button type="button" onClick={() => removeSpec(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => appendSpec("")} 
                    className="flex items-center justify-center gap-2 py-2 border border-dashed border-white/20 rounded-xl text-xs text-white/40 hover:text-white hover:border-brand-aqua/50 transition-all font-bold"
                  >
                    <Plus className="w-3 h-3" /> YENİ ÖZELLİK EKLE
                  </button>
                </div>

                <div className="flex flex-col gap-6 pt-6 border-t border-white/5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">ÖNE ÇIKAN DETAYLAR (İKONLU)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureFields.map((field, index) => (
                      <div key={field.id} className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5 space-y-4 relative">
                        <button type="button" onClick={() => removeFeature(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                              <label className="text-[10px] text-white/40 font-bold uppercase">Başlık</label>
                              <input {...form.register(`features.${index}.title`)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] text-white/40 font-bold uppercase">İkon</label>
                              <select {...form.register(`features.${index}.icon`)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white">
                                {iconOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-[#14222c]">{opt.label}</option>)}
                              </select>
                           </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 font-bold uppercase">Kısa Açıklama</label>
                          <textarea {...form.register(`features.${index}.desc`)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white h-16" />
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => appendFeature({ title: "", icon: "zap", desc: "" })} 
                      className="flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-white/10 text-white/20 hover:text-brand-aqua hover:border-brand-aqua/50 hover:bg-white/5 transition-all text-sm font-bold p-8"
                    >
                      <Plus className="w-8 h-8" />
                      YENİ DETAY KARTI EKLE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. SEO & Description */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-brand-aqua uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-aqua/10 flex items-center justify-center text-[10px]">05</span>
                İçerik & SEO
              </h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Uzun Açıklama (Ürün Sayfası İçeriği)</label>
                    <textarea 
                      {...form.register("description")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-aqua/40 outline-none transition h-40"
                      placeholder="Ürün hakkında detaylı bilgi, kullanım alanları vb..."
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase ml-1">Meta Başlık</label>
                        <input {...form.register("meta_title")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase ml-1">Meta Açıklama</label>
                        <textarea {...form.register("meta_description")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-24" />
                    </div>
                 </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/10 bg-[#14222c] flex items-center justify-end gap-4 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            İptal
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-brand-aqua hover:bg-brand-aqua text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-aqua/20 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : item ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
          </button>
        </div>
      </div>
    </div>
  );
}
