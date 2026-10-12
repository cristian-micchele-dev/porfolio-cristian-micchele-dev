import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgentConsole } from './AgentConsole'
import { LocalAgent } from '@/lib/agent/LocalAgent'
import { suggestedPrompts } from '@/data/knowledge'
import { profile } from '@/data/profile'
import type { AgentPort } from '@/lib/agent/types'

/**
 * Se inyecta `LocalAgent` en lugar de `HttpAgent`: el puerto existe
 * precisamente para poder testear la UI sin red. Si hiciera falta mockear
 * `fetch` para probar la consola, el puerto estaría mal diseñado.
 */
const localPort = new LocalAgent()

const getInput = () => screen.getByRole('textbox', { name: /preguntale/i })
const getOutput = () => screen.getByRole('list', { name: /respuestas del agente/i })

describe('AgentConsole', () => {
  it('arranca con un saludo: nunca se ve vacía', () => {
    render(<AgentConsole port={localPort} />)
    expect(screen.getByText(/agente listo/i)).toBeInTheDocument()
  })

  it('declara que no hay modelo detrás, en lugar de insinuar que sí', () => {
    render(<AgentConsole port={localPort} />)
    expect(screen.getByText(/base de conocimiento local/i)).toBeInTheDocument()
  })

  it('usa un input real con nombre accesible y región aria-live', () => {
    render(<AgentConsole port={localPort} />)
    expect(getInput().tagName).toBe('INPUT')
    expect(getOutput()).toHaveAttribute('aria-live', 'polite')
  })

  it('ofrece un chip por pregunta sugerida', () => {
    render(<AgentConsole port={localPort} />)
    for (const entry of suggestedPrompts) {
      expect(screen.getByRole('button', { name: entry.prompt })).toBeInTheDocument()
    }
  })

  it('responde una pregunta escrita y hace eco de la misma', async () => {
    const user = userEvent.setup()
    render(<AgentConsole port={localPort} />)

    await user.type(getInput(), '¿qué arquitectura usa?{Enter}')

    expect(await screen.findByText('¿qué arquitectura usa?')).toBeInTheDocument()
    expect(await screen.findByText(/dependencias apuntan hacia adentro/i)).toBeInTheDocument()
  })

  it('responde en inglés aunque el contenido esté en español', async () => {
    const user = userEvent.setup()
    render(<AgentConsole port={localPort} />)

    await user.type(getInput(), 'How can I contact him?{Enter}')

    const output = getOutput()
    expect(
      await within(output).findByRole('link', { name: profile.email }),
    ).toBeInTheDocument()
  })

  it('el chip dispara su pregunta', async () => {
    const user = userEvent.setup()
    const entry = suggestedPrompts[0]!
    render(<AgentConsole port={localPort} />)

    await user.click(screen.getByRole('button', { name: entry.prompt }))

    expect(await screen.findByText(entry.prompt, { selector: 'span' })).toBeInTheDocument()
  })

  it('limpia el input al enviar', async () => {
    const user = userEvent.setup()
    render(<AgentConsole port={localPort} />)

    await user.type(getInput(), 'hola{Enter}')

    expect(getInput()).toHaveValue('')
  })

  it('ignora el envío de una pregunta vacía', async () => {
    const user = userEvent.setup()
    const spy = { name: 'spy', ask: vi.fn(localPort.ask.bind(localPort)) } satisfies AgentPort
    render(<AgentConsole port={spy} />)

    await user.type(getInput(), '   {Enter}')

    expect(spy.ask).not.toHaveBeenCalled()
  })

  it('muestra un estado de espera mientras resuelve', async () => {
    const user = userEvent.setup()
    let release: () => void = () => {}
    const slow: AgentPort = {
      name: 'slow',
      ask: () =>
        new Promise((resolve) => {
          release = () => resolve({ lines: [{ kind: 'text', text: 'listo' }], confidence: 'high', source: 'local' })
        }),
    }

    render(<AgentConsole port={slow} />)
    await user.type(getInput(), 'algo{Enter}')

    expect(screen.getByText('pensando…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: suggestedPrompts[0]!.prompt })).toBeDisabled()

    release()
    expect(await screen.findByText('listo')).toBeInTheDocument()
    expect(screen.queryByText('pensando…')).not.toBeInTheDocument()
  })

  it('no acepta una segunda pregunta mientras hay una en curso', async () => {
    const user = userEvent.setup()
    const ask = vi.fn(
      () => new Promise<never>(() => {}),
    )
    render(<AgentConsole port={{ name: 'hang', ask } as unknown as AgentPort} />)

    await user.type(getInput(), 'una{Enter}')
    await user.type(getInput(), 'dos{Enter}')

    expect(ask).toHaveBeenCalledTimes(1)
  })

  it('recupera la última pregunta con flecha arriba', async () => {
    const user = userEvent.setup()
    render(<AgentConsole port={localPort} />)

    // Una pregunta sin match: "hola" ya tiene respuesta propia.
    await user.type(getInput(), 'zxcvbnm{Enter}')
    await screen.findByText(/no tengo una respuesta precisa/i)
    await user.type(getInput(), '{ArrowUp}')

    expect(getInput()).toHaveValue('zxcvbnm')
  })

  it('el fallback ofrece salidas en lugar de cortar la conversación', async () => {
    const user = userEvent.setup()
    render(<AgentConsole port={localPort} />)

    await user.type(getInput(), 'cuál es la capital de Francia{Enter}')

    expect(await screen.findByText(/no tengo una respuesta precisa/i)).toBeInTheDocument()
    const output = getOutput()
    for (const entry of suggestedPrompts) {
      expect(within(output).getByText(`· ${entry.prompt}`)).toBeInTheDocument()
    }
  })
})
