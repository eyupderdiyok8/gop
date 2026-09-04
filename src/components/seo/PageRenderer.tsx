import { notFound } from "next/navigation";
import { getActiveServices, getLocationBySlug, getServiceBySlug, getCustomPage, getNearbyNeighborhoods, getNearbyDistricts } from "@/lib/seo/db";
import { HeroSection } from "@/components/seo/HeroSection";
import { ServiceSection } from "@/components/seo/ServiceSection";
import { FAQSection } from "@/components/seo/FAQSection";
import { NearbyLocations } from "@/components/seo/NearbyLocations";
import { LocalServicesLinks } from "@/components/seo/LocalServicesLinks";
import { generateLocalBusinessSchema, generateServiceSchema } from "@/lib/seo/schema";
import { CtaBand } from "@/components/sections/CtaBand";
import { formatLocationName } from "@/lib/seo/locationNames";
import type { Metadata } from "next";
import { formatTechnicalText } from "@/lib/products/formatTechnicalText";

interface Props {
  params: Promise<{ il?: string; ilce?: string; mahalle_or_hizmet?: string; hizmet?: string }>;
}

interface Neighbor {
  il: string;
  ilce: string;
  mahalle: string | null;
  slug: string;
}

const DISTRICT_CONTEXT: Record<string, { serviceArea: string; intro: string }> = {
  sultangazi: {
    serviceArea: "Sultançiftliği, Cebeci, Gazi, 50. Yıl ve Uğur Mumcu",
    intro: "Sultançiftliği'ndeki merkezimizden Sultangazi mahallelerine cihaz satışı, montaj, bakım ve filtre değişimi hizmeti veriyoruz.",
  },
  gaziosmanpasa: {
    serviceArea: "Merkez, Karadeniz, Karayolları, Bağlarbaşı ve Yıldıztabya",
    intro: "Sultangazi'ye komşu Gaziosmanpaşa mahallelerinde su arıtma cihazı kurulumu, filtre değişimi ve teknik servis taleplerini planlıyoruz.",
  },
  eyup: {
    serviceArea: "Alibeyköy, Göktürk, Kemerburgaz, Yeşilpınar ve Silahtarağa",
    intro: "Eyüpsultan'ın şehir merkezi ve kuzey mahallelerinde ev ve iş yerlerine uygun su arıtma sistemi seçimi ile teknik servis desteği sunuyoruz.",
  },
  bayrampasa: {
    serviceArea: "Kartaltepe, Yıldırım, Kocatepe, Altıntepsi ve Terazidere",
    intro: "Bayrampaşa mahallelerinde tezgâh altı su arıtma cihazı montajı, periyodik bakım ve arıza tespiti hizmeti sağlıyoruz.",
  },
  esenler: {
    serviceArea: "Atışalanı, Kazım Karabekir, Menderes, Turgut Reis ve Nine Hatun",
    intro: "Esenler'de konut ve iş yerleri için su tüketimi, basınç ve mevcut su değerlerine göre cihaz ve servis çözümü sunuyoruz.",
  },
  bagcilar: {
    serviceArea: "Bağlar, Barış, Göztepe ve Yenimahalle",
    intro: "Bağcılar'da ev ve iş yerleri için cihaz kapasitesi, su basıncı ve bakım ihtiyacına göre montaj ve teknik servis planlıyoruz.",
  },
  basaksehir: {
    serviceArea: "Başakşehir ve yakın yerleşimler",
    intro: "Başakşehir'deki konut ve iş yerlerinde kurulum alanı, günlük tüketim ve su basıncına uygun arıtma sistemi seçimi sunuyoruz.",
  },
  gungoren: {
    serviceArea: "Güngören ve yakın mahalleler",
    intro: "Güngören'de mevcut cihazların filtre değişimi, arıza tespiti ve yeni cihaz montajı için bölgesel servis desteği sağlıyoruz.",
  },
};

