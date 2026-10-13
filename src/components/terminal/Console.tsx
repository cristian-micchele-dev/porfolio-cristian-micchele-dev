'use client'

import { useConsole } from '@/hooks/useConsole'
import { suggestedCommands } from '@/lib/terminal/registry'
import { suggestedPrompts } from '@/data/knowledge'
import type { AgentPort } from '@/lib/agent/types'
import { TerminalShell } from './TerminalShell'

interface ConsoleProps {
  /** Inyectable para testear sin red. */
  port?: AgentPort
  className?: string
}

/**
 * La consola del sitio. Una sola.
 *
 * Antes eran dos widgets idénticos: comandos en el hero, preguntas en una
 * sección aparte. Compartían el motor, pero el visitante no ve el código —
 * veía dos terminales iguales y las leía como repetición.
 *
 * Los chips mezclan ambos modos a propósito: los `/comandos` muestran que hay
 * acciones deterministas, y una pregunta de ejemplo muestra que también
 * entiende lenguaje natural. Sin eso, nadie descubriría la segunda mitad.
 */
export function Console({ port, className }: ConsoleProps) {
  const { lines, input, setInput, typeAndRun, onKeyDown, busy, inputRef } = useConsole({ port })

  const suggestions = [
    ...suggestedCommands.map((command) => ({
      id: command.name,
      label: `/${command.name}`,
      title: command.description,
      onSelect: () => typeAndRun(command.name),
    })),
    // Una sola pregunta de ejemplo: alcanza para revelar el modo y no satura
    // la fila de chips.
    ...suggestedPrompts.slice(0, 1).map((entry) => ({
      id: entry.id,
      label: entry.prompt,
      title: 'preguntá en lenguaje natural',
      onSelect: () => typeAndRun(entry.prompt),
    })),
  ]

  return (
    <TerminalShell
      className={className}
      label="cristian@dev:~"
      hint={
        <span className="hidden font-mono text-[11px] text-fg-faint sm:inline">
          {busy ? 'procesando…' : 'tab · ↑↓ · ctrl+l'}
        </span>
      }
      lines={lines}
      input={input}
      onInputChange={setInput}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      outputLabel="Salida de la consola"
      inputLabel="Consola: escribí un comando o preguntá algo, y presioná Enter"
      placeholder="preguntá o escribí un comando…"
      busy={busy}
      outputClassName="h-[clamp(220px,30vh,300px)]"
      suggestions={suggestions}
    />
  )
}
