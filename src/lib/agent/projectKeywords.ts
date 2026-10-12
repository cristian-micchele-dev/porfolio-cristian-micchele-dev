import { normalize } from './matcher'

/**
 * Tokens que NO identifican a un proyecto.
 *
 * "api", "admin" o "sistema" aparecen en los nombres pero también en
 * cualquier pregunta general. Si se usaran como keyword, "¿qué APIs hizo?"
 * dispararía la ficha de Parking Admin API en lugar de la lista de proyectos.
 */
const GENERIC = new Set([
  'la',
  'el',
  'los',
  'las',
  'de',
  'del',
  'y',
  'api',
  'apis',
  'admin',
  'app',
  'web',
  'sistema',
  'landing',
  'page',
  'manager',
  'dojo',
  '3d',
])

/** Mínimo de caracteres para que un token suelto sirva como identificador. */
const MIN_TOKEN = 4

/**
 * Keywords para reconocer un proyecto por su nombre.
 *
 * Devuelve el nombre completo como frase —que el matcher puntúa al doble— más
 * los tokens distintivos sueltos. Las `aliases` explícitas van primero porque
 * la gente abrevia: nadie escribe "Pulso — Gestión Hospitalaria" entero.
 */
export function projectKeywords(name: string, aliases: readonly string[] = []): string[] {
  const normalized = normalize(name)

  // El nombre suele traer un guión largo separando título y subtítulo:
  // cada parte es una frase buscable por sí misma.
  const phrases = name
    .split(/[—–|·]/)
    .map((part) => normalize(part))
    .filter((part) => part.split(' ').length > 1)

  const tokens = normalized
    .split(' ')
    .filter((token) => token.length >= MIN_TOKEN && !GENERIC.has(token))

  return [...new Set([...aliases.map(normalize), normalized, ...phrases, ...tokens])].filter(
    Boolean,
  )
}
