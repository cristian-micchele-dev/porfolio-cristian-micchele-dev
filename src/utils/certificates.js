// Ordenamiento y filtrado de certificados.
// Extraído de useCertificates.js para permitir testing aislado — la lógica
// de sort tiene edge cases (años faltantes, NaN) que vale la proteger.

/**
 * Ordena certificados por año. Por defecto descendente (más recientes primero).
 * Años faltantes o no parseables se tratan como 0.
 * @param {Array<{year?: *}>} certificates
 * @param {boolean} ascending - true para ascendente
 * @returns {Array} nueva array ordenada (no muta la original)
 */
export function sortCertificatesByYear(certificates, ascending = false) {
  return [...certificates].sort((a, b) => {
    const yearA = parseInt(a.year) || 0
    const yearB = parseInt(b.year) || 0
    return ascending ? yearA - yearB : yearB - yearA
  })
}

/**
 * Filtra certificados por categoría. Si no hay categoría, devuelve todos.
 * @param {Array<{category?: string}>} certificates
 * @param {string} category
 */
export function filterCertificatesByCategory(certificates, category) {
  if (!category) return certificates
  return certificates.filter(cert => cert.category === category)
}