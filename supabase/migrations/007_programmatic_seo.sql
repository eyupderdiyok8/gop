-- ============================================================
-- 007 - PROGRAMMATIC SEO & LOKASYON YÖNETİMİ (GAZİOSMANPAŞA)
-- ============================================================

-- 1. LOKASYONLAR (locations)
CREATE TABLE locations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  il          TEXT NOT NULL,
  ilce        TEXT NOT NULL,
  mahalle     TEXT,
  slug        TEXT NOT NULL UNIQUE,
  lat         NUMERIC(10, 6),
  lng         NUMERIC(10, 6),
  tds_degeri  INTEGER DEFAULT 200,
  nufus       INTEGER DEFAULT 0,
  rating_score NUMERIC(3,1) DEFAULT 4.9, -- Schema Rating için
  review_count INTEGER DEFAULT 120,      -- Schema Yorum Sayısı için
  aktif       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_ilce ON locations(il, ilce);

-- 2. HİZMETLER (services)
CREATE TYPE service_type AS ENUM ('transactional', 'commercial', 'informational');

CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  ad          TEXT NOT NULL,
  aciklama    TEXT,
  tip         service_type NOT NULL DEFAULT 'commercial',
  rating_score NUMERIC(3,1) DEFAULT 4.8, 
  review_count INTEGER DEFAULT 85,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ÖZELLEŞTİRİLMİŞ SAYFALAR (pages)
CREATE TABLE pages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id      UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  service_id       UUID REFERENCES services(id) ON DELETE CASCADE, -- NULL ise sadece lokasyon sayfası
  title            TEXT,
  meta_description TEXT,
  h1               TEXT,
  ozel_icerik      TEXT,
  yayinda          BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pages_loc_srv ON pages(location_id, service_id);

-- Updated at Trigger
CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loc_public" ON locations FOR SELECT TO anon USING (aktif = true);
CREATE POLICY "srv_public" ON services FOR SELECT TO anon USING (true);
CREATE POLICY "pages_public" ON pages FOR SELECT TO anon USING (yayinda = true);

CREATE POLICY "loc_auth" ON locations FOR ALL TO authenticated USING (true);
CREATE POLICY "srv_auth" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "pages_auth" ON pages FOR ALL TO authenticated USING (true);

-- ============================================================
-- SEED DATA (TOHUM VERİLERİ) - GAZİOSMANPAŞA
-- ============================================================

-- Hizmetler
INSERT INTO services (slug, ad, aciklama, tip, rating_score, review_count) VALUES
('su-aritma-servisi', 'Su Arıtma Servisi', 'Gaziosmanpaşa ve çevre ilçelerde 7/24 profesyonel su arıtma servisi. Aynı gün hizmet garantisi.', 'transactional', 4.9, 145),
('su-aritma-cihazi', 'Su Arıtma Cihazı Satışı', 'Gaziosmanpaşa bölgesi yüksek TDS değerlerine karşı NSF onaylı, mineral takviyeli su arıtma cihazları.', 'commercial', 4.8, 210),
('filtre-degisimi', 'Filtre Değişimi', 'İstanbul genelinde periyodik filtre değişimi ve sanitasyon bakımı. Yetkili teknik servis.', 'transactional', 4.9, 320),
('su-aritma-montaj', 'Su Arıtma Montajı', 'Gaziosmanpaşa ve çevre ilçelere aynı gün cihaz montajı hizmeti.', 'transactional', 4.8, 95),
('reverse-osmosis', 'Reverse Osmosis Sistemleri', 'Ters ozmoz teknolojisi ile %99.9 saflıkta içme suyu. İstanbul''un yüksek kireçli suyuna özel çözümler.', 'informational', 4.7, 50),
('su-aritma-fiyati', 'Su Arıtma Cihazı Fiyatları', 'Gaziosmanpaşa bölgesi bütçenize uygun, garantili su arıtma cihazı fiyatları ve kampanyalar.', 'commercial', 4.6, 120),
('su-yumusatma', 'Su Yumuşatma Sistemleri', 'İstanbul''un sert suyuna karşı bina ve daire tipi su yumuşatma sistemleri.', 'commercial', 4.8, 75);

-- 1. İL VE İLÇE DÜZEYİ LOKASYONLAR
INSERT INTO locations (il, ilce, mahalle, slug, lat, lng, tds_degeri, nufus, rating_score, review_count) VALUES
-- Ana İl
('istanbul', '', NULL, 'istanbul', 41.0082, 28.9784, 300, 16000000, 4.8, 1500),

