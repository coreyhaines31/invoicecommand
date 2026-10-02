import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024
// SVG intentionally excluded — it can carry <script> and event handlers.
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

// Magic-byte signatures keyed by sniffed content type. file.type is supplied
// by the client and trivially spoofable, so we use this as the source of truth.
function sniffImageType(buf: Buffer): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return 'image/png'
  if (
    buf.length >= 6 &&
    buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38 &&
    (buf[4] === 0x37 || buf[4] === 0x39) && buf[5] === 0x61
  ) return 'image/gif'
  // WebP: "RIFF" .... "WEBP"
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'image/webp'
  return null
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be between 1 byte and 2MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const sniffedType = sniffImageType(buffer)

    if (!sniffedType || !ALLOWED_IMAGE_TYPES.has(sniffedType)) {
      return NextResponse.json(
        { error: 'Unsupported image type (must be JPEG, PNG, GIF, or WebP)' },
        { status: 400 }
      )
    }

    const base64 = buffer.toString('base64')
    const dataUrl = `data:${sniffedType};base64,${base64}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      contentType: sniffedType,
      size: file.size,
    })
  } catch (error) {
    console.error('Logo upload failed:', error)
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
  }
}
