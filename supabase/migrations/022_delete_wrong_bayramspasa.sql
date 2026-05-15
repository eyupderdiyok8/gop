-- 022_delete_wrong_bayramspasa.sql
-- Yanlış yazılan 'bayramspasa' lokasyonunu ve buna bağlı sayfaları siler.
-- Doğru olan 'bayrampasa' (p harfi ile) kayıtlarına dokunmaz.

DELETE FROM locations WHERE slug = 'istanbul/bayramspasa';

-- Eğer slug içinde bayramspasa geçen mahalleler de yanlışlıkla eklenmişse onları da temizleyelim
DELETE FROM locations WHERE slug LIKE 'istanbul/bayramspasa/%';

-- locations tablosundan silindiğinde, ON DELETE CASCADE sayesinde 'pages' tablosundaki 
-- ilgili kayıtlar da otomatik olarak silinecektir.
