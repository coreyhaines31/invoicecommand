const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

// new Date('YYYY-MM-DD') is UTC midnight, which formats as the previous day
// west of UTC. Build date-only strings from their parts in local time instead.
// Anything else (a full ISO timestamp) is a real instant and parses as before.
function parseDateOnly(value: string): Date {
  const match = DATE_ONLY.exec(value)
  if (!match) return new Date(value)
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export function formatDateOnly(
  value: string | null | undefined,
  locale: string | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value) return ''
  const date = parseDateOnly(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, options)
}

export function toDateOnlyString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
