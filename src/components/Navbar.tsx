"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Home, Wrench, Package, Info, FileText, MessageSquare, ChevronDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICES_DATA } from "@/lib/constants/services";
import { YouTubeIcon } from "@/components/icons/YouTubeIcon";
import { XIcon } from "@/components/icons/XIcon";
import { BrandLogo } from "@/components/BrandLogo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  );
}

const socialLinks = [
  { href: "https://www.instagram.com/suaritmateknikservis34", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.facebook.com/suaritmaistabulavrupa", label: "Facebook", icon: FacebookIcon },
  { href: "https://www.youtube.com/@suaritmateknikservis34", label: "YouTube", icon: YouTubeIcon },
  { href: "https://x.com/suaritmateknik", label: "X", icon: XIcon },
];

type MenuItem = { label: string; href?: string; soon?: boolean; children?: MenuItem[] };

const serviceMenuItems: MenuItem[] = Object.values(SERVICES_DATA).map((s) => ({
  href: `/hizmetler/${s.slug}`,
  label: s.title,
}));

// Ürün menüsü: ana gruplar ve altındaki ürünler. Sayfası olmayan gruplar şimdilik /urunler'e gider.
const productMenuItems: MenuItem[] = [
  {
    label: "Evsel Su Arıtma Sistemleri",
    href: "/urunler",
    children: [
      { label: "Prada Su Arıtma", href: "/3-2-prada-su-aritma-cihazi" },
      { label: "Headon Su Arıtma", href: "/urunler/22-evsel-su-aritma-cihazi" },
    ],
  },
  {
    label: "Direkt Akış Su Arıtma Sistemleri",
    href: "/urunler",
    children: [
      { label: "Pantech Su Arıtma", href: "/pantech-su-aritma-cihazi" },
      { label: "Quantum Plus Su Arıtma", href: "/quantum-plus-su-aritma-cihazi" },
    ],
  },
  {
    label: "Sebiller",
    href: "/urunler",
    children: [
      {
        label: "Tezgah Üstü Sebiller",
        href: "/urunler",
        children: [
          { label: "OD-3TT02 Masaüstü Sebil", href: "/urunler/od-3tt02-masaustu-su-aritma-sebili" },
          { label: "KS-06 Masaüstü Sebil", href: "/urunler/ks-06-masaustu-su-aritma-sebili" },
        ],
      },
      {
        label: "Arıtmalı Su Sebilleri",
        href: "/urunler",
        children: [
          { label: "KS07 Arıtmalı Su Sebili", href: "/urunler/ks07-aritmali-su-sebili" },
          { label: "OD-3FS01 Arıtmalı Su Sebili", href: "/urunler/od-3fs01-aritmali-su-sebili-gaziosmanpasa" },
        ],
      },
    ],
  },
  { label: "Filtreler", href: "/urunler/su-aritma-cihazi-filtre-cesitleri" },
  { label: "Tanklar", href: "/urunler/su-aritma-cihazi-tank-cesitleri" },
  { label: "Musluklar", href: "/urunler/su-aritma-musluk-cesitleri-paslanmaz-krom-3-yollu" },
  { label: "Yedek Parça", href: "/urunler" },
];

const navLinks: { href: string; label: string; icon: typeof Home; mega?: boolean; menu?: { all: string; items: MenuItem[] } }[] = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/urunler", label: "Ürünler", icon: Package, mega: true, menu: { all: "Tüm Ürünler", items: productMenuItems } },
  { href: "/hizmetler", label: "Hizmetler", icon: Wrench, menu: { all: "Tüm Hizmetler", items: serviceMenuItems } },
  { href: "/cihaz-yenileme", label: "Cihaz Yenileme", icon: RefreshCw },
  { href: "/hakkimizda", label: "Hakkımızda", icon: Info },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/iletisim", label: "İletişim", icon: MessageSquare },
];

type NavLink = (typeof navLinks)[number];

