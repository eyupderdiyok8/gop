"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FileText, Trash2, Loader2, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { FinansListesi } from "./FinansListesi";
import Link from "next/link";

interface Props {
  initialTransactions: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  range: string;
}

export function RecentTransactionsClient({ 
  initialTransactions,
  currentPage,
  totalPages,
  totalCount,
  range
}: Props) {
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

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // range around current page
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === 2 && currentPage - delta > 2) ||
        (i === totalPages - 1 && currentPage + delta < totalPages - 1)
      ) {
        pages.push("...");
      }
    }
    // Remove consecutive duplicates of "..."
    return pages.filter((item, pos, self) => self.indexOf(item) === pos);
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Toplam <b>{totalCount}</b> işlemden <b>{(currentPage - 1) * 25 + 1}-{Math.min(currentPage * 25, totalCount)}</b> arası gösteriliyor
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <Link
              href={`?range=${range}&page=${currentPage - 1}`}
              className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                currentPage <= 1
                  ? "pointer-events-none opacity-50 bg-slate-100 border-slate-200 text-slate-400"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
              }`}
            >
              Önceki
            </Link>
            
            <div className="flex items-center gap-1.5">
              {getPageNumbers().map((p, idx) => {
                if (p === "...") {
                  return (
                    <span key={`dots-${idx}`} className="text-slate-400 px-1 text-xs">
                      ...
                    </span>
                  );
                }
                return (
                  <Link
                    key={`page-${p}`}
                    href={`?range=${range}&page=${p}`}
                    className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                      p === currentPage
                        ? "bg-brand-aqua border-brand-aqua text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            <Link
              href={`?range=${range}&page=${currentPage + 1}`}
              className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50 bg-slate-100 border-slate-200 text-slate-400"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
              }`}
            >
              Sonraki
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
