-- 025 - Eyupsultan Kemerburgaz Mahallesi hizmet konumu
INSERT INTO locations (il, ilce, mahalle, slug)
VALUES ('istanbul', 'eyup', 'kemerburgaz', 'istanbul/eyup/kemerburgaz')
ON CONFLICT (slug) DO NOTHING;
