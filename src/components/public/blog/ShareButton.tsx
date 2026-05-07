"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `${title} - SuArıtmaServis34 Blog`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link panoya kopyalandı!");
      }
    } catch (err) {
      console.error("Paylaşım hatası:", err);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleShare}
      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-brand-aqua transition-colors"
    >
      <Share2 className="w-4 h-4 mr-2" /> Bu Yazıyı Paylaş
    </Button>
  );
}
