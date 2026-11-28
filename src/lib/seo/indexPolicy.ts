// Programatik bölge sayfalarından hangilerinin Google'a indekslenmek üzere sunulacağını belirler.
// Mahalle × hizmet kombinasyonları ve düşük talepli hizmetler neredeyse aynı içerik ürettiği için
// noindex,follow olarak kalır ve sitemap'e girmez; sayfalar ziyaretçiler için erişilebilir kalır.
// Mahalle sayfaları da şablondan üretildiği için (komşu mahallelerle ~%96 aynı metin) yalnızca panelden
// özel içerik yazıldığında indekslenir; aksi halde Google bunları kapı sayfası (doorway) olarak görür.

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

export function isIndexablePage(location: LocationLike, serviceSlug?: string | null, hasCustomContent = false) {
  if (!serviceSlug) return location.mahalle ? hasCustomContent : true; // il ve ilçe sayfaları; mahalle yalnızca özel içerikle
  if (location.mahalle) return false; // mahalle × hizmet
  if (!location.ilce) return false; // il × hizmet (/istanbul/filtre-degisimi)
  return isCoreService(serviceSlug); // ilçe × ana hizmet
}