-- Ana hizmet ilçesi
('istanbul', 'gaziosmanpasa', NULL, 'istanbul/gaziosmanpasa', 41.0675, 28.9122, 320, 490000, 4.9, 210),
-- Kuzeydeki çevre ilçeler
('istanbul', 'sultangazi',   NULL, 'istanbul/sultangazi',   41.1067, 28.8714, 305, 510000, 4.8, 175),
('istanbul', 'eyup',   NULL, 'istanbul/eyup',   41.0478, 28.9264, 295, 410000, 4.8, 162),
('istanbul', 'basaksehir',   NULL, 'istanbul/basaksehir',   41.0923, 28.8012, 285, 475000, 4.8, 140),
-- Güneydeki komşu ilçeler
('istanbul', 'bagcilar',     NULL, 'istanbul/bagcilar',     41.0361, 28.8558, 315, 745000, 4.7, 195),
('istanbul', 'bayrampasa',  NULL, 'istanbul/bayrampasa',  41.0528, 28.9236, 330, 265000, 4.8, 158),
('istanbul', 'esenler',      NULL, 'istanbul/esenler',      41.0397, 28.8797, 318, 470000, 4.7, 148),
('istanbul', 'gungoren',     NULL, 'istanbul/gungoren',     41.0219, 28.8806, 310, 295000, 4.8, 132)
ON CONFLICT (slug) DO NOTHING;

-- 2. GAZİOSMANPAŞA MAHALLELERİ
INSERT INTO locations (il, ilce, mahalle, slug, lat, lng, tds_degeri, nufus, rating_score, review_count) VALUES
('istanbul', 'gaziosmanpasa', 'barbaros',        'istanbul/gaziosmanpasa/barbaros',        41.0621, 28.9080, 315, 28000, 4.9, 95),
('istanbul', 'gaziosmanpasa', 'baglarbaşı',      'istanbul/gaziosmanpasa/baglarbaşı',      41.0598, 28.9145, 322, 22000, 4.8, 88),
('istanbul', 'gaziosmanpasa', 'karadeniz',       'istanbul/gaziosmanpasa/karadeniz',       41.0712, 28.9056, 308, 18500, 4.9, 102),
('istanbul', 'gaziosmanpasa', 'karayollari',     'istanbul/gaziosmanpasa/karayollari',     41.0689, 28.9198, 325, 15000, 4.8, 76),
('istanbul', 'gaziosmanpasa', 'merkez',          'istanbul/gaziosmanpasa/merkez',          41.0675, 28.9122, 320, 12000, 4.9, 115),
('istanbul', 'gaziosmanpasa', 'mevlana',         'istanbul/gaziosmanpasa/mevlana',         41.0650, 28.9160, 318, 24500, 4.8, 92),
('istanbul', 'gaziosmanpasa', 'sarigol',         'istanbul/gaziosmanpasa/sarigol',         41.0588, 28.9095, 330, 31000, 4.9, 128),
('istanbul', 'gaziosmanpasa', 'seyrantepe',      'istanbul/gaziosmanpasa/seyrantepe',      41.0755, 28.9034, 298, 20000, 4.8, 84),
('istanbul', 'gaziosmanpasa', 'sultanciftligi',  'istanbul/gaziosmanpasa/sultanciftligi',  41.0810, 28.9085, 292, 35000, 4.8, 110),
('istanbul', 'gaziosmanpasa', 'topcular',        'istanbul/gaziosmanpasa/topcular',        41.0640, 28.9225, 335, 19000, 4.9, 97),
('istanbul', 'gaziosmanpasa', 'turkoba',         'istanbul/gaziosmanpasa/turkoba',         41.0730, 28.9165, 310, 16500, 4.8, 78),
('istanbul', 'gaziosmanpasa', 'yesilpinar',      'istanbul/gaziosmanpasa/yesilpinar',      41.0558, 28.9050, 328, 27000, 4.9, 135),
('istanbul', 'gaziosmanpasa', 'karlitepe',       'istanbul/gaziosmanpasa/karlitepe',       41.0698, 28.9248, 316, 21000, 4.8, 89),
('istanbul', 'gaziosmanpasa', 'kucukkoy',        'istanbul/gaziosmanpasa/kucukkoy',        41.0615, 28.9178, 322, 14500, 4.8, 72),
('istanbul', 'gaziosmanpasa', 'fevzicakmak',     'istanbul/gaziosmanpasa/fevzicakmak',     41.0580, 28.9210, 319, 18000, 4.9, 108),
('istanbul', 'gaziosmanpasa', 'ufuk',            'istanbul/gaziosmanpasa/ufuk',            41.0665, 28.9270, 311, 11000, 4.8, 65),
('istanbul', 'gaziosmanpasa', 'yenidogan',       'istanbul/gaziosmanpasa/yenidogan',       41.0635, 28.9305, 324, 16000, 4.8, 80),
('istanbul', 'gaziosmanpasa', 'pazarici',        'istanbul/gaziosmanpasa/pazarici',        41.0720, 28.9290, 306, 12500, 4.9, 73),
('istanbul', 'gaziosmanpasa', 'atisalani',       'istanbul/gaziosmanpasa/atisalani',       41.0740, 28.9220, 299, 9500,  4.8, 61),
('istanbul', 'gaziosmanpasa', 'karaagac',        'istanbul/gaziosmanpasa/karaagac',        41.0605, 28.9135, 317, 13000, 4.9, 87)
ON CONFLICT (slug) DO NOTHING;

