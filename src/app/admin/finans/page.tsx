import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Plus, 
  Clock, 
  FileText,
  BadgeAlert
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FinansListesi } from "./FinansListesi";
import { FinansGrafik } from "@/components/admin/FinansGrafik";

export const dynamic = "force-dynamic";

export default async function FinansPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // Get current month boundaries
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  // Fetch all transactions for this month to calculate totals
  const { data: monthTransactions } = await supabase
    .from("transactions")
    .select("tur, tutar, durum")
    .gte("tarih", firstDay)
    .lte("tarih", lastDay);

  let aylikGelir = 0;
  let aylikGider = 0;
  let bekleyenTahsilat = 0;

  const dailyDataMap = new Map();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthName = now.toLocaleString('tr-TR', { month: 'short' });
  for (let i = 1; i <= daysInMonth; i++) {
    dailyDataMap.set(i, { name: `${i} ${monthName}`, Gelir: 0, Gider: 0 });
  }

  if (monthTransactions) {
    monthTransactions.forEach((t: any) => {
      if (t.tur === "gelir") {
        if (t.durum === "odendi") {
          aylikGelir += Number(t.tutar);
          const day = new Date(t.tarih).getDate();
          const dayData = dailyDataMap.get(day);
          if (dayData) dayData.Gelir += Number(t.tutar);
        }
        if (t.durum === "bekliyor") bekleyenTahsilat += Number(t.tutar);
      } else if (t.tur === "gider") {
        if (t.durum === "odendi") {
          aylikGider += Number(t.tutar);
          const day = new Date(t.tarih).getDate();
          const dayData = dailyDataMap.get(day);
          if (dayData) dayData.Gider += Number(t.tutar);
        }
      }
    });
  }

  const chartData = Array.from(dailyDataMap.values());

  const netKar = aylikGelir - aylikGider;

  // Fetch recent 50 transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*, customers(ad, telefon)")
    .order("tarih", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  // Total Open Receivables (All time)
  const { data: allPending } = await supabase
    .from("transactions")
    .select("tutar")
    .eq("tur", "gelir")
    .eq("durum", "bekliyor");

  const totalBekleyen = allPending?.reduce((acc: number, t: any) => acc + Number(t.tutar), 0) || 0;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finans ve Kasa</h1>
          <p className="text-slate-900/60 text-sm mt-1">İşletmenizin nakit akışını ve açık hesaplarını takip edin.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
            <Link href="/admin/finans/borclar">
              <Clock className="w-4 h-4 mr-2 text-amber-500" />
              Borçlu Müşteriler
            </Link>
          </Button>
          <FinansListesi modalOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Aylık Net Kar</CardTitle>
            <Wallet className="w-4 h-4 text-brand-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(netKar)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Bu ay kasanızda kalan</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Bu Ay Toplam Gelir</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-brand-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-aqua">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(aylikGelir)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Tahsilatı yapılmış gelirler</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Bu Ay Toplam Gider</CardTitle>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(aylikGider)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Parça, yakıt, maaş harcamaları</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Açık Hesap (Alacaklar)</CardTitle>
            <BadgeAlert className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalBekleyen)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Tüm zamanlar veresiye bakiye</p>
          </CardContent>
        </Card>
      </div>

      <FinansGrafik data={chartData} />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Son İşlemler</h2>
          </div>
          <FinansListesi />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Henüz hiçbir finansal kayıt girilmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
