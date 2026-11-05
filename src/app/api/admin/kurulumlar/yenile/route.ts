import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Panelde kurulum fotoğrafı/videosu değişince sitedeki "Kurulumlarımızdan" şeridini hemen yeniler */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
