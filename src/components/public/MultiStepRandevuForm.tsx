"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, Droplets, Calendar as CalendarIcon, Clock, User, Phone, Mail, ShieldCheck, MapPin } from "lucide-react";
import { format, addDays } from "date-fns";
import { tr } from "date-fns/locale";

const HIZMET_TURLERI = [
  "Filtre Değişimi", "Arıza Giderme",
  "Kurulum"
];

const OTP_ENABLED = false; // Geçici olarak OTP deaktif edildi

export function MultiStepRandevuForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [hizmet, setHizmet] = useState("");
  const [tarih, setTarih] = useState("");
  const [saat, setSaat] = useState("");
  
  const [ad, setAd] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [adres, setAdres] = useState("");
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Available Slots state
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedDays, setBlockedDays] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/randevu/blocked-days")
      .then(r => r.json())
      .then(d => setBlockedDays(d.blockedDays || []))
      .catch(() => {});
  }, []);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  // Sonraki 14 günü oluşturup, Pazar günlerini ve engellenen günleri filtreleyip ilk 7 günü alıyoruz
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = addDays(new Date(), i);
    const valStr = format(d, "yyyy-MM-dd");
    
    let label = "";
    if (valStr === todayStr) label = `Bugün (${d.getDate()} ${format(d, "MMM", { locale: tr })})`;
    else if (valStr === tomorrowStr) label = `Yarın (${d.getDate()} ${format(d, "MMM", { locale: tr })})`;
    else label = format(d, "d MMM EEE", { locale: tr });
    
    return {
      value: valStr,
      label,
      dateObj: d
    };
  })
  .filter(d => !blockedDays.includes(d.value) && d.dateObj.getDay() !== 0)
  .slice(0, 7);

  const allSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const isToday = tarih === format(new Date(), "yyyy-MM-dd");
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const slots = allSlots.filter((s) => {
    if (!isToday) return true;
    const startHourStr = s.split(':')[0];
    const startMins = parseInt(startHourStr, 10) * 60;
    return startMins > currentMins + 90; // En az 1.5 saat pay
  });

  useEffect(() => {
    if (!tarih) return;
    setLoadingSlots(true);
    fetch(`/api/randevu?date=${tarih}`)
      .then(r => r.json())
      .then(d => setBusySlots(d.busySlots || []))
      .catch(() => setBusySlots([]))
      .finally(() => setLoadingSlots(false));
  }, [tarih]);

  const handleSendOtp = async () => {
    if (!ad || !telefon || telefon.length < 10 || !email || !email.includes("@") || !adres.trim()) {
      setError("Lütfen geçerli bir isim, telefon, adres ve e-posta adresi giriniz.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (OTP_ENABLED) {
        const res = await fetch("/api/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, telefon, ad })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Kod gönderilemedi");
        }
        setStep(3); // Go to OTP step
      } else {
        // OTP Deaktif ise direkt randevu oluştur
        const randevuRes = await fetch("/api/randevu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            musteri_adi: ad,
            musteri_telefon: telefon,
            musteri_email: email,
            musteri_adres: adres,
            hizmet_turu: hizmet,
            randevu_tarihi: `${tarih}T${saat}:00`
          })
        });

        if (!randevuRes.ok) {
          throw new Error("Randevu oluşturulurken teknik bir hata meydana geldi.");
        }
        setStep(4); // Direkt başarı ekranına
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndSubmit = async () => {
    const enteredCode = otp.join("");
    if (enteredCode.length !== 6) {
      setError("Lütfen 6 haneli kodu eksiksiz girin.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // 1. Verify OTP
      const otpRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, telefon, code: enteredCode })
      });
      
      if (!otpRes.ok) {
        throw new Error("Girdiğiniz kod hatalı veya süresi dolmuş.");
      }

      // 2. Submit Appointment
      const randevuRes = await fetch("/api/randevu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          musteri_adi: ad,
          musteri_telefon: telefon,
          musteri_email: email,
          musteri_adres: adres,
          hizmet_turu: hizmet,
          randevu_tarihi: `${tarih}T${saat}:00`
        })
      });

      if (!randevuRes.ok) {
        throw new Error("Randevu oluşturulurken teknik bir hata meydana geldi.");
      }

      setStep(4); // Success!
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-brand-navy/95 border border-brand-aqua/30 rounded-[2rem] p-6 md:p-10 backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(0,180,216,0.3)] relative overflow-hidden">
      {/* Progress Bar */}
      {step < 4 && (
        <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-brand-aqua to-brand-aqua shadow-[0_0_10px_rgba(0,180,216,0.5)]"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <h3 className="text-2xl font-bold font-heading text-white mb-6">Ne tür bir hizmete ihtiyacınız var?</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {HIZMET_TURLERI.map(h => (
                <button
                  key={h}
                  onClick={() => setHizmet(h)}
                  className={`p-3 rounded-xl text-sm font-medium transition text-left border ${
                    hizmet === h ? "bg-brand-aqua/20 text-brand-aqua border-brand-aqua/50 shadow-inner" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Droplets className={`w-4 h-4 mb-2 ${hizmet === h ? "text-brand-aqua" : "text-white/30"}`} />
                  {h}
                </button>
              ))}
            </div>

            {hizmet && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Tarih Seçin</label>
                  <select 
                    value={tarih} onChange={(e) => { setTarih(e.target.value); setSaat(""); }}
                    className="w-full bg-brand-navy border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-aqua"
                  >
                    <option value="">Bir gün seçin...</option>
                    {dates.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                {tarih && (
                  <div>
                    <label className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Uygun Saatler</label>
                    {loadingSlots ? (
                      <div className="flex items-center gap-2 text-white/50 text-sm py-4"><Loader2 className="w-4 h-4 animate-spin"/> Saatler yükleniyor...</div>
                    ) : slots.filter(s => !busySlots.includes(s)).length > 0 ? (
                      <div className="grid grid-cols-4 gap-2">
                        {slots.filter(s => !busySlots.includes(s)).map(s => {
                          return (
                            <button
                              key={s}
                              onClick={() => setSaat(s)}
                              className={`p-2 rounded-lg text-sm font-medium border transition ${
                                saat === s ? "bg-brand-aqua text-white border-brand-aqua-light font-bold" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm py-4 bg-red-400/10 px-4 rounded-xl border border-red-400/20">Bu gün için seçilebilir uygun servis saati kalmamıştır. Lütfen farklı bir gün seçiniz.</div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)} disabled={!hizmet || !tarih || !saat}
                className="bg-white text-[#0f1c26] hover:bg-gray-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition"
              >
                Devam Et <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <button onClick={() => setStep(1)} className="text-white/50 hover:text-white flex items-center gap-1 text-sm mb-6 transition">
              <ArrowLeft className="w-4 h-4" /> Geri dön
            </button>
            <h3 className="text-2xl font-bold font-heading text-white mb-2">İletişim Bilgileriniz</h3>
            <p className="text-white/50 text-sm mb-6">Size ulaşabilmemiz ve randevunuzu onaylamamız için gerekli.</p>

            {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/60 mb-1.5 flex items-center gap-2"><User className="w-4 h-4" /> İsim Soyisim</label>
                <input value={ad} onChange={(e) => setAd(e.target.value)} type="text" placeholder="Ahmet Yılmaz" className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-aqua transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-1.5 flex items-center gap-2"><Phone className="w-4 h-4" /> Telefon (SMS/WhatsApp)</label>
                <input value={telefon} onChange={(e) => setTelefon(e.target.value)} type="tel" placeholder="0555 123 45 67" className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-aqua transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-1.5 flex items-center gap-2"><Mail className="w-4 h-4" /> E-posta Adresi (Zorunlu)</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="ornek@email.com" className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-aqua transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4" /> Adres (Zorunlu)</label>
                <textarea value={adres} onChange={(e) => setAdres(e.target.value)} placeholder="Mahalle, cadde, daire bilgisi..." className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-aqua transition resize-none" rows={2} />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSendOtp} disabled={!ad || !telefon || !email || loading}
                className="bg-brand-aqua text-white hover:opacity-90 px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (OTP_ENABLED ? "Doğrulama Kodu Al" : "Randevuyu Onayla")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <ShieldCheck className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold font-heading text-white mb-2">Güvenlik Onayı</h3>
            <p className="text-white/60 text-sm mb-8 max-w-sm mx-auto">
              Size ulaşabilmemiz için e-posta ve mesaj olarak gönderdiğimiz 6 haneli doğrulama kodunu giriniz.
            </p>

            {error && <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl inline-block">{error}</div>}

            <div className="flex justify-center gap-2 sm:gap-3 mb-8" dir="ltr">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-brand-navy border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-aqua focus:bg-white/5 transition"
                  onChange={(e) => {
                    const val =e.target.value.replace(/[^0-9]/g, "");
                    const newOtp = [...otp]; newOtp[i] = val; setOtp(newOtp);
                    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
                  }}
                />
              ))}
            </div>

            <button 
              onClick={handleVerifyOtpAndSubmit} disabled={otp.join("").length !== 6 || loading}
              className="w-full bg-brand-aqua text-white hover:opacity-90 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 transition shadow-lg shadow-brand-aqua/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "İşlemi Tamamla"}
            </button>
            
            <button onClick={() => setStep(2)} className="mt-4 text-sm text-white/40 hover:text-white transition">Hatalı Numara? Geri Dön</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-20 h-20 bg-brand-aqua/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-brand-aqua" />
            </div>
            <h3 className="text-3xl font-bold font-heading text-white mb-4">Randevunuz Alındı!</h3>
            <p className="text-white/70 text-base max-w-sm mx-auto mb-8">
              Müşteri hizmetlerimiz en kısa sürede size ulaşarak teyit sağlayacaktır. Tercihiniz için teşekkür ederiz.
            </p>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl max-w-xs mx-auto text-left space-y-2 text-sm text-white/80">
              <p><strong>Hizmet:</strong> {hizmet}</p>
              <p><strong>Tarih:</strong> {format(new Date(tarih), "d MMMM yyyy", { locale: tr })}</p>
              <p><strong>Saat:</strong> {saat}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
