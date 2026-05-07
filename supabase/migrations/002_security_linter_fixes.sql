-- ============================================================
-- Supabase Security Linter Fixes (002)
-- ============================================================

-- 1. Fonksiyonların search_path uyarısını düzeltmek için:
ALTER FUNCTION public.update_updated_at() SET search_path = '';
ALTER FUNCTION public.update_inventory_stock() SET search_path = '';

-- 2. RLS Politikalarının "Always True" uyarısını düzeltmek için:
ALTER POLICY "customers_auth_all" ON customers 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "devices_auth_all" ON devices 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "service_records_auth_all" ON service_records 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "inventory_auth_all" ON inventory 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "inventory_movements_auth_all" ON inventory_movements 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "filter_plans_auth_all" ON filter_plans 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "customer_notes_auth_all" ON customer_notes 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "appointments_auth_all" ON appointments 
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
