-- ============================================================
-- 8. FİNANS VE KASA YÖNETİMİ (finance schema)
-- ============================================================

CREATE TYPE transaction_type AS ENUM ('gelir', 'gider');
CREATE TYPE transaction_status AS ENUM ('odendi', 'bekliyor', 'iptal');

CREATE TABLE transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tur               transaction_type NOT NULL,
  kategori          TEXT NOT NULL,
  tutar             NUMERIC(10,2) NOT NULL DEFAULT 0,
  tarih             DATE NOT NULL DEFAULT CURRENT_DATE,
  aciklama          TEXT,
  durum             transaction_status NOT NULL DEFAULT 'odendi',
  customer_id       UUID REFERENCES customers(id) ON DELETE SET NULL,
  service_record_id UUID REFERENCES service_records(id) ON DELETE SET NULL,
  yapan_kullanici   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast reporting and tracking
CREATE INDEX idx_transactions_tur        ON transactions(tur);
CREATE INDEX idx_transactions_tarih      ON transactions(tarih);
CREATE INDEX idx_transactions_durum      ON transactions(durum);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);

-- Updated_at trigger
CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_auth_all" ON transactions
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Seed Data (Örnek Finans Verileri)
INSERT INTO transactions (tur, kategori, tutar, tarih, aciklama, durum, yapan_kullanici) VALUES
  ('gelir', 'Cihaz Satışı', 12500.00, CURRENT_DATE - INTERVAL '1 day', 'LG 12 Aşama Cihaz Satışı', 'odendi', 'Admin'),
  ('gelir', 'Filtre Değişimi', 1200.00, CURRENT_DATE - INTERVAL '2 days', 'Yıllık Periyodik Bakım', 'odendi', 'Admin'),
  ('gider', 'Yedek Parça Alımı', 3500.00, CURRENT_DATE - INTERVAL '5 days', 'Toptancıdan 20 adet membran alımı', 'odendi', 'Admin'),
  ('gider', 'Yakıt Masrafı', 850.00, CURRENT_DATE, 'Servis aracı yakıt alımı', 'odendi', 'Usta Ali'),
  ('gelir', 'Bakım Anlaşması', 600.00, CURRENT_DATE, 'Açık Hesap (Haftaya verecek)', 'bekliyor', 'Usta Ali');
