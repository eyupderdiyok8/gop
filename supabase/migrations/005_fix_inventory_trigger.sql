-- ============================================================
-- Fix for stock movement trigger (search_path issue)
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_inventory_stock()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.hareket_turu = 'giris' THEN
    UPDATE public.inventory SET adet = adet + NEW.miktar WHERE id = NEW.inventory_id;
  ELSIF NEW.hareket_turu = 'cikis' THEN
    UPDATE public.inventory SET adet = adet - NEW.miktar WHERE id = NEW.inventory_id;
  END IF;
  RETURN NEW;
END;
$$;
