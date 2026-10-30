-- 030 - Ürün kategorilerine alt kategori desteği (ör. Filtreler > Membran Filtreler).
-- parent_id boş olan kategoriler ana kategoridir. Ana kategori silinirse alt kategoriler ana kategoriye dönüşür.

ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS product_categories_parent_id_idx ON public.product_categories(parent_id);
