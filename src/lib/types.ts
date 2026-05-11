// Database types
export type ServiceStatus = "bekliyor" | "devam_ediyor" | "tamamlandi" | "iptal";
export type AppointmentStatus = "bekliyor" | "onaylandi" | "tamamlandi" | "iptal";
export type MovementType = "giris" | "cikis";

export interface Customer {
  id: string;
  ad: string;
  telefon: string;
  telefon2: string | null;
  email: string | null;
  adres: string | null;
  notlar: string | null;
  islem_1: string | null;
  islem_2: string | null;
  islem_3: string | null;
  odeme_yontemi: string | null;
  islem_tarihi: string | null;
  sonraki_islem_gun: number | null;
  islem_tutari: number | null;
  teknisyen: string | null;
  sonraki_islem_tarihi: string | null;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  customer_id: string;
  marka: string;
  model: string;
  seri_no: string | null;
  satin_alma_tarihi: string | null;
  created_at: string;
  updated_at: string;
  customers?: Customer;
}

export interface ServiceRecord {
  id: string;
  device_id: string;
  aciklama: string;
  durum: ServiceStatus;
  teknisyen: string | null;
  servis_tarihi: string;
  notlar: string | null;
  created_at: string;
  updated_at: string;
  devices?: Device & { customers?: Customer };
}

export interface InventoryItem {
  id: string;
  urun_adi: string;
  marka?: string | null;
  kategori: string;
  adet: number;
  min_stok_esigi: number;
  birim_fiyat: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  inventory_id: string;
  service_record_id: string | null;
  hareket_turu: MovementType;
  miktar: number;
  aciklama: string | null;
  yapan_kullanici: string | null;
  created_at: string;
  inventory?: InventoryItem;
}

export interface FilterPlan {
  id: string;
  device_id: string;
  son_degisim_tarihi: string;
  periyot_gun: number;
  sonraki_degisim: string;
  bildirim_gonderildi_7: boolean;
  bildirim_gonderildi_1: boolean;
  notlar: string | null;
  created_at: string;
  updated_at: string;
  devices?: Device & { customers?: Customer };
}

export interface Appointment {
  id: string;
  customer_id: string | null;
  musteri_adi: string;
  musteri_telefon: string;
  musteri_email: string | null;
  musteri_adres?: string | null;
  hizmet_turu: string;
  randevu_tarihi: string;
  teknisyen: string | null;
  durum: AppointmentStatus;
  notlar: string | null;
  created_at: string;
  updated_at: string;
  customers?: Customer;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  icerik: string;
  yazan: string | null;
  created_at: string;
}

export interface Technician {
  id: string;
  ad_soyad: string;
  aktif: boolean;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  slug: string;
  name: string;
  tagline: string | null;
  price: number | null;
  old_price: number | null;
  description: string | null;
  badge: string | null;
  badge_color: string | null;
  main_image: string | null;
  gallery: string[];
  specs: string[];
  features: { title: string; icon: string; desc: string }[];
  is_active: boolean;
  is_highlight: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
}
