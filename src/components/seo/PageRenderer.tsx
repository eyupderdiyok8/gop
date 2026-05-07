import { notFound } from "next/navigation";
import { getActiveLocations, getActiveServices, getLocationBySlug, getServiceBySlug, getCustomPage, getNearbyNeighborhoods, getNearbyDistricts } from "@/lib/seo/db";
import { HeroSection } from "@/components/seo/HeroSection";
import { ServiceSection } from "@/components/seo/ServiceSection";
import { FAQSection } from "@/components/seo/FAQSection";
import { NearbyLocations } from "@/components/seo/NearbyLocations";
import { LocalServicesLinks } from "@/components/seo/LocalServicesLinks";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { generateLocalBusinessSchema, generateServiceSchema } from "@/lib/seo/schema";
import { CtaBand } from "@/components/sections/CtaBand";
import type { Metadata } from "next";

const TR_MAP: Record<string, string> = {
  // İller
  istanbul: "İstanbul",

  // İstanbul İlçeleri
  gaziosmanpasa: "Gaziosmanpaşa",
  sultangazi: "Sultangazi",
  eyup: "Eyüp",
  basaksehir: "Başakşehir",
  bagcilar: "Bağcılar",
  bayrampasa: "Bayrampaşa",
  esenler: "Esenler",
  gungoren: "Güngören",

  // Gaziosmanpaşa Mahalleleri
  barbaros: "Barbaros",
  baglarbasi: "Bağlarbaşı",
  karadeniz: "Karadeniz",
  karayollari: "Karayolları",
  merkez: "Merkez",
  mevlana: "Mevlana",
  sarigol: "Sarıgöl",
  seyrantepe: "Seyrantepe",
  sultanciftligi: "Sultançiftliği",
  topcular: "Topçular",
  turkoba: "Türkoba",
  yesilpinar: "Yeşilpınar",
  karlitepe: "Karlıtepe",
  kucukkoy: "Küçükköy",
  fevzicakmak: "Fevziçakmak",
  ufuk: "Ufuk",
  yenidogan: "Yenidoğan",
  pazarici: "Pazariçi",
  atisalani: "Atışalanı",
  karaagac: "Karaağaç",

  // Sultangazi Mahalleleri
  cebeci: "Cebeci",
  ugurmumcu: "Uğur Mumcu",
  habibler: "Habibler",
  ikitelli: "İkitelli",
  "50-yil": "50. Yıl",
  gazi: "Gazi",

  // Eyüp Mahalleleri
  alibeykoy: "Alibeyköy",
  rami: "Rami",
  gungorensanayi: "Güngören Sanayi",

  // Bağcılar Mahalleleri
  baris: "Barış",
  yenimahalle: "Yenimahalle",
  baglar: "Bağlar",
  goztepe: "Göztepe",

  // Bayrampaşa Mahalleleri
  yildirim: "Yıldırım",
  kartaltepe: "Kartaltepe",
  muratpasa: "Muratpaşa",
  ismetpasa: "İsmetpaşa",

  // Genel
  cumhuriyet: "Cumhuriyet",
  hurriyet: "Hürriyet",
  zafer: "Zafer",
  ataturk: "Atatürk",
};

function toTR(slugPart: string) {
  if (!slugPart) return "";
  return TR_MAP[slugPart.toLowerCase()] || (slugPart.charAt(0).toUpperCase() + slugPart.slice(1));
}

interface Props {
  params: Promise<{ il?: string; ilce?: string; mahalle_or_hizmet?: string; hizmet?: string }>;
}

