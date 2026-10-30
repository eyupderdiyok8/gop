-- 032 - Ürünler menüsünü panelden yönetmek için başlangıç yapısı (030 ve 031'den sonra çalıştırın).
--   Evsel Su Arıtma Sistemleri : 3.2 Prada, Headon (+ mevcut ev tipi ürünler)
--   Direkt Akış Su Arıtma      : Pantech, Quantum Plus
--   Sebiller                   : Tezgah Üstü Sebiller, Arıtmalı Su Sebilleri
--   Filtre & Aksesuarlar       : mevcut filtre ürünleri
-- Tekrar çalıştırılabilir; sonrasında her şey admin panelinden düzenlenebilir.

-- 1) Kategoriler
UPDATE public.product_categories SET name = 'Evsel Su Arıtma Sistemleri', display_order = 1 WHERE slug = 'ev-tipi';

INSERT INTO public.product_categories (name, slug, display_order) VALUES
  ('Direkt Akış Su Arıtma Sistemleri', 'direkt-akis-su-aritma-sistemleri', 2),
  ('Sebiller', 'sebiller', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_categories (name, slug, display_order, parent_id)
SELECT v.name, v.slug, v.ord, (SELECT id FROM public.product_categories WHERE slug = 'sebiller')
FROM (VALUES ('Tezgah Üstü Sebiller', 'tezgah-ustu-sebiller', 1), ('Arıtmalı Su Sebilleri', 'aritmali-su-sebilleri', 2)) AS v(name, slug, ord)
ON CONFLICT (slug) DO NOTHING;

UPDATE public.product_categories SET display_order = 4 WHERE slug = 'aksesuarlar';
UPDATE public.product_categories SET display_order = 5 WHERE slug = 'ofis-tipi';
UPDATE public.product_categories SET display_order = 6 WHERE slug = 'endustriyel';

-- 2) Sebilleri alt kategorilere taşı
UPDATE public.products SET category_id = (SELECT id FROM public.product_categories WHERE slug = 'tezgah-ustu-sebiller')
WHERE slug IN ('od-3tt02-masaustu-su-aritma-sebili', 'ks-06-masaustu-su-aritma-sebili');

UPDATE public.products SET category_id = (SELECT id FROM public.product_categories WHERE slug = 'aritmali-su-sebilleri')
WHERE slug IN ('ks07-aritmali-su-sebili', 'od-3fs01-aritmali-su-sebili-gaziosmanpasa');

-- 3) Tanıtım sayfası olan ürünler
-- Headon: mevcut 2.2 Evsel ürünü, kendi sayfasına yönlenir
UPDATE public.products
SET name = 'Headon Su Arıtma Cihazı', page_url = '/headon-su-aritma-cihazi'
WHERE slug = '22-evsel-su-aritma-cihazi';

INSERT INTO public.products (category_id, slug, name, tagline, main_image, page_url, is_active)
VALUES
  ((SELECT id FROM public.product_categories WHERE slug = 'ev-tipi'),
   '3-2-prada-su-aritma-cihazi', '3.2 Prada Su Arıtma Cihazı', 'Şeffaf kasa · 5 aşamalı filtreleme',
   '/images/urunler/prada-3-2.webp', '/3-2-prada-su-aritma-cihazi', true),
  ((SELECT id FROM public.product_categories WHERE slug = 'direkt-akis-su-aritma-sistemleri'),
   'pantech-su-aritma-cihazi', 'Pantech Su Arıtma Cihazı', 'Tanksız · 600 GPD · LED ekran',
   '/images/urunler/pantech.webp', '/pantech-su-aritma-cihazi', true),
  ((SELECT id FROM public.product_categories WHERE slug = 'direkt-akis-su-aritma-sistemleri'),
   'quantum-plus-su-aritma-cihazi', 'Quantum Plus Su Arıtma Cihazı', 'Dijital ekran · 6 aşama · Alkali + B12',
   '/images/urunler/quantum-plus.webp', '/quantum-plus-su-aritma-cihazi', true)
ON CONFLICT (slug) DO UPDATE SET page_url = EXCLUDED.page_url, category_id = EXCLUDED.category_id;
