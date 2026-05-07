-- ============================================================
-- 13. ÜRÜN YÖNETİMİ VE KATALOG SİSTEMİ
-- ============================================================

-- Ürün Kategorileri
CREATE TABLE public.product_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ürünler
CREATE TABLE public.products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  tagline     TEXT,
  price       NUMERIC(10,2),
  old_price   NUMERIC(10,2),
  description TEXT, -- Markdown içerik
  badge       TEXT,
  badge_color TEXT DEFAULT 'bg-brand-teal text-white',
  main_image  TEXT,
  gallery     JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs       JSONB NOT NULL DEFAULT '[]'::jsonb, -- ['Aşama Sayısı: 7', 'Kapasite: 12L']
  features    JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{title: 'Hızlı', icon: 'zap', desc: '...'}]
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  is_highlight BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title  TEXT,
  meta_description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_slug        ON public.products(slug);
CREATE INDEX idx_products_is_highlight ON public.products(is_highlight);

-- Trigger for updated_at
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;

-- Politikalar: Herkes görebilir, Sadece admin değiştirebilir
CREATE POLICY "category_public_select" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "category_admin_all" ON public.product_categories FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "product_public_select" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "product_admin_all" ON public.products FOR ALL TO authenticated USING (public.is_admin());

-- Örnek Kategoriler (Seed)
INSERT INTO public.product_categories (name, slug, display_order) VALUES
  ('Ev Tipi Su Arıtma', 'ev-tipi', 1),
  ('Ofis & İşyeri Tipi', 'ofis-tipi', 2),
  ('Endüstriyel Sistemler', 'endustriyel', 3),
  ('Filtre & Aksesuarlar', 'aksesuarlar', 4);

-- Storage Bucket: products
-- Not: Bucket oluşturma işlemi genellikle UI veya SQL üzerinden Policy ile yapılır. 
-- Biz burada Policy'leri hazırlıyoruz, bucket elle veya API ile açılmalı.
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin All Access" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'products' AND public.is_admin());
