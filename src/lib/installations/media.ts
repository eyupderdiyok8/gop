export type InstallationMedia = {
  id: string;
  kind: "image" | "video";
  /** Fotoğraf ya da video kapağı */
  thumb: string;
  /** Büyük görünümde açılacak adres (fotoğraf ya da YouTube embed) */
  src: string;
  caption: string;
  vertical: boolean;
};

export type InstallationRow = {
  id: string;
  kind: "image" | "video";
  image_url: string | null;
  video_url: string | null;
  caption: string | null;
};

/** YouTube bağlantısından video kimliği ve Shorts (dikey) bilgisi */
export function parseYouTube(url: string | null | undefined): { id: string; vertical: boolean } | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
  return m ? { id: m[1], vertical: url.includes("/shorts/") } : null;
}

export function toInstallationMedia(row: InstallationRow): InstallationMedia | null {
  const caption = row.caption?.trim() || "Su arıtma kurulumu";
  if (row.kind === "video") {
    const yt = parseYouTube(row.video_url);
    if (!yt) return null;
    return {
      id: row.id,
      kind: "video",
      thumb: row.image_url || `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg`,
      src: `https://www.youtube.com/embed/${yt.id}`,
      caption,
      vertical: yt.vertical,
    };
  }
  if (!row.image_url) return null;
  return { id: row.id, kind: "image", thumb: row.image_url, src: row.image_url, caption, vertical: false };
}

/** 034 SQL çalışmadan önce ya da tablo boşken gösterilen kayıtlar */
export const fallbackInstallations: InstallationMedia[] = [
  { id: "f1", kind: "image", thumb: "/testimonials/su-aritma-servisi-musteri-yorumlari1.jpeg", src: "/testimonials/su-aritma-servisi-musteri-yorumlari1.jpeg", caption: "Tezgah altı su arıtma kurulumu", vertical: false },
  { id: "f2", kind: "video", thumb: "/testimonials/su-aritma-servisi-musteri-yorumlari2.jpeg", src: "https://www.youtube.com/embed/zjKagH_Oygg", caption: "Kurulum videosu", vertical: true },
  { id: "f3", kind: "image", thumb: "/testimonials/su-aritma-servisi-musteri-yorumlari3.jpeg", src: "/testimonials/su-aritma-servisi-musteri-yorumlari3.jpeg", caption: "Mutfak dolabına su arıtma montajı", vertical: false },
];

