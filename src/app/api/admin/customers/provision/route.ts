import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function generatePassword(length = 8) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export async function POST(req: Request) {
  try {
    const { customerId, ad, telefon, email } = await req.json();

    if (!customerId || !ad || !telefon || !email) {
      return NextResponse.json({ error: "Eksik bilgi: ID, Ad, Telefon ve Email zorunludur." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // 1. Şifre Üret
    const password = generatePassword(8);

    // 2. Auth Kullanıcısı Oluştur
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        role: "customer",
        ad: ad,
        telefon: telefon
      }
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return NextResponse.json({ error: `Auth Hatası: ${authError.message}` }, { status: 500 });
    }

    const userId = userData.user.id;

    // 3. Customers Tablosunu Güncelle
    const { error: dbError } = await supabase
      .from("customers")
      .update({ user_id: userId })
      .eq("id", customerId);

    if (dbError) {
      console.error("Database link error:", dbError);
      return NextResponse.json({ error: `Veritabanı bağlantı hatası: ${dbError.message}` }, { status: 500 });
    }

    // 4. WhatsApp Bilgilendirmesi (WasenderAPI)
    if (process.env.WASENDER_API_KEY) {
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
          text: `*SuArıtmaServis34 Müşteri Paneli Giriş Bilgileri*\n\nSayın *${ad}*,\n\nCihazınızın durumunu ve servis geçmişini takip edebileceğiniz müşteri paneliniz aktifleştirilmiştir.\n\n*Giriş Linki:* ${process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com"}/giris\n*E-posta:* ${email}\n*Şifre:* ${password}\n\nLütfen şifrenizi güvenli bir yerde saklayınız.`
        }),
      }).catch(err => console.error("WasenderAPI Error:", err));
    }

    // 5. E-posta Bilgilendirmesi (Resend)
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "onboarding@suaritmaservis34.com",
          to: email,
          subject: "Müşteri Paneli Giriş Bilgileriniz — SuArıtmaServis34",
          html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9fbfc;border-radius:16px;border:1px solid #e2e8f0">
            <h2 style="color:#1a9488">Aramıza Hoş Geldiniz!</h2>
            <p>Sayın <b>${ad}</b>, cihazınızın sağlığını ve servis tarihlerini takip edebilmeniz için müşteri hesabınız oluşturulmuştur.</p>
            <div style="background:white;border-radius:12px;padding:20px;border:1px solid #cbd5e1;margin:20px 0">
              <p style="margin:5px 0"><b>Giriş Sayfası:</b> <a href="${process.env.NEXT_PUBLIC_SITE_URL}/giris" style="color:#1a9488">${process.env.NEXT_PUBLIC_SITE_URL}/giris</a></p>
              <p style="margin:5px 0"><b>Kullanıcı Adı:</b> ${email}</p>
              <p style="margin:5px 0"><b>Geçici Şifre:</b> <code style="background:#f1f5f9;padding:2px 4px;border-radius:4px;font-size:1.1em">${password}</code></p>
            </div>
            <p style="color:#64748b;font-size:14px">Panel üzerinden cihazınızın filtre ömrünü anlık olarak takip edebilirsiniz.</p>
          </div>`,
        }),
      }).catch(err => console.error("Resend Error:", err));
    }

    return NextResponse.json({ success: true, password });
  } catch (err: any) {
    console.error("Provisioning error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
