import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, BadgeAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BorclarClient } from "./BorclarClient";

export const dynamic = "force-dynamic";

export default async function BorclarPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // Fetch all pending 'gelir' transactions (Açık Hesap / Borçlu Müşteriler)
  const { data: pendingReceivables } = await supabase
    .from("transactions")
    .select("*, customers(ad, telefon)")
    .eq("tur", "gelir")
    .eq("durum", "bekliyor")
    .order("tarih", { ascending: true }); // Oldest first

  const total = pendingReceivables?.reduce((acc: number, t: any) => acc + Number(t.tutar), 0) || 0;

  return (
    <div className="p-6">
      <Button asChild variant="ghost" className="mb-4 text-slate-500 hover:bg-white hover:text-slate-900 px-2">
        <Link href="/admin/finans">
          <ArrowLeft className="w-4 h-4 mr-2" /> Finans Paneline Dön
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BadgeAlert className="w-6 h-6 text-amber-500" />
            Borçlu Müşteriler (Açık Hesaplar)
          </h1>
          <p className="text-slate-900/60 text-sm mt-1">
            "Veresiye / Sonra Ödeyeceğim" diyen müşterilerin dökümü. Buradan tahsil edilenleri silebilirsiniz.
          </p>
        </div>
        <div className="bg-[#122330] border border-white/10 px-6 py-3 rounded-xl flex flex-col items-end">
          <span className="text-xs text-slate-500">Toplam İçerideki Para</span>
          <span className="text-xl font-bold text-amber-500">
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(total)}
          </span>
        </div>
      </div>

      <BorclarClient initialData={pendingReceivables || []} />
    </div>
  );
}
