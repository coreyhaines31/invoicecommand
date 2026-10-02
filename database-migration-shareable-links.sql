-- Migration: Shareable invoice links
-- Adds opaque share tokens so recipients can view/pay an invoice via a
-- non-guessable URL (/i/[token]) instead of the raw invoice UUID.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS share_token TEXT,
  ADD COLUMN IF NOT EXISTS share_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS share_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS share_view_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS share_last_viewed_at TIMESTAMPTZ;

-- Plain unique index: Postgres treats NULLs as distinct by default, so
-- existing rows without a token coexist freely while issued tokens stay unique.
CREATE UNIQUE INDEX IF NOT EXISTS invoices_share_token_idx
  ON public.invoices (share_token);

COMMENT ON COLUMN public.invoices.share_token IS 'URL-safe random token used as the public share-link identifier (/i/[token]). NULL until first share.';
COMMENT ON COLUMN public.invoices.share_enabled IS 'Whether the share link is currently active. Revoking flips this to false rather than nulling the token.';
COMMENT ON COLUMN public.invoices.share_expires_at IS 'Optional expiration; NULL means never expires.';
