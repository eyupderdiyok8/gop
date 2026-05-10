import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Clock, 
  BadgeAlert
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinansListesi } from "./FinansListesi";
import { FinansGrafik } from "@/components/admin/FinansGrafik";
import { RecentTransactionsClient } from "./RecentTransactionsClient";

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
    .select("tur, tutar, durum, tarih")
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

      <RecentTransactionsClient initialTransactions={recentTransactions || []} />
    </div>
  );
}
