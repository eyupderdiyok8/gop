import Link from "next/link";
import { ArrowRight, Filter, Wrench, PackagePlus } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const HELP_OPTIONS = [
  {
    href: "/hizmetler/filtre-degisimi",
    title: "Filtre değişimi",
    desc: "Periyodik bakım ve filtre setinin yenilenmesi",
    icon: Filter,
  },
  {
    href: "/hizmetler/su-aritma-servisi",
    title: "Arıza ve teknik servis",
    desc: "Su gelmiyor, sızdırıyor veya ses yapıyorsa",
    icon: Wrench,
  },
  {
    href: "/hizmetler/su-aritma-cihazi",
    title: "Yeni cihaz ve kurulum",
    desc: "Su değerine uygun cihaz seçimi ve montaj",
    icon: PackagePlus,
  },
];

const WHATSAPP_URL = `https://wa.me/905531142734?text=${encodeURIComponent(
  "Merhaba, su arıtma hizmetleriniz hakkında bilgi almak istiyorum."
)}`;

export function HeroHelpMenu() {
  return (
    <div className="w-full max-w-xl mx-auto bg-brand-navy/95 border border-brand-aqua/30 rounded-[2rem] p-6 md:p-10 backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(26,140,255,0.3)]">
      <h2 className="text-2xl font-bold font-heading text-white mb-2">Size nasıl yardımcı olabiliriz?</h2>
      <p className="text-white/50 text-sm mb-6">İhtiyacınızı seçin, sizi doğru sayfaya yönlendirelim.</p>

      <div className="space-y-3">
        {HELP_OPTIONS.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-brand-aqua/15 hover:border-brand-aqua/50 transition"
          >
            <span className="w-11 h-11 shrink-0 rounded-lg gradient-teal flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-white font-semibold">{title}</span>
              <span className="block text-white/50 text-sm">{desc}</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 text-white/40 group-hover:text-brand-aqua group-hover:translate-x-0.5 transition" />
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-white/10 text-sm">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#25D366] text-white font-semibold py-3 hover:opacity-90 transition"
        >
          <WhatsAppIcon className="w-4 h-4" />
          WhatsApp&apos;tan yazın
        </a>
      </div>
    </div>
  );
}
