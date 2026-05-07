-- Add marka to inventory
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS marka TEXT;
