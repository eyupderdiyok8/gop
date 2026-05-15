import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { sendAppointmentReceived } from "@/lib/notifications";

// Belirli bir gün için dolu slotları sorgula
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!date) return NextResponse.json({ error: "date gerekli" }, { status: 400 });

  const supabase = await createClient();

  // 1. Alınmış (iptal edilmemiş) randevuların saatlerini al
  const { data: appointments } = await supabase
    .from("appointments")
    .select("randevu_tarihi")
    .gte("randevu_tarihi", `${date}T00:00:00`)
    .lte("randevu_tarihi", `${date}T23:59:59`)
    .neq("durum", "iptal");

  // 2. Admin'in block koyduğu saatleri/günleri çek
  const { data: blocks } = await supabase
    .from("appointment_blocks")
    .select("blocked_time")
    .eq("blocked_date", date);

  let busySlots: string[] = [];

  // Eğer `blocked_time` NULL olan bir kayıt varsa o gün komple kapalıdır.
  // Bu durumda mevcut formdaki tüm saatleri bloke etmek için özel bir string dönebilir veya tüm saatleri verebiliriz.
  const isFullDayBlocked = blocks?.some(b => b.blocked_time === null);

  if (isFullDayBlocked) {
    // 00 ile 24 saatlerini döngüye alıp hepsini pushla
    for (let i = 0; i < 24; i++) {
      let h = i.toString().padStart(2, '0');
      busySlots.push(`${h}:00`);
    }
    // Tüm saatler busy gibi döner
  } else {
    // Randevu alınan saatler
    const apptSlots = (appointments ?? []).map((a) => a.randevu_tarihi.slice(11, 16));

    // Admin tarafından kapalı slotlar (time sütunu 'HH:MM:SS' tipinde döner, ilk 5 harfini almak gerekir HH:MM)
    const blockedSlots = (blocks ?? [])
      .filter(b => b.blocked_time !== null)
      .map(b => b.blocked_time.substring(0, 5));

    busySlots = [...apptSlots, ...blockedSlots];
  }

  return NextResponse.json({ busySlots });
}

// Yeni randevu oluştur (anonim)
export async function POST(req: Request) {
  const body = await req.json();
  const { musteri_adi, musteri_telefon, musteri_email, musteri_adres, hizmet_turu, randevu_tarihi } = body;

  if (!musteri_adi || !musteri_telefon || !hizmet_turu || !randevu_tarihi) {
    return NextResponse.json({ error: "Tüm zorunlu alanları doldurun" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .insert({ musteri_adi, musteri_telefon, musteri_email: musteri_email || null, musteri_adres: musteri_adres || null, hizmet_turu, randevu_tarihi, durum: "bekliyor" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Onay emaili gönder
  if (musteri_email && process.env.RESEND_API_KEY) {
    const tarih = format(parseISO(randevu_tarihi), "d MMMM yyyy HH:mm", { locale: tr });
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "bildirim@suaritmaservis34.com",
        to: musteri_email,
        subject: "Randevunuz Alındı — SuArıtmaServis34",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#1a9488">✅ Randevunuz Alındı!</h2>
          <p>Sayın <strong>${musteri_adi}</strong>,</p>
          <p>Randevunuz başarıyla alınmıştır. Ekibimiz en kısa sürede sizi arayarak onaylayacaktır.</p>
          <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0">
            <p><strong>Hizmet:</strong> ${hizmet_turu}</p>
            <p><strong>Tarih/Saat:</strong> ${tarih}</p>
          </div>
          <p>Sorularınız için: <a href="tel:+905531142734">0553 114 27 34</a></p>
          <p style="color:#999;font-size:12px;margin-top:24px">SuArıtmaServis34 Teknik Servis</p>
        </div>`,
      }),
    }).catch(() => { });
  }

  // WhatsApp Bilgilendirmesi (WasenderAPI)
  try {
    await sendAppointmentReceived({
      ad: musteri_adi,
      telefon: musteri_telefon,
      tarih: randevu_tarihi,
      hizmet: hizmet_turu,
    });
  } catch (err) {
    console.error("Appointment WhatsApp Error:", err);
  }

  return NextResponse.json({ success: true, id: data.id });
}
