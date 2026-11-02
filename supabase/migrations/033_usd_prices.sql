-- 033 - Dolar bazlı fiyat: ürüne USD fiyat girilir, TL fiyat aylık kurla hesaplanır.
--   price_usd / old_price_usd doluysa price / old_price kurla yeniden yazılır.
--   Boş bırakılan ürünler elle girilen TL fiyatla kalır.
-- Tekrar çalıştırılabilir.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_usd NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS old_price_usd NUMERIC;

-- Kullanılan kur (virgülden sonra tek hane). updated_at son güncelleme tarihidir.
INSERT INTO public.site_settings (key, value) VALUES ('usd_try_rate', 0)
ON CONFLICT (key) DO NOTHING;
