import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { format, differenceInDays, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

export async function POST(req: Request) {
  const { planId } = await req.json();
  if (!planId) return NextResponse.json({ error: "planId gerekli" }, { status: 400 });

  const supabase = await createServiceClient();

  const { data: plan, error } = await supabase
    .from("filter_plans")
    .select("*, devices(marka, model, customers(ad, telefon, email))")
    .eq("id", planId)
    .single();

  if (error || !plan) return NextResponse.json({ error: "Plan bulunamadı" }, { status: 404 });

  const customer = (plan.devices as any)?.customers;
  const device = plan.devices as any;
  const days = differenceInDays(parseISO(plan.sonraki_degisim), new Date());
  const tarih = format(parseISO(plan.sonraki_degisim), "d MMMM yyyy", { locale: tr });

  const mesaj = `Sayın ${customer?.ad},
${device?.marka} ${device?.model} cihazınızın filtresi ${tarih} tarihinde değiştirilmesi gerekmektedir (${days} gün kaldı).
Randevu almak için: https://www.suaritmaservis34.com/randevu
SuArıtmaServis34 Teknik Servis`;

  const results: Record<string, any> = {};

  // E-posta (Resend)
  if (customer?.email && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "bildirim@suaritmaservis34.com",
          to: customer.email,
          subject: `Filtre Değişim Hatırlatması — ${tarih}`,
          text: mesaj,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
            <h2 style="color:#1a9488">🔔 Filtre Değişim Hatırlatması</h2>
            <p>Sayın <strong>${customer.ad}</strong>,</p>
            <p><strong>${device?.marka} ${device?.model}</strong> cihazınızın filtresi
            <strong>${tarih}</strong> tarihinde değiştirilmesi gerekmektedir.</p>
            ${days > 0 ? `<p style="color:#e67e22"><strong>${days} gün</strong> kaldı.</p>` : `<p style="color:#e74c3c">Değişim tarihi geçmiş!</p>`}
            <a href="https://www.suaritmaservis34.com/randevu" style="display:inline-block;background:#1a9488;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Randevu Al</a>
            <p style="color:#999;font-size:12px;margin-top:24px">SuArıtmaServis34 Teknik Servis</p>
          </div>`,
        }),
      });
      results.email = res.ok ? "gönderildi" : "hata";
    } catch {
      results.email = "hata";
    }
  }

  // WhatsApp (WasenderAPI)
  if (customer?.telefon && process.env.WASENDER_API_KEY) {
    try {
      // Türk telefon numarasını uluslararası formata çevir (+90...)
      let phone = customer.telefon.replace(/\D/g, "");
      if (phone.startsWith("0")) phone = "90" + phone.slice(1);
      else if (!phone.startsWith("90")) phone = "90" + phone;

      const finalTo = "+" + phone;

      const res = await fetch("https://www.wasenderapi.com/api/send-message", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WASENDER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: finalTo,
          text: mesaj,
        }),
      });
      results.whatsapp = res.ok ? "gönderildi" : "hata";
    } catch {
      results.whatsapp = "hata";
    }
  }

  // Bildirimi kaydet
  await supabase
    .from("filter_plans")
    .update({ bildirim_gonderildi_7: days <= 7, bildirim_gonderildi_1: days <= 1 })
    .eq("id", planId);

  return NextResponse.json({ success: true, results });
}
