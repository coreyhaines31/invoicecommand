-- Voice usage tracking migration
-- Run this in Supabase SQL Editor to add voice usage tracking

-- Create voice usage tracking table
CREATE TABLE IF NOT EXISTS public.voice_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
    command_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one record per user per month
    UNIQUE(user_id, month_year)
);

-- Enable Row Level Security
ALTER TABLE public.voice_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for voice usage
CREATE POLICY "Users can view own voice usage" ON public.voice_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own voice usage" ON public.voice_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice usage" ON public.voice_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Add style field to invoices table (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'invoices'
                   AND column_name = 'style'
                   AND table_schema = 'public') THEN
        ALTER TABLE public.invoices
        ADD COLUMN style TEXT DEFAULT 'modern' CHECK (style IN ('modern', 'classic', 'minimal'));
    END IF;
END $$;

-- Trigger to automatically update updated_at for voice_usage
CREATE TRIGGER handle_voice_usage_updated_at
    BEFORE UPDATE ON public.voice_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();