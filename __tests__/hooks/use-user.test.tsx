/**
 * Tests for useUser hook
 * Tests mapping of the Better Auth session into user/loading/isAuthenticated
 */

import { renderHook } from '@testing-library/react'
import { useUser } from '@/hooks/use-user'

const mockUseSession = jest.fn()

jest.mock('@/lib/auth-client', () => ({
  useSession: () => mockUseSession(),
}))

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should report loading with no user while the session is pending', () => {
    mockUseSession.mockReturnValue({ data: null, isPending: true })

    const { result } = renderHook(() => useUser())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should report an anonymous user when there is no session', () => {
    mockUseSession.mockReturnValue({ data: null, isPending: false })

    const { result } = renderHook(() => useUser())

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should treat a session without a user as unauthenticated', () => {
    mockUseSession.mockReturnValue({ data: { session: { id: 's1' } }, isPending: false })

    const { result } = renderHook(() => useUser())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should expose the session user when authenticated', () => {
    const user = { id: 'user-123', email: 'test@example.com' }
    mockUseSession.mockReturnValue({ data: { user, session: { id: 's1' } }, isPending: false })

    const { result } = renderHook(() => useUser())

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toEqual(user)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should update when the session changes', () => {
    mockUseSession.mockReturnValue({ data: null, isPending: false })
    const { result, rerender } = renderHook(() => useUser())
    expect(result.current.isAuthenticated).toBe(false)

    const user = { id: 'user-456', email: 'new@example.com' }
    mockUseSession.mockReturnValue({ data: { user }, isPending: false })
    rerender()

    expect(result.current.user).toEqual(user)
    expect(result.current.isAuthenticated).toBe(true)
  })
})
