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

interface PageProps {
  searchParams: Promise<{
    range?: string;
    page?: string;
  }>;
}

export default async function FinansPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { range = "month", page = "1" } = await searchParams;
  const isAllTime = range === "all";

  // Get date boundaries if month filter
  const now = new Date();
  let query = supabase.from("transactions").select("tur, tutar, durum, tarih");

  if (!isAllTime) {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    query = query.gte("tarih", firstDay).lte("tarih", lastDay);
  }

  const { data: transactionsForCalculations } = await query;

  let totalGelir = 0;
  let totalGider = 0;
  let bekleyenTahsilat = 0;

  const dailyDataMap = new Map();
  const monthlyDataMap = new Map();

  if (!isAllTime) {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthName = now.toLocaleString('tr-TR', { month: 'short' });
    for (let i = 1; i <= daysInMonth; i++) {
      dailyDataMap.set(i, { name: `${i} ${monthName}`, Gelir: 0, Gider: 0 });
    }
  }

  if (transactionsForCalculations) {
    transactionsForCalculations.forEach((t: any) => {
      const tutarVal = Number(t.tutar);
      if (t.tur === "gelir") {
        if (t.durum === "odendi") {
          totalGelir += tutarVal;
          if (!isAllTime) {
            const day = new Date(t.tarih).getDate();
            const dayData = dailyDataMap.get(day);
            if (dayData) dayData.Gelir += tutarVal;
          } else {
            const d = new Date(t.tarih);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString('tr-TR', { month: 'short', year: 'numeric' });
            if (!monthlyDataMap.has(key)) {
              monthlyDataMap.set(key, { key, name: label, Gelir: 0, Gider: 0 });
            }
            monthlyDataMap.get(key).Gelir += tutarVal;
          }
        }
        if (t.durum === "bekliyor") bekleyenTahsilat += tutarVal;
      } else if (t.tur === "gider") {
        if (t.durum === "odendi") {
          totalGider += tutarVal;
          if (!isAllTime) {
            const day = new Date(t.tarih).getDate();
            const dayData = dailyDataMap.get(day);
            if (dayData) dayData.Gider += tutarVal;
          } else {
            const d = new Date(t.tarih);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString('tr-TR', { month: 'short', year: 'numeric' });
            if (!monthlyDataMap.has(key)) {
              monthlyDataMap.set(key, { key, name: label, Gelir: 0, Gider: 0 });
            }
            monthlyDataMap.get(key).Gider += tutarVal;
          }
        }
      }
    });
  }

  const chartData = isAllTime
    ? Array.from(monthlyDataMap.values())
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ name, Gelir, Gider }) => ({ name, Gelir, Gider }))
    : Array.from(dailyDataMap.values());

  const netKar = totalGelir - totalGider;

  // Pagination setups for recent transactions
  const PAGE_SIZE = 25;
  const currentPage = Number(page) || 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Fetch paginated transactions
  const { data: recentTransactions, count } = await supabase
    .from("transactions")
    .select("*, customers(ad, telefon)", { count: "exact" })
    .order("tarih", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

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
        <div className="flex flex-wrap items-center gap-3">
          {/* Time range selector tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <Link 
              href="?range=month" 
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${!isAllTime ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Bu Ay
            </Link>
            <Link 
              href="?range=all" 
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${isAllTime ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Tüm Zamanlar
            </Link>
          </div>

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
            <CardTitle className="text-sm font-medium text-slate-500">
              {isAllTime ? "Toplam Net Kar" : "Aylık Net Kar"}
            </CardTitle>
            <Wallet className="w-4 h-4 text-brand-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(netKar)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isAllTime ? "Tüm zamanlar net kasa" : "Bu ay kasanızda kalan"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              {isAllTime ? "Toplam Gelir" : "Bu Ay Toplam Gelir"}
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-brand-aqua" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-aqua">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalGelir)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Tahsilatı yapılmış gelirler</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              {isAllTime ? "Toplam Gider" : "Bu Ay Toplam Gider"}
            </CardTitle>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalGider)}
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

      <RecentTransactionsClient 
        key={`${currentPage}-${range}`}
        initialTransactions={recentTransactions || []} 
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        range={range}
      />
    </div>
  );
}
