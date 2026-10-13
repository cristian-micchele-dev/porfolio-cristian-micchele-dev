import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Console } from './Console'
import { LocalAgent } from '@/lib/agent/LocalAgent'
import { profile } from '@/data/profile'
import { suggestedCommands } from '@/lib/terminal/registry'
import { suggestedPrompts } from '@/data/knowledge'
import type { AgentPort } from '@/lib/agent/types'

/**
 * Se inyecta `LocalAgent` en lugar de `HttpAgent`: el puerto existe para poder
 * testear la UI sin red. Si hiciera falta mockear `fetch`, estaría mal hecho.
 */
const localPort = new LocalAgent()

const getInput = () => screen.getByRole('textbox', { name: /consola/i })
const getOutput = () => screen.getByRole('list', { name: /salida de la consola/i })

describe('Console — una sola, dos formas de hablarle', () => {
  it('arranca sembrada y explica los dos modos', () => {
    render(<Console port={localPort} />)
    // Nadie descubriría el modo conversacional si no se lo dice.
    expect(screen.getByText(profile.name)).toBeInTheDocument()
    expect(screen.getByText(/preguntá en lenguaje natural/i)).toBeInTheDocument()
  })

  it('un comando se ejecuta al instante y de forma determinista', async () => {
    const user = userEvent.setup()
    const spy = { name: 'spy', ask: vi.fn() } satisfies AgentPort
    render(<Console port={spy as unknown as AgentPort} />)

    await user.type(getInput(), 'status{Enter}')

    expect(screen.getByText(profile.location)).toBeInTheDocument()
    // Un comando NO debe pasar por el agente: lo predecible sigue predecible.
    expect(spy.ask).not.toHaveBeenCalled()
  })

  it('lo que no es un comando se manda al agente', async () => {
    const user = userEvent.setup()
    render(<Console port={localPort} />)

    await user.type(getInput(), '¿qué es Pulso?{Enter}')

    expect(await screen.findByText(/Pulso — Gestión Hospitalaria/)).toBeInTheDocument()
  })

  it('responde en inglés aunque el contenido esté en español', async () => {
    const user = userEvent.setup()
    render(<Console port={localPort} />)

    await user.type(getInput(), 'How can I contact him?{Enter}')

    expect(
      await within(getOutput()).findByRole('link', { name: profile.email }),
    ).toBeInTheDocument()
  })

  it('acepta la forma con slash y la unix', async () => {
    const user = userEvent.setup()
    render(<Console port={localPort} />)

    await user.type(getInput(), '/status{Enter}')

    expect(screen.getByText(profile.location)).toBeInTheDocument()
  })

  it('autocompleta comandos con Tab', async () => {
    const user = userEvent.setup()
    render(<Console port={localPort} />)

    await user.type(getInput(), 'who')
    await user.tab()

    expect(getInput()).toHaveValue('whoami')
  })

  it('recupera lo último escrito con flecha arriba', async () => {
    const user = userEvent.setup()
    render(<Console port={localPort} />)

    await user.type(getInput(), 'status{Enter}')
    await user.type(getInput(), '{ArrowUp}')

    expect(getInput()).toHaveValue('status')
  })

  it('Ctrl+L limpia', async () => {
    const user = userEvent.setup()
    render(<Console port={localPort} />)

    await user.click(getInput())
    await user.keyboard('{Control>}l{/Control}')

    expect(within(getOutput()).queryByText(profile.name)).not.toBeInTheDocument()
  })

  it('muestra un estado de espera mientras el agente resuelve', async () => {
    const user = userEvent.setup()
    let release: () => void = () => {}
    const slow: AgentPort = {
      name: 'slow',
      ask: () =>
        new Promise((resolve) => {
          release = () =>
            resolve({ lines: [{ kind: 'text', text: 'listo' }], confidence: 'high', source: 'local' })
        }),
    }

    render(<Console port={slow} />)
    await user.type(getInput(), 'algo que no es comando{Enter}')

    expect(screen.getByText('pensando…')).toBeInTheDocument()

    release()
    expect(await screen.findByText('listo')).toBeInTheDocument()
    expect(screen.queryByText('pensando…')).not.toBeInTheDocument()
  })
})

describe('Console — chips', () => {
  it('mezcla comandos y una pregunta, para revelar los dos modos', () => {
    render(<Console port={localPort} />)

    for (const command of suggestedCommands) {
      expect(screen.getByRole('button', { name: `/${command.name}` })).toBeInTheDocument()
    }
    // Una sola pregunta: alcanza para revelar el modo sin saturar la fila.
    expect(
      screen.getByRole('button', { name: suggestedPrompts[0]!.prompt }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(suggestedCommands.length + 1)
  })

  it('el chip de pregunta dispara el modo conversacional', async () => {
    const user = userEvent.setup()
    render(<Console port={localPort} />)

    await user.click(screen.getByRole('button', { name: suggestedPrompts[0]!.prompt }))

    expect(
      await screen.findByText(/proyectos publicados/i, undefined, { timeout: 4000 }),
    ).toBeInTheDocument()
  })
})
