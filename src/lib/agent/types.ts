import type { TerminalLine } from '@/lib/terminal/types'
import type { SectionId } from '@/types/content'

export interface AgentAnswer {
  /** La respuesta, en el mismo formato de línea que usa la terminal. */
  lines: TerminalLine[]
  /** Si está, la consola ofrece saltar a esa sección. */
  sectionId?: SectionId
  /** `low` significa que no se encontró una entrada: es el fallback. */
  confidence: 'high' | 'low'
  /** Qué adaptador respondió. Se muestra en la UI: nada de magia opaca. */
  source: 'local' | 'remote'
  /** Id de la entrada que respondió, cuando hubo match. Útil para debug. */
  matchedId?: string
}

/**
 * El puerto.
 *
 * La UI depende SOLO de esta interface, nunca de una implementación. Hoy la
 * cumple `LocalAgent` con una base de conocimiento; el día que haya una API de
 * IA real se escribe otro adaptador y la UI no cambia una línea.
 *
 * Esto no es ceremonia: es la misma arquitectura hexagonal que la sección
 * Architecture declara. El portfolio se sostiene a sí mismo.
 */
export interface AgentPort {
  readonly name: string
  ask(question: string): Promise<AgentAnswer>
}

export interface KnowledgeEntry {
  id: string
  /** Pregunta canónica. La primera de cada entrada destacada se muestra como chip. */
  prompt: string
  /** Si se ofrece como sugerencia en la consola. */
  suggested?: boolean
  /**
   * Palabras y frases que disparan la entrada. Deliberadamente bilingües:
   * el contenido está en español pero un reclutador puede preguntar en inglés.
   */
  keywords: readonly string[]
  /** Se resuelve en el momento, leyendo de `src/data`. */
  answer: () => TerminalLine[]
  sectionId?: SectionId
}
