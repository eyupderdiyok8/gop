import type { SupabaseClient } from "@supabase/supabase-js";

const TCMB_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";

/** Kur virgülden sonra tek haneye yuvarlanır: 49,85 → 49,9 */
export function roundRate(rate: number) {
  return Math.round(rate * 10) / 10;
}

/** TL fiyat kuruşsuz, en yakın tam liraya yuvarlanır: 249,50 → 250 */
export function usdToTry(usd: number, rate: number) {
  return Math.round(usd * rate);
}

/** TCMB günlük kurlarından USD döviz satış kuru (yuvarlanmış) */
export async function fetchTcmbUsdRate(): Promise<number> {
  const res = await fetch(TCMB_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`TCMB yanıt vermedi (${res.status})`);
  const xml = await res.text();
  const block = xml.match(/CurrencyCode="USD"[\s\S]*?<\/Currency>/)?.[0];
  const selling = block?.match(/<ForexSelling>([\d.]+)<\/ForexSelling>/)?.[1];
  const rate = Number(selling);
  if (!rate || rate <= 0) throw new Error("TCMB verisinde USD kuru bulunamadı");
  return roundRate(rate);
}

export type UsdPriceResult = { rate: number; updated: number };

/**
 * Dolar fiyatı olan ürünlerin TL fiyatlarını verilen kurla yeniden yazar,
 * stok tablosundaki birim fiyatı eşitler ve kullanılan kuru ayarlara kaydeder.
 */
export async function applyUsdPrices(supabase: SupabaseClient, rawRate: number): Promise<UsdPriceResult> {
  const rate = roundRate(rawRate);
  if (!rate || rate <= 0) throw new Error("Geçersiz kur");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price_usd, old_price_usd")
    .not("price_usd", "is", null);
  if (error) throw error;

  for (const p of products ?? []) {
    const price = usdToTry(Number(p.price_usd), rate);
    const oldPrice = p.old_price_usd != null ? usdToTry(Number(p.old_price_usd), rate) : null;

    const { error: updateError } = await supabase
      .from("products")
      .update({ price, old_price: oldPrice, updated_at: new Date().toISOString() })
      .eq("id", p.id);
    if (updateError) throw updateError;

    await supabase.from("inventory").update({ birim_fiyat: price }).eq("urun_adi", p.name);
  }

  const { error: settingError } = await supabase
    .from("site_settings")
    .upsert({ key: "usd_try_rate", value: rate, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (settingError) throw settingError;

  return { rate, updated: products?.length ?? 0 };
}
