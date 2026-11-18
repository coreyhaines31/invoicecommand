// Logos are stored inline as data URLs in invoices.sender_logo (text), so they are kept small.
export const MAX_LOGO_BYTES = 200 * 1024
export const MAX_LOGO_SIZE_LABEL = '200 KB'

const LOGO_DATA_URL_PREFIX = /^data:image\/(png|jpeg|webp|gif);base64,/
const BASE64 = /^[A-Za-z0-9+/]*={0,2}$/
const MAX_LOGO_DATA_URL_LENGTH = 'data:image/jpeg;base64,'.length + Math.ceil(MAX_LOGO_BYTES / 3) * 4

// A logo is only ever an inline image of the kind the upload route returns (PNG, JPEG, WebP
// or GIF, no SVG) within the size limit. Remote URLs are not accepted: the PDF is rendered
// on the server, which must not fetch addresses taken from stored data.
export function isInlineLogo(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const prefix = value.match(LOGO_DATA_URL_PREFIX)
  if (!prefix) return false
  return value.length <= MAX_LOGO_DATA_URL_LENGTH && BASE64.test(value.slice(prefix[0].length))
}
