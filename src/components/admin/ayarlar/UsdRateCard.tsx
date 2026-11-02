"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DollarSign, Loader2, RefreshCw } from "lucide-react";

type RateInfo = { rate: number; updatedAt: string | null; usdProducts: number };

async function fetchRateInfo(): Promise<RateInfo | null> {
  const supabase = createClient();
  const [{ data: setting }, { count, error }] = await Promise.all([
    supabase.from("site_settings").select("value, updated_at").eq("key", "usd_try_rate").maybeSingle(),
    supabase.from("products").select("id", { count: "exact", head: true }).not("price_usd", "is", null),
  ]);
  if (!setting || error) return null;
  return { rate: Number(setting.value), updatedAt: setting.updated_at, usdProducts: count ?? 0 };
}

/** Ayarlar: dolar kuru, son güncelleme ve dolar bazlı ürün fiyatlarını yeniden hesaplama */
export function UsdRateCard() {
  const [info, setInfo] = useState<RateInfo | null>(null);
  const [missing, setMissing] = useState(false);
  const [manualRate, setManualRate] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const refresh = () =>
    fetchRateInfo().then((r) => {
      if (r) setInfo(r);
      else setMissing(true);
    });

  useEffect(() => {
    refresh();
  }, []);

  const update = async (rate?: number) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/kur-guncelle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rate ? { rate } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kur güncellenemedi");
      setMessage({
        ok: true,
        text: `Kur ${Number(data.rate).toLocaleString("tr-TR")} ₺ ile ${data.updated} ürünün fiyatı güncellendi.`,
      });
      setManualRate("");
      await refresh();
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Kur güncellenemedi" });
    }
    setBusy(false);
  };

  const manual = Number(manualRate.replace(",", "."));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-heading font-bold text-slate-900">Dolar Kuru ve Fiyatlar</h2>
          <p className="text-xs text-slate-500 mt-1">
            Dolar fiyatı girilen ürünlerin TL fiyatı her ayın 1&apos;inde TCMB kuruyla güncellenir.
          </p>
        </div>
        {busy && <Loader2 className="w-4 h-4 text-brand-aqua animate-spin" />}
      </div>

      {missing ? (
        <p className="p-6 text-sm text-amber-700">
          Bu bölüm için Supabase&apos;de <code>033_usd_prices.sql</code> dosyasının çalıştırılması gerekiyor.
        </p>
      ) : (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">Kullanılan Kur</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {info && info.rate > 0 ? `${info.rate.toLocaleString("tr-TR")} ₺` : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">Son Güncelleme</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {info?.updatedAt && info.rate > 0
                  ? new Date(info.updatedAt).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })
                  : "Henüz yok"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">Dolar Fiyatlı Ürün</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{info?.usdProducts ?? 0}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => update()}
              disabled={busy}
              className="px-5 py-2.5 bg-brand-aqua disabled:opacity-50 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-brand-aqua/20"
            >
              <RefreshCw className="w-4 h-4" /> TCMB&apos;den Şimdi Güncelle
            </button>
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={manualRate}
                  onChange={(e) => setManualRate(e.target.value)}
                  placeholder="Elle kur, örn: 50,5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-aqua/50"
                />
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => update(manual)}
                disabled={busy || !(manual > 0)}
                className="px-5 py-2.5 border border-slate-200 disabled:opacity-50 text-slate-700 hover:border-brand-aqua/50 rounded-xl text-sm font-medium transition"
              >
                Bu Kurla Güncelle
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Kur virgülden sonra tek haneye, TL fiyat en yakın tam liraya yuvarlanır (örn. 5 $ × 49,9 = 250 ₺).
            Elle girilen kur bir sonraki ayın 1&apos;ine kadar geçerlidir.
          </p>

          {message && (
            <p className={`text-sm ${message.ok ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p>
          )}
        </div>
      )}
    </div>
  );
}
