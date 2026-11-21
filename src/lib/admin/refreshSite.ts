/** Panelde değişiklik olunca ilgili veriyi sitede hemen yeniler (yalnızca o veriyi kullanan sayfalar, ziyaret edildikçe) */
export type SiteDataTag = "product-menu" | "installation-media";

export const refreshSiteData = (tag: SiteDataTag) =>
  fetch("/api/admin/site-yenile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag }),
  }).catch(() => {});
