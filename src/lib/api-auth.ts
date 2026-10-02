import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { validateApiKey, type ApiKeyResult, type RateLimitInfo } from '@/lib/api-keys'

export type AuthResult =
  | { authenticated: true; userId: string; method: 'session'; scopes: null; rateLimitInfo: null }
  | { authenticated: true; userId: string; method: 'api_key'; scopes: string[]; apiKey: ApiKeyResult; rateLimitInfo: RateLimitInfo }
  | { authenticated: false; error: string; status: number }

export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  // Check for API key in Authorization header
  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Bearer sk_live_')) {
    const apiKey = authHeader.substring(7) // Remove 'Bearer '
    const result = await validateApiKey(apiKey)

    if (!result.valid) {
      return { authenticated: false, error: result.error, status: result.status }
    }

    return {
      authenticated: true,
      userId: result.apiKey.userId,
      method: 'api_key',
      scopes: result.apiKey.scopes,
      apiKey: result.apiKey,
      rateLimitInfo: result.apiKey.rateLimitInfo,
    }
  }

  // Fall back to session auth
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return { authenticated: false, error: 'Unauthorized', status: 401 }
  }

  return {
    authenticated: true,
    userId: session.user.id,
    method: 'session',
    scopes: null, // Session users have full access
    rateLimitInfo: null,
  }
}

export function hasScope(authResult: AuthResult, scope: string): boolean {
  if (!authResult.authenticated) return false

  // Session auth has full access
  if (authResult.method === 'session') return true

  // API key auth needs explicit scope
  return authResult.scopes.includes(scope) || authResult.scopes.includes('*')
}

export function requireScope(authResult: AuthResult, scope: string): AuthResult {
  if (!authResult.authenticated) return authResult

  if (!hasScope(authResult, scope)) {
    return {
      authenticated: false,
      error: `Missing required scope: ${scope}`,
      status: 403,
    }
  }

  return authResult
}

// Helper to extract userId from auth result
export function getUserId(authResult: AuthResult): string | null {
  return authResult.authenticated ? authResult.userId : null
}

// Create a JSON response with rate limit headers if applicable
export function createApiResponse<T>(
  data: T,
  authResult: AuthResult,
  options: { status?: number } = {}
): NextResponse<T> {
  const response = NextResponse.json(data, { status: options.status })

  // Add rate limit headers for API key auth
  if (authResult.authenticated && authResult.rateLimitInfo) {
    const { limit, remaining, reset } = authResult.rateLimitInfo
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.floor(reset.getTime() / 1000).toString())
  }

  return response
}
