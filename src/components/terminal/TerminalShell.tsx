'use client'

import { useEffect, useRef } from 'react'
import { Panel } from '@/components/primitives/Panel'
import { suggestedCommands } from '@/lib/terminal/registry'
import { useTerminal } from '@/hooks/useTerminal'
import { cn } from '@/lib/cn'
import { Caret } from './Caret'
import { TerminalLineView } from './TerminalLineView'

interface TerminalShellProps {
  /** Comando inicial para que la consola nunca arranque vacía. */
  seedCommand?: string
  /** Placeholder del input. */
  prompt?: string
  className?: string
}

/**
 * El widget de terminal. DESIGN.md §1 — es UN elemento del dashboard, no el
 * contenedor de la página.
 *
 * Un solo motor sirve al hero (modo comandos) y a la sección AI (modo
 * conversacional, Fase 5): misma shell, distinto registry. Dos terminales
 * duplicadas se leerían como relleno.
 */
export function TerminalShell({
  seedCommand = 'whoami',
  prompt = 'ask cristian…',
  className,
}: TerminalShellProps) {
  const { lines, input, setInput, onKeyDown, typeAndRun, isTyping, inputRef } = useTerminal({
    seedCommand,
  })

  const outputRef = useRef<HTMLDivElement>(null)

  // Autoscroll al final del output. `scrollTop` directo y no scrollIntoView:
  // scrollIntoView acá arrastraría la página entera, no solo el contenedor.
  useEffect(() => {
    const el = outputRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <div className={className}>
      <Panel
        label="cristian@dev:~"
        headerRight={
          <span className="hidden font-mono text-[11px] text-fg-faint sm:inline">
            tab · ↑↓ · ctrl+l
          </span>
        }
      >
        {/* Click en cualquier parte enfoca el input, como cualquier terminal real */}
        <div
          className="cursor-text"
          onClick={() => inputRef.current?.focus()}
          role="presentation"
        >
          <div
            ref={outputRef}
            className="h-[clamp(190px,26vh,260px)] overflow-y-auto px-4 py-3 font-mono text-sm"
          >
            <ol
              aria-label="Salida de la consola"
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Consola: escribí un comando y presioná Enter"
                placeholder={lines.length > 0 ? prompt : ''}
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
                <Caret />
              </span>
            </span>
          </div>
        </div>
      </Panel>

      <ul className="mt-3 flex flex-wrap gap-2">
        {suggestedCommands.map((command) => (
          <li key={command.name}>
            <button
              type="button"
              onClick={() => typeAndRun(command.name)}
              disabled={isTyping}
              title={command.description}
              className={cn(
                'rounded-[4px] border border-line bg-surface px-2.5 py-1.5 font-mono text-[13px] text-fg-muted',
                'transition-colors duration-150',
                'hover:border-line-hi hover:text-fg',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
            >
              /{command.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
