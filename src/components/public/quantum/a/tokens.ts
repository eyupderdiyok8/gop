/** Konsept A renkleri (JS/SVG içinde lazım olduğunda). CSS'te theme.module.css değişkenlerini kullanın. */

export const C = {
  pearl: "#F4F8FD",
  mist: "#E6F0FB",
  sky: "#CFE4FA",
  cloud: "#FFFFFF",
  text: "#0B0F17",
  slate: "#475467",
  glass: "#06070A",
  glass2: "#0D0F14",
  paper: "#F5F7FA",
  amber: "#FFB020",
  wa: "#25D366",
  steel: ["#C9CED6", "#8A919C"],
} as const;

/** İris: parlak (çizgi/halka, mürekkep üstü metin) ve koyu (inci üstü metin) */
export const IRIS = ["#FF3DC8", "#8B5CF6", "#22D3EE"] as const;
export const IRIS_DEEP = ["#D1179E", "#6D3AE0", "#0891B2"] as const;
export const IRIS_STOPS = [0, 0.45, 1] as const;

export const LED = { on: "#34E37A", on2: "#2EE6D6", off: "#1B1F24", glow: "rgba(52,227,122,0.22)" } as const;

/** 01–06 aşama renkleri (dekoratif; kartuş etiket renkleriyle bilerek eşleşmez) */
export const SPECTRUM = ["#FF3DC8", "#C04BFF", "#8B5CF6", "#5B6CFF", "#3B9BFF", "#22D3EE"] as const;

/** Yalnızca Mineral bölümü: soğuk su/mineral tonları (döngüsel; ölçek ya da değer anlamı yok) */
export const MINERAL_HUES = ["#2F7BFF", "#22D3EE", "#2EE6D6", "#5B6CFF", "#8B5CF6"] as const;

export const EASE = [0.16, 1, 0.3, 1] as const;
