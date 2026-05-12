"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { getSeoFileName } from "@/lib/slugify";

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  value: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
  label?: string;
}

export function ImageUpload({ bucket, folder = "products", value, onChange, multiple = false, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const urls: string[] = Array.isArray(value) ? [...value] : (value ? [value] : []);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = getSeoFileName(file.name);
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        console.error("Yükleme hatası:", error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (multiple) {
        urls.push(publicUrl);
      } else {
        onChange(publicUrl);
        setUploading(false);
        return;
      }
    }

    if (multiple) {
      onChange(urls);
    }
    setUploading(false);
  };

  const removeImage = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter(url => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-xs font-bold text-white/50 uppercase tracking-widest">{label}</label>}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Render existing images */}
        {multiple && Array.isArray(value) ? (
          value.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
              <img src={url} alt="Ürün" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        ) : !multiple && value && (
          <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
            <img src={value as string} alt="Kapak" className="w-full h-full object-cover" />
            <button
               type="button"
               onClick={() => onChange("")}
               className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Upload Button */}
        {(multiple || (!multiple && !value)) && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-brand-aqua/50 hover:bg-white/5 transition-all text-white/30 hover:text-brand-aqua"
          >
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            <span className="text-[10px] font-bold uppercase tracking-tight">{uploading ? 'Yükleniyor...' : 'Görsel Seç'}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
