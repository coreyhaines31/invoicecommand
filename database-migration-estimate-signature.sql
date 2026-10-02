-- Migration: Add E-Signature Support for Estimates
-- Adds columns to capture electronic signatures + acceptance metadata
-- on estimates per ESIGN/UETA legal requirements.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signature_data TEXT,
  ADD COLUMN IF NOT EXISTS signer_name TEXT,
  ADD COLUMN IF NOT EXISTS signer_email TEXT,
  ADD COLUMN IF NOT EXISTS signed_ip TEXT;

COMMENT ON COLUMN public.invoices.signed_at IS 'Timestamp when the estimate was electronically signed by the recipient';
COMMENT ON COLUMN public.invoices.signature_data IS 'Base64-encoded PNG of the signature canvas drawing';
COMMENT ON COLUMN public.invoices.signer_name IS 'Typed full name of the person accepting the estimate';
COMMENT ON COLUMN public.invoices.signer_email IS 'Email address of the person accepting the estimate';
COMMENT ON COLUMN public.invoices.signed_ip IS 'IP address captured at time of signing for legal record';

-- Index to quickly find signed estimates
CREATE INDEX IF NOT EXISTS idx_invoices_signed_at ON public.invoices(signed_at)
  WHERE signed_at IS NOT NULL;