export async function PageRenderer({ params }: Props) {
  const resolvedParams = await params;

  // Parsing exact nested params
  let currentSlugArr: string[] = [];
  if (resolvedParams.il) currentSlugArr.push(resolvedParams.il);

  let hizmetSlug: string | undefined = undefined;
  let mahalle: string | undefined = resolvedParams.mahalle_or_hizmet;

  if (resolvedParams.ilce && !resolvedParams.mahalle_or_hizmet) {
    // We are at depth 2: could be /tekirdag/corlu OR /tekirdag/su-aritma-servisi
    const svcTry = await getServiceBySlug(resolvedParams.ilce);
    if (svcTry) {
      hizmetSlug = resolvedParams.ilce;
      // Don't add to currentSlugArr as it's a service, not a location segment
    } else {
      currentSlugArr.push(resolvedParams.ilce);
    }
  } else if (resolvedParams.mahalle_or_hizmet && !resolvedParams.hizmet) {
    // We are at depth 3: could be /tekirdag/corlu/resadiye OR /tekirdag/corlu/su-aritma-servisi
    if (resolvedParams.ilce) currentSlugArr.push(resolvedParams.ilce);
    const svcTry = await getServiceBySlug(resolvedParams.mahalle_or_hizmet);
    if (svcTry) {
      hizmetSlug = resolvedParams.mahalle_or_hizmet;
      mahalle = undefined;
    } else {
      currentSlugArr.push(resolvedParams.mahalle_or_hizmet);
    }
  } else if (resolvedParams.mahalle_or_hizmet && resolvedParams.hizmet) {
    // depth 4: /tekirdag/corlu/resadiye/su-aritma-servisi
    if (resolvedParams.ilce) currentSlugArr.push(resolvedParams.ilce);
    currentSlugArr.push(resolvedParams.mahalle_or_hizmet);
    hizmetSlug = resolvedParams.hizmet;
  }

  const locationSlug = currentSlugArr.join("/");
  const location = await getLocationBySlug(locationSlug);

  if (!location) {
    notFound();
  }

  let service = null;
  if (hizmetSlug) {
    service = await getServiceBySlug(hizmetSlug);
    if (!service) notFound();
  }

  const allLocalServices = await getActiveServices();

  const customPage = await getCustomPage(location.id, service?.id);

  const locName = location.mahalle
    ? `${toTR(location.mahalle)} Mahallesi`
    : (location.ilce ? toTR(location.ilce) : toTR(location.il));

  const title = customPage?.h1 || (service
    ? `${locName} ${service.ad}`
    : `${locName} Su Arıtma Servisi ve Cihazları`);

  const subtitle = customPage?.meta_description ||
    `${locName} bölgesine aynı gün servis, uygun fiyatlı cihazlar ve tam kapsamlı filtre değişim hizmeti.`;

  let neighbors: any[] = [];
  if (location.mahalle) {
    // Mahalle sayfasındayken aynı ilçedeki diğer mahalleleri göster
    neighbors = await getNearbyNeighborhoods(location.ilce, location.slug) || [];
  } else if (location.ilce) {
    // İlçe sayfasındayken o ilçeye ait mahalleleri göster
    neighbors = await getNearbyNeighborhoods(location.ilce, location.slug) || [];
  } else {
    // İl sayfasındayken o ile ait ilçeleri göster
    neighbors = await getNearbyDistricts(location.il, location.slug) || [];
  }

  const faqs = [
    {
      q: `${locName} bölgesinde su sertliği nasıl?`,
      a: `İstanbul'un bu bölgesinde (${locName}) ortalama TDS değeri ${location.tds_degeri || 320} civarındadır. İstanbul şebeke suyu genel olarak sert sayılır; özellikle beyaz evcil eşya ve ısıtıcılarda kireç birikim sorununa karşı arıtma sistemi kullanılmasını mutlaka öneriyoruz.`
    },
    {
      q: `${locName} alanında servis ücretiniz ne kadar?`,
      a: `Keşif işlemlerimiz ve servisimizle ilgili teklif almak için bizi arayabilirsiniz. Filtre değişimi ve cihaz fiyatları için bizimle iletişime geçebilirsiniz. Gaziosmanpaşa merkez ve tüm çevre ilçelere servis veriyoruz.`
    },
    {
      q: "Aynı gün servis hizmetiniz var mı?",
      a: `Evet, 7/24 mobil araçlarımızla ${locName} içinde aynı gün hizmet sunuyoruz. Sabah arayan müşterilerimize çoğunlukla öleden önce ulaşıyoruz.`
    },
    {
      q: `Gaziosmanpaşa için hangi cihazı önerirsiniz?`,
      a: `İstanbul suyunun yapısına göre 5 veya 7 katmanlı ters ozmoz (RO) sistemi en doğru seçenektir. TDS değeri 300'n üzerinde olan bölgelerde (${locName} dahil) mineral tákviyeli RO sistemleri öncelikli tercihimizdir.`
    }
  ];

  const localBusinessSchema = generateLocalBusinessSchema(locName, service?.ad, location.lat, location.lng, location.rating_score, location.review_count);
  const serviceSchemaObj = service ? generateServiceSchema(service.ad, service.aciklama, `SuArıtmaServis34 ${locName}`, locName, service.rating_score, service.review_count) : null;

  const breadcrumbs = [];
  let cum = "";
  for (const s of currentSlugArr) {
    cum += `/${s}`;
    breadcrumbs.push({ name: toTR(s), url: cum });
  }
  if (hizmetSlug) {
    breadcrumbs.push({ name: service!.ad, url: `${cum}/${hizmetSlug}` });
  }

  // Dynamic Image Logic
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.suaritmaservis34.com';
  const pageImage = customPage?.image_url || `${baseUrl}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle.slice(0, 100))}`;

  return (
    <main className="min-h-screen bg-background">
      <script
        id="localdev-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {serviceSchemaObj && (
        <script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemaObj) }}
        />
      )}

      <HeroSection
        title={title}
        subtitle={subtitle}
        tdsValue={location.tds_degeri}
        locationName={locName}
        breadcrumbs={breadcrumbs}
        imageUrl={pageImage}
      />

      <ServiceSection
        locationName={locName}
        serviceName={service?.ad || "Su Arıtma Çözümleri"}
        customContent={customPage?.ozel_icerik}
        serviceType={service?.tip || "commercial"}
        tdsValue={location.tds_degeri}
        featuredImage={pageImage}
      />

      {allLocalServices.length > 0 && (
        <LocalServicesLinks
          services={allLocalServices}
          baseUrl={`/${locationSlug}`}
          currentServiceId={service?.id}
        />
      )}

      <NearbyLocations neighbors={neighbors} currentLocationName={locName} />

      <FAQSection faqs={faqs} locationName={locName} />

      <CtaBand />
    </main>
  );
}

