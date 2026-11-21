/** Panelde değişiklik olunca ilgili veriyi sitede hemen yeniler (yalnızca o veriyi kullanan sayfalar, ziyaret edildikçe) */
export type SiteDataTag = "product-menu" | "installation-media";

const post = (body: object) =>
  fetch("/api/admin/site-yenile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});

export const refreshSiteData = (tag: SiteDataTag) => post({ tag });

/** Belirli sayfaları yeniler; yalnızca /blog ve /urunler altındaki adresler kabul edilir */
export const refreshSitePaths = (paths: string[]) => post({ paths });
