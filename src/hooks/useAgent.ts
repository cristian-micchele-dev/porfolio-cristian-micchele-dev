'use client'

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import { HttpAgent } from '@/lib/agent/HttpAgent'
import { blank, strong, text } from '@/lib/terminal/lines'
import type { AgentPort } from '@/lib/agent/types'
import type { TerminalLine } from '@/lib/terminal/types'
import type { HistoryLine } from './useTerminal'

const MAX_LINES = 200

/** El saludo inicial: la consola nunca arranca vacía. */
function greeting(): HistoryLine[] {
  const lines: TerminalLine[] = [
    strong('Agente listo.'),
    text('Preguntá en lenguaje natural, en español o en inglés.'),
    blank(),
    text('Respondo desde una base de conocimiento local — sin modelo, sin'),
    text('alucinaciones. Las respuestas salen de los mismos datos que las secciones.'),
  ]
  return lines.map((line, id) => ({ ...line, id }))
}

export function useAgent(port?: AgentPort) {
  const reduce = useReducedMotion()
  const agent = useMemo(() => port ?? new HttpAgent(), [port])

  const [lines, setLines] = useState<HistoryLine[]>(() => greeting())
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const nextId = useRef(lines.length)
  const history = useRef<string[]>([])
  const historyIndex = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const append = useCallback((incoming: TerminalLine[]) => {
    if (incoming.length === 0) return
    setLines((prev) => {
      const next = [...prev, ...incoming.map((l) => ({ ...l, id: nextId.current++ }))]
      return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next
    })
  }, [])

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim()
      if (!trimmed || busy) return

      history.current.push(trimmed)
      historyIndex.current = null
      setInput('')
      setBusy(true)

      append([
        { kind: 'command', text: trimmed },
        { kind: 'text', text: 'pensando…', tone: 'muted' },
      ])

      const answer = await agent.ask(trimmed)

      // Reemplaza la línea de "pensando…" por la respuesta.
      setLines((prev) => {
        const withoutPending = prev.slice(0, -1)
        const resolved = answer.lines.map((l) => ({ ...l, id: nextId.current++ }))
        const next = [...withoutPending, ...resolved]
        return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next
      })

      setBusy(false)

      if (answer.sectionId) {
        const sectionId = answer.sectionId
        window.setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({
            behavior: reduce ? 'auto' : 'smooth',
            block: 'start',
          })
        }, 600)
      }
    },
    [agent, append, busy, reduce],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        void ask(input)
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
          historyIndex.current === null
            ? entries.length - 1
            : Math.max(0, historyIndex.current - 1)
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
    [ask, input],
  )

  return { lines, input, setInput, ask, onKeyDown, busy, inputRef, adapter: agent.name }
}
