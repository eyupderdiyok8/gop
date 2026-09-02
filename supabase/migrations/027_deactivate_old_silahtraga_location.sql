-- 027 - Hatalı silahtraga kaydını sitemap ve aktif konumlardan çıkarır.
-- Eski URL, next.config.ts içindeki kalıcı yönlendirme ile doğru sayfaya gider.
UPDATE locations
SET aktif = false
WHERE slug = 'istanbul/eyup/silahtraga';
