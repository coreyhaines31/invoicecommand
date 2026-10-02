-- Migration: Owner-side toggles for e-signature collection
-- Adds two flags so the estimate owner can control whether the public
-- view offers a signature pad and whether signing is marked as required.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS collect_signature BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS signature_required BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.invoices.collect_signature IS 'If true, the public estimate view renders the signature pad. Defaults true for backward compatibility with already-shared estimates.';
COMMENT ON COLUMN public.invoices.signature_required IS 'If true, the public estimate view shows a prominent "signature required" notice. Does not physically block viewing; used for owner-side workflow signaling.';
