-- 024 - Hizmet verilen ilce ve mahalle listesini genisletir.
-- URL segmentleri ASCII kalir; ekranda gorunen Turkce adlar PageRenderer'daki TR_MAP ile uretilir.

-- Yanlis ilcede bulunan mevcut kayitlari tasir. Kayit ID'leri korundugu icin
-- ileride pages tablosuna baglanacak ozel icerikler etkilenmez.
UPDATE locations
SET ilce = 'sultangazi',
    mahalle = 'sultanciftligi',
    slug = 'istanbul/sultangazi/sultanciftligi'
WHERE slug = 'istanbul/gaziosmanpasa/sultanciftligi';

UPDATE locations
SET ilce = 'esenler',
    mahalle = 'atisalani',
    slug = 'istanbul/esenler/atisalani'
WHERE slug = 'istanbul/gaziosmanpasa/atisalani';

UPDATE locations
SET ilce = 'eyup',
    mahalle = 'topcular',
    slug = 'istanbul/eyup/topcular'
WHERE slug = 'istanbul/gaziosmanpasa/topcular';

UPDATE locations
SET ilce = 'eyup',
    mahalle = 'yesilpinar',
    slug = 'istanbul/eyup/yesilpinar'
WHERE slug = 'istanbul/gaziosmanpasa/yesilpinar';

