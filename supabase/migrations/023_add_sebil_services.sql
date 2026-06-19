-- Yeni hizmetler: Sebil Ozonlama ve Sebil Temizliği
INSERT INTO services (slug, ad, aciklama, tip, rating_score, review_count) VALUES
('sebil-ozonlama', 'Sebil Ozonlama', 'Ozon gazı ile sebil sterilizasyonu. Gaziosmanpaşa ve İstanbul genelinde ofis ve ev sebilleri için profesyonel ozonlama hizmeti.', 'transactional', 4.9, 85),
('sebil-temizligi', 'Sebil Temizliği', 'Su sebillerinin periyodik bakım, yıkama ve sanitasyon hizmeti. Gıda uygunluklu dezenfektanlarla detaylı temizlik.', 'transactional', 4.8, 110)
ON CONFLICT (slug) DO NOTHING;
