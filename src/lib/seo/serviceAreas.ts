import { CORE_SERVICE_SLUGS } from "@/lib/seo/indexPolicy";

// Ana sayfa ve /hizmetler sayfalarından bölge sayfalarına verilen iç linkler için ilçe listesi.
// locations tablosundaki ilçe kayıtlarıyla (slug: istanbul/<ilce>) eşleşmelidir.
export const SERVICE_DISTRICTS = [
  { slug: "sultangazi", name: "Sultangazi" },
  { slug: "gaziosmanpasa", name: "Gaziosmanpaşa" },
  { slug: "eyup", name: "Eyüpsultan" },
  { slug: "esenler", name: "Esenler" },
  { slug: "bayrampasa", name: "Bayrampaşa" },
  { slug: "bagcilar", name: "Bağcılar" },
  { slug: "basaksehir", name: "Başakşehir" },
  { slug: "gungoren", name: "Güngören" },
] as const;

export function districtUrl(districtSlug: string, serviceSlug?: string) {
  const base = `/istanbul/${districtSlug}`;
  return serviceSlug && (CORE_SERVICE_SLUGS as readonly string[]).includes(serviceSlug)
    ? `${base}/${serviceSlug}`
    : base;
}
