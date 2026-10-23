import { KIT_ITEMS } from "../data";

/** Açıklamalar data.ts'ten gelir (doğrulanmış metin) */
const desc = (name: (typeof KIT_ITEMS)[number]["name"]) => KIT_ITEMS.find((k) => k.name === name)?.desc ?? "";

/**
 * Kutu içeriği (sıra = işaret numarası). Konumlar kit.jpg (760×486) üzerinde yüzde olarak.
 * Fotoğrafın solundaki rozetli beyaz parça ürünün parçası değildir: işaretlenmez, anlatılmaz.
 * at: işaretin yeri · focus: kamera yaklaşınca ortalanacak nokta.
 * Odaklar, 1.7x yakınlaşmada (görünen pencere odak ±%29,4) soldaki rozetli parça (x %13–20) ve
 * paneldeki baskılı rozet (x %32–38, y %82–91) kadraja girmeyecek biçimde seçildi.
 * Güç adaptörü: valf yalnızca özellik listesinde, iddiasız geçer; bu yüzden burada yalnızca panel anılır.
 */
export const SET_ITEMS = [
  { id: "cihaz", name: "Quantum Plus cihaz", desc: desc("Quantum Plus gövde"), at: { x: 32.4, y: 38.5 }, focus: { x: 50.5, y: 50 } },
  { id: "kartus", name: "Filtre kartuşları", desc: desc("Filtre kartuşları"), at: { x: 42, y: 14.5 }, focus: { x: 50, y: 20 } },
  { id: "membran", name: "80 GPD Cruze membran", desc: desc("80 GPD Cruze membran"), at: { x: 64, y: 50 }, focus: { x: 69, y: 58 } },
  { id: "musluk", name: "Paslanmaz musluk", desc: desc("Paslanmaz musluk"), at: { x: 80.5, y: 84 }, focus: { x: 81, y: 68 } },
  { id: "adaptor", name: "Güç adaptörü", desc: "Elektronik panel için.", at: { x: 71.5, y: 70 }, focus: { x: 72, y: 72 } },
  { id: "hortum", name: "Hortum ve bağlantı parçaları", desc: desc("Hortum ve bağlantı parçaları"), at: { x: 92.5, y: 68 }, focus: { x: 90, y: 68 } },
] as const;

export type SetItem = (typeof SET_ITEMS)[number];

/** İşaret ve onay kutusunun birlikte yandığı an (sn, kapak açıldıktan sonra) */
export const popDelay = (i: number) => 0.12 + i * 0.09;
