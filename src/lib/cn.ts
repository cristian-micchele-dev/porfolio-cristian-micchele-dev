type ClassValue = string | number | false | null | undefined

/**
 * Concatenador de clases mínimo.
 * No usamos clsx/tailwind-merge: con tokens semánticos y primitivos cerrados no
 * tenemos conflictos de utilidades que justifiquen 8kB de dependencia.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
