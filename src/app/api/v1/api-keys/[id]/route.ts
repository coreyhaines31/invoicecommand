import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { revokeApiKey } from '@/lib/api-keys'
import { jsonErrorResponse } from '@/lib/error-response'

// DELETE /api/v1/api-keys/:id - Revoke an API key (session auth only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const revoked = await revokeApiKey(session.user.id, id)

    if (!revoked) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'API key revoked' })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to revoke API key')
  }
}
