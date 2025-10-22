// Re-export client-side functionality only
export { supabase, createBrowserSupabaseClient } from './supabase-client'

// Note: Server-side functions are in './supabase-server'
// Import directly from there to avoid bundling issues