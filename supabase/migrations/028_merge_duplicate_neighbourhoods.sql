-- 028 - Aynı mahalleyi temsil eden tekrar kayıtları birleştirir.
-- Resmi adı taşıyan kayıt (024) tutulur; eski kaydın (007) konum, TDS ve nüfus verisi ona aktarılır.
-- Eski kayıt pasife alınır; eski URL'ler next.config.ts içindeki kalıcı yönlendirme ile yeni sayfaya gider.
--   istanbul/gaziosmanpasa/barbaros -> istanbul/gaziosmanpasa/barbaros-hayrettinpasa
--   istanbul/eyup/eyup              -> istanbul/eyup/eyupsultan-merkez
--   istanbul/eyup/rami              -> istanbul/eyup/rami-cuma (resmi "Rami" mahallesi yok; Rami Cuma ve Rami Yeni var)

UPDATE locations AS keep
SET lat = old.lat,
    lng = old.lng,
    tds_degeri = old.tds_degeri,
    nufus = old.nufus
FROM locations AS old
WHERE (keep.slug, old.slug) IN (
  ('istanbul/gaziosmanpasa/barbaros-hayrettinpasa', 'istanbul/gaziosmanpasa/barbaros'),
  ('istanbul/eyup/eyupsultan-merkez', 'istanbul/eyup/eyup'),
  ('istanbul/eyup/rami-cuma', 'istanbul/eyup/rami')
);

UPDATE locations
SET aktif = false
WHERE slug IN (
  'istanbul/gaziosmanpasa/barbaros',
  'istanbul/eyup/eyup',
  'istanbul/eyup/rami'
);
