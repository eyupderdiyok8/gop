-- ============================================================
-- 011 - pSEO ÖZEL GÖRSEL ALANI EKLEME
-- ============================================================

ALTER TABLE pages ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN pages.image_url IS 'SEO sayfası için özel yüklenen görsel URL''i. NULL ise otomatik üretilir.';
