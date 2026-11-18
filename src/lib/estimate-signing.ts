// Shown next to the signature pad and stored with every signature. The server
// always stores this constant, never text sent by the client.
export const ESTIMATE_CONSENT_TEXT =
  'I accept this estimate and agree that this electronic signature is the legal equivalent of my handwritten signature under the U.S. ESIGN Act and applicable state law (UETA).'

// The share page renders this version of the estimate and the accept route
// only signs a row whose updated_at still matches it. Both sides serialize
// through this function so the comparison is on the same millisecond string.
export function serializeDocumentVersion(updatedAt: Date | null | undefined): string {
  return updatedAt ? updatedAt.toISOString() : ''
}
