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

  it('redacts the token in share PDF route URLs', () => {
    expect(redactSecretsInText(`https://invoicecommand.com/api/share/${TOKEN}/pdf`)).toBe(
      'https://invoicecommand.com/api/share/[redacted]/pdf'
    )
    expect(redactSecretsInText(`/api/share/${TOKEN}/pdf`)).toBe('/api/share/[redacted]/pdf')
    expect(redactSecretsInText(`GET /api/share/${TOKEN}/pdf`)).toBe('GET /api/share/[redacted]/pdf')
    expect(redactSecretsInText(`fetch failed for "/api/share/${TOKEN}/pdf"`)).toBe(
      'fetch failed for "/api/share/[redacted]/pdf"'
    )
    expect(redactSecretsInText('GET /api/share/[token]/pdf')).toBe('GET /api/share/[token]/pdf')
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
        { category: 'fetch', data: { url: `/api/share/${TOKEN}/pdf`, status_code: 404 } },
      ],
    }

    const out = scrubSentryPayload(event)

    expect(out).toBe(event)
    expect(JSON.stringify(out)).not.toContain(TOKEN)
    expect(out.request.url).toBe('https://invoicecommand.com/i/[redacted]')
    expect(out.breadcrumbs[1].data.status_code).toBe(200)
  })

  it('redacts an error event from the share PDF route', () => {
    const event = {
      exception: { values: [{ type: 'Error', value: `render failed for /api/share/${TOKEN}/pdf` }] },
      request: {
        url: `https://invoicecommand.com/api/share/${TOKEN}/pdf`,
        headers: { Referer: `https://invoicecommand.com/i/${TOKEN}` },
      },
      transaction: `GET /api/share/${TOKEN}/pdf`,
    }

    const out = scrubSentryPayload(event)

    expect(JSON.stringify(out)).not.toContain(TOKEN)
    expect(out.request.url).toBe('https://invoicecommand.com/api/share/[redacted]/pdf')
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

  it('skips getter-only properties and still redacts the rest', () => {
    const event: Record<string, unknown> = { url: `/i/${TOKEN}` }
    Object.defineProperty(event, '$', { get: () => 'plain', enumerable: true })

    expect(() => scrubSentryPayload(event)).not.toThrow()
    expect(event.$).toBe('plain')
    expect(event.url).toBe('/i/[redacted]')
  })

  it('does not throw on frozen nested objects', () => {
    const event = {
      url: `/i/${TOKEN}`,
      contexts: Object.freeze({ app: Object.freeze({ name: 'web', path: `/i/${TOKEN}` }) }),
    }

    expect(() => scrubSentryPayload(event)).not.toThrow()
    expect(event.url).toBe('/i/[redacted]')
    expect(event.contexts.app.name).toBe('web')
  })

  it('deletes a getter-only property whose value holds a token', () => {
    const event: Record<string, unknown> = {}
    Object.defineProperty(event, 'href', { get: () => `/i/${TOKEN}`, enumerable: true, configurable: true })

    expect(() => scrubSentryPayload(event)).not.toThrow()
    expect(JSON.stringify(event)).not.toContain(TOKEN)
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
