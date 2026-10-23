/**
 * Quantum Plus — doğrulanmış ürün bilgileri ve fotoğraflardan ölçülmüş koordinatlar.
 * Buradaki dışında iddia (sertifika, TDS/pH değeri, garanti, fiyat) eklenmez.
 * Sahibin düzeltmeleri: ORP modülü yoktur; B12 ayrı filtre değil, mineral filtrenin içindedir;
 * tuşlar Function ve On/Off'tur; kaçak sensörü mekaniktir, selenoid valfle ilgisi yoktur.
 */
import { waLink } from "../prada-v2/contact";

export { PHONE, TEL, waLink } from "../prada-v2/contact";

export const PRODUCT = "Quantum Plus";
export const WA = waLink(`Merhaba, ${PRODUCT} dijital su arıtma cihazı hakkında bilgi almak istiyorum.`);

/** 6 aşamalı filtreleme (sıra önemli) */
export const STAGES = [
  { no: "01", name: "Sediment Filtre", short: "Sediment" },
  { no: "02", name: "GAC Karbon Filtre", short: "GAC Karbon" },
  { no: "03", name: "CTO Blok Karbon Filtre", short: "CTO Blok Karbon" },
  { no: "04", name: "80 GPD Cruze Membran", short: "Cruze Membran" },
  { no: "05", name: "Gümüş İyon Post Carbon", short: "Gümüş İyon" },
  { no: "06", name: "Cruze Mineral Filtre", short: "Mineral" },
] as const;

/** 6. aşama: alkali su ve B12 vurgusu buradan gelir (ayrı bir B12 filtresi yoktur) */
export const MINERAL = {
  name: "Cruze Mineral Filtre",
  tag: "Alkali · B12",
  line: "B12 vitaminli mineral filtre; suya alkali özellik kazandırır.",
} as const;

/** Su kaçak sensörü: mekanik çalışır, selenoid valfle ilgisi yoktur */
export const LEAK = {
  name: "Su kaçak sensörü",
  line: "Suyla temas edince içindeki pamuk şişer, mandal atar ve su yolunu kapatır.",
  short: "Kaçakta su yolunu kendiliğinden kapatır.",
} as const;

/** Ön paneldeki dokunmatik tuşlar (fotoğrafta MODE/RESET yazsa da gerçek adları bunlar) */
export const KEYS = { function: "Function", power: "On/Off" } as const;

/** Donanım ve akıllı özellikler */
export const FEATURES = [
  "Alkali + B12 mineral filtre",
  "Dijital LED ekran",
  "TDS takip",
  "Filtre takip",
  "Dokunmatik kontrol",
  "Su kaçak sensörü",
  "Selenoid valf",
  "Paslanmaz musluk",
  "Mat dayanıklı kasa",
  "Modern tasarım",
] as const;

/** Ölçüler (cm) */
export const DIMENSIONS = { height: 41, width: 26, depth: 43 } as const;

/** Görseller (açık mavi stüdyo zeminli JPG'ler; şeffaflık yok) */
export const IMAGES = {
  hero: { src: "/images/quantum/hero.jpg", w: 690, h: 770 },
  front: { src: "/images/quantum/front.jpg", w: 292, h: 446 },
  side: { src: "/images/quantum/side.jpg", w: 489, h: 449 },
  open: { src: "/images/quantum/open.jpg", w: 377, h: 412 },
  kit: { src: "/images/quantum/kit.jpg", w: 760, h: 486 },
} as const;

/**
 * hero.jpg (690×770) üzerindeki ön panel ekranının piksel koordinatları.
 * Canlı ekran katmanı aynı viewBox ile (0 0 690 770) birebir üstüne bindirilir.
 * Panel hafif açılı olduğu için sütunlar sağa doğru birkaç piksel aşağı kayar.
 */
export const DISPLAY = {
  ring: { cx: 166.5, cy: 336, r: 62, stroke: 8 },
  digits: { x: 140, y: 313, w: 53, h: 45 },
  underline: { x1: 107, y1: 406, x2: 223, y2: 414, width: 6 },
  /** her sütunda 6 segment; y üstten alta; segment yüksekliği ~7, aralık ~10.5 */
  bars: [
    { label: "DEPO", x: 95, w: 16, top: 465, bottom: 528 },
    { label: "ÜRETİM", x: 134, w: 17, top: 467, bottom: 532 },
    { label: "ATIK", x: 175, w: 16, top: 470, bottom: 537 },
    { label: "SERVİS", x: 216, w: 18, top: 473, bottom: 540 },
  ],
  segments: 6,
  /** soldaki tuş On/Off (fotoğrafta MODE yazar), sağdaki Function (fotoğrafta RESET yazar) */
  keys: [
    { label: "On/Off", cx: 118, cy: 560, r: 21 },
    { label: "Function", cx: 205, cy: 568, r: 21 },
  ],
} as const;

/** kit.jpg üzerindeki parçaların konumu (%). Soldaki "pH" rozetli beyaz parça bir ürün parçası değildir; işaretlenmez. */
export const KIT_ITEMS = [
  { name: "Quantum Plus gövde", desc: "Mat beyaz kasa, siyah cam dijital panel.", x: 41.8, y: 61.7 },
  { name: "Filtre kartuşları", desc: "Gövdenin üstünde, kolay erişilen hat tipi kartuşlar.", x: 42, y: 14.5 },
  { name: "80 GPD Cruze membran", desc: "Ters ozmoz sisteminin kalbi.", x: 64.1, y: 57.6 },
  { name: "Güç adaptörü", desc: "Elektronik panel için.", x: 71.7, y: 75 },
  { name: "Paslanmaz musluk", desc: "Kutusunda gelen paslanmaz çelik musluk.", x: 84.2, y: 41 },
  { name: "Hortum ve bağlantı parçaları", desc: "Kurulum için gereken hortum ve rakorlar.", x: 92, y: 68 },
] as const;
