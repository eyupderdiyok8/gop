"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, Trash2, Loader2, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { FinansListesi } from "./FinansListesi";

interface Props {
  initialTransactions: any[];
}

export function RecentTransactionsClient({ initialTransactions }: Props) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Bu finansal işlemi silmek istediğinizden emin misiniz?")) return;

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTransactions(transactions.filter((tx) => tx.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };
  const handleExport = () => {
    const data = transactions.map(tx => ({
      'Tarih': new Date(tx.tarih).toLocaleDateString('tr-TR'),
      'Tür': tx.tur === 'gelir' ? 'Gelir' : 'Gider',
      'Kategori': tx.kategori,
      'Açıklama': tx.aciklama || '-',
      'Müşteri': tx.customers?.ad || '-',
      'Kimin Yaptığı': tx.yapan_kullanici || 'Admin',
      'Tutar': tx.tutar,
      'Durum': tx.durum === 'odendi' ? 'Kasada' : tx.durum === 'bekliyor' ? 'Açık Hesap' : 'İptal'
    }));
    exportToExcel(data, "Finans_Raporu");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">Son İşlemler</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Dışa Aktar</span><span className="xs:hidden">Excel</span>
          </button>
          <FinansListesi />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-400 font-medium uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4">İşlem / Kategori</th>
              <th className="px-6 py-4">Müşteri</th>
              <th className="px-6 py-4">Kimin Yaptığı</th>
              <th className="px-6 py-4 text-right">Tutar</th>
              <th className="px-6 py-4 text-center">Durum</th>
              <th className="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length > 0 ? (
              transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {new Date(tx.tarih).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      {tx.tur === 'gelir' ? (
                        <div className="w-6 h-6 rounded bg-brand-aqua/10 text-brand-aqua flex flex-shrink-0 items-center justify-center text-[10px] font-bold">↓</div>
                      ) : (
                        <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex flex-shrink-0 items-center justify-center text-[10px] font-bold">↑</div>
                      )}
                      {tx.kategori}
                    </div>
                    <div className="text-slate-400 text-xs mt-1 max-w-xs truncate" title={tx.aciklama}>
                      {tx.aciklama || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {tx.customers?.ad || <span className="text-slate-300 text-xs italic">Cari Yok</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {tx.yapan_kullanici || "Admin"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={tx.tur === 'gelir' ? 'text-brand-aqua font-semibold' : 'text-rose-600 font-semibold'}>
                      {tx.tur === 'gelir' ? '+' : '-'} {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(tx.tutar)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge 
                      variant="secondary" 
                      className={
                        tx.durum === 'odendi' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                        tx.durum === 'bekliyor' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                        'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }
                    >
                      {tx.durum === 'odendi' ? 'Kasada' : tx.durum === 'bekliyor' ? 'Açık Hesap' : 'İptal'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletingId === tx.id}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="İşlemi Sil"
                    >
                      {deletingId === tx.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  Henüz hiçbir finansal kayıt girilmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
