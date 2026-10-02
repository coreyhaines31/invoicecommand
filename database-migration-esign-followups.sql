-- Migration: E-signature audit trail + integrity
-- Adds consent text + user agent for ESIGN/UETA audit trail.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS consent_text TEXT,
  ADD COLUMN IF NOT EXISTS signed_user_agent TEXT;

COMMENT ON COLUMN public.invoices.consent_text IS 'Exact ESIGN/UETA consent text the signer agreed to, captured at signing time';
COMMENT ON COLUMN public.invoices.signed_user_agent IS 'Browser user-agent string captured at signing for audit trail';
