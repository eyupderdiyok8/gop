-- ============================================================
-- 018 - AYARLAR & TEKNİSYEN TABLOLARI
-- ============================================================

-- 1. AYARLAR (site_settings)
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       NUMERIC NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Herkes okuyabilir, sadece adminler (giriş yapanlar) yazabilir
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'site_settings_auth_all' AND tablename = 'site_settings') THEN
    CREATE POLICY "site_settings_auth_all" ON site_settings FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'site_settings_public_select' AND tablename = 'site_settings') THEN
    CREATE POLICY "site_settings_public_select" ON site_settings FOR SELECT TO public USING (true);
  END IF;
END $$;

-- Varsayılan Ayarları Ekle
INSERT INTO site_settings (key, value) VALUES
('carboy_price', 180),
('maintenance_price', 1500)
ON CONFLICT (key) DO NOTHING;

-- 2. TEKNİSYENLER (technicians)
CREATE TABLE IF NOT EXISTS technicians (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_soyad    TEXT NOT NULL,
  aktif       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
