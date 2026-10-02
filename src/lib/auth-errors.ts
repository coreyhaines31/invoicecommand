// Maps Better Auth error responses to user-friendly messages with optional
// follow-up actions. Better Auth returns { code: string, message: string } on
// failure; we prefer the code for routing logic and only fall back to the raw
// message when the code is unknown.

export interface FriendlyAuthError {
  message: string
  actionHref?: string
  actionLabel?: string
}

interface BetterAuthError {
  code?: string
  message?: string
  status?: number
}

export function getAuthErrorMessage(error: BetterAuthError | null | undefined): FriendlyAuthError {
  const code = error?.code
  const raw = error?.message

  // Codes come from better-auth/dist/error/codes.mjs (BASE_ERROR_CODES).
  // Cover the ones we can actually trigger from the signup/login/reset flows;
  // unknown codes fall through to Better Auth's raw message.
  switch (code) {
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return {
        message: 'An account with this email already exists.',
        actionHref: '/auth/login',
        actionLabel: 'Sign in instead',
      }
    case 'INVALID_EMAIL_OR_PASSWORD':
    case 'INVALID_PASSWORD':
      return { message: 'That email and password combination is incorrect.' }
    case 'INVALID_EMAIL':
      return { message: 'That email address looks invalid.' }
    case 'USER_NOT_FOUND':
      return {
        message: 'No account found for that email.',
        actionHref: '/auth/signup',
        actionLabel: 'Create one',
      }
    case 'PASSWORD_TOO_SHORT':
      return { message: 'Password is too short. Use at least 8 characters.' }
    case 'PASSWORD_TOO_LONG':
      return { message: 'Password is too long.' }
    case 'EMAIL_NOT_VERIFIED':
      return { message: 'Please verify your email before signing in.' }
    case 'INVALID_TOKEN':
    case 'TOKEN_EXPIRED':
      return { message: 'This link is invalid or has expired. Please request a new one.' }
    case 'FAILED_TO_CREATE_USER':
      return { message: 'We could not create your account. Please try again.' }
    case 'CREDENTIAL_ACCOUNT_NOT_FOUND':
      return { message: 'No password-based account found. Try signing in with the method you originally used.' }
    default:
      return { message: raw || 'Something went wrong. Please try again.' }
  }
}
