import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendAppointmentApproval } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ error: "Randevu ID gereklidir." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // 1. Randevu bilgilerini çek
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json({ error: "Randevu bulunamadı." }, { status: 404 });
    }

    // 2. Bildirimi gönder
    const notifyResult = await sendAppointmentApproval({
      ad: appointment.musteri_adi,
      telefon: appointment.musteri_telefon,
      email: appointment.musteri_email,
      tarih: appointment.randevu_tarihi,
      hizmet: appointment.hizmet_turu,
      teknisyen: appointment.teknisyen
    });

    return NextResponse.json({ 
      success: true, 
      details: notifyResult 
    });

  } catch (err: any) {
    console.error("Appointment notification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
