"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TiptapEditor } from "./TiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  ImageIcon, 
  Loader2, 
  Globe, 
  Image as ImageFormIcon 
} from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  initialData?: any;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Genel",
    excerpt: "",
    content: "",
    featured_image: "",
    seo_title: "",
    seo_description: "",
    is_published: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        category: initialData.category || "Genel",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        featured_image: initialData.featured_image || "",
        seo_title: initialData.seo_title || "",
        seo_description: initialData.seo_description || "",
        is_published: initialData.is_published || false,
      });
    }
  }, [initialData]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: initialData ? prev.slug : generateSlug(title), // Sadece yeni kayıtta otomatik slug
      seo_title: initialData ? prev.seo_title : title,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.url) {
          setFormData(prev => ({ ...prev, featured_image: data.url }));
        }
      } catch (err) {
        alert("Görsel yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    try {
      let error;
      if (initialData?.id) {
        ({ error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", initialData.id));
      } else {
        ({ error } = await supabase
          .from("blogs")
          .insert(payload));
      }

      if (error) throw error;
      
      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/blog" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Yazılara Dön
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <Switch 
              checked={formData.is_published} 
              onCheckedChange={(val: boolean) => setFormData(prev => ({ ...prev, is_published: val }))}
            />
            <Label className="text-slate-700 text-sm cursor-pointer">
              {formData.is_published ? "Yayında" : "Taslak"}
            </Label>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="gradient-teal">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon: Ana İçerik */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-700">Yazı Başlığı (H1)</Label>
            <Input 
              value={formData.title} 
              onChange={handleTitleChange}
              placeholder="Başlığı giriniz..."
              className="bg-white border-slate-200 text-slate-900 text-lg font-bold h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-500">URL Slug</Label>
            <Input 
              value={formData.slug} 
              onChange={(e: any) => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase() }))}
              placeholder="url-slug-yapisi"
              className="bg-white border-slate-200 text-slate-400 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">İçerik (Editör)</Label>
            <TiptapEditor 
              content={formData.content} 
              onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} 
            />
          </div>
        </div>

        {/* Sağ Kolon: Ayarlar & SEO */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-slate-900 font-semibold flex items-center gap-2 mb-2">
              <ImageFormIcon className="w-4 h-4 text-brand-aqua" /> Kapak Görseli
            </h3>
            {formData.featured_image ? (
              <div className="relative group rounded-xl overflow-hidden aspect-video">
                <img src={formData.featured_image} className="w-full h-full object-cover" alt="Kapak" />
                <button 
                  onClick={() => setFormData(p => ({ ...p, featured_image: "" }))}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                >
                  Değiştir / Kaldır
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl aspect-video flex flex-col items-center justify-center bg-slate-50">
                <input type="file" id="cover-upload" hidden onChange={handleImageUpload} accept="image/*" />
                <label 
                  htmlFor="cover-upload" 
                  className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-brand-aqua transition-colors"
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Görsel Seç</span>
                </label>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-slate-900 font-semibold mb-2">Yazı Ayarları</h3>
            <div className="space-y-2">
              <Label className="text-slate-600 text-xs uppercase tracking-wider">Kategori</Label>
              <Input 
                value={formData.category} 
                onChange={(e: any) => setFormData(p => ({ ...p, category: e.target.value }))}
                className="bg-white border-slate-200 text-slate-900 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600 text-xs uppercase tracking-wider">Kısa Özet (Meta Description İçin)</Label>
              <Textarea 
                value={formData.excerpt} 
                onChange={(e: any) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                placeholder="Bu yazı ne hakkında? Kısaca özetle..."
                className="bg-white border-slate-200 text-slate-900 text-sm min-h-[100px]"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-slate-900 font-semibold flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-brand-aqua" /> SEO Ayarları
            </h3>
            <div className="space-y-2">
              <Label className="text-slate-600 text-xs">SEO Title (Opsiyonel)</Label>
              <Input 
                value={formData.seo_title} 
                onChange={(e: any) => setFormData(p => ({ ...p, seo_title: e.target.value }))}
                className="bg-white border-slate-200 text-slate-900 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600 text-xs">SEO Description (Opsiyonel)</Label>
              <Textarea 
                value={formData.seo_description} 
                onChange={(e: any) => setFormData(p => ({ ...p, seo_description: e.target.value }))}
                className="bg-white border-slate-200 text-slate-900 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
