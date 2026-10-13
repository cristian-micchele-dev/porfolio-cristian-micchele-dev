import type { KnowledgeEntry } from './types'

/** Debajo de esto se considera que no hubo match y se responde el fallback. */
const SCORE_THRESHOLD = 1

/** Longitud mínima para aplicar prefijo laxo (plurales). */
const STEM_MIN_LENGTH = 5

/**
 * Normaliza una pregunta para comparar.
 *
 * Saca tildes y puntuación pero preserva `.`, `+` y `#`, que son parte del
 * nombre de tecnologías reales: node.js, next.js, c++, c#.
 */
export function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.+#\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenMatches(token: string, keyword: string): boolean {
  if (token === keyword) return true
  // Tolera plurales y derivados sólo en keywords largas: con keywords cortas
  // el prefijo laxo produce falsos positivos ("api" dentro de "apikey").
  return keyword.length >= STEM_MIN_LENGTH && token.startsWith(keyword)
}

/**
 * Puntaje de una entrada frente a una pregunta.
 *
 * Una frase vale el doble de sus palabras: "arquitectura hexagonal" es mucho
 * más específico que "arquitectura" suelta, y debe ganarle.
 */
export function scoreEntry(question: string, entry: KnowledgeEntry): number {
  const normalized = normalize(question)
  if (!normalized) return 0

  const tokens = normalized.split(' ')
  const padded = ` ${normalized} `
  let score = 0

  for (const rawKeyword of entry.keywords) {
    const keyword = normalize(rawKeyword)
    if (!keyword) continue

    const words = keyword.split(' ')

    if (words.length > 1) {
      if (padded.includes(` ${keyword} `)) score += words.length * 2
    } else if (tokens.some((token) => tokenMatches(token, keyword))) {
      score += 1
    }
  }

  return score
}

/**
 * La entrada de mayor puntaje, o null si ninguna supera el umbral.
 * Ante empate gana la primera declarada: el orden del array es la prioridad.
 */
export function matchEntry(
  question: string,
  entries: readonly KnowledgeEntry[],
): KnowledgeEntry | null {
  let best: KnowledgeEntry | null = null
  let bestScore = 0

  for (const entry of entries) {
    const score = scoreEntry(question, entry)
    if (score > bestScore) {
      best = entry
      bestScore = score
    }
  }

  return bestScore >= SCORE_THRESHOLD ? best : null
}
