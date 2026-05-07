"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Droplets, Phone, Home, Wrench, Package, Info, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/hizmetler", label: "Hizmetler", icon: Wrench },
  { href: "/urunler", label: "Ürünler", icon: Package },
  { href: "/hakkimizda", label: "Hakkımızda", icon: Info },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/iletisim", label: "İletişim", icon: MessageSquare },
];

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
            <img src="/logo.png" alt="SuArıtmaServis34" className="h-16 lg:h-20 w-auto transition-transform group-hover:scale-105 duration-300" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isSolid
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+905304794722"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isSolid ? "text-white/80 hover:text-white" : "text-white/80 hover:text-white"
              )}
            >
              <Phone className="w-4 h-4" />
              0530 479 47 22
            </a>
            <Button
              asChild
              size="sm"
              className="gradient-teal text-white border-0 hover:opacity-90 shadow-sm font-medium"
            >
              <Link href="/iletisim">Fiyat Teklifi Al</Link>
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
                    <img src="/logo.png" alt="SuArıtmaServis34" className="h-16 w-auto" />
                  </Link>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 py-6">
                <div className="space-y-1">
                  {navLinks.map((link) => (
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
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex flex-col gap-4">
                  <a
                    href="tel:+905304794722"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium shadow-sm active:scale-[0.98] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    0530 479 47 22
                  </a>

                  <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Bizi Takip Edin</p>
                    <div className="flex gap-4">
                      <a href="#" className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-brand-aqua transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                      <a href="#" className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-brand-aqua transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </a>
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

