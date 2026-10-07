'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { completeCommand, executeCommand } from '@/lib/terminal/registry'
import type { TerminalLine } from '@/lib/terminal/types'

export interface HistoryLine extends TerminalLine {
  id: number
}

/** Cota de líneas en memoria: una sesión larga no debería crecer sin techo. */
const MAX_LINES = 200

/** Velocidad del tipeo automático de los chips, en ms por carácter. */
const TYPE_SPEED = 26

export interface UseTerminalOptions {
  /** Comando que se ejecuta al montar, para que la consola nunca arranque vacía. */
  seedCommand?: string
}

/**
 * Resuelve la semilla de forma sincrónica.
 *
 * Corre en el servidor porque el registry es lógica pura: así el HTML ya llega
 * con la salida de `whoami` dentro. Si sembráramos en un efecto, la terminal
 * —que es la protagonista del hero— aparecería vacía hasta la hidratación.
 */
function seedLines(seedCommand: string | undefined): HistoryLine[] {
  if (!seedCommand) return []

  const result = executeCommand(seedCommand)
  if (result.type === 'clear') return []

  return [{ kind: 'command' as const, text: seedCommand }, ...result.lines].map((line, id) => ({
    ...line,
    id,
  }))
}

export function useTerminal({ seedCommand }: UseTerminalOptions = {}) {
  const reduce = useReducedMotion()
  const [lines, setLines] = useState<HistoryLine[]>(() => seedLines(seedCommand))
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const nextId = useRef(lines.length)
  const commandHistory = useRef<string[]>([])
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

  const scrollToSection = useCallback(
    (sectionId: string) => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      })
    },
    [reduce],
  )

  /** Ejecuta un comando crudo y appendea el eco + la salida. */
  const run = useCallback(
    (raw: string, { echo = true }: { echo?: boolean } = {}) => {
      const result = executeCommand(raw)

      if (result.type === 'clear') {
        setLines([])
        return
      }

      append([
        ...(echo ? [{ kind: 'command' as const, text: raw.trim() }] : []),
        ...result.lines,
      ])

      if (result.type === 'navigate') {
        // Deja respirar al render antes de mover el scroll: si scrolleamos en el
        // mismo frame, la salida aparece ya fuera de vista y se pierde el efecto.
        window.setTimeout(() => scrollToSection(result.sectionId), 420)
      }
    },
    [append, scrollToSection],
  )

  const stopTyping = useCallback(() => {
    if (typingTimer.current) {
      clearInterval(typingTimer.current)
      typingTimer.current = null
    }
    setIsTyping(false)
  }, [])

  /**
   * Tipea el comando carácter por carácter y lo ejecuta.
   * Es el detalle que hace que la terminal se sienta viva cuando el visitante
   * toca un chip en lugar de escribir. Con reduced-motion se ejecuta directo.
   */
  const typeAndRun = useCallback(
    (command: string) => {
      stopTyping()
      inputRef.current?.focus()

      if (reduce) {
        setInput('')
        run(command)
        return
      }

      setIsTyping(true)
      let i = 0
      typingTimer.current = setInterval(() => {
        i += 1
        setInput(command.slice(0, i))
        if (i >= command.length) {
          stopTyping()
          // Pausa breve para que se lea el comando completo antes de la salida.
          window.setTimeout(() => {
            setInput('')
            run(command)
          }, 180)
        }
      }, TYPE_SPEED)
    },
    [reduce, run, stopTyping],
  )

  const submit = useCallback(() => {
    const raw = input
    setInput('')
    historyIndex.current = null

    const trimmed = raw.trim()
    if (trimmed) commandHistory.current.push(trimmed)

    run(raw || ' ', { echo: true })
  }, [input, run])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (isTyping) {
        event.preventDefault()
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        submit()
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
        const history = commandHistory.current
        if (history.length === 0) return
        const index = historyIndex.current === null ? history.length - 1 : Math.max(0, historyIndex.current - 1)
        historyIndex.current = index
        setInput(history[index] ?? '')
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const history = commandHistory.current
        if (historyIndex.current === null) return
        const index = historyIndex.current + 1
        if (index >= history.length) {
          historyIndex.current = null
          setInput('')
          return
        }
        historyIndex.current = index
        setInput(history[index] ?? '')
      }
    },
    [isTyping, submit],
  )

  useEffect(() => stopTyping, [stopTyping])

  return {
    lines,
    input,
    setInput,
    submit,
    onKeyDown,
    typeAndRun,
    isTyping,
    inputRef,
    clear: () => setLines([]),
  }
}
