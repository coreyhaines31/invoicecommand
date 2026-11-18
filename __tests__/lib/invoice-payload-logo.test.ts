/**
 * Issue #91: the logo upload returns a data URL, and saving an invoice with it
 * must pass the payload validator.
 */
import { parseInvoicePayload, InvoiceValidationError } from '@/lib/invoice-payload'
import { MAX_LOGO_BYTES } from '@/lib/logo'

function dataUrl(type: string, bytes: number) {
  return `data:${type};base64,${Buffer.alloc(bytes, 7).toString('base64')}`
}

function parseLogo(senderLogo: unknown) {
  return parseInvoicePayload({ senderLogo }, 'update').senderLogo
}

describe('parseInvoicePayload senderLogo', () => {
  it('accepts a logo at the upload size limit, in every type the upload allows', () => {
    for (const type of ['image/png', 'image/jpeg', 'image/webp', 'image/gif']) {
      const logo = dataUrl(type, MAX_LOGO_BYTES)
      expect(parseLogo(logo)).toBe(logo)
    }
  })

  it('accepts a typical 30 KB PNG logo', () => {
    const logo = dataUrl('image/png', 30 * 1024)
    expect(parseLogo(logo)).toBe(logo)
  })

  it('rejects a logo larger than the upload allows', () => {
    expect(() => parseLogo(dataUrl('image/png', MAX_LOGO_BYTES + 3))).toThrow(InvoiceValidationError)
  })

  it('rejects SVG and other non-image data URLs', () => {
    expect(() => parseLogo('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')).toThrow(InvoiceValidationError)
    expect(() => parseLogo('data:text/html;base64,PGgxPjwvaDE+')).toThrow(InvoiceValidationError)
  })

  it('rejects a data URL with characters outside base64', () => {
    expect(() => parseLogo('data:image/png;base64,abc"onerror=x')).toThrow(InvoiceValidationError)
  })

  it('rejects remote and other non-inline logo values', () => {
    expect(() => parseLogo('https://example.com/logo.png')).toThrow(InvoiceValidationError)
    expect(() => parseLogo('http://example.com/logo.png')).toThrow(InvoiceValidationError)
    expect(() => parseLogo('javascript:alert(1)')).toThrow(InvoiceValidationError)
    expect(() => parseLogo('/logo.png')).toThrow(InvoiceValidationError)
  })

  it('clears the logo with an empty string or null', () => {
    expect(parseLogo('')).toBeNull()
    expect(parseLogo(null)).toBeNull()
  })
})
