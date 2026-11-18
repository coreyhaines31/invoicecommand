import { DEFAULT_NEXT_PATH, getSafeNextPath, resolveNextPath, withNextPath } from '@/lib/next-path'

describe('getSafeNextPath', () => {
  it.each([
    '/',
    '/dashboard',
    '/dashboard/payments/setup',
    '/invoice/new?type=estimate',
    '/templates#top',
    '/a/b%2Fc',
  ])('accepts same-origin path %s', (value) => {
    expect(getSafeNextPath(value)).toBe(value)
  })

  it.each([
    ['empty string', ''],
    ['protocol-relative', '//evil.com'],
    ['protocol-relative with path', '//evil.com/dashboard'],
    ['absolute https', 'https://evil.com'],
    ['absolute http', 'http://evil.com/'],
    ['javascript scheme', 'javascript:alert(1)'],
    ['data scheme', 'data:text/html,<script>alert(1)</script>'],
    ['backslash host', '/\\evil.com'],
    ['double backslash', '\\\\evil.com'],
    ['backslash later in path', '/dashboard\\..\\evil'],
    ['tab between slashes', '/\t/evil.com'],
    ['newline between slashes', '/\n/evil.com'],
    ['carriage return', '/\r/evil.com'],
    ['null byte', '/\u0000/evil.com'],
    ['relative path', 'dashboard'],
    ['dot relative', './dashboard'],
    ['leading space', ' /dashboard'],
    ['too long', '/' + 'a'.repeat(2048)],
  ])('rejects %s', (_label, value) => {
    expect(getSafeNextPath(value)).toBeNull()
  })

  it.each([undefined, null, 42, ['/dashboard'], { path: '/' }])('rejects non-string %p', (value) => {
    expect(getSafeNextPath(value)).toBeNull()
  })
})

describe('resolveNextPath', () => {
  it('returns a valid path', () => {
    expect(resolveNextPath('/')).toBe('/')
  })

  it('falls back to the dashboard when absent or invalid', () => {
    expect(resolveNextPath(undefined)).toBe(DEFAULT_NEXT_PATH)
    expect(resolveNextPath('//evil.com')).toBe(DEFAULT_NEXT_PATH)
    expect(DEFAULT_NEXT_PATH).toBe('/dashboard')
  })
})

describe('withNextPath', () => {
  it('appends an encoded next param', () => {
    expect(withNextPath('/auth/login', '/dashboard/payments/setup')).toBe(
      '/auth/login?next=%2Fdashboard%2Fpayments%2Fsetup'
    )
  })

  it('uses & when the href already has a query', () => {
    expect(withNextPath('/auth/login?reset=1', '/')).toBe('/auth/login?reset=1&next=%2F')
  })

  it('leaves the href alone when next is absent or unsafe', () => {
    expect(withNextPath('/auth/signup', null)).toBe('/auth/signup')
    expect(withNextPath('/auth/signup', 'https://evil.com')).toBe('/auth/signup')
  })
})
