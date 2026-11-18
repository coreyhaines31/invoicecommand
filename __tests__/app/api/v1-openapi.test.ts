/**
 * @jest-environment node
 */
import { GET } from '@/app/api/v1/openapi.json/route'
import { EMAIL_NOT_VERIFIED, EMAIL_NOT_VERIFIED_API_MESSAGE } from '@/lib/email-verification'

describe('v1 OpenAPI spec', () => {
  it('documents the unverified-email 403 on send, with how to fix it', async () => {
    const spec = await (await GET()).json()
    const forbidden = spec.paths['/invoices/{id}/send'].post.responses['403']
    expect(forbidden.description).toContain(EMAIL_NOT_VERIFIED)
    const schema = forbidden.content['application/json'].schema
    expect(schema.properties.code.enum).toContain(EMAIL_NOT_VERIFIED)
    expect(forbidden.content['application/json'].examples.emailNotVerified.value).toEqual({
      error: EMAIL_NOT_VERIFIED_API_MESSAGE,
      code: EMAIL_NOT_VERIFIED,
    })
  })
})
