import type { SectionId } from '@/types/content'

export type LineTone = 'fg' | 'muted' | 'accent' | 'ok' | 'warn' | 'err'

/**
 * Una línea de salida de la terminal.
 *
 * Deliberadamente SIN id: los ids los asigna el hook al appendear. Así el
 * registry queda puro y sus tests no dependen de un generador de ids.
 */
export interface TerminalLine {
  kind: 'command' | 'text' | 'pair' | 'group' | 'error' | 'blank'
  text: string
  /** Solo para `pair`: el valor a la derecha del label. */
  value?: string
  tone?: LineTone
  /** Si está, la línea se renderiza como link externo. */
  href?: string
}

export type CommandResult =
  | { type: 'output'; lines: TerminalLine[] }
  | { type: 'clear' }
  /** Imprime y además scrollea a la sección: ata la terminal a la página. */
  | { type: 'navigate'; sectionId: SectionId; lines: TerminalLine[] }

export interface Command {
  name: string
  aliases?: readonly string[]
  /** Se muestra en `help` y en los chips sugeridos. */
  description: string
  /** Los chips sugeridos debajo del input. */
  suggested?: boolean
  run: () => CommandResult
}
