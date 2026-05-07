"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";

export function BorclarClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const supabase = createClient();

  const handleMarkAsPaid = async (id: string) => {
    if (!confirm("Bu kaydı tahsil edilmiş olarak işaretlemek istediğinize emin misiniz?")) return;
    
    setLoadingId(id);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ durum: 'odendi', tarih: new Date().toISOString() }) // Update date to today if requested, but better to keep original and just mark odendi.
        .eq("id", id);
        
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert("Hata oluştu: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlem Özeti</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tutar</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Müşteri Detay</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Not / Açıklama</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialData.length > 0 ? (
              initialData.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-slate-600 font-medium">{new Date(tx.tarih).toLocaleDateString("tr-TR")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {tx.kategori}
                  </td>
                  <td className="px-6 py-4 text-rose-600 font-bold text-base">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(tx.tutar)}
                  </td>
                  <td className="px-6 py-4">
                     {tx.customers?.ad ? (
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold">{tx.customers.ad}</span>
                          <span className="text-slate-500 text-xs">{tx.customers.telefon}</span>
                        </div>
                     ) : (
                       <span className="text-slate-400 italic text-xs">Müşteri Bağlantısı Yok</span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {tx.aciklama || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800 transition-all font-semibold"
                      onClick={() => handleMarkAsPaid(tx.id)}
                      disabled={loadingId === tx.id}
                    >
                      {loadingId === tx.id ? "İşleniyor..." : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> 
                          Tahsil Et
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-aqua/10 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-6 h-6 text-brand-aqua" />
                    </div>
                    <p className="text-slate-900/60 font-medium">Hiç borçlu müşteri veya açık hesap bulunmuyor.</p>
                    <p className="text-slate-400 text-xs mt-1">Harika iş çıkarıyorsunuz!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
