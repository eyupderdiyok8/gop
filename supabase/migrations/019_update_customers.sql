-- 019_update_customers.sql
-- Müşteri tablosuna yeni alanlar ekleniyor

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS telefon2 TEXT,
ADD COLUMN IF NOT EXISTS islem_1 TEXT,
ADD COLUMN IF NOT EXISTS islem_2 TEXT,
ADD COLUMN IF NOT EXISTS islem_3 TEXT,
ADD COLUMN IF NOT EXISTS odeme_yontemi TEXT,
ADD COLUMN IF NOT EXISTS islem_tarihi DATE,
ADD COLUMN IF NOT EXISTS sonraki_islem_gun INTEGER,
ADD COLUMN IF NOT EXISTS islem_tutari NUMERIC;
