-- 026 - Silahtaraga mahalle slug'indaki eksik "a" harfini duzeltir.
UPDATE locations
SET mahalle = 'silahtaraga',
    slug = 'istanbul/eyup/silahtaraga'
WHERE slug = 'istanbul/eyup/silahtraga';
