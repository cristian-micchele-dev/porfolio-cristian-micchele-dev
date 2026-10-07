'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ResponseBlockProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  status: number
  statusText: string
  /** Pares que se renderizan como cuerpo JSON. Valores ya formateados. */
  body: Record<string, string | number>
  className?: string
}

const STATUS_TONE = (status: number) =>
  status >= 500
    ? 'text-err'
    : status >= 400
      ? 'text-warn'
      : status >= 200 && status < 300
        ? 'text-ok'
        : 'text-fg-muted'

/**
 * El bloque de respuesta de API que precede al contenido real de cada sección.
 * Entra 180ms antes que las cards (DESIGN.md §6) para que se lea como una
 * secuencia request → response → render, no como dos cosas sueltas.
 */
export function ResponseBlock({
  method,
  path,
  status,
  statusText,
  body,
  className,
}: ResponseBlockProps) {
  const reduce = useReducedMotion()
  const entries = Object.entries(body)

  return (
    <motion.div
      className={cn(
        'rounded-panel border border-line bg-surface font-mono text-sm',
        className,
      )}
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reduce ? 0.18 : 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="label-mono text-accent">{method}</span>
        <span className="text-fg-muted">{path}</span>
        <span className={cn('ml-auto tabular-nums', STATUS_TONE(status))}>
          {status} {statusText}
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-3 text-fg-muted">
        <code>
          {'{\n'}
          {entries.map(([key, value], i) => (
            <span key={key}>
              {'  '}
              <span className="text-fg">&quot;{key}&quot;</span>
              {': '}
              <span className={typeof value === 'number' ? 'text-accent' : 'text-ok'}>
                {typeof value === 'number' ? value : `"${value}"`}
              </span>
              {i < entries.length - 1 ? ',' : ''}
              {'\n'}
            </span>
          ))}
          {'}'}
        </code>
      </pre>
    </motion.div>
  )
}
