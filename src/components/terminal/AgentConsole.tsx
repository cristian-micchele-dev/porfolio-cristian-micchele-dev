'use client'

import { useAgent } from '@/hooks/useAgent'
import { suggestedPrompts } from '@/data/knowledge'
import type { AgentPort } from '@/lib/agent/types'
import { TerminalShell } from './TerminalShell'

interface AgentConsoleProps {
  /** Inyectable para testear sin red. En producción usa HttpAgent. */
  port?: AgentPort
  className?: string
}

/**
 * Contenedor del modo conversacional.
 *
 * Misma shell que el hero, otra lógica: acá no hay comandos, hay preguntas en
 * lenguaje natural resueltas a través del `AgentPort`.
 */
export function AgentConsole({ port, className }: AgentConsoleProps) {
  const { lines, input, setInput, ask, onKeyDown, busy, inputRef } = useAgent(port)

  return (
    <TerminalShell
      className={className}
      label="ask cristian ai"
      hint={
        <span className="font-mono text-[11px] text-fg-faint">
          {busy ? 'procesando…' : 'enter · ↑↓'}
        </span>
      }
      lines={lines}
      input={input}
      onInputChange={setInput}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      outputLabel="Respuestas del agente"
      inputLabel="Preguntale algo sobre Cristian y presioná Enter"
      placeholder="Ask something about Cristian…"
      busy={busy}
      outputClassName="h-[clamp(240px,34vh,340px)]"
      suggestions={suggestedPrompts.map((entry) => ({
        id: entry.id,
        label: entry.prompt,
        onSelect: () => void ask(entry.prompt),
      }))}
    />
  )
}
