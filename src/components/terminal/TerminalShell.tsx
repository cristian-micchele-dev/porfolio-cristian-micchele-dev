'use client'

import { useEffect, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { Panel } from '@/components/primitives/Panel'
import { cn } from '@/lib/cn'
import { Caret } from './Caret'
import { TerminalLineView } from './TerminalLineView'
import type { ConsoleLine } from '@/hooks/useConsole'

export interface Suggestion {
  id: string
  label: string
  title?: string
  onSelect: () => void
}

interface TerminalShellProps {
  /** Label del header del panel. */
  label: string
  /** Pista a la derecha del header (atajos, estado). */
  hint?: ReactNode
  lines: ConsoleLine[]
  input: string
  onInputChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  inputRef: RefObject<HTMLInputElement | null>
  /** Nombre accesible de la región de salida. */
  outputLabel: string
  /** Etiqueta accesible del input. */
  inputLabel: string
  placeholder?: string
  /** Bloquea el input mientras se resuelve algo. */
  busy?: boolean
  suggestions?: readonly Suggestion[]
  /** Clase de alto del área de salida. */
  outputClassName?: string
  className?: string
}

/**
 * La shell de terminal: SOLO presentación.
 *
 * No sabe qué es un comando ni qué es una pregunta: eso lo decide `Console`,
 * el único contenedor que la usa.
 *
 * Mantenerla tonta es lo que permitió fusionar las dos consolas que había
 * —una de comandos en el hero y otra conversacional en su propia sección—
 * sin tocar una línea de chrome.
 */
export function TerminalShell({
  label,
  hint,
  lines,
  input,
  onInputChange,
  onKeyDown,
  inputRef,
  outputLabel,
  inputLabel,
  placeholder,
  busy = false,
  suggestions,
  outputClassName = 'h-[clamp(190px,26vh,260px)]',
  className,
}: TerminalShellProps) {
  const outputRef = useRef<HTMLDivElement>(null)

  // Autoscroll al final. `scrollTop` directo y no scrollIntoView: éste último
  // arrastraría la página entera, no sólo el contenedor.
  useEffect(() => {
    const el = outputRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <div className={className}>
      <Panel label={label} headerRight={hint}>
        {/* Click en cualquier parte enfoca el input, como cualquier terminal */}
        <div className="cursor-text" onClick={() => inputRef.current?.focus()} role="presentation">
          <div
            ref={outputRef}
            className={cn('overflow-y-auto px-4 py-3 font-mono text-sm', outputClassName)}
          >
            <ol
              aria-label={outputLabel}
              aria-live="polite"
              aria-atomic="false"
              className="space-y-0.5"
            >
              {lines.map((line) => (
                <TerminalLineView key={line.id} line={line} />
              ))}
            </ol>
          </div>

          <div className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-sm">
            <span aria-hidden="true" className="select-none text-accent">
              &gt;
            </span>

            <span className="relative flex min-w-0 flex-1 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label={inputLabel}
                placeholder={placeholder}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                className="w-full bg-transparent text-fg caret-transparent outline-none placeholder:text-fg-faint"
              />
              {/* Caret propio: el nativo no se puede estilar como bloque */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 flex items-center whitespace-pre font-mono text-transparent"
              >
                {input}
                {!busy && <Caret />}
              </span>
            </span>
          </div>
        </div>
      </Panel>

      {suggestions && suggestions.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onClick={suggestion.onSelect}
                disabled={busy}
                title={suggestion.title}
                className={cn(
                  'rounded-[4px] border border-line bg-surface px-2.5 py-1.5 text-left font-mono text-[13px] text-fg-muted',
                  'transition-colors duration-150',
                  'hover:border-line-hi hover:text-fg',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
