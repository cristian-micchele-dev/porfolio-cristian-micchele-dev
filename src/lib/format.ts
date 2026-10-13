/** Formateadores de presentación. Los datos guardan ISO; el formateo vive acá. */

const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const

/**
 * `2026-02` → `feb 2026`.
 * Una fecha inválida se devuelve tal cual: preferimos mostrar el dato crudo
 * antes que un "Invalid Date" o un hueco silencioso en la UI.
 */
export function formatMonthYear(iso: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(iso)
  if (!match) return iso

  const [, year, month] = match as unknown as [string, string, string]
  const monthName = MONTHS_ES[Number.parseInt(month, 10) - 1]
  if (!monthName) return iso

  return `${monthName} ${year}`
}

/** Latencia en ms para la status bar. Redondea y acota el ancho visual. */
export function formatLatency(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms) || ms < 0) return '--'
  return `${Math.min(Math.round(ms), 9999)}ms`
}

/** `https://github.com/user/repo` → `github.com/user/repo`. Para links en mono. */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
