-- ============================================================
-- AquaPure Teknik Servis Yönetim Sistemi - Supabase Migration
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. MÜŞTERİLER (customers)
-- ============================================================
CREATE TABLE customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad          TEXT NOT NULL,
  telefon     TEXT NOT NULL,
  email       TEXT,
  adres       TEXT,
  notlar      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customers_telefon ON customers(telefon);
CREATE INDEX idx_customers_email   ON customers(email);
CREATE INDEX idx_customers_ad      ON customers(ad);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. CİHAZLAR (devices)
-- ============================================================
CREATE TABLE devices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  marka           TEXT NOT NULL,
  model           TEXT NOT NULL,
  seri_no         TEXT,
  satin_alma_tarihi DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_customer_id ON devices(customer_id);
CREATE INDEX idx_devices_seri_no     ON devices(seri_no);

CREATE TRIGGER devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. SERVİS KAYITLARI (service_records)
-- ============================================================
CREATE TYPE service_status AS ENUM (
  'bekliyor',
  'devam_ediyor',
  'tamamlandi',
  'iptal'
);

CREATE TABLE service_records (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id   UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  aciklama    TEXT NOT NULL,
  durum       service_status NOT NULL DEFAULT 'bekliyor',
  teknisyen   TEXT,
  servis_tarihi DATE NOT NULL DEFAULT CURRENT_DATE,
  notlar      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_records_device_id ON service_records(device_id);
CREATE INDEX idx_service_records_durum     ON service_records(durum);
CREATE INDEX idx_service_records_tarih     ON service_records(servis_tarihi);

CREATE TRIGGER service_records_updated_at
  BEFORE UPDATE ON service_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. STOK (inventory)
-- ============================================================
CREATE TABLE inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  urun_adi        TEXT NOT NULL,
  kategori        TEXT NOT NULL DEFAULT 'Genel',
  adet            INTEGER NOT NULL DEFAULT 0 CHECK (adet >= 0),
  min_stok_esigi  INTEGER NOT NULL DEFAULT 5,
  birim_fiyat     NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_kategori  ON inventory(kategori);
CREATE INDEX idx_inventory_urun_adi  ON inventory(urun_adi);

CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. STOK HAREKETLERİ (inventory_movements)
-- ============================================================
CREATE TYPE movement_type AS ENUM ('giris', 'cikis');

CREATE TABLE inventory_movements (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id     UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  service_record_id UUID REFERENCES service_records(id) ON DELETE SET NULL,
  hareket_turu     movement_type NOT NULL,
  miktar           INTEGER NOT NULL CHECK (miktar > 0),
  aciklama         TEXT,
  yapan_kullanici  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inv_movements_inventory_id ON inventory_movements(inventory_id);
CREATE INDEX idx_inv_movements_created_at   ON inventory_movements(created_at);

-- Trigger: stok miktarını otomatik güncelle
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.hareket_turu = 'giris' THEN
    UPDATE inventory SET adet = adet + NEW.miktar WHERE id = NEW.inventory_id;
  ELSIF NEW.hareket_turu = 'cikis' THEN
    UPDATE inventory SET adet = adet - NEW.miktar WHERE id = NEW.inventory_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER inventory_movement_trigger
  AFTER INSERT ON inventory_movements
  FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();

-- ============================================================
-- 6. FİLTRE DEĞİŞİM PLANI (filter_plans)
-- ============================================================
CREATE TABLE filter_plans (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id           UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  son_degisim_tarihi  DATE NOT NULL,
  periyot_gun         INTEGER NOT NULL DEFAULT 90 CHECK (periyot_gun > 0),
  sonraki_degisim     DATE GENERATED ALWAYS AS (son_degisim_tarihi + periyot_gun) STORED,
  bildirim_gonderildi_7 BOOLEAN NOT NULL DEFAULT FALSE,
  bildirim_gonderildi_1 BOOLEAN NOT NULL DEFAULT FALSE,
  notlar              TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_filter_plans_device_id       ON filter_plans(device_id);
CREATE INDEX idx_filter_plans_sonraki_degisim ON filter_plans(sonraki_degisim);

CREATE TRIGGER filter_plans_updated_at
  BEFORE UPDATE ON filter_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 7. RANDEVULAR (appointments)
-- ============================================================
CREATE TYPE appointment_status AS ENUM (
  'bekliyor',
  'onaylandi',
  'tamamlandi',
  'iptal'
);

CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  musteri_adi     TEXT NOT NULL,
  musteri_telefon TEXT NOT NULL,
  musteri_email   TEXT,
  hizmet_turu     TEXT NOT NULL,
  randevu_tarihi  TIMESTAMPTZ NOT NULL,
  teknisyen       TEXT,
  durum           appointment_status NOT NULL DEFAULT 'bekliyor',
  notlar          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_tarih      ON appointments(randevu_tarihi);
CREATE INDEX idx_appointments_durum      ON appointments(durum);
CREATE INDEX idx_appointments_teknisyen  ON appointments(teknisyen);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- MÜŞTERİ NOTLARI (customer_notes)
-- ============================================================
CREATE TABLE customer_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  icerik      TEXT NOT NULL,
  yazan       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customer_notes_customer_id ON customer_notes(customer_id);

-- ============================================================
-- RLS POLİTİKALARI
-- ============================================================
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices           ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory         ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE filter_plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes    ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS: authenticated kullanıcılar tam erişim
CREATE POLICY "customers_auth_all" ON customers
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- DEVICES: authenticated tam erişim
CREATE POLICY "devices_auth_all" ON devices
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- SERVICE RECORDS: authenticated tam erişim
CREATE POLICY "service_records_auth_all" ON service_records
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- INVENTORY: authenticated tam erişim
CREATE POLICY "inventory_auth_all" ON inventory
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- INVENTORY MOVEMENTS: authenticated tam erişim
CREATE POLICY "inventory_movements_auth_all" ON inventory_movements
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- FILTER PLANS: authenticated tam erişim
CREATE POLICY "filter_plans_auth_all" ON filter_plans
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- CUSTOMER NOTES: authenticated tam erişim
CREATE POLICY "customer_notes_auth_all" ON customer_notes
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- APPOINTMENTS: authenticated tam erişim + public sadece INSERT
CREATE POLICY "appointments_auth_all" ON appointments
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "appointments_public_insert" ON appointments
  FOR INSERT TO anon
  WITH CHECK (durum = 'bekliyor');

-- Public: dolu slotları görmek için SELECT (sadece tarih/saat alanları)
CREATE POLICY "appointments_public_select_slots" ON appointments
  FOR SELECT TO anon
  USING (randevu_tarihi > NOW());

-- ============================================================
-- ÖRNEK VERİLER (seed)
-- ============================================================
INSERT INTO inventory (urun_adi, kategori, adet, min_stok_esigi, birim_fiyat) VALUES
  ('5 Mikron Sediment Filtresi', 'Filtre', 50, 10, 45.00),
  ('GAC Aktif Karbon Filtresi', 'Filtre', 30, 8, 65.00),
  ('CTO Blok Karbon Filtresi', 'Filtre', 25, 8, 75.00),
  ('75 GPD Membran', 'Membran', 15, 5, 280.00),
  ('100 GPD Membran', 'Membran', 10, 5, 320.00),
  ('Post Karbon Filtresi', 'Filtre', 20, 5, 55.00),
  ('5 lt Basınç Tankı', 'Tank', 8, 3, 450.00),
  ('11 lt Basınç Tankı', 'Tank', 6, 3, 650.00),
  ('220V Pompa Motoru', 'Pompa', 4, 2, 850.00),
  ('O-Ring Seti', 'Aksesuar', 40, 15, 25.00),
  ('Filtre Başlığı', 'Aksesuar', 20, 5, 35.00),
  ('Boru Bağlantı Seti', 'Aksesuar', 15, 5, 120.00);
