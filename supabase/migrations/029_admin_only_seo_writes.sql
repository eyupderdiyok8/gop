-- 029 - Programatik SEO tablolarına (locations, services, pages) yazma yetkisini yalnızca admine verir.
-- 007'deki "FOR ALL TO authenticated USING (true)" politikaları giriş yapmış her kullanıcının
-- (müşteri hesapları dahil) bu tabloları değiştirmesine izin veriyordu.
-- Herkese açık okuma (anon) politikaları değişmez; admin kontrolü 012'deki public.is_admin() ile yapılır.

DROP POLICY IF EXISTS "loc_auth" ON locations;
DROP POLICY IF EXISTS "srv_auth" ON services;
DROP POLICY IF EXISTS "pages_auth" ON pages;

-- Giriş yapmış kullanıcılar da anon ile aynı içeriği okuyabilir
CREATE POLICY "loc_auth_read" ON locations FOR SELECT TO authenticated USING (aktif = true OR public.is_admin());
CREATE POLICY "srv_auth_read" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "pages_auth_read" ON pages FOR SELECT TO authenticated USING (yayinda = true OR public.is_admin());

-- Yazma (insert/update/delete) yalnızca admin
CREATE POLICY "loc_admin_write" ON locations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "srv_admin_write" ON services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pages_admin_write" ON pages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
