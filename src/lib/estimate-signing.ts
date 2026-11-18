// The share page renders this version of the estimate and the accept route
// only signs a row whose updated_at still matches it. Both sides serialize
// through this function so the comparison is on the same millisecond string.
export function serializeDocumentVersion(updatedAt: Date | null | undefined): string {
  return updatedAt ? updatedAt.toISOString() : ''
}
