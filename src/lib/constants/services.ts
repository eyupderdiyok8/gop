import { 
  Wrench, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Droplets, 
  Settings, 
  ShoppingCart,
  Zap
} from "lucide-react";

export interface ServiceDetail {
  slug: string;
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: any;
  color: string;
  features: string[];
  benefits: { title: string; desc: string; icon: any }[];
  faqs: { q: string; a: string }[];
}

export const SERVICES_DATA: Record<string, ServiceDetail> = {
  "su-aritma-cihazi": {
    slug: "su-aritma-cihazi",
    id: "satis",
    badge: "Satış",
    title: "Su Arıtma Cihazı Satışı",
    shortDesc: "Evinize ve bütçenize en uygun, NSF onaylı su arıtma sistemleri.",
    longDesc: "SuArıtmaServis34 olarak, sadece su arıtma cihazı satmıyoruz; size ve ailenize sağlıklı bir yaşam sunuyoruz. Gaziosmanpaşa ve çevre ilçelerin su değerlerini (TDS) analiz ederek, İstanbul şebeke suyunun yoğun kireç, klor ve ağır metal yüküne en uygun filtrasyon sistemlerini öneriyoruz.",
    icon: ShoppingCart,
    color: "teal",
    features: [
      "NSF ve ISO Sertifikalı Filtreler",
      "8-12 Aşamalı Mineral Dengeli Sistemler",
      "Kompakt ve Şık Tasarımlar",
      "Basınç Düşürücü ve Tank Korumalı Modeller",
      "2 Yıl Full Garanti",
      "Ücretsiz Kurulum"
    ],
    benefits: [
      { title: "Taze ve Lezzetli", desc: "Damacana bekletme derdi olmadan her an taze suya ulaşın.", icon: Droplets },
      { title: "Ekonomik Çözüm", desc: "Damacana maliyetlerini ortadan kaldırarak 6 ayda kendini amorti eder.", icon: Zap },
      { title: "Mutfakta Konfor", desc: "Yemeklerinizde, çayınızda ve kahvenizde gerçek lezzeti bulun.", icon: Settings }
    ],
    faqs: [
      { q: "Hangi cihazı seçmeliyim?", a: "Evinizdeki kişi sayısı ve suyunuzun TDS değerine göre tespit ve keşif sonrası size en uygun modeli öneriyoruz." },
      { q: "Cihaz montajı ne kadar sürer?", a: "Ortalama 45-60 dakika içerisinde montaj tamamlanıp cihaz kullanıma hazır hale getirilir." }
    ]
  },
  "filtre-degisimi": {
    slug: "filtre-degisimi",
    id: "filtre",
    badge: "Bakım",
    title: "Periyodik Filtre Değişimi",
    shortDesc: "Cihazınızın ömrünü uzatan, su kalitesini koruyan profesyonel bakım.",
    longDesc: "Su arıtma cihazlarının performansı, filtrelerin zamanında değişmesine bağlıdır. Zamanı geçen filtreler sadece suyu temizleyememekle kalmaz, aynı zamanda bakteri üretmeye başlayabilir. Biz, periyodik hatırlatma servisimizle bu süreci sizin için takip ediyoruz.",
    icon: Settings,
    color: "amber",
    features: [
      "Orijinal ve Yüksek Kaliteli Filtre Setleri",
      "GAC, CTO ve Sediment Filtre Bakımı",
      "Membran Temizliği ve Kontrolü",
      "Tank Basınç Ayarı",
      "Sızıntı ve Akış Kontrolü",
      "İç Hazne Dezenfeksiyonu"
    ],
    benefits: [
      { title: "Sağlıklı İçim", desc: "Filtreler taze olduğunda suyunuzun mineral dengesi hep en üst seviyededir.", icon: ShieldCheck },
      { title: "Cihaz Ömrü", desc: "Düzenli bakım, pahalı parçaların (pompa, membran) bozulmasını önler.", icon: Wrench },
      { title: "Kesintisiz Servis", desc: "Gaziosmanpaşa ve tüm çevre ilçelerde aynı gün filtre değişim hizmeti.", icon: Truck }
    ],
    faqs: [
      { q: "Filtreler ne sıklıkla değişmeli?", a: "Ön üçlü filtre seti genellikle 6-8 ayda bir, membran ve post-karbon ise 12-18 ayda bir değişmelidir." },
      { q: "Filtre değişimini kendim yapabilir miyim?", a: "Teknik bilginiz varsa yapabilirsiniz ancak sızıntı ve hava yapma riskine karşı profesyonel destek öneriyoruz." }
    ]
  },
  "su-aritma-servisi": {
    slug: "su-aritma-servisi",
    id: "ariza",
    badge: "Acil Servis",
    title: "Su Arıtma Servisi & Arıza",
    shortDesc: "Cihazınızdaki akıntı, düşük debi veya koku problemleri için anında müdahale.",
    longDesc: "Eski veya bakımsız cihazlarda görülen su kaçırma, tankın dolmaması, atık suyun kesilmemesi gibi sorunlar ciddi su israfına yol açabilir. SuArıtmaServis34 teknik servis ekibi olarak Gaziosmanpaşa ve tüm çevre ilçelerde marka bağımsız her türlü su arıtma arızasına müdahale ediyoruz.",
    icon: Wrench,
    color: "red",
    features: [
      "Aynı Gün Acil Müdahale",
      "Marka Bağımsız Tamir Desteği",
      "Yedek Parça Garantisi",
      "Atık Su Valf Kontrolü",
      "Pompa ve Adaptör Tamiri",
      "Musluk Değişimi"
    ],
    benefits: [
      { title: "7/24 Destek", desc: "Acil sızıntı durumlarında telefonla ve yerinde hızlı destek.", icon: Clock },
      { title: "Şeffaf Servis", desc: "İşlem öncesi arıza tespiti ve net fiyat bilgilendirmesi.", icon: ShieldCheck },
      { title: "Garantili Onarım", desc: "Yapılan her parça değişimi firmamız garantisi altındadır.", icon: ShieldCheck }
    ],
    faqs: [
      { q: "Servis ücretiniz ne kadar?", a: "Gaziosmanpaşa merkez ve tüm çevre ilçeler için keşif ve arıza tespit randevularımız için bizi arayabilirsiniz." },
      { q: "Cihazım çok gürültülü çalışıyor, normal mi?", a: "Hayır,ellikle pompa veya atık su valfi kaynaklı bir sorun olabilir. Kısa sürede bakılması gerekir." }
    ]
  },
  "su-aritma-montaj": {
    slug: "su-aritma-montaj",
    id: "montaj",
    badge: "Kurulum",
    title: "Montaj & Kurulum",
    shortDesc: "Yeni cihazınız veya taşınma durumlarındaki yer değişikliği için uzman kurulum.",
    longDesc: "Yeni bir ev aldınız veya taşınıyorsunuz; su arıtma cihazınızın sökülmesi ve yeni yerinde güvenli bir şekilde kurulması gerekir. Yanlış yapılan montajlar mutfak dolaplarına su sızmasına veya verimsiz çalışmaya neden olabilir.",
    icon: Truck,
    color: "blue",
    features: [
      "Titiz ve Temiz Çalışma",
      "Mutfak Bataryası Delme İşlemi",
      "Basınç Regülatör Montajı",
      "Sistem Kaçak Testi",
      "Bina Girişi Sistem Kurulumu",
      "İlk Çalıştırma ve Test"
    ],
    benefits: [
      { title: "Güvenli Kurulum", desc: "Tüm bağlantılar sızdırmazlık garantisi ile yapılır.", icon: ShieldCheck },
      { title: "Hızlı Çözüm", desc: "Taşınma gününüzde cihazınızı söküp yeni evinize kurabiliriz.", icon: Clock },
      { title: "Usta Eller", desc: "Tesisat ve arıtma tecrübesine sahip profesyonel ekip.", icon: Wrench }
    ],
    faqs: [
      { q: "Mermer delme işlemi tezgahıma zarar verir mi?", a: "Hayır, özel elmas uçlu makinelerimizle pürüzsüz ve çatlak oluşturmadan delme işlemi yapıyoruz." },
      { q: "Bina girişine arıtma takıyor musunuz?", a: "Evet, tüm daireyi kireçten koruyan bina giriş tipi yumuşatma ve filtrasyon sistemleri kuruyoruz." }
    ]
  }
};
