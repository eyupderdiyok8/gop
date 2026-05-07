-- ============================================================
-- Add address field to appointments
-- ============================================================

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS musteri_adres TEXT;
