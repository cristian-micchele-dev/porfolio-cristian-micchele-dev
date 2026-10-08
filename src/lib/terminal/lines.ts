import type { TerminalLine } from './types'

/**
 * Constructores de línea.
 *
 * Los usan el registry de comandos y la base de conocimiento del agente: las
 * dos consolas renderizan con el mismo vocabulario visual y no hay forma de
 * que una derive respecto de la otra.
 */

export const text = (value: string, tone: TerminalLine['tone'] = 'muted'): TerminalLine => ({
  kind: 'text',
  text: value,
  tone,
})

export const strong = (value: string): TerminalLine => ({ kind: 'text', text: value, tone: 'fg' })

export const pair = (label: string, value: string): TerminalLine => ({
  kind: 'pair',
  text: label,
  value,
})

export const group = (label: string): TerminalLine => ({
  kind: 'group',
  text: label,
  tone: 'accent',
})

export const link = (label: string, href: string): TerminalLine => ({
  kind: 'text',
  text: label,
  href,
  tone: 'accent',
})

export const blank = (): TerminalLine => ({ kind: 'blank', text: '' })

export const error = (value: string): TerminalLine => ({
  kind: 'error',
  text: value,
  tone: 'err',
})
