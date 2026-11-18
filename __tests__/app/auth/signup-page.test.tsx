import type React from 'react'
import { render, screen } from '@testing-library/react'
import SignupPage from '@/app/auth/signup/page'

jest.mock('@/components/auth/signup-form', () => ({
  SignupForm: ({ next }: { next?: string | null }) => <div data-testid="signup-form" data-next={next ?? ''} />,
}))

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

const DRAFT_NOTE = 'Your invoice draft is kept in this browser and will be there after you sign up.'

async function renderPage(params: { next?: string }) {
  render(await SignupPage({ searchParams: Promise.resolve(params) }))
}

describe('SignupPage', () => {
  it('tells the visitor their draft is kept when returning to the builder', async () => {
    await renderPage({ next: '/' })

    expect(screen.getByText(DRAFT_NOTE)).toBeInTheDocument()
    expect(screen.getByTestId('signup-form')).toHaveAttribute('data-next', '/')
    expect(screen.getByText('Already have an account? Sign in').closest('a')).toHaveAttribute(
      'href',
      '/auth/login?next=%2F'
    )
  })

  it('shows no draft note for other return paths', async () => {
    await renderPage({ next: '/dashboard/payments/setup' })

    expect(screen.queryByText(DRAFT_NOTE)).not.toBeInTheDocument()
  })

  it('drops an unsafe next path', async () => {
    await renderPage({ next: '//evil.com' })

    expect(screen.getByTestId('signup-form')).toHaveAttribute('data-next', '')
    expect(screen.getByText('Already have an account? Sign in').closest('a')).toHaveAttribute('href', '/auth/login')
  })
})