// Generate Metadata helper
export async function generateDynamicMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  // Logic identical to rendering, returns Metadata
  let currentSlugArr: string[] = [];
  if (resolvedParams.il) currentSlugArr.push(resolvedParams.il);
  let hizmetSlug: string | undefined = undefined;

  if (resolvedParams.ilce && !resolvedParams.mahalle_or_hizmet) {
    const svcTry = await getServiceBySlug(resolvedParams.ilce);
    if (svcTry) {
      hizmetSlug = resolvedParams.ilce;
    } else {
      currentSlugArr.push(resolvedParams.ilce);
    }
  } else if (resolvedParams.mahalle_or_hizmet && !resolvedParams.hizmet) {
    if (resolvedParams.ilce) currentSlugArr.push(resolvedParams.ilce);
    const svcTry = await getServiceBySlug(resolvedParams.mahalle_or_hizmet);
    if (svcTry) {
      hizmetSlug = resolvedParams.mahalle_or_hizmet;
    } else {
      currentSlugArr.push(resolvedParams.mahalle_or_hizmet);
    }
  } else if (resolvedParams.mahalle_or_hizmet && resolvedParams.hizmet) {
    if (resolvedParams.ilce) currentSlugArr.push(resolvedParams.ilce);
    currentSlugArr.push(resolvedParams.mahalle_or_hizmet);
    hizmetSlug = resolvedParams.hizmet;
  }

  const locationSlug = currentSlugArr.join("/");
  const location = await getLocationBySlug(locationSlug);
  if (!location) return { title: "Sayfa Bulunamadı" };

  let service = null;
  if (hizmetSlug) {
    service = await getServiceBySlug(hizmetSlug);
  }

  const customPage = await getCustomPage(location.id, service?.id);
  const locName = location.mahalle
    ? `${toTR(location.mahalle)}`
    : toTR(location.ilce);

  const metaTitle = customPage?.title || (service
    ? `${locName} Su Arıtma ${service.ad} | SuArıtmaServis34`
    : `${locName} Su Arıtma Servisi ve Cihazları | SuArıtmaServis34`);

  const metaDesc = customPage?.meta_description ||
    `${locName} için 7/24 su arıtma servisi. Ortalama ${location.tds_degeri} TDS kireç oranına özel garantili filtre değişimi ve tamir.`;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/${locationSlug}${hizmetSlug ? `/${hizmetSlug}` : ''}`;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.suaritmaservis34.com'}/api/og?title=${encodeURIComponent(metaTitle)}`,
          width: 1200,
          height: 630,
          alt: metaTitle,
        }
      ]
    },
    other: {
      "geo.region": "TR-34", // İstanbul plaka kodu
      "geo.placename": locName,
      ...(location.lat && location.lng ? {
        "geo.position": `${location.lat};${location.lng}`,
        "ICBM": `${location.lat}, ${location.lng}`
      } : {})
    }
  };
}
