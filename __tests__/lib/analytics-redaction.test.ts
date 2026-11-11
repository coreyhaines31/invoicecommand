import {
  hasTokenInPath,
  isSensitivePath,
  redactPath,
  scrubEvent,
  scrubUrl,
} from '@/lib/analytics-redaction'

const TOKEN = 'Ab3_dEf-GhIjKlMnOpQrStUvWxYz0123'

describe('redactPath', () => {
  it('redacts the share token in /i/<token>', () => {
    expect(redactPath(`/i/${TOKEN}`)).toBe('/i/[redacted]')
    expect(redactPath(`/i/${TOKEN}/`)).toBe('/i/[redacted]/')
  })

  it('leaves other paths alone', () => {
    expect(redactPath('/invoice-templates/plumber')).toBe('/invoice-templates/plumber')
    expect(redactPath('/i')).toBe('/i')
    expect(redactPath('/blog/i/thing')).toBe('/blog/i/thing')
  })
})

describe('hasTokenInPath / isSensitivePath', () => {
  it('flags share and invoice pages only', () => {
    expect(hasTokenInPath(`/i/${TOKEN}`)).toBe(true)
    expect(hasTokenInPath('/invoice/123')).toBe(false)
    expect(isSensitivePath(`/i/${TOKEN}`)).toBe(true)
    expect(isSensitivePath('/invoice/7f0c1d2e')).toBe(true)
    expect(isSensitivePath('/invoice-templates/plumber')).toBe(false)
    expect(isSensitivePath('/')).toBe(false)
    expect(isSensitivePath('/dashboard')).toBe(false)
  })
})

describe('scrubUrl', () => {
  it('redacts the token in absolute share URLs without a query string', () => {
    expect(scrubUrl(`https://invoicecommand.com/i/${TOKEN}`)).toBe('https://invoicecommand.com/i/[redacted]')
  })

  it('redacts the token in relative share URLs and keeps the rest', () => {
    expect(scrubUrl(`/i/${TOKEN}?payment=success#pay`)).toBe('/i/[redacted]?payment=success#pay')
  })

  it('redacts both path and query secrets', () => {
    expect(scrubUrl(`https://invoicecommand.com/i/${TOKEN}?token=abc`)).toBe(
      'https://invoicecommand.com/i/[redacted]?token=REDACTED'
    )
  })

  it('still redacts sensitive query params', () => {
    expect(scrubUrl('https://invoicecommand.com/auth/reset-password?token=secret123')).toBe(
      'https://invoicecommand.com/auth/reset-password?token=REDACTED'
    )
  })

  it('returns untouched URLs unchanged', () => {
    const url = 'https://invoicecommand.com/invoice-templates/plumber?utm_source=x'
    expect(scrubUrl(url)).toBe(url)
  })
})

describe('scrubEvent', () => {
  it('redacts $current_url, $pathname, $referrer and persisted person props', () => {
    const event = {
      event: '$pageview',
      properties: {
        $current_url: `https://invoicecommand.com/i/${TOKEN}`,
        $pathname: `/i/${TOKEN}`,
        $referrer: `https://invoicecommand.com/i/${TOKEN}`,
        $prev_pageview_pathname: `/i/${TOKEN}`,
        $session_entry_url: `https://invoicecommand.com/i/${TOKEN}`,
        title: 'Invoice INV-001 from Acme',
        $host: 'invoicecommand.com',
      },
      $set_once: {
        $initial_current_url: `https://invoicecommand.com/i/${TOKEN}`,
        $initial_pathname: `/i/${TOKEN}`,
      },
      $set: { $current_url: `https://invoicecommand.com/i/${TOKEN}` },
    }

    const result = scrubEvent(event, `/i/${TOKEN}`)

    expect(JSON.stringify(result)).not.toContain(TOKEN)
    expect(result?.properties.$current_url).toBe('https://invoicecommand.com/i/[redacted]')
    expect(result?.properties.$pathname).toBe('/i/[redacted]')
    expect(result?.properties.$referrer).toBe('https://invoicecommand.com/i/[redacted]')
    expect(result?.properties).not.toHaveProperty('title')
    expect(result?.properties.$host).toBe('invoicecommand.com')
    expect(result?.$set_once?.$initial_pathname).toBe('/i/[redacted]')
  })

  it('redacts a share-link referrer on a public page', () => {
    const result = scrubEvent(
      { event: '$pageview', properties: { $referrer: `https://invoicecommand.com/i/${TOKEN}`, title: 'Home' } },
      '/'
    )
    expect(result?.properties.$referrer).toBe('https://invoicecommand.com/i/[redacted]')
    expect(result?.properties.title).toBe('Home')
  })

  it('drops click events on sensitive pages', () => {
    for (const name of ['$autocapture', '$rageclick', '$dead_click', '$copy_autocapture']) {
      expect(scrubEvent({ event: name, properties: {} }, `/i/${TOKEN}`)).toBeNull()
      expect(scrubEvent({ event: name, properties: {} }, '/invoice/abc')).toBeNull()
    }
  })

  it('keeps click events on public pages', () => {
    expect(scrubEvent({ event: '$autocapture', properties: {} }, '/')).not.toBeNull()
  })

  it('falls back to the event $pathname when no current path is given', () => {
    expect(scrubEvent({ event: '$autocapture', properties: { $pathname: `/i/${TOKEN}` } })).toBeNull()
  })

  it('passes null through', () => {
    expect(scrubEvent(null)).toBeNull()
  })
})
