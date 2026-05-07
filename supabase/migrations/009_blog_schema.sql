-- ============================================================
-- 9. BLOG YÖNETİMİ (blog schema)
-- ============================================================

-- Blog yazıları tablosu
CREATE TABLE blogs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  content           TEXT NOT NULL, -- Zengin HTML içerik
  excerpt           TEXT, -- Kısa özet
  category          TEXT NOT NULL DEFAULT 'Genel',
  featured_image    TEXT, -- Kapak fotoğrafı URL
  seo_title         TEXT,
  seo_description   TEXT,
  is_published      BOOLEAN NOT NULL DEFAULT FALSE,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_is_published ON blogs(is_published);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);

-- Updated_at tetikleyicisi
CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Ayarları
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Admin her şeyi yapabilir
CREATE POLICY "blogs_admin_all" ON blogs
  FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Ziyaretçiler sadece yayınlanmış blogları görebilir
CREATE POLICY "blogs_public_select" ON blogs
  FOR SELECT TO anon USING (is_published = TRUE);

-- ============================================================
-- STORAGE KURULUMU (blog_images)
-- Not: Supabase Storage API üzerinden bucket oluşturulması önerilir.
-- SQL ile bucket oluşturmak için:
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog_images', 'blog_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Politikaları
CREATE POLICY "blog_images_public_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'blog_images');

CREATE POLICY "blog_images_admin_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog_images');

CREATE POLICY "blog_images_admin_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'blog_images');

CREATE POLICY "blog_images_admin_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'blog_images');
