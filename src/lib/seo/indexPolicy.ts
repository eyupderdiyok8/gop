// Programatik bölge sayfalarından hangilerinin Google'a indekslenmek üzere sunulacağını belirler.
// Mahalle × hizmet kombinasyonları ve düşük talepli hizmetler neredeyse aynı içerik ürettiği için
// noindex,follow olarak kalır ve sitemap'e girmez; sayfalar ziyaretçiler için erişilebilir kalır.

export const CORE_SERVICE_SLUGS = [
  "su-aritma-servisi",
  "su-aritma-cihazi",
  "filtre-degisimi",
  "su-aritma-montaj",
] as const;

export function isCoreService(slug: string | undefined | null) {
  return !!slug && (CORE_SERVICE_SLUGS as readonly string[]).includes(slug);
}

interface LocationLike {
  ilce?: string | null;
  mahalle?: string | null;
}

export function isIndexablePage(location: LocationLike, serviceSlug?: string | null) {
  if (!serviceSlug) return true; // il, ilçe ve mahalle sayfaları
  if (location.mahalle) return false; // mahalle × hizmet
  if (!location.ilce) return false; // il × hizmet (/istanbul/filtre-degisimi)
  return isCoreService(serviceSlug); // ilçe × ana hizmet
}
