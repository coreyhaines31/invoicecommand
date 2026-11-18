import type React from 'react'
import { render, screen } from '@testing-library/react'
import VerifiedPage from '@/app/auth/verified/page'

jest.mock('@/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}))

jest.mock('next/link', () => {
  function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return MockLink
})

async function renderPage(params: { next?: string; error?: string }) {
  render(await VerifiedPage({ searchParams: Promise.resolve(params) }))
}

describe('VerifiedPage', () => {
  it('confirms verification and continues to the next path', async () => {
    await renderPage({ next: '/' })
    expect(screen.getByRole('heading', { name: 'Your email is verified' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/')
  })

  it('falls back to the dashboard for an unsafe next path', async () => {
    await renderPage({ next: '//evil.com' })
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/dashboard')
  })

  it('explains an expired or invalid link', async () => {
    await renderPage({ next: '/dashboard', error: 'TOKEN_EXPIRED' })
    expect(screen.getByRole('heading', { name: 'This link did not work' })).toBeInTheDocument()
    expect(screen.getByText(/request a new one/)).toBeInTheDocument()
  })
})
