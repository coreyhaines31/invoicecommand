-- Rollback Migration: Remove Estimate Mode Support
-- This script safely removes estimate mode features and reverts to invoice-only structure
-- ⚠️ WARNING: This will delete all estimate data. Back up your database before running!

-- Step 1: Verify what will be affected
-- Uncomment to see what data would be deleted:
-- SELECT COUNT(*) as estimate_count FROM public.invoices WHERE document_type = 'estimate';
-- SELECT COUNT(*) as converted_estimates FROM public.invoices WHERE converted_to_invoice_id IS NOT NULL;

-- Step 2: Optional - Archive estimate data before deletion
-- Uncomment if you want to preserve estimate data:
-- CREATE TABLE IF NOT EXISTS invoices_archive AS
-- SELECT * FROM public.invoices WHERE document_type = 'estimate';

-- Step 3: Remove foreign key references
-- Update invoices that reference converted estimates (set to NULL)
UPDATE public.invoices
SET converted_to_invoice_id = NULL
WHERE converted_to_invoice_id IS NOT NULL;

-- Step 4: Delete all estimates (if you want to keep them, skip this step)
-- Uncomment the line below to delete estimates:
-- DELETE FROM public.invoices WHERE document_type = 'estimate';

-- Step 5: Drop indexes
DROP INDEX IF EXISTS idx_invoices_document_type;
DROP INDEX IF EXISTS idx_invoices_converted_to;

-- Step 6: Remove column comments
COMMENT ON COLUMN public.invoices.invoice_number IS NULL;
COMMENT ON COLUMN public.invoices.document_type IS NULL;
COMMENT ON COLUMN public.invoices.expiration_date IS NULL;
COMMENT ON COLUMN public.invoices.converted_to_invoice_id IS NULL;

-- Step 7: Remove columns (in reverse order of dependencies)
ALTER TABLE public.invoices DROP COLUMN IF EXISTS converted_to_invoice_id;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS expiration_date;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS document_type;

-- Step 8: Verification query
-- Run this to verify rollback was successful:
SELECT
  column_name,
  data_type
FROM
  information_schema.columns
WHERE
  table_name = 'invoices'
  AND table_schema = 'public'
ORDER BY
  ordinal_position;

-- Expected result: document_type, expiration_date, and converted_to_invoice_id should NOT be in the list
