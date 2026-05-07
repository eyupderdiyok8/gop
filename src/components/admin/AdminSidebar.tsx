"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Wrench, Package, Filter, CalendarDays,
  LogOut, ChevronRight, Settings, Wallet, FileText,
  ExternalLink, Clock, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin",             label: "Dashboard",       icon: LayoutDashboard, exact: true },
  { href: "/admin/musteriler",  label: "Müşteriler",      icon: Users },
  { href: "/admin/servis",      label: "Servis Kayıtları", icon: Wrench },
  { href: "/admin/stok",        label: "Stok Yönetimi",   icon: Package },
  { href: "/admin/filtre-takvimi", label: "Filtre Takvimi", icon: Filter },
  { href: "/admin/randevular",  label: "Randevular",      icon: CalendarDays },
  { href: "/admin/saat-islemleri", label: "Saat Kapatma", icon: Clock },
  { href: "/admin/finans",      label: "Finans & Kasa",   icon: Wallet },
  { href: "/admin/blog",        label: "Blog Yazıları",   icon: FileText },
  { href: "/admin/ayarlar",     label: "Ayarlar",         icon: Settings },
  { href: "/admin/urunler",     label: "Ürün Yönetimi",   icon: Package },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  };

  const Links = ({ close }: { close?: () => void }) => (
    <>
      {navItems.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={close}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group",
              active
                ? "bg-brand-aqua/10 text-brand-aqua border border-brand-aqua shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-brand-aqua" : "text-slate-400 group-hover:text-slate-600")} />
            <span className="flex-1">{item.label}</span>
            {active && <ChevronRight className="w-3.5 h-3.5 text-brand-aqua" />}
          </Link>
        );
      })}
    </>
  );

  const Footer = ({ close }: { close?: () => void }) => (
    <div className="px-3 py-4 border-t border-slate-100 space-y-1 flex-shrink-0">
      <Link href="/" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
        <ExternalLink className="w-5 h-5" /><span>Siteye Dön</span>
      </Link>
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-all">
        <LogOut className="w-5 h-5" /><span>Çıkış Yap</span>
      </button>
    </div>
  );

  return (
    <>
      {/* ── MASAÜSTÜ SİDEBAR ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto">
        <div className="px-6 h-16 border-b border-slate-100 flex items-center flex-shrink-0">
          <Link href="/admin">
            <img src="/logo.png" alt="SuArıtmaServis34" className="h-12 w-auto -ml-3" />
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <Links />
        </nav>
        <Footer />
      </aside>

      {/* ── MOBİL TOPBAR ── */}
      {mounted && (
        <div className="md:hidden sticky top-0 left-0 right-0 z-[40] h-[56px] bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm shrink-0">
          <Link href="/admin">
            <img src="/logo.png" alt="SuArıtmaServis34" className="h-9 w-auto" />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Menüyü Aç"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* ── MOBİL OVERLAY ── */}
      {mounted && (
        <div
          className="md:hidden fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 250ms" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBİL DRAWER ── */}
      {mounted && (
        <aside
          className="md:hidden fixed top-0 left-0 z-[80] h-full w-[280px] bg-white border-r border-slate-200 shadow-2xl flex flex-col"
          style={{ transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
        >
          <div className="px-6 h-[56px] border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <Link href="/admin" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="SuArıtmaServis34" className="h-9 w-auto -ml-2" />
            </Link>
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Kapat">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <Links close={() => setOpen(false)} />
          </nav>
          <Footer close={() => setOpen(false)} />
        </aside>
      )}
    </>
  );
}
