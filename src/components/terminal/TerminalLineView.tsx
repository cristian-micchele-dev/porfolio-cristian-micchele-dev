'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { ConsoleLine } from '@/hooks/useConsole'
import type { LineTone } from '@/lib/terminal/types'

const TONE: Record<LineTone, string> = {
  fg: 'text-fg',
  muted: 'text-fg-muted',
  accent: 'text-accent',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
}

interface TerminalLineViewProps {
  line: ConsoleLine
}

/**
 * Una línea de la consola.
 *
 * Las líneas entran con un fade corto y escalonado por el padre. No hay
 * typewriter por carácter en la salida: con 20 líneas se vuelve ilegible y
 * la prioridad es la legibilidad (DESIGN.md §1).
 */
export function TerminalLineView({ line }: TerminalLineViewProps) {
  const reduce = useReducedMotion()
  const tone = TONE[line.tone ?? 'muted']

  const content = (() => {
    switch (line.kind) {
      case 'blank':
        return <span className="block h-[0.9em]" />

      case 'command':
        return (
          <span className="flex gap-2">
            <span className="shrink-0 select-none text-accent">&gt;</span>
            <span className="text-fg">{line.text}</span>
          </span>
        )

      case 'group':
        return <span className="label-mono text-accent">{line.text}</span>

      case 'error':
        return <span className="text-err">{line.text}</span>

      case 'pair':
        return (
          <span className="flex items-baseline gap-2">
            <span className="shrink-0 text-fg">{line.text}</span>
            <span
              className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dashed border-line"
              aria-hidden="true"
            />
            <span className="shrink-0 text-fg-muted">{line.value}</span>
          </span>
        )

      default:
        return line.href ? (
          <a
            href={line.href}
            target={line.href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noreferrer"
            className="text-accent underline decoration-accent-dim underline-offset-4 transition-colors hover:decoration-accent"
          >
            {line.text}
          </a>
        ) : (
          <span className={cn('whitespace-pre-wrap', tone)}>{line.text}</span>
        )
    }
  })()

  return (
    <motion.li
      initial={{ opacity: 0, y: reduce ? 0 : 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="leading-relaxed"
    >
      {content}
    </motion.li>
  )
}
