-- ============================================================
-- Müşteri Üyelik Sistemi ve Güvenlik Altyapısı
-- ============================================================

-- 1. Customers tablosuna user_id (auth.users referansı) ekleme
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Telefon numarası bazlı eşleşme için telefonun benzersiz olduğundan emin olalım.
-- Not: Eğer veritabanında aynı numaradan birden fazla varsa bu hata verebilir.
-- Admin'in temiz veri girişi yaptığı varsayılır.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_customer_phone') THEN
        ALTER TABLE public.customers ADD CONSTRAINT unique_customer_phone UNIQUE (telefon);
    END IF;
END $$;

-- 3. Rol Kontrol Fonksiyonları
-- Metadata üzerinde 'role' alanına bakar.
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR 
    (auth.jwt() ->> 'role' = 'service_role')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS Politikalarını Yeniden Düzenleme (Veri Güvenliği)

-- CUSTOMERS tablosu
DROP POLICY IF EXISTS "customers_auth_all" ON public.customers;
CREATE POLICY "admin_all_customers" ON public.customers FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "customer_own_data" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid());

-- DEVICES tablosu
DROP POLICY IF EXISTS "devices_auth_all" ON public.devices;
CREATE POLICY "admin_all_devices" ON public.devices FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "customer_own_devices" ON public.devices FOR SELECT TO authenticated 
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- SERVICE RECORDS tablosu
DROP POLICY IF EXISTS "service_records_auth_all" ON public.service_records;
CREATE POLICY "admin_all_services" ON public.service_records FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "customer_own_services" ON public.service_records FOR SELECT TO authenticated 
  USING (device_id IN (SELECT d.id FROM public.devices d JOIN public.customers c ON d.customer_id = c.id WHERE c.user_id = auth.uid()));

-- FILTER PLANS tablosu
DROP POLICY IF EXISTS "filter_plans_auth_all" ON public.filter_plans;
CREATE POLICY "admin_all_filters" ON public.filter_plans FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "customer_own_filters" ON public.filter_plans FOR SELECT TO authenticated 
  USING (device_id IN (SELECT d.id FROM public.devices d JOIN public.customers c ON d.customer_id = c.id WHERE c.user_id = auth.uid()));

-- APPOINTMENTS tablosu (Update)
DROP POLICY IF EXISTS "appointments_auth_all" ON public.appointments;
CREATE POLICY "admin_all_appointments" ON public.appointments FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "customer_own_appointments" ON public.appointments FOR SELECT TO authenticated 
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- 5. Başlangıç Admin Kullanıcısı İçin Not:
-- Mevcut admin kullanıcınızın metadata'sına { "role": "admin" } eklenmelidir.
-- SQL üzerinden şu şekilde yapılabilir (E-posta kısmını değiştirin):
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}' WHERE email = 'admin@example.com';
