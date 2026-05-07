import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface NotificationParams {
  ad: string;
  telefon: string;
  email?: string | null;
  tarih: string;
  hizmet: string;
  teknisyen?: string | null;
}

export async function sendAppointmentReceived({
  ad,
  telefon,
  tarih,
  hizmet,
}: NotificationParams) {
  const formattedDate = format(new Date(tarih), "d MMMM yyyy 'saat' HH:mm", { locale: tr });
  
  const results = {
    whatsapp: false,
    error: null as string | null
  };

  // 1. WhatsApp Bilgilendirmesi (WasenderAPI)
  if (process.env.WASENDER_API_KEY) {
    try {
      let formattedPhone = telefon.replace(/[^0-9]/g, "");
      if (formattedPhone.startsWith("0")) formattedPhone = "90" + formattedPhone.substring(1);
      else if (!formattedPhone.startsWith("90")) formattedPhone = "90" + formattedPhone;
      
      const finalTo = "+" + formattedPhone;

      const whatsappRes = await fetch("https://www.wasenderapi.com/api/send-message", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WASENDER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: finalTo,
          text: `*SuArıtmaServis34 Randevu Talebi Alındı*\n\nSayın *${ad}*,\n\n*${hizmet}* talebiniz başarıyla alınmıştır.\n\n*Randevu Tarihi:* ${formattedDate}\n\nEkibimiz en kısa sürede sizinle iletişime geçerek randevunuzu onaylayacaktır. Bizi tercih ettiğiniz için teşekkür ederiz.`
        }),
      });
      if (whatsappRes.ok) results.whatsapp = true;
    } catch (err: any) {
      console.error("WasenderAPI Received Error:", err);
    }
  }

  return results;
}

export async function sendAppointmentApproval({
  ad,
  telefon,
  email,
  tarih,
  hizmet,
  teknisyen
}: NotificationParams) {
  const formattedDate = format(new Date(tarih), "d MMMM yyyy 'saat' HH:mm", { locale: tr });
  const techName = teknisyen || "Uzman ekiplerimiz";
  
  const results = {
    whatsapp: false,
    email: false,
    error: null as string | null
  };

  // 1. WhatsApp Bilgilendirmesi (WasenderAPI)
  if (process.env.WASENDER_API_KEY) {
    try {
      let formattedPhone = telefon.replace(/[^0-9]/g, "");
      // Türkiye için E.164 formatına çevir (+90...)
      if (formattedPhone.startsWith("0")) formattedPhone = "90" + formattedPhone.substring(1);
      else if (!formattedPhone.startsWith("90")) formattedPhone = "90" + formattedPhone;
      
      const finalTo = "+" + formattedPhone;

      const whatsappRes = await fetch("https://www.wasenderapi.com/api/send-message", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WASENDER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: finalTo,
          text: `*SuArıtmaServis34 Randevu Onayı*\n\nSayın *${ad}*,\n\n*${formattedDate}* tarihindeki *${hizmet}* randevunuz onaylanmıştır.\n\n*Teknisyen:* ${techName} yönlendirilmiştir.\n\nSorularınız için bu numara üzerinden bizimle iletişime geçebilirsiniz. Sağlıklı günler dileriz.`
        }),
      });
      if (whatsappRes.ok) results.whatsapp = true;
    } catch (err: any) {
      console.error("WasenderAPI Notification Error:", err);
    }
  }

  // 2. E-posta Bilgilendirmesi (Resend)
  if (process.env.RESEND_API_KEY && email) {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "onboarding@suaritmaservis34.com",
          to: email,
          subject: "Randevunuz Onaylandı — SuArıtmaServis34",
          html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9fbfc;border-radius:16px;border:1px solid #e2e8f0">
            <h2 style="color:#1a9488">Randevu Onayı</h2>
            <p>Sayın <b>${ad}</b>,</p>
            <p>Aşağıdaki bilgilerle oluşturduğunuz servis randevunuz onaylanmıştır:</p>
            <div style="background:white;border-radius:12px;padding:20px;border:1px solid #cbd5e1;margin:20px 0">
              <p style="margin:5px 0"><b>Hizmet:</b> ${hizmet}</p>
              <p style="margin:5px 0"><b>Tarih:</b> ${formattedDate}</p>
              <p style="margin:5px 0"><b>Teknisyen:</b> ${techName} yönlendirilmiştir.</p>
            </div>
            <p style="color:#64748b;font-size:14px">Ekibimiz randevu saatinde adresinizde olacaktır. Herhangi bir değişiklik için bizimle iletişime geçebilirsiniz.</p>
          </div>`,
        }),
      });
      if (resendRes.ok) results.email = true;
    } catch (err: any) {
      console.error("Resend Notification Error:", err);
    }
  }

  return results;
}

export async function sendFilterReminder({
  ad,
  telefon,
  email,
  tarih,
  hizmet,
}: NotificationParams) {
  const formattedDate = format(new Date(tarih), "d MMMM yyyy", { locale: tr });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.suaritmaservis34.com";
  
  const results = {
    whatsapp: false,
    email: false,
  };

  // 1. WhatsApp Bilgilendirmesi (WasenderAPI)
  if (process.env.WASENDER_API_KEY) {
    try {
      let formattedPhone = telefon.replace(/[^0-9]/g, "");
      // Türkiye için E.164 formatına çevir (+90...)
      if (formattedPhone.startsWith("0")) formattedPhone = "90" + formattedPhone.substring(1);
      else if (!formattedPhone.startsWith("90")) formattedPhone = "90" + formattedPhone;
      
      const finalTo = "+" + formattedPhone;

      const whatsappRes = await fetch("https://www.wasenderapi.com/api/send-message", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WASENDER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: finalTo,
          text: `*SuArıtmaServis34 Filtre Değişim Hatırlatması*\n\nSayın *${ad}*,\n\nCihazınızın sağlıklı çalışmaya devam etmesi için filtre değişim zamanınız yaklaşıyor (*Bakım Tarihi: ${formattedDate}*).\n\nSize uygun bir zaman için randevunuzu buradan oluşturabilirsiniz:\n${siteUrl}/randevu\n\nSağlıklı günler dileriz.`
        }),
      });
      if (whatsappRes.ok) results.whatsapp = true;
    } catch (err) {
      console.error("WasenderAPI Filter Notify Error:", err);
    }
  }

  // 2. E-posta Bilgilendirmesi (Resend)
  if (process.env.RESEND_API_KEY && email) {
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "onboarding@suaritmaservis34.com",
          to: email,
          subject: "Filtre Değişim Zamanınız Yaklaşıyor — SuArıtmaServis34",
          html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f0f9ff;border-radius:16px;border:1px solid #bae6fd">
            <h2 style="color:#0369a1">Filtre Değişim Hatırlatması</h2>
            <p>Sayın <b>${ad}</b>, temiz ve sağlıklı suya kesintisiz ulaşabilmeniz için cihazınızın periyodik bakım vakti gelmiştir.</p>
            <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e0f2fe;margin:20px 0;text-align:center">
              <p style="margin:5px 0;font-size:18px"><b>Tahmini Bakım Tarihi:</b> ${formattedDate}</p>
              <a href="${siteUrl}/randevu" style="display:inline-block;background:#0369a1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:15px;font-weight:bold">Hemen Randevu Al</a>
            </div>
            <p style="color:#64748b;font-size:14px">Sorularınız için bizimle her zaman iletişime geçebilirsiniz.</p>
          </div>`,
        }),
      });
      if (resendRes.ok) results.email = true;
    } catch (err) {
      console.error("Resend Filter Notify Error:", err);
    }
  }

  return results;
}
