CREATE TABLE public.otp_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.otp_requests ENABLE ROW LEVEL SECURITY;

-- API (Service Role) üzerinden erişileceği için RLS kapalı kalabilir,
-- ama yine de güvenlik için anonim erişimini engelleyelim:
CREATE POLICY "service_role_only" ON public.otp_requests
  FOR ALL USING (auth.role() = 'service_role');
