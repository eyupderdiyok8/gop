import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { applyUsdPrices, fetchTcmbUsdRate } from "@/lib/pricing/usdPricing";

/**
 * Panelden kur güncelleme. Gövdede { rate } varsa o kur kullanılır,
 * yoksa TCMB'den güncel kur çekilir.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const manualRate = Number(body?.rate);
    const rate = manualRate > 0 ? manualRate : await fetchTcmbUsdRate();

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const result = await applyUsdPrices(supabaseAdmin, rate);
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, source: manualRate > 0 ? "manual" : "tcmb", ...result });
  } catch (error) {
    console.error("Kur güncelleme hatası:", error);
    const message = error instanceof Error ? error.message : "Kur güncellenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
