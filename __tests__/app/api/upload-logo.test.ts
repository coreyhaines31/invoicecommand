/**
 * @jest-environment node
 *
 * Issue #91: the logo is stored inline as a data URL, so the upload keeps it small
 * enough to save with the invoice.
 */
import { NextRequest } from 'next/server'

jest.mock('@/lib/auth', () => ({
  auth: { api: { getSession: jest.fn(async () => ({ user: { id: 'user-a' } })) } },
}))

import { POST } from '@/app/api/upload/logo/route'
import { parseInvoicePayload } from '@/lib/invoice-payload'
import { MAX_LOGO_BYTES } from '@/lib/logo'

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

function png(size: number) {
  const bytes = new Uint8Array(size)
  bytes.set(PNG_SIGNATURE)
  return new File([bytes], 'logo.png', { type: 'image/png' })
}

async function upload(file: File) {
  const form = new FormData()
  form.append('file', file)
  return POST(new NextRequest('http://localhost/api/upload/logo', { method: 'POST', body: form }))
}

describe('POST /api/upload/logo', () => {
  it('returns a data URL that the invoice save accepts, at the size limit', async () => {
    const res = await upload(png(MAX_LOGO_BYTES))
    expect(res.status).toBe(200)

    const { url } = await res.json()
    expect(url.startsWith('data:image/png;base64,')).toBe(true)
    expect(parseInvoicePayload({ senderLogo: url }, 'update').senderLogo).toBe(url)
  })

  it('rejects a logo over the limit with a message that names the limit', async () => {
    const res = await upload(png(MAX_LOGO_BYTES + 1))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Logo must be 200 KB or smaller' })
  })
})
