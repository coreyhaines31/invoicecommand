import { NextRequest, NextResponse } from 'next/server'

// Better Auth handles OAuth callbacks at /api/auth/[...all]
// This route just redirects legacy Supabase OAuth callbacks to dashboard
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
