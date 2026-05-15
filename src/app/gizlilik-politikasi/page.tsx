import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | SuArıtmaServis34",
  description: "SuArıtmaServis34 olarak kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. KVKK uyumlu gizlilik politikamız.",
};

export default function GizlilikPolitikasiPage() {
  const lastUpdate = "20 Nisan 2026";

  const sections = [
    {
      title: "1. Veri Sorumlusu",
      content: "6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz veri sorumlusu olarak SuArıtmaServis34 tarafından aşağıda açıklanan kapsamda işlenebilecektir.",
    },
    {
      title: "2. Toplanan Veriler ve Amacı",
      content: [
        "İletişim ve Servis Bilgileri: Adınız, telefon numaranız ve adresiniz; servis taleplerinizi karşılamak, randevu oluşturmak ve montaj hizmeti sunmak amacıyla toplanır.",
        "Analitik Veriler: IP adresi, cihaz bilgileri ve uygulama kullanım istatistikleri; kullanıcı deneyimini iyileştirmek amacıyla çerezler aracılığıyla toplanır.",
        "Hesaplama Verileri: Tasarruf hesaplayıcı üzerinde girdiğiniz veriler, size özel teklifler sunmak için anonim olarak işlenebilir.",
      ],
    },
    {
      title: "3. Verilerin Paylaşımı",
      content: "Kişisel verileriniz, izniniz olmaksızın üçüncü taraflarla paylaşılmaz. Ancak yasal zorunluluklar ve resmi talepler durumunda ilgili kamu kurumlarıyla veya hizmetin sağlanması amacıyla yetkili teknik personelimizle paylaşılabilir.",
    },
    {
      title: "4. Veri Güvenliği",
      content: "Toplanan tüm veriler, yetkisiz erişimi engellemek amacıyla endüstri standardı güvenlik protokolleri ve şifreleme yöntemleri ile korunmaktadır. Sunucularımızda saklanan veriler düzenli olarak yedeklenmektedir.",
    },
    {
      title: "5. Çerezler (Cookies)",
      content: "Web sitemiz, ziyaretçilerin tercihlerini hatırlamak ve sitemizi geliştirmek için çerezler kullanır. Tarayıcı ayarlarınız üzerinden çerez kullanımını kısıtlayabilirsiniz.",
    },
    {
      title: "6. Haklarınız (KVKK Madde 11)",
      content: [
        "Kişisel verilerinizin işlenip işlenmediğini öğrenme.",
        "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme.",
        "Kişisel verilerinizin silinmesini veya yok edilmesini isteme.",
        "Verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative gradient-hero pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 text-xs tracking-wide">
            🛡️ GÜVENLİ VE ŞEFFAF
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5 uppercase tracking-tight">
            Gizlilik Politikası
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Verilerinizin güvenliği bizim için önceliktir. Şeffaf veri işleme süreçlerimiz hakkında buradan bilgi alabilirsiniz.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground mb-12 italic border-l-4 border-brand-aqua pl-4">
              Son Güncelleme: {lastUpdate}
            </p>

            <div className="space-y-12">
              {sections.map((section, idx) => (
                <div key={idx} className="group">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-aqua/10 text-brand-aqua text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h2>

                  {Array.isArray(section.content) ? (
                    <ul className="space-y-3 list-none pl-11">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-aqua/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed pl-11">
                      {section.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-20 p-8 rounded-2xl bg-secondary border border-border">
              <h3 className="text-xl font-bold text-brand-navy mb-4">Sorularınız mı var?</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Gizlilik politikamız veya verilerinizin işlenmesiyle ilgili herhangi bir sorunuz için bize e-posta veya telefon yoluyla ulaşabilirsiniz.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-brand-navy">E-posta:</span>
                  <a href="mailto:info@suaritmaservis34.com" className="text-brand-aqua hover:underline">info@suaritmaservis34.com</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-brand-navy">Telefon:</span>
                  <a href="tel:+905531142734" className="text-brand-aqua hover:underline">0553 114 27 34</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
