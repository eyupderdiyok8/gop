import Link from "next/link";
import { Droplets, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  hizmetler: [
    { href: "/hizmetler/su-aritma-cihazi", label: "Su Arıtma Satışı" },
    { href: "/hizmetler/su-aritma-montaj", label: "Montaj & Kurulum" },
    { href: "/hizmetler/filtre-degisimi", label: "Periyodik Bakım" },
    { href: "/hizmetler/filtre-degisimi", label: "Filtre Değişimi" },
    { href: "/hizmetler/su-aritma-servisi", label: "Arıza Servisi" },
  ],
  urunler: [
    { href: "/urunler#ev", label: "Ev Tipi Arıtma" },
    { href: "/urunler#ofis", label: "Ofis Tipi Arıtma" },
    { href: "/urunler#endustriyel", label: "Endüstriyel Sistemler" },
    { href: "/urunler#aksesuar", label: "Filtreler & Aksesuarlar" },
  ],
  kurumsal: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/blog", label: "Blog" },
    { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
    { href: "/iletisim", label: "İletişim" },
  ],
  bolgeler: [
    { href: "/istanbul/gaziosmanpasa", label: "Gaziosmanpaşa Servisi" },
    { href: "/istanbul/sultangazi", label: "Sultangazi Servisi" },
    { href: "/istanbul/eyup", label: "Eyüp Servisi" },
    { href: "/istanbul/bagcilar", label: "Bağcılar Servisi" },
    { href: "/istanbul/bayrampasa", label: "Bayrampaşa Servisi" },
    { href: "/istanbul/esenler", label: "Esenler Servisi" },
  ]
};

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-2">
              <img src="/logo.png" alt="SuArıtmaServis34" className="h-20 w-auto -ml-2" />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Gaziosmanpaşa ve çevre ilçelerde güvenilir su arıtma çözümleri. İstanbul'un sert suyuna karşı sağlıklı ve temiz suya ulaşmak artık çok kolay.
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-aqua mt-0.5 flex-shrink-0" />
                <span>Bağlarbaşı Mh. Adsız Nefer Cd. No:62<br />Gaziosmanpaşa / İstanbul</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-aqua flex-shrink-0" />
                <a href="tel:+905304794722" className="hover:text-white transition-colors">0530 479 47 22</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-aqua flex-shrink-0" />
                <span>Pzt–Cmt: 08:00–19:00</span>
              </div>
            </div>
          </div>

          {/* Bölgeler (SEO Internal Links) */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Servis Bölgeleri</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.bolgeler.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/istanbul" className="text-sm text-brand-aqua hover:text-brand-aqua-light transition-colors font-medium">
                  Tüm Bölgeleri Gör →
                </Link>
              </li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Hizmetler</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.hizmetler.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ürünler */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Ürünler</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.urunler.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Kurumsal</h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="font-heading font-semibold text-white mb-3 text-sm uppercase tracking-wider">Sosyal Medya</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/suaritmateknikservis34"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-aqua flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a
                  href="https://www.facebook.com/suaritmaistabulavrupa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-aqua flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a
                  href="https://share.google/GFjeps99t7x2pgmNx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-aqua flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/905304794722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-aqua flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© 2026 SuArıtmaServis34. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="/gizlilik-politikasi" className="hover:text-white/70 transition-colors">Gizlilik Politikası</Link>
            <Link href="/gizlilik-politikasi" className="hover:text-white/70 transition-colors">KVKK</Link>
          </div>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/905304794722?text=Merhaba,%20su%20arıtma%20hakkında%20bilgi%20almak%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 z-50"
        aria-label="WhatsApp ile iletişime geç"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </footer>
  );
}

