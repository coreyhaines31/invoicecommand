-- Migration: Add Estimate Mode Support
-- This migration adds support for estimates alongside invoices

-- Add document_type column to distinguish invoices from estimates
ALTER TABLE public.invoices
ADD COLUMN document_type TEXT DEFAULT 'invoice' CHECK (document_type IN ('invoice', 'estimate'));

-- Add expiration_date for estimates (valid until date)
ALTER TABLE public.invoices
ADD COLUMN expiration_date DATE;

-- Add tracking for estimate to invoice conversions
ALTER TABLE public.invoices
ADD COLUMN converted_to_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- Add index for better query performance on document_type
CREATE INDEX idx_invoices_document_type ON public.invoices(document_type);

-- Add index for conversion tracking
CREATE INDEX idx_invoices_converted_to ON public.invoices(converted_to_invoice_id);

-- Update the invoice_number column comment to clarify it handles both invoices and estimates
COMMENT ON COLUMN public.invoices.invoice_number IS 'Document number - format: INV-1001 for invoices, EST-1001 for estimates';
COMMENT ON COLUMN public.invoices.document_type IS 'Type of document: invoice or estimate';
COMMENT ON COLUMN public.invoices.expiration_date IS 'For estimates only: date until which the estimate is valid';
COMMENT ON COLUMN public.invoices.converted_to_invoice_id IS 'For estimates only: ID of the invoice created from this estimate';

-- Note: The table name remains 'invoices' for backward compatibility, but it now stores both invoices and estimates
