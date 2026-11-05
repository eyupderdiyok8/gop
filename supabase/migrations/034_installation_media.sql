-- 034 - "Kurulumlarımızdan" bölümü: fotoğraf ve videolar admin panelinden yönetilir.
--   kind = 'image' : image_url yüklenen fotoğraf
--   kind = 'video' : video_url YouTube bağlantısı, image_url isteğe bağlı kapak
-- Görseller mevcut 'products' bucket'ında 'kurulumlar/' klasörüne yüklenir.
-- Tekrar çalıştırılabilir.

CREATE TABLE IF NOT EXISTS public.installation_media (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind           TEXT NOT NULL DEFAULT 'image' CHECK (kind IN ('image', 'video')),
  image_url      TEXT,
  video_url      TEXT,
  caption        TEXT,
  display_order  INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.installation_media ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'installation_media_public_select' AND tablename = 'installation_media') THEN
    CREATE POLICY "installation_media_public_select" ON public.installation_media FOR SELECT TO public USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'installation_media_admin_all' AND tablename = 'installation_media') THEN
    CREATE POLICY "installation_media_admin_all" ON public.installation_media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- Sitede bugün duran 3 kayıt başlangıç olarak eklenir (tablo boşsa)
INSERT INTO public.installation_media (kind, image_url, video_url, caption, display_order)
SELECT * FROM (VALUES
  ('image', '/testimonials/su-aritma-servisi-musteri-yorumlari1.jpeg', NULL, 'Tezgah altı su arıtma kurulumu', 1),
  ('video', '/testimonials/su-aritma-servisi-musteri-yorumlari2.jpeg', 'https://www.youtube.com/shorts/zjKagH_Oygg', 'Kurulum videosu', 2),
  ('image', '/testimonials/su-aritma-servisi-musteri-yorumlari3.jpeg', NULL, 'Mutfak dolabına su arıtma montajı', 3)
) AS v(kind, image_url, video_url, caption, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.installation_media);
