import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendFilterReminder } from "@/lib/notifications";
import { addDays, format } from "date-fns";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const date7 = format(addDays(new Date(), 7), "yyyy-MM-dd");
    const date1 = format(addDays(new Date(), 1), "yyyy-MM-dd");

    // 7 gün veya 1 gün sonraki bekleyen değişimleri çek
    const { data: plans, error } = await supabaseAdmin
      .from("filter_plans")
      .select(`
        id, 
        sonraki_degisim,
        bildirim_gonderildi_7,
        bildirim_gonderildi_1,
        devices (
          marka,
          model,
          customers (ad, telefon, email)
        )
      `)
      .eq("durum", "bekliyor")
      .in("sonraki_degisim", [date7, date1]);

    if (error) throw error;

    let resendGonderilen = 0;
    let whatsappGonderilen = 0;
    let islenenKayit = 0;

    if (plans && plans.length > 0) {
      for (const p of plans) {
        const is7Days = p.sonraki_degisim === date7;
        const is1Day = p.sonraki_degisim === date1;

        // Daha önce bu milestone için bildirim gönderildiyse atla
        if (is7Days && p.bildirim_gonderildi_7) continue;
        if (is1Day && p.bildirim_gonderildi_1) continue;

        const device = p.devices as any;
        const musteri = device?.customers;
        
        if (musteri) {
          const notifyResult = await sendFilterReminder({
            ad: musteri.ad,
            telefon: musteri.telefon,
            email: musteri.email,
            tarih: p.sonraki_degisim,
            hizmet: `${device.marka} Filtre Değişimi`
          });

          if (notifyResult.whatsapp) whatsappGonderilen++;
          if (notifyResult.email) resendGonderilen++;
          
          // Durumu güncelle
          await supabaseAdmin
            .from("filter_plans")
            .update({ 
               bildirim_gonderildi_7: is7Days ? true : p.bildirim_gonderildi_7,
               bildirim_gonderildi_1: is1Day ? true : p.bildirim_gonderildi_1
            })
            .eq("id", p.id);
            
          islenenKayit++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Filtre kontrolü tamamlandı",
      islenenKayit,
      resendGonderilen,
      whatsappGonderilen,
      tarih: todayStr
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
