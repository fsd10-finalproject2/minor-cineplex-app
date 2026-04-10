const DISPLAY_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/**
 * Parses `YYYY-MM-DD` as a local calendar date so the displayed day matches the string
 * (avoids UTC midnight shifts from `new Date("YYYY-MM-DD")`).
 */
function parseDateInput(value: string): Date | null {
  const trimmed = value.trim()
  const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (isoDateOnly) {
    const y = Number(isoDateOnly[1])
    const m = Number(isoDateOnly[2]) - 1
    const d = Number(isoDateOnly[3])
    const date = new Date(y, m, d)
    if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
      return date
    }
    return null
  }
  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * UI display format: e.g. "18 Jun 2025".
 * If the value cannot be parsed, returns the original string.
 */
export function formatDisplayDate(value: string): string {
  const date = parseDateInput(value)
  if (!date) {
    return value
  }
  return DISPLAY_DATE.format(date)
}
