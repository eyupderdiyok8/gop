"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Droplets, Maximize2 } from "lucide-react";

interface ProductImageGalleryProps {
  product: any;
  gallery: string[];
}

export function ProductImageGallery({ product, gallery }: ProductImageGalleryProps) {
  const [selectedImg, setSelectedImg] = useState(product.main_image);

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger render={<button type="button" className="block w-full text-left bg-transparent p-0 border-0 outline-none" />}>
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-white border border-border group relative cursor-pointer">
            {selectedImg ? (
              <img
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <Droplets className="w-16 h-16 text-brand-navy" />
              </div>
            )}
            
            {/* Zoom Icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all bg-white/90 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                <Maximize2 className="w-5 h-5 text-brand-aqua" />
              </div>
            </div>

            <div className="absolute top-8 left-8 flex flex-col gap-2">
              {product.is_highlight && (
                <Badge className="bg-amber-500 text-white border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                  Günün Fırsatı
                </Badge>
              )}
              {product.badge && (
                <Badge className={`${product.badge_color || 'bg-brand-aqua'} text-white border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg`}>
                  {product.badge}
                </Badge>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] md:max-w-[800px] bg-white border-border p-4 shadow-2xl">
           <img
             src={selectedImg}
             alt={product.name}
             className="w-full h-auto max-h-[80vh] object-contain"
           />
        </DialogContent>
      </Dialog>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {gallery.map((img: string, i: number) => (
            <div
              key={i}
              onClick={() => setSelectedImg(img)}
              className={`aspect-square rounded-2xl overflow-hidden border cursor-pointer hover:border-brand-aqua transition-all ${selectedImg === img ? 'border-brand-aqua ring-2 ring-brand-aqua/20' : 'border-border bg-white'}`}
            >
              <img src={img} alt={`${product.name} - ${i}`} className="w-full h-full object-contain p-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
