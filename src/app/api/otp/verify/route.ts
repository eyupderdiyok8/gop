import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "E-posta ve kod gerekli" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Aktif, süresi geçmemiş ve kullanılmamış kodu getir
    const { data, error } = await supabaseAdmin
      .from("otp_requests")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Geçersiz veya süresi dolmuş kod" }, { status: 400 });
    }

    // Kodu kullanıldı olarak işaretle
    await supabaseAdmin
      .from("otp_requests")
      .update({ used: true })
      .eq("id", data.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
