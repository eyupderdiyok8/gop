import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, password, ad, telefon } = await req.json();

    if (!email || !password || !ad || !telefon) {
      return NextResponse.json({ error: "Lütfen tüm alanları doldurun." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // 1. Kullanıcıyı oluştur (Admin yetkisiyle değil, normal kayıt gibi ama serverda kontrol ediyoruz)
    const { data: userData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "customer",
          ad,
          telefon
        }
      }
    });

    if (signupError) throw signupError;

    const userId = userData.user?.id;
    if (!userId) throw new Error("Kullanıcı oluşturulamadı.");

    // 2. Müşteri Eşleşme Mantığı
    // Telefon numarasıyla mevcut bir kayıt var mı kontrol et
    const { data: existingCustomer, error: findError } = await supabase
      .from("customers")
      .select("id, user_id")
      .eq("telefon", telefon)
      .maybeSingle();

    if (existingCustomer) {
      if (existingCustomer.user_id) {
        // Zaten bir hesaba bağlıysa hata döndür (Ya da direkt bağla ama güvenlik için kontrol önemli)
        return NextResponse.json({ error: "Bu telefon numarasıyla zaten bir hesap açılmış." }, { status: 400 });
      }

      // Mevcut kaydı yeni kullanıcıyla eşle
      await supabase
        .from("customers")
        .update({ user_id: userId, ad, email })
        .eq("id", existingCustomer.id);
    } else {
      // Yeni bir müşteri kaydı oluştur
      await supabase
        .from("customers")
        .insert({
          user_id: userId,
          ad,
          telefon,
          email
        });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
