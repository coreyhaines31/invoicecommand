import { randomBytes } from 'node:crypto'

// 24 bytes → 32 url-safe base64 chars. Enough entropy that guessing is hopeless
// without making the URL/QR code uncomfortably long.
export function generateShareToken(): string {
  return randomBytes(24).toString('base64url')
}

export function buildShareUrl(token: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://invoicecommand.com'
  return `${appUrl.replace(/\/$/, '')}/i/${token}`
}
