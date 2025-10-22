import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current month-year
    const now = new Date()
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Get or create voice usage record for this month
    const { data: voiceUsage, error } = await supabase
      .from('voice_usage')
      .select('command_count')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching voice usage:', error)
      return NextResponse.json(
        { error: 'Failed to fetch voice usage' },
        { status: 500 }
      )
    }

    // If no record exists, return 0 usage
    const commandCount = voiceUsage?.command_count || 0

    return NextResponse.json({
      used: commandCount,
      limit: 10, // Free users get 10 commands per month
      canUse: commandCount < 10
    })

  } catch (error) {
    console.error('Voice usage API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current month-year
    const now = new Date()
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Check current usage first
    const { data: existingUsage, error: fetchError } = await supabase
      .from('voice_usage')
      .select('command_count')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing usage:', fetchError)
      return NextResponse.json(
        { error: 'Failed to check current usage' },
        { status: 500 }
      )
    }

    const currentCount = existingUsage?.command_count || 0

    // Check if user has reached limit
    if (currentCount >= 10) {
      return NextResponse.json(
        { error: 'Voice command limit reached for this month' },
        { status: 429 }
      )
    }

    // Increment usage using upsert
    const { error: upsertError } = await supabase
      .from('voice_usage')
      .upsert({
        user_id: user.id,
        month_year: monthYear,
        command_count: currentCount + 1,
        last_used: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,month_year'
      })

    if (upsertError) {
      console.error('Error updating voice usage:', upsertError)
      return NextResponse.json(
        { error: 'Failed to update voice usage' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      used: currentCount + 1,
      limit: 10,
      remaining: 10 - (currentCount + 1)
    })

  } catch (error) {
    console.error('Voice usage increment API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}