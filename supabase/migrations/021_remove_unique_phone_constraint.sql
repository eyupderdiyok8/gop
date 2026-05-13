-- 021_remove_unique_phone_constraint.sql
-- Müşteriler tablosundaki telefon numarası benzersizlik kısıtlamasını kaldırır.
-- Bu sayede aynı numara ile birden fazla müşteri kaydı açılabilir.

ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS unique_customer_phone;
