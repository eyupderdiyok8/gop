import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { applyUsdPrices, fetchTcmbUsdRate } from "@/lib/pricing/usdPricing";

/** Her ayın 1'inde (vercel.json) TCMB kuruyla dolar bazlı ürün fiyatlarını günceller */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const rate = await fetchTcmbUsdRate();
    const result = await applyUsdPrices(supabaseAdmin, rate);
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Kur güncelleme hatası:", error);
    const message = error instanceof Error ? error.message : "Kur güncellenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
