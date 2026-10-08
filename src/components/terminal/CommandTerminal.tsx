'use client'

import { useTerminal } from '@/hooks/useTerminal'
import { suggestedCommands } from '@/lib/terminal/registry'
import { TerminalShell } from './TerminalShell'

interface CommandTerminalProps {
  /** Comando inicial, para que la consola nunca arranque vacía. */
  seedCommand?: string
  className?: string
}

/**
 * Contenedor del modo comandos: el que vive en el hero.
 *
 * Toda la lógica está en `useTerminal` + el registry; acá sólo se conecta con
 * la shell presentacional.
 */
export function CommandTerminal({ seedCommand = 'whoami', className }: CommandTerminalProps) {
  const { lines, input, setInput, onKeyDown, typeAndRun, isTyping, inputRef } = useTerminal({
    seedCommand,
  })

  return (
    <TerminalShell
      className={className}
      label="cristian@dev:~"
      hint={
        <span className="hidden font-mono text-[11px] text-fg-faint sm:inline">
          tab · ↑↓ · ctrl+l
        </span>
      }
      lines={lines}
      input={input}
      onInputChange={setInput}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      outputLabel="Salida de la consola"
      inputLabel="Consola: escribí un comando y presioná Enter"
      placeholder={lines.length > 0 ? 'ask cristian…' : ''}
      busy={isTyping}
      suggestions={suggestedCommands.map((command) => ({
        id: command.name,
        label: `/${command.name}`,
        title: command.description,
        onSelect: () => typeAndRun(command.name),
      }))}
    />
  )
}
