-- 031 - Ürünlere özel tanıtım sayfası adresi (ör. /headon-su-aritma-cihazi).
-- Doluysa menü ve ürün kartları bu adrese gider; /urunler/<slug> de buraya yönlendirir.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS page_url TEXT;
