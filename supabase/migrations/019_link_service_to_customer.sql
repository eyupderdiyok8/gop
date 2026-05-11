-- Add customer_id to service_records and make device_id optional
ALTER TABLE service_records ADD COLUMN customer_id UUID REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE service_records ALTER COLUMN device_id DROP NOT NULL;

-- Backfill customer_id from devices if possible (optional but good)
UPDATE service_records sr
SET customer_id = d.customer_id
FROM devices d
WHERE sr.device_id = d.id;