-- Mevcut kayitlari oldugu gibi birakir, eksik olanlari ekler.
INSERT INTO locations (il, ilce, mahalle, slug) VALUES
-- Sultangazi
('istanbul', 'sultangazi', '75-yil', 'istanbul/sultangazi/75-yil'),
('istanbul', 'sultangazi', 'cumhuriyet', 'istanbul/sultangazi/cumhuriyet'),
('istanbul', 'sultangazi', 'esentepe', 'istanbul/sultangazi/esentepe'),
('istanbul', 'sultangazi', 'eski-habipler', 'istanbul/sultangazi/eski-habipler'),
('istanbul', 'sultangazi', 'ismetpasa', 'istanbul/sultangazi/ismetpasa'),
('istanbul', 'sultangazi', 'malkocoglu', 'istanbul/sultangazi/malkocoglu'),
('istanbul', 'sultangazi', 'yayla', 'istanbul/sultangazi/yayla'),
('istanbul', 'sultangazi', 'yunus-emre', 'istanbul/sultangazi/yunus-emre'),
('istanbul', 'sultangazi', 'zubeyde-hanim', 'istanbul/sultangazi/zubeyde-hanim'),
-- Gaziosmanpasa
('istanbul', 'gaziosmanpasa', 'barbaros-hayrettinpasa', 'istanbul/gaziosmanpasa/barbaros-hayrettinpasa'),
('istanbul', 'gaziosmanpasa', 'hurriyet', 'istanbul/gaziosmanpasa/hurriyet'),
('istanbul', 'gaziosmanpasa', 'kazim-karabekir', 'istanbul/gaziosmanpasa/kazim-karabekir'),
('istanbul', 'gaziosmanpasa', 'semsipasa', 'istanbul/gaziosmanpasa/semsipasa'),
('istanbul', 'gaziosmanpasa', 'yeni-mahalle', 'istanbul/gaziosmanpasa/yeni-mahalle'),
('istanbul', 'gaziosmanpasa', 'yildiztabya', 'istanbul/gaziosmanpasa/yildiztabya'),
-- Eyupsultan (URL uyumlulugu icin mevcut 'eyup' ilce slug'i kullanilir.)
('istanbul', 'eyup', 'agacli', 'istanbul/eyup/agacli'),
('istanbul', 'eyup', 'akpinar', 'istanbul/eyup/akpinar'),
('istanbul', 'eyup', 'aksemsettin', 'istanbul/eyup/aksemsettin'),
('istanbul', 'eyup', 'circir', 'istanbul/eyup/circir'),
('istanbul', 'eyup', 'ciftalan', 'istanbul/eyup/ciftalan'),
('istanbul', 'eyup', 'defterdar', 'istanbul/eyup/defterdar'),
('istanbul', 'eyup', 'dugmeciler', 'istanbul/eyup/dugmeciler'),
('istanbul', 'eyup', 'emniyettepe', 'istanbul/eyup/emniyettepe'),
('istanbul', 'eyup', 'esentepe', 'istanbul/eyup/esentepe'),
('istanbul', 'eyup', 'eyupsultan-merkez', 'istanbul/eyup/eyupsultan-merkez'),
('istanbul', 'eyup', 'gokturk', 'istanbul/eyup/gokturk'),
('istanbul', 'eyup', 'guzeltepe', 'istanbul/eyup/guzeltepe'),
('istanbul', 'eyup', 'isiklar', 'istanbul/eyup/isiklar'),
('istanbul', 'eyup', 'ihsaniye', 'istanbul/eyup/ihsaniye'),
('istanbul', 'eyup', 'islambey', 'istanbul/eyup/islambey'),
('istanbul', 'eyup', 'karadolap', 'istanbul/eyup/karadolap'),
('istanbul', 'eyup', 'mimarsinan', 'istanbul/eyup/mimarsinan'),
('istanbul', 'eyup', 'mithatpasa', 'istanbul/eyup/mithatpasa'),
('istanbul', 'eyup', 'nisanca', 'istanbul/eyup/nisanca'),
('istanbul', 'eyup', 'odayeri', 'istanbul/eyup/odayeri'),
('istanbul', 'eyup', 'pirincci', 'istanbul/eyup/pirincci'),
('istanbul', 'eyup', 'rami-cuma', 'istanbul/eyup/rami-cuma'),
('istanbul', 'eyup', 'rami-yeni', 'istanbul/eyup/rami-yeni'),
('istanbul', 'eyup', 'sakarya', 'istanbul/eyup/sakarya'),
('istanbul', 'eyup', 'silahtraga', 'istanbul/eyup/silahtraga'),
('istanbul', 'eyup', '5-levent', 'istanbul/eyup/5-levent'),
-- Bayrampasa
('istanbul', 'bayrampasa', 'altintepsi', 'istanbul/bayrampasa/altintepsi'),
('istanbul', 'bayrampasa', 'cevatpasa', 'istanbul/bayrampasa/cevatpasa'),
('istanbul', 'bayrampasa', 'kocatepe', 'istanbul/bayrampasa/kocatepe'),
('istanbul', 'bayrampasa', 'orta', 'istanbul/bayrampasa/orta'),
('istanbul', 'bayrampasa', 'terazidere', 'istanbul/bayrampasa/terazidere'),
('istanbul', 'bayrampasa', 'vatan', 'istanbul/bayrampasa/vatan'),
('istanbul', 'bayrampasa', 'yenidogan', 'istanbul/bayrampasa/yenidogan'),
-- Esenler
('istanbul', 'esenler', '15-temmuz', 'istanbul/esenler/15-temmuz'),
('istanbul', 'esenler', 'birlik', 'istanbul/esenler/birlik'),
('istanbul', 'esenler', 'cifte-havuzlar', 'istanbul/esenler/cifte-havuzlar'),
('istanbul', 'esenler', 'davutpasa', 'istanbul/esenler/davutpasa'),
('istanbul', 'esenler', 'fatih', 'istanbul/esenler/fatih'),
('istanbul', 'esenler', 'fevzicakmak', 'istanbul/esenler/fevzicakmak'),
('istanbul', 'esenler', 'kazim-karabekir', 'istanbul/esenler/kazim-karabekir'),
('istanbul', 'esenler', 'kemer', 'istanbul/esenler/kemer'),
('istanbul', 'esenler', 'menderes', 'istanbul/esenler/menderes'),
('istanbul', 'esenler', 'mimar-sinan', 'istanbul/esenler/mimar-sinan'),
('istanbul', 'esenler', 'namik-kemal', 'istanbul/esenler/namik-kemal'),
('istanbul', 'esenler', 'nine-hatun', 'istanbul/esenler/nine-hatun'),
('istanbul', 'esenler', 'orucreis', 'istanbul/esenler/orucreis'),
('istanbul', 'esenler', 'tuna', 'istanbul/esenler/tuna'),
('istanbul', 'esenler', 'turgut-reis', 'istanbul/esenler/turgut-reis'),
('istanbul', 'esenler', 'yavuz-selim', 'istanbul/esenler/yavuz-selim'),
('istanbul', 'esenler', 'sehitler', 'istanbul/esenler/sehitler'),
('istanbul', 'esenler', 'yesil-vadi', 'istanbul/esenler/yesil-vadi')
ON CONFLICT (slug) DO NOTHING;
