"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Droplets,
  Settings,
  History,
  Calendar,
  LogOut,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  PhoneCall
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays, addDays } from "date-fns";
import { tr } from "date-fns/locale";

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [serviceRecords, setServiceRecords] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/giris");
      return;
    }

    // 1. Müşteri Bilgisi
    const { data: customerData } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!customerData) {
      setLoading(false);
      return;
    }
    setCustomer(customerData);

    // 2. Cihazlar ve Filtre Planları
    const { data: devicesData } = await supabase
      .from("devices")
      .select("*, filter_plans(*)")
      .eq("customer_id", customerData.id);

    setDevices(devicesData || []);

    // 3. Servis Geçmişi
    const { data: recordsData } = await supabase
      .from("service_records")
      .select("*")
      .in("device_id", devicesData?.map(d => d.id) || [])
      .order("servis_tarihi", { ascending: false });

    setServiceRecords(recordsData || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/giris");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-aqua/20 border-t-brand-aqua rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">Profil Bulunamadı</h2>
          <p className="text-slate-500 mb-8">Henüz sistemde kayıtlı bir müşteri profiliniz bulunmuyor. Lütfen işletme ile iletişime geçin.</p>
          <Button onClick={handleLogout} variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100">Çıkış Yap</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-aqua/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center shadow-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-sm tracking-tight text-slate-900">SUARITMASERVIS34</h1>
              <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">Müşteri Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs font-medium text-slate-600">{customer.ad}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all group text-sm font-medium text-slate-600"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600 transition-colors" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-brand-aqua/10 text-brand-aqua border-brand-aqua/20 px-3 py-1">✦ Hoş Geldiniz</Badge>
            <h2 className="text-3xl font-heading font-bold text-slate-900">Merhaba, {customer.ad.split(' ')[0]} 👋</h2>
            <p className="text-slate-500 text-sm mt-1">Cihazlarınızın güncel sağlık durumunu aşağıdan takip edebilirsiniz.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-12 px-6 shadow-sm">
              <a href="tel:+905531142734"><PhoneCall className="w-4 h-4 mr-2" /> Destek Hattı</a>
            </Button>
          </div>
        </div>

        {/* Son İşlem Bilgisi */}
        {(customer.islem_1 || customer.islem_tarihi) && (
          <div className="bg-brand-aqua/10 border border-brand-aqua/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-brand-aqua flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-aqua/20">
              <History className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Son Gerçekleşen İşlem</h3>
              <p className="text-slate-600 text-sm mb-3">
                {[customer.islem_1, customer.islem_2, customer.islem_3].filter(Boolean).join(", ") || "Belirtilmemiş"}
              </p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {customer.islem_tarihi && (
                  <Badge className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-aqua" />
                    İşlem Tarihi: {format(new Date(customer.islem_tarihi), "d MMM yyyy", { locale: tr })}
                  </Badge>
                )}
                {customer.sonraki_islem_gun > 0 && customer.islem_tarihi && (
                  <Badge className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1 text-xs">
                    <History className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                    Sonraki İşlem: {format(addDays(new Date(customer.islem_tarihi), customer.sonraki_islem_gun), "d MMM yyyy", { locale: tr })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Devices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {devices.map((device) => {
            const plan = device.filter_plans?.[0];
            const daysRemaining = plan ? differenceInDays(new Date(plan.sonraki_degisim), new Date()) : 0;
            const totalDays = plan ? plan.periyot_gun : 90;
            const healthPercentage = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
            const isDanger = healthPercentage < 20;

            return (
              <Card key={device.id} className="bg-white border-slate-200 rounded-[2rem] overflow-hidden group hover:border-brand-aqua/40 hover:shadow-md transition-all p-8 relative shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-aqua/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                      <Settings className="w-8 h-8 text-brand-aqua" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-slate-900">{device.marka} {device.model}</h3>
                      <p className="text-slate-400 text-xs">Seri No: {device.seri_no || "---"}</p>
                    </div>
                  </div>
                  {isDanger ? (
                    <div className="bg-red-50 text-red-500 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-red-100">
                      <AlertTriangle className="w-4 h-4" /> Bakım Yaklaşıyor
                    </div>
                  ) : (
                    <div className="bg-brand-aqua/10 text-brand-aqua px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-brand-aqua/20">
                      <CheckCircle2 className="w-4 h-4" /> Durum İyi
                    </div>
                  )}
                </div>

                {/* Health Meter */}
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">FİLTRE ÖMRÜ</p>
                      <p className="text-3xl font-heading font-bold text-slate-900">%{Math.round(healthPercentage)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">KALAN SÜRE</p>
                      <p className="text-sm font-bold text-slate-700">{daysRemaining} Gün</p>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isDanger ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-brand-aqua shadow-[0_0_15px_rgba(26,148,136,0.4)]'}`}
                      style={{ width: `${healthPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative z-10">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div className="text-xs">
                    <span className="text-slate-500 block">Sonraki Bakım Tarihi</span>
                    <span className="font-bold text-slate-900">{plan ? format(new Date(plan.sonraki_degisim), "d MMMM yyyy", { locale: tr }) : "Bilinmiyor"}</span>
                  </div>
                </div>
              </Card>
            );
          })}

          {devices.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white border border-dashed border-slate-300 rounded-3xl shadow-sm">
              <Wrench className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500">Kayıtlı cihazınız bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Service History */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-brand-aqua" />
            <h3 className="text-xl font-heading font-bold text-slate-900">Servis Geçmişi</h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tarih</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">İşlem</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teknisyen</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {serviceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{format(new Date(record.servis_tarihi), "d MMM yyyy", { locale: tr })}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.aciklama}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{record.teknisyen || "---"}</td>
                      <td className="px-6 py-4">
                        <Badge className={`rounded-full px-3 py-0.5 text-[10px] ${record.durum === 'tamamlandi' ? 'bg-brand-aqua/10 text-brand-aqua border-brand-aqua/20' :
                            'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                          {record.durum.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {serviceRecords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm italic">Henüz servis kaydı bulunmuyor.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-12 pb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-brand-aqua bg-brand-aqua/5 px-4 py-2 rounded-full border border-brand-aqua/10">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Güvenli SuArıtmaServis34 Altyapısı</span>
          </div>
          <p className="text-slate-400 text-xs">© 2026 SuArıtmaServis34 Su Arıtma Sistemleri. Tüm hakları saklıdır.</p>
        </div>
      </main>
    </div>
  );
}
