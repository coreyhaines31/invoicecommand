import { isUntrackedPath } from '@/components/tracerkit'

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }))

describe('isUntrackedPath', () => {
  it('skips pages whose URL carries a secret', () => {
    expect(isUntrackedPath('/auth/reset-password')).toBe(true)
    expect(isUntrackedPath('/i/Ab3_dEf-GhIjKlMnOpQrStUvWxYz0123')).toBe(true)
  })

  it('tracks everything else', () => {
    expect(isUntrackedPath('/')).toBe(false)
    expect(isUntrackedPath('/invoice-templates/plumber')).toBe(false)
    expect(isUntrackedPath('/auth/login')).toBe(false)
  })
})
