export const PHONE = "0553 114 27 34";
export const TEL = "tel:+905531142734";

/** Fiyatlar yalnızca sayfanın sonundaki fiyat bölümünde gösterilir */
export const PRICES = { pompasiz: "50.000₺", pompali: "60.000₺" } as const;

export function waLink(message = "Merhaba, 3.2 Prada su arıtma cihazı hakkında bilgi almak istiyorum.") {
  return "https://wa.me/905531142734?text=" + encodeURIComponent(message);
}

export const WA = waLink();
