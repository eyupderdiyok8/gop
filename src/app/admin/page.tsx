import { createClient } from "@/lib/supabase/server";
import {
  Users,
  Wrench,
  Package,
  CalendarDays,
  AlertTriangle,
  Filter,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

async function getDashboardData() {
  const supabase = await createClient();

  const [
    { count: customerCount },
    { count: serviceCount },
    { data: lowStock },
    { data: devicePlans },
    { data: customerPlans },
    { data: pendingAppointments },
    { data: recentServices },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("service_records").select("*", { count: "exact", head: true }).eq("durum", "bekliyor"),
    supabase.from("inventory").select("id, urun_adi, adet, min_stok_esigi"),
    supabase
      .from("filter_plans")
      .select("id, sonraki_degisim, devices(marka, model, customers(ad))")
      .gte("sonraki_degisim", new Date().toISOString().split("T")[0])
      .lte("sonraki_degisim", new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0])
      .order("sonraki_degisim", { ascending: true })
      .limit(5),
    supabase
      .from("customers")
      .select("id, ad, sonraki_islem_tarihi")
      .not("sonraki_islem_tarihi", "is", null)
      .gte("sonraki_islem_tarihi", new Date().toISOString().split("T")[0])
      .lte("sonraki_islem_tarihi", new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0])
      .order("sonraki_islem_tarihi", { ascending: true })
      .limit(5),
    supabase.from("appointments").select("*", { count: "exact", head: false }).eq("durum", "bekliyor").limit(5).order("randevu_tarihi", { ascending: true }),
    supabase
      .from("service_records")
      .select("id, aciklama, durum, servis_tarihi, devices(marka, model, customers(ad)), customers(ad)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const criticalStock = (lowStock ?? []).filter((item: any) => item.adet <= item.min_stok_esigi);

  const unifiedUpcoming = [
    ...((devicePlans as any[]) ?? []).map(p => ({
      id: p.id,
      customer_name: p.devices?.customers?.ad,
      device_info: p.devices?.marka,
      next_date: p.sonraki_degisim
    })),
    ...((customerPlans as any[]) ?? []).map(c => ({
      id: c.id,
      customer_name: c.ad,
      device_info: "Genel Servis",
      next_date: c.sonraki_islem_tarihi
    }))
  ].sort((a, b) => new Date(a.next_date).getTime() - new Date(b.next_date).getTime()).slice(0, 5);

  return {
    customerCount: customerCount ?? 0,
    serviceCount: serviceCount ?? 0,
    lowStock: criticalStock,
    upcomingFilters: unifiedUpcoming,
    pendingAppointments: pendingAppointments ?? [],
    recentServices: recentServices ?? [],
  };
}

const statusColors: Record<string, string> = {
  bekliyor: "bg-amber-100 text-amber-700 border border-amber-200",
  devam_ediyor: "bg-blue-100 text-blue-700 border border-blue-200",
  tamamlandi: "bg-brand-aqua/10 text-brand-aqua border border-brand-aqua",
  iptal: "bg-red-100 text-red-700 border border-red-200",
};

const statusLabels: Record<string, string> = {
  bekliyor: "Bekliyor",
  devam_ediyor: "Devam Ediyor",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};

export default async function AdminDashboard() {
  const { customerCount, serviceCount, lowStock, upcomingFilters, pendingAppointments, recentServices } =
    await getDashboardData();

  const stats = [
    {
      label: "Toplam Müşteri",
      value: customerCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/musteriler",
    },
    {
      label: "Kritik Stok",
      value: lowStock.length,
      icon: Package,
      color: "text-red-600",
      bg: "bg-red-50",
      href: "/admin/stok",
    },
    {
      label: "Bekleyen Randevu",
      value: pendingAppointments?.length ?? 0,
      icon: CalendarDays,
      color: "text-brand-aqua",
      bg: "bg-brand-aqua",
      href: "/admin/randevular",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {format(new Date(), "d MMMM yyyy, EEEE", { locale: tr })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 hover:border-white/15 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-900/20 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Son Servis Kayıtları */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-aqua" />
              <h2 className="text-sm font-semibold text-slate-900">Son Servis Kayıtları</h2>
            </div>
            <Link href="/admin/servis" className="text-xs text-brand-aqua hover:text-brand-aqua">
              Tümünü Gör →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentServices.length === 0 ? (
              <p className="px-6 py-8 text-center text-slate-400 text-sm">Servis kaydı bulunamadı</p>
            ) : (
              recentServices.map((s: any) => (
                <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium truncate">
                      {s.devices?.customers?.ad || s.customers?.ad || "—"} 
                      <span className="text-slate-400 font-normal">
                        {s.devices ? ` — ${s.devices.marka} ${s.devices.model}` : " — Genel Servis"}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{s.aciklama}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[s.durum]}`}>
                      {statusLabels[s.durum]}
                    </span>
                    <span className="text-xs text-slate-400">{s.servis_tarihi}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-6">
          {/* Kritik Stok */}
          {lowStock.length > 0 && (
            <div className="bg-red-500/8 border border-red-500/15 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-red-500/10">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold text-red-300">Kritik Stok Uyarısı</h2>
              </div>
              <div className="divide-y divide-red-500/10">
                {lowStock.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                    <p className="text-xs text-slate-700 truncate flex-1">{item.urun_adi}</p>
                    <span className="text-xs font-bold text-red-400 ml-2">
                      {item.adet} adet
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3">
                <Link href="/admin/stok" className="text-xs text-red-400 hover:text-red-300">
                  Stok Yönetimine Git →
                </Link>
              </div>
            </div>
          )}

          {/* Yaklaşan Filtre Değişimleri */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200">
              <Filter className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-900">Yaklaşan Filtreler</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingFilters.length === 0 ? (
                <p className="px-5 py-6 text-center text-slate-400 text-xs">14 gün içinde değişim yok</p>
              ) : (
                upcomingFilters.map((fp: any) => (
                  <div key={fp.id} className="px-5 py-3">
                    <p className="text-xs text-slate-700 truncate">
                      {fp.customer_name} — {fp.device_info}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <p className="text-xs text-amber-400 font-medium">
                        {format(new Date(fp.next_date), "d MMM yyyy", { locale: tr })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <Link href="/admin/filtre-takvimi" className="text-xs text-brand-aqua hover:text-brand-aqua">
                Tüm Takvimi Gör →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
