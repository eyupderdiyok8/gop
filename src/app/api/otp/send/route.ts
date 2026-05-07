import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, telefon, ad } = await req.json();

    if (!telefon || telefon.length < 10 || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Geçerli bir e-posta ve telefon numarası girin" }, { status: 400 });
    }

    // Altı haneli rastgele kod üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 10 dakika geçerlilik süresi
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabaseAdmin.from("otp_requests").insert({
      email,
      code,
      expires_at,
    });

    if (dbError) throw dbError;

    // WasenderAPI ile WhatsApp Kodu Gönder
    if (process.env.WASENDER_API_KEY && telefon) {
      let formattedPhone = telefon.replace(/[^0-9]/g, "");
      // Türkiye için E.164 formatına çevir (+90...)
      if (formattedPhone.startsWith("0")) formattedPhone = "90" + formattedPhone.substring(1);
      else if (!formattedPhone.startsWith("90")) formattedPhone = "90" + formattedPhone;

      const finalTo = "+" + formattedPhone;

      fetch("https://www.wasenderapi.com/api/send-message", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WASENDER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: finalTo,
          text: `*SuArıtmaServis34*\n\nRandevu Onay Kodunuz: *${code}*\n\nBu kod 10 dakika boyunca geçerlidir. Güvenliğiniz için kodu kimseyle paylaşmayınız.`
        }),
      }).catch(err => console.error("WasenderAPI OTP Error:", err));
    }

    // E-postaya da mutlaka kod gönder (Güvenlik gereği)
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "bildirim@suaritmaservis34.com",
          to: email,
          subject: "Randevu Onay Kodu — SuArıtmaServis34",
          html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
            <h2 style="color:#1a9488">Randevu Doğrulama Kodu</h2>
            <p>Sayın ${ad || "Müşterimiz"}, randevunuzu tamamlamak için lütfen aşağıdaki doğrulama kodunu ekrana giriniz:</p>
            <div style="background:#f8f9fa;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
              <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#0f1c26">${code}</span>
            </div>
            <p style="color:#666;font-size:14px">Bu kod 10 dakika boyunca geçerlidir.</p>
          </div>`,
        }),
      }).catch(err => console.error("Resend Error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
