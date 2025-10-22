import { NextRequest, NextResponse } from 'next/server'
import { autoConfirmUser } from '@/lib/auth-helpers'

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Auto-confirm only available in development' },
      { status: 403 }
    )
  }

  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const success = await autoConfirmUser(userId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to confirm user' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Auto-confirm API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}