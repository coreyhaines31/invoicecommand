import {
  isReplayBlockedPath,
  redactDeep,
  redactSecretsInText,
  scrubSentryPayload,
} from '@/lib/sentry-redaction'

const TOKEN = 'Ab3_dEf-GhIjKlMnOpQrStUvWxYz0123'

describe('redactSecretsInText', () => {
  it('redacts the token in absolute, relative and embedded share URLs', () => {
    expect(redactSecretsInText(`https://invoicecommand.com/i/${TOKEN}`)).toBe(
      'https://invoicecommand.com/i/[redacted]'
    )
    expect(redactSecretsInText(`/i/${TOKEN}?pay=1`)).toBe('/i/[redacted]?pay=1')
    expect(redactSecretsInText(`GET /i/${TOKEN}`)).toBe('GET /i/[redacted]')
    expect(redactSecretsInText(`Navigated from "/i/${TOKEN}" to /`)).toBe(
      'Navigated from "/i/[redacted]" to /'
    )
  })

  it('redacts token query params', () => {
    expect(redactSecretsInText('/auth/reset-password?token=secret123&x=1')).toBe(
      '/auth/reset-password?token=REDACTED&x=1'
    )
  })

  it('leaves route patterns and unrelated paths alone', () => {
    expect(redactSecretsInText('GET /i/[token]')).toBe('GET /i/[token]')
    expect(redactSecretsInText('/blog/i/thing')).toBe('/blog/i/thing')
    expect(redactSecretsInText('/invoice/7f0c1d2e')).toBe('/invoice/7f0c1d2e')
    expect(redactSecretsInText('/i')).toBe('/i')
  })
})

describe('scrubSentryPayload', () => {
  it('redacts request.url, headers, transaction names, spans and breadcrumbs', () => {
    const event = {
      transaction: `/i/${TOKEN}`,
      request: {
        url: `https://invoicecommand.com/i/${TOKEN}`,
        headers: { Referer: `https://invoicecommand.com/i/${TOKEN}` },
      },
      spans: [{ description: `GET /i/${TOKEN}`, data: { 'url.full': `https://invoicecommand.com/i/${TOKEN}` } }],
      breadcrumbs: [
        { category: 'navigation', data: { from: `/i/${TOKEN}`, to: '/' } },
        { category: 'fetch', data: { url: `/i/${TOKEN}`, status_code: 200 } },
      ],
    }

    const out = scrubSentryPayload(event)

    expect(out).toBe(event)
    expect(JSON.stringify(out)).not.toContain(TOKEN)
    expect(out.request.url).toBe('https://invoicecommand.com/i/[redacted]')
    expect(out.breadcrumbs[1].data.status_code).toBe(200)
  })

  it('passes null through for dropped events', () => {
    expect(scrubSentryPayload(null)).toBeNull()
  })

  it('handles cycles', () => {
    const a: Record<string, unknown> = { url: `/i/${TOKEN}` }
    a.self = a
    redactDeep(a)
    expect(a.url).toBe('/i/[redacted]')
  })
})

describe('isReplayBlockedPath', () => {
  it('blocks share-link pages only', () => {
    expect(isReplayBlockedPath(`/i/${TOKEN}`)).toBe(true)
    expect(isReplayBlockedPath(`https://invoicecommand.com/i/${TOKEN}`)).toBe(true)
    expect(isReplayBlockedPath('/dashboard')).toBe(false)
    expect(isReplayBlockedPath('/invoice/7f0c1d2e')).toBe(false)
  })
})
