-- ============================================================
-- 003_technicians.sql - Teknisyen Yönetimi
-- ============================================================

CREATE TABLE technicians (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_soyad    TEXT NOT NULL,
  aktif       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "technicians_auth_all" ON technicians
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Seed defaults
INSERT INTO technicians (ad_soyad) VALUES 
('Mehmet K.'), 
('Ali R.'), 
('Ayşe T.'), 
('Fatih D.');
