import { 
  Wrench, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Droplets, 
  Settings, 
  ShoppingCart,
  Zap,
  Wind,
  Sparkles,
  DollarSign,
  Waves,
  type LucideIcon,
} from "lucide-react";

export interface ServiceDetail {
  slug: string;
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: LucideIcon;
  color: string;
  features: string[];
  benefits: { title: string; desc: string; icon: LucideIcon }[];
  faqs: { q: string; a: string }[];
}

export const SERVICES_DATA: Record<string, ServiceDetail> = {
  "su-aritma-cihazi": {
    slug: "su-aritma-cihazi",
    id: "satis",
    badge: "Satış",
    title: "Su Arıtma Cihazı Satışı",
    shortDesc: "Evinizin su tüketimi, basıncı ve ölçüm sonuçlarına uygun su arıtma sistemleri.",
    longDesc: "Sultangazi ve İstanbul Avrupa Yakası'nda ev ve iş yerleri için su arıtma cihazı seçimi yapıyoruz. TDS, su basıncı, günlük tüketim ve kurulum alanını birlikte değerlendirerek ihtiyaca uygun filtrasyon sistemlerini öneriyoruz. TDS toplam çözünmüş maddeyi gösterir; su sertliği için ayrıca ölçüm yapılması gerekir.",
    icon: ShoppingCart,
    color: "teal",
    features: [
      "Ürün Belgesine Göre Sertifikalı Filtre Seçenekleri",
      "8-12 Aşamalı Mineral Dengeli Sistemler",
      "Kompakt ve Şık Tasarımlar",
      "Basınç Düşürücü ve Tank Korumalı Modeller",
      "Ürüne Göre Garanti Seçenekleri",
      "Profesyonel Kurulum"
    ],
    benefits: [
      { title: "Taze ve Lezzetli", desc: "Damacana bekletme derdi olmadan her an taze suya ulaşın.", icon: Droplets },
      { title: "Ekonomik Çözüm", desc: "Kullanıma ve damacana maliyetine bağlı olarak uzun vadeli tasarruf sağlayabilir.", icon: Zap },
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
    longDesc: "Su arıtma cihazlarının performansı, filtrelerin kullanım süresine ve giriş suyu koşullarına bağlıdır. Zamanı geçen filtrelerde debi, tat, koku ve filtrasyon performansı değişebilir. Periyodik bakım sırasında filtreler, membran, tank basıncı ve bağlantılar birlikte kontrol edilir.",
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
      { title: "Dengeli Performans", desc: "Zamanında değişen filtreler debi ve filtrasyon performansının korunmasına yardımcı olur.", icon: ShieldCheck },
      { title: "Cihaz Ömrü", desc: "Düzenli bakım, pompa ve membran gibi parçaların erken yıpranma riskini azaltır.", icon: Wrench },
      { title: "Bölgesel Servis", desc: "Sultangazi ve çevre ilçelerde rota uygunluğuna göre filtre değişimi.", icon: Truck }
    ],
    faqs: [
      { q: "Filtreler ne sıklıkla değişmeli?", a: "Ön üçlü filtre seti genellikle 6-8 ayda bir, membran ve post-karbon ise 12-18 ayda bir değişmelidir." },
      { q: "Filtre değişimini kendim yapabilir miyim?", a: "Teknik bilginiz varsa yapabilirsiniz ancak sızıntı ve hava yapma riskine karşı profesyonel destek öneriyoruz." }
    ]
  },
  "su-aritma-servisi": {
    slug: "su-aritma-servisi",
    id: "ariza",
    badge: "Teknik Servis",
    title: "Su Arıtma Servisi & Arıza",
    shortDesc: "Cihazınızdaki akıntı, düşük debi veya koku problemleri için anında müdahale.",
    longDesc: "Eski veya bakımsız cihazlarda görülen su kaçırma, tankın dolmaması, atık suyun kesilmemesi gibi sorunlar ciddi su israfına yol açabilir. Sultangazi merkezli teknik servis ekibimizle İstanbul Avrupa Yakası'nda marka bağımsız su arıtma arızalarını tespit ediyoruz.",
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
      { title: "Hızlı Destek", desc: "Çalışma saatlerinde telefonla bilgilendirme ve yerinde servis planlaması.", icon: Clock },
      { title: "Şeffaf Servis", desc: "İşlem öncesi arıza tespiti ve net fiyat bilgilendirmesi.", icon: ShieldCheck },
      { title: "Garantili Onarım", desc: "Yapılan her parça değişimi firmamız garantisi altındadır.", icon: ShieldCheck }
    ],
    faqs: [
      { q: "Servis ücretiniz ne kadar?", a: "Ücret; adres, cihaz modeli, arıza ve gerekli parçaya göre belirlenir. Sultangazi ve çevre ilçeler için güncel bilgi almak üzere bizi arayabilirsiniz." },
      { q: "Cihazım çok gürültülü çalışıyor, normal mi?", a: "Hayır, özellikle pompa, su basıncı veya atık su valfi kaynaklı bir sorun olabilir. Cihazın kontrol edilmesi önerilir." }
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
  },
  "reverse-osmosis": {
    slug: "reverse-osmosis",
    id: "ro",
    badge: "Teknoloji",
    title: "Ters Ozmoz (RO) Sistemleri",
    shortDesc: "Membran filtrasyonu ile çözünmüş madde miktarını azaltmaya yönelik içme suyu çözümü.",
    longDesc: "Ters ozmoz (RO), suyu yarı geçirgen bir membrandan geçirerek çözünmüş maddelerin önemli bir bölümünü azaltmayı amaçlayan filtrasyon yöntemidir. Performans; giriş suyu, basınç, membran modeli ve bakım durumuna göre değişir. Sultangazi ve İstanbul Avrupa Yakası'nda RO sistemi kurulumu ve bakımı sağlıyoruz.",
    icon: Waves,
    color: "blue",
    features: [
      "RO Membran Filtrasyonu",
      "5-7 Aşamalı Membran Filtrasyonu",
      "NSF Onaylı RO Membranları",
      "Otomatik Yıkama Sistemi",
      "Mineral Takviyeli Post-Filtre",
      "Yüksek Basınç Pompa Desteği"
    ],
    benefits: [
      { title: "Membran Performansı", desc: "Çözünmüş maddeleri azaltma oranı membran ve giriş suyu koşullarına göre değişir.", icon: ShieldCheck },
      { title: "Ölçülebilir Sonuç", desc: "Kurulum öncesi ve sonrası TDS ölçümüyle sistem performansı takip edilebilir.", icon: Droplets },
      { title: "Planlı Bakım", desc: "Membran ömrü kullanım, basınç ve ön filtre bakımına bağlıdır.", icon: Clock }
    ],
    faqs: [
      { q: "Ters ozmoz sistemi nasıl seçilir?", a: "Giriş suyu basıncı, TDS değeri, günlük tüketim ve membran kapasitesi birlikte değerlendirilmelidir." },
      { q: "RO sistemi ne kadar atık su üretir?", a: "Atık su oranı cihaz modeline, membrana, basınca ve su sıcaklığına göre değişir. Teklif sırasında ilgili modelin teknik değeri paylaşılır." }
    ]
  },
  "su-aritma-fiyati": {
    slug: "su-aritma-fiyati",
    id: "fiyat",
    badge: "Fiyatlar",
    title: "Su Arıtma Cihazı Fiyatları",
    shortDesc: "Bütçenize uygun, garantili su arıtma cihazı fiyatları ve kampanyalar.",
    longDesc: "Sultangazi ve çevre ilçelerde farklı kapasite ve filtre yapılarına sahip su arıtma cihazları sunuyoruz. Toplam maliyet; cihaz modeli, pompa ihtiyacı, filtre yapısı ve kurulum koşullarına göre değişir. Güncel ürün ve ödeme seçenekleri için teklif alabilirsiniz.",
    icon: DollarSign,
    color: "green",
    features: [
      "Ekonomik Başlangıç Paketleri",
      "Premium Mineral Sistemleri",
      "12 Aya Varan Taksit İmkanı",
      "Ücretsiz Keşif ve Kurulum",
      "2 Yıl Full Garanti Dahil",
      "Eski Cihaz Takas İndirimi"
    ],
    benefits: [
      { title: "Maliyet Karşılaştırması", desc: "Cihaz, bakım ve mevcut damacana tüketimini birlikte karşılaştırabilirsiniz.", icon: Zap },
      { title: "Şeffaf Fiyat", desc: "Gizli maliyet yok — kurulum, garanti ve ilk bakım fiyata dahildir.", icon: ShieldCheck },
      { title: "Esnek Ödeme", desc: "Peşin, kredi kartı taksit veya havale seçenekleriyle bütçenize uygun çözüm.", icon: DollarSign }
    ],
    faqs: [
      { q: "En ucuz su arıtma cihazı ne kadar?", a: "Başlangıç paketlerimiz ücretsiz kurulum dahil uygun fiyatlarla sunulmaktadır. Detaylı fiyat için bizi arayın." },
      { q: "Taksit imkanı var mı?", a: "Evet, kredi kartına 12 aya varan taksit seçenekleri mevcuttur." }
    ]
  },
  "su-yumusatma": {
    slug: "su-yumusatma",
    id: "yumusatma",
    badge: "Yumuşatma",
    title: "Su Yumuşatma Sistemleri",
    shortDesc: "İstanbul'un sert suyuna karşı bina ve daire tipi yumuşatma çözümleri.",
    longDesc: "Su sertliği, başta kalsiyum ve magnezyum olmak üzere çözünmüş minerallerle ilişkilidir ve TDS'den farklı bir ölçümdür. Sertlik analizi yüksek çıktığında iyon değiştirme reçineli sistemler tesisattaki kireçlenmeyi azaltmak için kullanılabilir.",
    icon: Wind,
    color: "purple",
    features: [
      "Bina Girişi Tipi Sistemler",
      "Daire Tipi Kompakt Modeller",
      "Otomatik Rejenerasyon",
      "Tuz Bazlı İyon Değiştirme",
      "Dijital Kontrol Paneli",
      "By-pass Valf Sistemi"
    ],
    benefits: [
      { title: "Tesisatı Korur", desc: "Kireç birikimini önleyerek kombi, çamaşır ve bulaşık makinesi ömrünü uzatır.", icon: ShieldCheck },
      { title: "Kullanım Konforu", desc: "Yumuşatılmış su yüzeylerdeki kireç lekelerinin azalmasına yardımcı olabilir.", icon: Droplets },
      { title: "Deterjan Kullanımı", desc: "Daha düşük sertlik, kullanım koşullarına bağlı olarak deterjan ihtiyacını azaltabilir.", icon: Zap }
    ],
    faqs: [
      { q: "Su yumuşatma cihazı ne kadar dayanır?", a: "Kaliteli reçine yatakları 10-15 yıl dayanır. Periyodik tuz takviyesi ile uzun ömürlü kullanım sağlarsınız." },
      { q: "Yumuşatılmış su içilebilir mi?", a: "Evet, yumuşatılmış su içilebilir ancak sodyum miktarı artar. İçme suyu için RO sistemi ile kombine edilmesi önerilir." }
    ]
  },
  "sebil-ozonlama": {
    slug: "sebil-ozonlama",
    id: "ozonlama",
    badge: "Hijyen",
    title: "Sebil Ozonlama",
    shortDesc: "Su sebillerinde hazne, musluk ve su kanallarına yönelik ozon destekli bakım.",
    longDesc: "Su sebillerinin haznesi, muslukları ve su kanalları düzenli bakım gerektirir. Ozonlama, uygun ekipman ve prosedürle uygulandığında temizlik ve dezenfeksiyon sürecini destekler. Sultangazi ve İstanbul Avrupa Yakası'nda ev ve iş yeri sebilleri için bakım hizmeti sağlıyoruz.",
    icon: Wind,
    color: "cyan",
    features: [
      "Ozon Destekli Dezenfeksiyon",
      "Hazne ve Su Kanalı Bakımı",
      "Koku ve Tat Giderimi",
      "Musluk ve Hazne Dezenfeksiyonu",
      "Kontrollü Ozon Uygulaması",
      "Periyodik Bakım Planı"
    ],
    benefits: [
      { title: "Kontrollü Uygulama", desc: "Ozon işlemi cihazın yapısına uygun süre ve ekipmanla uygulanır.", icon: ShieldCheck },
      { title: "Planlı İşlem", desc: "İşlem süresi sebilin tipi ve bakım ihtiyacına göre belirlenir.", icon: Clock },
      { title: "Bakım Desteği", desc: "Ozonlama, fiziksel temizlik ve parça kontrolüyle birlikte planlanabilir.", icon: Droplets }
    ],
    faqs: [
      { q: "Sebil ozonlama ne sıklıkla yapılmalı?", a: "Ayda 1 kez ozonlama yapılması idealdir. Yoğun kullanılan ofis sebillerinde 2 haftada 1 önerilir." },
      { q: "Ozonlama sebilime zarar verir mi?", a: "Uygun yoğunluk ve sürede, cihaz malzemeleri dikkate alınarak uygulanmalıdır. İşlem öncesinde sebilin modeli ve parçaları kontrol edilir." }
    ]
  },
  "sebil-temizligi": {
    slug: "sebil-temizligi",
    id: "temizlik",
    badge: "Temizlik",
    title: "Sebil Temizliği",
    shortDesc: "Sebillerinizin periyodik bakım ve sanitasyon ile her zaman tertemiz.",
    longDesc: "Su sebilleri düzenli temizlenmediğinde bakteri, yosun ve kireç tabakası oluşur. Bu hem suyun tadını bozar hem de sağlık riski yaratır. Profesyonel sebil temizliği hizmetimizle sebilin haznesi, soğutma sistemi, musluklar ve dış yüzeyleri gıda uygunluğu sertifikalı temizlik ürünleriyle detaylıca yıkanır ve dezenfekte edilir.",
    icon: Sparkles,
    color: "teal",
    features: [
      "Hazne İç Yüzey Temizliği",
      "Soğutma Sistemi Bakımı",
      "Musluk ve Damlatma Tepsisi Temizliği",
      "Gıda Uygunluklu Dezenfektanlar",
      "Dış Yüzey Parlatma",
      "Filtre Kontrolü ve Değişimi"
    ],
    benefits: [
      { title: "Düzenli Hijyen", desc: "Periyodik temizlik birikinti, koku ve mikrobiyal oluşum riskini azaltmaya yardımcı olur.", icon: ShieldCheck },
      { title: "Lezzetli Su", desc: "Temiz sebilden akan suyun tadı fark edilir şekilde daha taze ve doğal olur.", icon: Droplets },
      { title: "Cihaz Bakımı", desc: "Periyodik kontrol, aşınan veya kirlenen parçaların zamanında fark edilmesini sağlar.", icon: Wrench }
    ],
    faqs: [
      { q: "Sebil temizliği ile ozonlama farkı nedir?", a: "Sebil temizliği fiziksel yıkama ve sanitasyon adımlarını içerir; ozonlama ise dezenfeksiyon sürecini destekleyen ayrı bir uygulamadır. İhtiyaç cihazın durumuna göre belirlenir." },
      { q: "Temizlik sırasında sebilimi kullanabilir miyim?", a: "Temizlik işlemi yaklaşık 20-30 dakika sürer. İşlem sonrası hemen kullanabilirsiniz." }
    ]
  }
};
