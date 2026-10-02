import { timingSafeEqual } from 'crypto'

/**
 * Constant-time compare of two secrets. Returns false if either side is
 * absent or differs in length. Use for Bearer / shared-secret header checks
 * so that response timing does not leak per-character info about the secret.
 */
export function timingSafeStringEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}
