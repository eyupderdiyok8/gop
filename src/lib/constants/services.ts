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
  Waves
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
  },
  "reverse-osmosis": {
    slug: "reverse-osmosis",
    id: "ro",
    badge: "Teknoloji",
    title: "Reverse Osmosis Sistemleri",
    shortDesc: "Ters ozmoz teknolojisi ile %99.9 saflıkta içme suyu çözümü.",
    longDesc: "Reverse Osmosis (Ters Ozmoz), suyu yarı geçirgen bir membran filtreleyerek %99.9 oranında saflaştıran ileri su arıtma teknolojisidir. İstanbul'un yüksek TDS ve kireç oranına sahip şebeke suyunda en etkili yöntemdir. Gaziosmanpaşa ve çevre ilçelerde profesyonel RO sistemi kurulumu ve bakımı sağlıyoruz.",
    icon: Waves,
    color: "blue",
    features: [
      "%99.9 Saflık Oranı",
      "5-7 Aşamalı Membran Filtrasyonu",
      "NSF Onaylı RO Membranları",
      "Otomatik Yıkama Sistemi",
      "Mineral Takviyeli Post-Filtre",
      "Yüksek Basınç Pompa Desteği"
    ],
    benefits: [
      { title: "Maksimum Saflık", desc: "Ağır metaller, klor, bakteri ve virüsleri %99.9 oranında filtreler.", icon: ShieldCheck },
      { title: "Kireçsiz Su", desc: "İstanbul'un sert suyunda bile kristal berraklığında içme suyu elde edin.", icon: Droplets },
      { title: "Uzun Ömür", desc: "Kaliteli membranlar 2-3 yıl dayanarak maliyet avantajı sağlar.", icon: Clock }
    ],
    faqs: [
      { q: "Reverse Osmosis suyu sağlıklı mı?", a: "Evet, RO sistemi zararlı maddeleri filtrelerken mineral takviyeli post-filtre ile sağlıklı mineral dengesi sağlar." },
      { q: "RO sistemi ne kadar su israf eder?", a: "Modern sistemlerimiz 1:1 oranında atık/temiz su üretir. Eski sistemlere göre %50 daha verimlidir." }
    ]
  },
  "su-aritma-fiyati": {
    slug: "su-aritma-fiyati",
    id: "fiyat",
    badge: "Fiyatlar",
    title: "Su Arıtma Cihazı Fiyatları",
    shortDesc: "Bütçenize uygun, garantili su arıtma cihazı fiyatları ve kampanyalar.",
    longDesc: "Gaziosmanpaşa ve çevre ilçelerde en uygun su arıtma cihazı fiyatlarını sunuyoruz. Damacana maliyetlerini 6 ayda amorti eden ekonomik çözümlerden premium sistemlere kadar geniş ürün yelpazemizle her bütçeye hitap ediyoruz. Taksit imkanı ve ücretsiz kurulum dahil fiyatlarımızla hemen teklif alın.",
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
      { title: "Hızlı Amortisman", desc: "Damacana masrafını 6 ayda sıfırlayarak uzun vadede büyük tasarruf sağlayın.", icon: Zap },
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
    longDesc: "İstanbul şebeke suyu yüksek sertlik (kireç) değerlerine sahiptir. Bu durum çamaşır makinelerinden musluklara kadar tüm tesisatta kireç birikimine yol açar. Su yumuşatma sistemleri iyon değiştirme reçinesi kullanarak kalsiyum ve magnezyumu sudan arındırır, böylece tesisatınız ve cildiniz korunur.",
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
      { title: "Yumuşak Cilt", desc: "Sert su cildi kurutur; yumuşatılmış su ile cildiniz ve saçlarınız daha sağlıklı olur.", icon: Droplets },
      { title: "Deterjan Tasarrufu", desc: "Yumuşak suda %50 daha az deterjan kullanarak hem bütçenizi hem doğayı koruyun.", icon: Zap }
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
    shortDesc: "Sebillerinizde ozon gazı ile %99.9 bakterisiz ve sağlıklı içme suyu.",
    longDesc: "Su sebilleri zamanla bakteri ve mikroorganizma barındırabilir. Ozonlama işlemi, doğanın en güçlü dezenfektanı olan ozon gazı (O₃) kullanarak sebilin iç haznesi, musluklar ve su kanallarını tamamen sterilize eder. Gaziosmanpaşa ve tüm İstanbul'da ofis, ev ve iş yeri sebilleriniz için profesyonel ozonlama hizmeti sağlıyoruz.",
    icon: Wind,
    color: "cyan",
    features: [
      "Ozon Gazı ile Derin Sterilizasyon",
      "Bakteri ve Virüs İmhası (%99.9)",
      "Koku ve Tat Giderimi",
      "Musluk ve Hazne Dezenfeksiyonu",
      "Kimyasalsız Doğal Temizlik",
      "Periyodik Bakım Planı"
    ],
    benefits: [
      { title: "Kimyasalsız", desc: "Ozon doğal bir dezenfektandır, suya zararlı kalıntı bırakmaz.", icon: ShieldCheck },
      { title: "Hızlı İşlem", desc: "15-20 dakikada tam sterilizasyon, bekleme süresi olmadan kullanıma hazır.", icon: Clock },
      { title: "Sağlıklı Su", desc: "Ozonlanmış su, klorlu suya göre çok daha etkili ve sağlıklı dezenfeksiyon sağlar.", icon: Droplets }
    ],
    faqs: [
      { q: "Sebil ozonlama ne sıklıkla yapılmalı?", a: "Ayda 1 kez ozonlama yapılması idealdir. Yoğun kullanılan ofis sebillerinde 2 haftada 1 önerilir." },
      { q: "Ozonlama sebilime zarar verir mi?", a: "Hayır, ozon gazı plastik ve metal yüzeylere zarar vermez. Aksine, ömrünü uzatan bir bakım işlemidir." }
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
      { title: "Sağlık Güvencesi", desc: "Düzenli temizlik bakteri ve yosun oluşumunu tamamen engeller.", icon: ShieldCheck },
      { title: "Lezzetli Su", desc: "Temiz sebilden akan suyun tadı fark edilir şekilde daha taze ve doğal olur.", icon: Droplets },
      { title: "Uzun Ömür", desc: "Periyodik bakım sebilinizin ömrünü 2 katına çıkarır.", icon: Wrench }
    ],
    faqs: [
      { q: "Sebil temizliği ile ozonlama farkı nedir?", a: "Sebil temizliği fiziksel yıkama ve sanitasyondur, ozonlama ise gaz ile derin sterilizasyondur. İkisi birlikte en iyi sonucu verir." },
      { q: "Temizlik sırasında sebilimi kullanabilir miyim?", a: "Temizlik işlemi yaklaşık 20-30 dakika sürer. İşlem sonrası hemen kullanabilirsiniz." }
    ]
  }
};
