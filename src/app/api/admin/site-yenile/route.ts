import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const TAGS = ["product-menu", "installation-media"];

/** Panelde ürün, kategori ya da kurulum görseli değişince o veriyi kullanan sayfaları yeniler */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
  const { tag } = await req.json().catch(() => ({ tag: null }));
  if (!TAGS.includes(tag)) {
    return NextResponse.json({ error: "Geçersiz etiket" }, { status: 400 });
  }
  revalidateTag(tag, "max");
  return NextResponse.json({ success: true });
}