-- 3. ÇEVRE İLÇE MAHALLELERİ
-- Sultangazi Mahalleleri
INSERT INTO locations (il, ilce, mahalle, slug, lat, lng, tds_degeri, nufus, rating_score, review_count) VALUES
('istanbul', 'sultangazi', 'cebeci',         'istanbul/sultangazi/cebeci',         41.1120, 28.8550, 300, 38000, 4.8, 92),
('istanbul', 'sultangazi', 'ugurmumcu',      'istanbul/sultangazi/ugurmumcu',      41.1080, 28.8620, 310, 42000, 4.8, 105),
('istanbul', 'sultangazi', 'habibler',       'istanbul/sultangazi/habibler',       41.1050, 28.8450, 295, 55000, 4.7, 115),
('istanbul', 'sultangazi', 'ikitelli',       'istanbul/sultangazi/ikitelli',       41.0900, 28.8130, 285, 48000, 4.8, 98),
('istanbul', 'sultangazi', '50-yil',         'istanbul/sultangazi/50-yil',         41.1030, 28.8710, 308, 35000, 4.8, 88),
('istanbul', 'sultangazi', 'gazi',           'istanbul/sultangazi/gazi',           41.1100, 28.8680, 312, 29000, 4.9, 110)
ON CONFLICT (slug) DO NOTHING;

-- Eyüp Mahalleleri
INSERT INTO locations (il, ilce, mahalle, slug, lat, lng, tds_degeri, nufus, rating_score, review_count) VALUES
('istanbul', 'eyup', 'alibeyköy',      'istanbul/eyup/alibeykoy',      41.0650, 28.9350, 318, 45000, 4.8, 122),
('istanbul', 'eyup', 'rami',           'istanbul/eyup/rami',           41.0550, 28.9220, 325, 32000, 4.9, 135),
('istanbul', 'eyup', 'gungorensanayi', 'istanbul/eyup/gungorensanayi', 41.0580, 28.9400, 310, 15000, 4.7, 68),
('istanbul', 'eyup', 'eyup',           'istanbul/eyup/eyup',           41.0478, 28.9340, 295, 28000, 4.9, 145)
ON CONFLICT (slug) DO NOTHING;

-- Bağcılar Mahalleleri
INSERT INTO locations (il, ilce, mahalle, slug, lat, lng, tds_degeri, nufus, rating_score, review_count) VALUES
('istanbul', 'bagcilar', 'baris',            'istanbul/bagcilar/baris',            41.0330, 28.8600, 320, 52000, 4.8, 118),
('istanbul', 'bagcilar', 'yenimahalle',      'istanbul/bagcilar/yenimahalle',      41.0370, 28.8480, 315, 48000, 4.8, 105),
('istanbul', 'bagcilar', 'baglar',           'istanbul/bagcilar/baglar',           41.0400, 28.8650, 318, 58000, 4.7, 128),
('istanbul', 'bagcilar', 'goztepe',          'istanbul/bagcilar/goztepe',          41.0290, 28.8560, 322, 43000, 4.8, 97)
ON CONFLICT (slug) DO NOTHING;

-- Bayrampaşa Mahalleleri
INSERT INTO locations (il, ilce, mahalle, slug, lat, lng, tds_degeri, nufus, rating_score, review_count) VALUES
('istanbul', 'bayrampasa', 'yildirim',      'istanbul/bayrampasa/yildirim',      41.0512, 28.9210, 335, 38000, 4.9, 142),
('istanbul', 'bayrampasa', 'kartaltepe',    'istanbul/bayrampasa/kartaltepe',    41.0545, 28.9170, 330, 29000, 4.8, 118),
('istanbul', 'bayrampasa', 'muratpasa',     'istanbul/bayrampasa/muratpasa',     41.0490, 28.9290, 328, 24000, 4.8, 95),
('istanbul', 'bayrampasa', 'ismetpasa',     'istanbul/bayrampasa/ismetpasa',     41.0530, 28.9140, 332, 20000, 4.9, 108)
ON CONFLICT (slug) DO NOTHING;
