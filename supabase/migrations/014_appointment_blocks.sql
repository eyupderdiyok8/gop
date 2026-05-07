-- ==============================================================================
-- Migration: 014_appointment_blocks.sql
-- Description: Randevu randevu_blocks tablosu
-- ==============================================================================

-- 1. Tabloyu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS appointment_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocked_date DATE NOT NULL,
  blocked_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. İndeksler
CREATE INDEX IF NOT EXISTS idx_appointment_blocks_date ON appointment_blocks(blocked_date);

-- 3. Yetkilendirme (RLS)
ALTER TABLE appointment_blocks ENABLE ROW LEVEL SECURITY;

-- Politikalar
-- Tüm kullanıcılar (zamanı kontrol etmek isteyen ziyaretçiler) bloklu saatleri/günleri okuyabilir
CREATE POLICY "Randevu blokları herkese görünür" 
  ON appointment_blocks 
  FOR SELECT 
  USING (true);

-- Sadece authentike olan adminler/yetkililer bloklama ekleyebilir/silebilir
CREATE POLICY "Yöneticiler randevu bloklarını ekleyebilir" 
  ON appointment_blocks 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Yöneticiler randevu bloklarını silebilir" 
  ON appointment_blocks 
  FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Yöneticiler randevu bloklarını güncelleyebilir" 
  ON appointment_blocks 
  FOR UPDATE 
  TO authenticated 
  USING (true);
