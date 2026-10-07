/**
 * Ordenamiento y filtrado de certificados.
 * Portado del portfolio anterior: la lógica de sort tiene edge cases (años
 * faltantes, no parseables) que vale la pena proteger aunque hoy los tipos
 * los hagan improbables — los datos de contenido los edita una persona.
 */

type Sortable = { year?: string | number | null }
type Categorized = { category?: string }

/**
 * Ordena por año, descendente por defecto (más recientes primero).
 * Años faltantes o no parseables se tratan como 0. No muta la entrada.
 */
export function sortCertificatesByYear<T extends Sortable>(
  certificates: readonly T[],
  ascending = false,
): T[] {
  return [...certificates].sort((a, b) => {
    const yearA = Number.parseInt(String(a.year), 10) || 0
    const yearB = Number.parseInt(String(b.year), 10) || 0
    return ascending ? yearA - yearB : yearB - yearA
  })
}

/** Filtra por categoría. Sin categoría devuelve la referencia original. */
export function filterCertificatesByCategory<T extends Categorized>(
  certificates: readonly T[],
  category?: string,
): readonly T[] {
  if (!category) return certificates
  return certificates.filter((cert) => cert.category === category)
}
