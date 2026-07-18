import type { Metadata } from "next";
import CihazYenilemeClient from "@/components/public/cihaz-yenileme/CihazYenilemeClient";

export const metadata: Metadata = {
  title: "Cihaz Yenileme Kampanyası – Eski Cihazınızı Alalım, Yenisini Verelim | SuArıtmaServis34",
  description:
    "Eski su arıtma cihazınızı takas edin, indirimli fiyatla yepyeni bir cihaza sahip olun. Ücretsiz söküm, montaj ve 2 yıl garanti dahil. Hemen teklif alın!",
  openGraph: {
    title: "Cihaz Yenileme Kampanyası – Eski Cihazınızı Alalım, Yenisini Verelim",
    description:
      "Eski su arıtma cihazınızı takas edin, indirimli fiyatla yepyeni bir cihaza sahip olun. Ücretsiz söküm, montaj ve 2 yıl garanti dahil.",
    images: [
      {
        url: "https://www.suaritmaservis34.com/images/cihaz-yenileme-kampanyasi.jpg",
        width: 1200,
        height: 675,
        alt: "Su arıtma cihazı yenileme kampanyası",
      },
    ],
  },
};

export default function CihazYenilemePage() {
  return <CihazYenilemeClient />;
}
