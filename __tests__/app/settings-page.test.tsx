import { render, screen } from '@testing-library/react'

const mockRedirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT ${url}`)
})
jest.mock('next/navigation', () => ({ redirect: (url: string) => mockRedirect(url) }))
jest.mock('next/headers', () => ({ headers: jest.fn(async () => new Headers()) }))

const mockGetSession = jest.fn()
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: () => mockGetSession() } } }))
jest.mock('@/components/navigation', () => ({ Navigation: () => null }))

import SettingsPage from '@/app/settings/page'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SettingsPage', () => {
  it('redirects anonymous visitors to login with a return path', async () => {
    mockGetSession.mockResolvedValue(null)

    await expect(SettingsPage()).rejects.toThrow('NEXT_REDIRECT')
    expect(mockRedirect).toHaveBeenCalledWith('/auth/login?next=%2Fsettings')
  })

  it('shows the account email and signup date', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-a', email: 'a@example.com', createdAt: new Date('2026-03-04T12:00:00Z') },
    })

    render(await SettingsPage())

    expect(screen.getByText('a@example.com')).toBeInTheDocument()
    expect(screen.getByText('March 4, 2026')).toBeInTheDocument()
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument()
  })
})