export async function PageRenderer({ params }: Props) {
  const resolvedParams = await params;

  // Parsing exact nested params
  const currentSlugArr: string[] = [];
  if (resolvedParams.il) currentSlugArr.push(resolvedParams.il);

  let hizmetSlug: string | undefined = undefined;
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
    ? `${formatLocationName(location.mahalle)} Mahallesi`
    : (location.ilce ? formatLocationName(location.ilce) : formatLocationName(location.il));

  const serviceName = service ? formatTechnicalText(service.ad) : null;
  const title = customPage?.h1 || (service
    ? `${locName} ${serviceName}`
    : `${locName} Su Arıtma Servisi ve Cihazları`);

  const districtContext = DISTRICT_CONTEXT[location.ilce] || {
    serviceArea: `${locName} ve yakın çevresi`,
    intro: `${locName} bölgesinde cihaz satışı, montaj, filtre değişimi ve teknik servis hizmeti sunuyoruz.`,
  };

  const subtitle = customPage?.meta_description ||
    districtContext.intro;

  let neighbors: Neighbor[] = [];
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
      q: `${locName} için cihaz seçerken hangi su değerleri ölçülmeli?`,
      a: `${locName} için kayıtlı yaklaşık TDS değeri ${location.tds_degeri || 320} ppm'dir; gerçek değer bina ve zamana göre değişebilir. TDS toplam çözünmüş madde miktarını gösterir, su sertliğiyle aynı ölçüm değildir. Sertlik için kalsiyum ve magnezyum değerleri ayrıca değerlendirilmelidir.`
    },
    {
      q: `${locName} servis ücreti nasıl belirlenir?`,
      a: `Ücret; cihazın modeli, arıza türü, değişecek filtre veya parçalar ve servis adresine göre belirlenir. İşlem öncesinde ihtiyaç netleştirilir ve onayınız alınmadan parça değişimi yapılmaz.`
    },
    {
      q: `${locName} için aynı gün servis mümkün mü?`,
      a: `Pazartesi-Cumartesi 08:00-19:00 saatlerinde gelen talepleri ekip ve rota uygunluğuna göre aynı güne planlayabiliyoruz. ${districtContext.serviceArea} servis güzergâhımız içinde yer alır.`
    },
    {
      q: `${locName} için hangi su arıtma sistemi uygundur?`,
      a: `Tek bir sistem her ev için doğru değildir. Giriş suyu basıncı, TDS ölçümü, sertlik analizi, günlük tüketim ve cihazın kurulacağı alan birlikte değerlendirilerek ters ozmoz (RO) veya ihtiyaca uygun başka bir filtrasyon sistemi seçilir.`
    }
  ];

  const localBusinessSchema = generateLocalBusinessSchema(locName, serviceName || undefined, location.lat, location.lng);
  const serviceSchemaObj = service ? generateServiceSchema(serviceName!, service.aciklama, `SuArıtmaServis34 ${locName}`, locName) : null;

  const breadcrumbs = [];
  let cum = "";
  for (const s of currentSlugArr) {
    cum += `/${s}`;
    breadcrumbs.push({ name: formatLocationName(s), url: cum });
  }
  if (hizmetSlug) {
    breadcrumbs.push({ name: serviceName!, url: `${cum}/${hizmetSlug}` });
  }

  // Static / Fallback Image Logic
  const pageImage = customPage?.image_url || '/images/su-aritma-servis34.webp';

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
        serviceName={serviceName || "Su Arıtma Çözümleri"}
        customContent={customPage?.ozel_icerik}
        serviceType={service?.tip || "commercial"}
        tdsValue={location.tds_degeri}
        featuredImage={pageImage}
        serviceArea={districtContext.serviceArea}
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
  const currentSlugArr: string[] = [];
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
  const metadataServiceName = service ? formatTechnicalText(service.ad) : null;
  const locName = location.mahalle
    ? `${formatLocationName(location.mahalle)} Mahallesi`
    : (location.ilce ? formatLocationName(location.ilce) : formatLocationName(location.il));

  const rawMetaTitle = customPage?.title || (service
    ? `${locName} ${metadataServiceName} | SuArıtmaServis34`
    : `${locName} Su Arıtma Servisi ve Cihazları | SuArıtmaServis34`);
  const metaTitle = rawMetaTitle.replace(/\s*\|\s*SuArıtmaServis34\s*$/i, "");

  const metaDesc = customPage?.meta_description ||
    `${locName} su arıtma servisi: cihaz satışı, montaj, filtre değişimi ve arıza tespiti. Sultangazi merkezli ekibimiz İstanbul Avrupa Yakası'nda hizmet verir.`;

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
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.suaritmaservis34.com'}/images/su-aritma-servis34.webp`,
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