/** Menü satırı: alt öğesi olan grup başlığı, normal bağlantı ya da "yakında" etiketi */
function MenuRows({ items, pathname, onPick, variant, depth = 0 }: { items: MenuItem[]; pathname: string; onPick: () => void; variant: "desktop" | "mobile"; depth?: number }) {
  const row = variant === "desktop" ? "block px-4 py-2 text-sm" : "block py-2.5 px-3 text-sm rounded-lg";
  return (
    <>
      {items.map((item) => {
        const active = item.href !== undefined && item.href !== "/urunler" && pathname === item.href;
        const isGroup = Boolean(item.children?.length);
        return (
          <div key={item.label}>
            {item.soon || !item.href ? (
              <span className={cn(row, "flex items-center gap-2 text-white/35")}>
                {item.label}
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/45">Yakında</span>
              </span>
            ) : (
              <Link
                href={item.href}
                onClick={onPick}
                className={cn(
                  row,
                  "transition-colors hover:bg-white/10",
                  isGroup || depth === 0 ? "font-semibold text-white" : active ? "font-semibold text-brand-aqua" : variant === "desktop" ? "text-white/80" : "text-white/60"
                )}
              >
                {item.label}
              </Link>
            )}
            {isGroup && (
              <div className={cn("border-l border-white/10", variant === "desktop" ? "ml-4 mb-1" : "ml-3 mb-1")}>
                <MenuRows items={item.children!} pathname={pathname} onPick={onPick} variant={variant} depth={depth + 1} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function NavItemWithDropdown({ link, isSolid, pathname }: { link: NavLink; isSolid: boolean; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={link.href}
        className={cn(
          "px-4 lg:px-2.5 xl:px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1",
          isSolid
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-white/80 hover:text-white hover:bg-white/10"
        )}
      >
        {link.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
      </Link>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 max-h-[75vh] overflow-y-auto bg-brand-navy/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <Link
            href={link.href}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-brand-aqua font-semibold hover:bg-white/10 transition-colors border-b border-white/10 mb-1"
          >
            {link.menu!.all}
          </Link>
          <MenuRows items={link.menu!.items} pathname={pathname} onPick={() => setOpen(false)} variant="desktop" />
        </div>
      )}
    </div>
  );
}

/** Masaüstü ürün mega menüsü: alt grubu olan her başlık bir sütun, tekil kalemler son sütunda toplanır */
function NavItemMega({ link, pathname }: { link: NavLink; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const items = link.menu!.items;
  const columns: MenuItem[] = [
    ...items.filter((i) => i.children?.length),
    { label: "Filtre & Yedek Parça", children: items.filter((i) => !i.children?.length) },
  ];
  const close = () => setOpen(false);
  const leaf = (item: MenuItem) =>
    item.href ? (
      <Link
        key={item.label}
        href={item.href}
        onClick={close}
        className={cn(
          "block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/10 hover:text-white",
          item.href !== "/urunler" && pathname === item.href ? "font-semibold text-brand-aqua" : "text-white/70"
        )}
      >
        {item.label}
      </Link>
    ) : null;

  return (
    <div
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(close, 150);
      }}
      onFocus={() => setOpen(true)}
    >
      <Link
        href={link.href}
        className="px-4 lg:px-2.5 xl:px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 text-white/80 hover:text-white hover:bg-white/10"
      >
        {link.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
      </Link>

      {open && (
        <div className="absolute left-1/2 top-[calc(100%-2.5rem)] z-50 w-[min(94vw,1040px)] -translate-x-1/2 pt-[calc(2.5rem+4px)]">
          <div className="rounded-2xl border border-white/10 bg-brand-navy/95 p-6 shadow-2xl backdrop-blur-lg animate-in fade-in-0 slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-4 gap-6">
              {columns.map((col) => (
                <div key={col.label}>
                  {col.href ? (
                    <Link href={col.href} onClick={close} className="mb-2 block px-2 text-xs font-bold uppercase tracking-wider text-brand-aqua hover:text-brand-aqua-light">
                      {col.label}
                    </Link>
                  ) : (
                    <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-brand-aqua">{col.label}</p>
                  )}
                  <div className="space-y-0.5">
                    {col.children!.map((item) =>
                      item.children?.length ? (
                        <div key={item.label} className="pt-1">
                          <p className="px-2 pb-0.5 pt-1 text-[13px] font-semibold text-white">{item.label}</p>
                          <div className="ml-2 border-l border-white/10 pl-1">{item.children.map(leaf)}</div>
                        </div>
                      ) : (
                        leaf(item)
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-sm text-white/50">Ev, ofis ve iş yerleri için su arıtma çözümleri</p>
              <Link href={link.href} onClick={close} className="text-sm font-semibold text-brand-aqua hover:text-brand-aqua-light">
                {link.menu!.all} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavItemWithDropdown({ link, pathname, setOpen }: { link: NavLink; pathname: string; setOpen: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={link.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 flex-1",
            pathname === link.href
              ? "bg-brand-aqua/20 text-brand-aqua-light border border-brand-aqua/20"
              : "text-white/70 hover:text-white hover:bg-white/5"
          )}
        >
          <link.icon className={cn("w-5 h-5", pathname === link.href ? "text-brand-aqua" : "text-white/40")} />
          {link.label}
        </Link>
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`${link.label} alt menüsünü aç`}
          className="p-3 text-white/40 hover:text-white transition-colors"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", expanded && "rotate-180")} />
        </button>
      </div>

      {expanded && (
        <div className="ml-8 mt-1 space-y-0.5 border-l border-white/10 pl-3">
          <Link
            href={link.href}
            onClick={() => setOpen(false)}
            className="block py-2.5 px-3 text-sm text-brand-aqua font-semibold hover:bg-white/5 rounded-lg transition-colors"
          >
            {link.menu!.all}
          </Link>
          <MenuRows items={link.menu!.items} pathname={pathname} onPick={() => setOpen(false)} variant="mobile" />
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isSolid = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isSolid
          ? "bg-brand-navy shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <BrandLogo preload className="shrink-0 transition-transform group-hover:scale-105 duration-300" emblemClassName="h-11 lg:h-10 xl:h-14" wordmarkClassName="h-7 lg:h-6 xl:h-9" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {navLinks.map((link) =>
              link.mega ? (
                <NavItemMega key={link.href} link={link} pathname={pathname} />
              ) : link.menu ? (
                <NavItemWithDropdown key={link.href} link={link} isSolid={isSolid} pathname={pathname} />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 lg:px-2.5 xl:px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                    isSolid
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center">
            <Button
              asChild
              size="sm"
              className="gradient-teal text-white border-0 hover:opacity-90 shadow-sm font-medium"
            >
              <a href="tel:+905531142734">
                <Phone className="mr-2 w-4 h-4" />
                Hemen Ara
              </a>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden", isSolid ? "text-white" : "text-white hover:bg-white/10")}
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-80 bg-brand-navy border-l border-white/10 p-0 flex flex-col">
              {/* Header inside Drawer */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => setOpen(false)} className="">
                    <BrandLogo emblemClassName="h-11" wordmarkClassName="h-7" />
                  </Link>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 py-6">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    link.menu ? (
                      <MobileNavItemWithDropdown key={link.href} link={link} pathname={pathname} setOpen={setOpen} />
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200",
                          pathname === link.href
                            ? "bg-brand-aqua/20 text-brand-aqua-light border border-brand-aqua/20"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <link.icon className={cn("w-5 h-5", pathname === link.href ? "text-brand-aqua" : "text-white/40")} />
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex flex-col gap-4">
                  <a
                    href="tel:+905531142734"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium shadow-sm active:scale-[0.98] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    0553 114 27 34
                  </a>

                  <div className="flex flex-col gap-3 px-2">
                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Bizi Takip Edin</p>
                    <div className="flex gap-2">
                      {socialLinks.map(({ href, label, icon: Icon }) => (
                        <a
                          key={href}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          title={label}
                          className="p-2.5 bg-white/5 rounded-lg text-white/60 hover:text-brand-aqua transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-2">
                    <p className="text-[10px] text-white/20 font-medium">© 2026 SuArıtmaServis34 • Tüm Hakları Saklıdır.</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

