import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const TAGS = ["product-menu", "installation-media"];
const PATH_PREFIXES = ["/blog", "/urunler"];

/**
 * Panelde ürün, kategori, blog ya da kurulum görseli değişince yalnızca etkilenen veriyi/sayfaları yeniler.
 * Sayfalar günde bir yenilendiği için değişikliklerin hemen görünmesini bu sağlar.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const tag: unknown = body?.tag;
  const paths: unknown = body?.paths;

  if (typeof tag === "string") {
    if (!TAGS.includes(tag)) return NextResponse.json({ error: "Geçersiz etiket" }, { status: 400 });
    revalidateTag(tag, "max");
  }
  if (Array.isArray(paths)) {
    for (const p of paths.slice(0, 10)) {
      if (typeof p === "string" && PATH_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + "/"))) {
        revalidatePath(p);
      }
    }
  }
  return NextResponse.json({ success: true });
}
