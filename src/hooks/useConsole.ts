'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import { completeCommand, executeCommand, resolveCommand } from '@/lib/terminal/registry'
import { HttpAgent } from '@/lib/agent/HttpAgent'
import { blank, strong, text } from '@/lib/terminal/lines'
import type { AgentPort } from '@/lib/agent/types'
import type { TerminalLine } from '@/lib/terminal/types'

export interface ConsoleLine extends TerminalLine {
  id: number
}

/** Cota de líneas en memoria: una sesión larga no debería crecer sin techo. */
const MAX_LINES = 200

/** Velocidad del tipeo automático de los chips, en ms por carácter. */
const TYPE_SPEED = 26

/**
 * La consola del sitio. Una sola, con dos formas de hablarle.
 *
 * Antes había dos widgets idénticos —uno de comandos en el hero y otro
 * conversacional en una sección aparte— que compartían el motor pero se veían
 * iguales. El visitante no ve el código: veía dos terminales y las leía como
 * repetición.
 *
 * Ahora: si lo que escribís resuelve a un comando, se ejecuta al instante y
 * de forma determinista. Si no, se manda al agente. Lo predecible sigue
 * siendo predecible, y lo abierto sigue estando.
 */
function seedLines(seedCommand: string | undefined): ConsoleLine[] {
  const intro: TerminalLine[] = [
    blank(),
    text('Escribí un comando, o preguntá en lenguaje natural.'),
    text('Probá: "¿qué es Pulso?" · /help para ver los comandos.'),
  ]

  if (!seedCommand) return intro.map((line, id) => ({ ...line, id }))

  const result = executeCommand(seedCommand)
  const output = result.type === 'clear' ? [] : result.lines

  return [{ kind: 'command' as const, text: seedCommand }, ...output, ...intro].map(
    (line, id) => ({ ...line, id }),
  )
}

export interface UseConsoleOptions {
  seedCommand?: string
  /** Inyectable para testear sin red. En producción, `HttpAgent`. */
  port?: AgentPort
}

export function useConsole({ seedCommand = 'whoami', port }: UseConsoleOptions = {}) {
  const reduce = useReducedMotion()
  const agent = useMemo(() => port ?? new HttpAgent(), [port])

  const [lines, setLines] = useState<ConsoleLine[]>(() => seedLines(seedCommand))
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const nextId = useRef(lines.length)
  const history = useRef<string[]>([])
  const historyIndex = useRef<number | null>(null)
  const typingTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const append = useCallback((incoming: TerminalLine[]) => {
    if (incoming.length === 0) return
    setLines((prev) => {
      const next = [...prev, ...incoming.map((l) => ({ ...l, id: nextId.current++ }))]
      return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next
    })
  }, [])

  const goToSection = useCallback(
    (sectionId: string) => {
      // Deja respirar al render antes de mover el scroll: si scrolleamos en el
      // mismo frame, la salida aparece ya fuera de vista.
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'start',
        })
      }, 450)
    },
    [reduce],
  )

  /**
   * Ejecuta lo que se escribió.
   * Los comandos tienen prioridad y son sincrónicos; el resto es una pregunta.
   */
  const run = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim()
      if (!trimmed || busy) return

      history.current.push(trimmed)
      historyIndex.current = null
      setInput('')
      append([{ kind: 'command', text: trimmed }])

      if (resolveCommand(trimmed)) {
        const result = executeCommand(trimmed)
        if (result.type === 'clear') {
          setLines([])
          return
        }
        append(result.lines)
        if (result.type === 'navigate') goToSection(result.sectionId)
        return
      }

      setBusy(true)
      append([text('pensando…')])

      const answer = await agent.ask(trimmed)

      setLines((prev) => {
        const withoutPending = prev.slice(0, -1)
        const resolved = answer.lines.map((l) => ({ ...l, id: nextId.current++ }))
        const next = [...withoutPending, ...resolved]
        return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next
      })
      setBusy(false)

      if (answer.sectionId) goToSection(answer.sectionId)
    },
    [agent, append, busy, goToSection],
  )

  const stopTyping = useCallback(() => {
    if (typingTimer.current) {
      clearInterval(typingTimer.current)
      typingTimer.current = null
    }
  }, [])

  /**
   * Tipea el texto del chip y lo ejecuta.
   * Es el detalle que hace que la consola se sienta viva cuando el visitante
   * toca en lugar de escribir. Con reduced-motion se ejecuta directo.
   */
  const typeAndRun = useCallback(
    (value: string) => {
      stopTyping()
      inputRef.current?.focus()

      if (reduce) {
        setInput('')
        void run(value)
        return
      }

      let i = 0
      typingTimer.current = setInterval(() => {
        i += 1
        setInput(value.slice(0, i))
        if (i >= value.length) {
          stopTyping()
          window.setTimeout(() => {
            setInput('')
            void run(value)
          }, 180)
        }
      }, TYPE_SPEED)
    },
    [reduce, run, stopTyping],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        void run(input)
        return
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        setInput((current) => completeCommand(current))
        return
      }

      if (event.key === 'l' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        setLines([])
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const entries = history.current
        if (entries.length === 0) return
        const index =
          historyIndex.current === null ? entries.length - 1 : Math.max(0, historyIndex.current - 1)
        historyIndex.current = index
        setInput(entries[index] ?? '')
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (historyIndex.current === null) return
        const index = historyIndex.current + 1
        if (index >= history.current.length) {
          historyIndex.current = null
          setInput('')
          return
        }
        historyIndex.current = index
        setInput(history.current[index] ?? '')
      }
    },
    [input, run],
  )

  useEffect(() => stopTyping, [stopTyping])

  return { lines, input, setInput, run, typeAndRun, onKeyDown, busy, inputRef }
}

/** Lo que el agente devuelve mientras resuelve, para poder afirmarlo en tests. */
export const PENDING_LABEL = 'pensando…'

export { strong }
