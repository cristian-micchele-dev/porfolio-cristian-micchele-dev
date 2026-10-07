import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TerminalShell } from './TerminalShell'
import { profile } from '@/data/profile'
import { suggestedCommands } from '@/lib/terminal/registry'

const getInput = () => screen.getByRole('textbox', { name: /consola/i })
const getOutput = () => screen.getByRole('list', { name: /salida de la consola/i })

describe('TerminalShell', () => {
  it('arranca con la semilla ejecutada: nunca se ve vacía', () => {
    render(<TerminalShell seedCommand="whoami" />)
    expect(screen.getByText(profile.name)).toBeInTheDocument()
    expect(screen.getByText(profile.specialization)).toBeInTheDocument()
  })

  it('usa un input real, no un div contenteditable (DESIGN.md §7)', () => {
    render(<TerminalShell />)
    expect(getInput().tagName).toBe('INPUT')
  })

  it('anuncia la salida en una región aria-live con nombre accesible', () => {
    render(<TerminalShell />)
    expect(getOutput()).toHaveAttribute('aria-live', 'polite')
  })

  it('ejecuta un comando escrito y hace eco del mismo', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)

    await user.type(getInput(), 'status{Enter}')

    expect(screen.getByText('status')).toBeInTheDocument()
    expect(screen.getByText(profile.location)).toBeInTheDocument()
  })

  it('acepta la forma con slash además de la unix', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)

    await user.type(getInput(), '/status{Enter}')

    expect(screen.getByText(profile.location)).toBeInTheDocument()
  })

  it('limpia el input después de ejecutar', async () => {
    const user = userEvent.setup()
    render(<TerminalShell />)

    await user.type(getInput(), 'status{Enter}')

    expect(getInput()).toHaveValue('')
  })

  it('informa un comando desconocido sin romperse', async () => {
    const user = userEvent.setup()
    render(<TerminalShell />)

    await user.type(getInput(), 'rm -rf /{Enter}')

    expect(screen.getByText(/command not found/i)).toBeInTheDocument()
    expect(screen.getByText(/help/i)).toBeInTheDocument()
  })

  it('Enter en vacío no agrega una línea de error', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)

    await user.type(getInput(), '{Enter}')

    expect(screen.queryByText(/command not found/i)).not.toBeInTheDocument()
  })

  it('autocompleta con Tab', async () => {
    const user = userEvent.setup()
    render(<TerminalShell />)

    await user.type(getInput(), 'who')
    await user.tab()

    expect(getInput()).toHaveValue('whoami')
  })

  it('recupera el último comando con flecha arriba', async () => {
    const user = userEvent.setup()
    render(<TerminalShell />)

    await user.type(getInput(), 'status{Enter}')
    await user.type(getInput(), '{ArrowUp}')

    expect(getInput()).toHaveValue('status')
  })

  it('Ctrl+L limpia la consola cuando el input tiene foco', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)
    expect(screen.getByText(profile.name)).toBeInTheDocument()

    // El atajo está acotado al input a propósito: capturarlo a nivel documento
    // le robaría Ctrl+L al navegador en toda la página.
    await user.click(getInput())
    await user.keyboard('{Control>}l{/Control}')

    expect(screen.queryByText(profile.name)).not.toBeInTheDocument()
  })

  it('expone un chip por comando sugerido', () => {
    render(<TerminalShell />)
    const chips = screen.getAllByRole('button')
    expect(chips).toHaveLength(suggestedCommands.length)
    for (const command of suggestedCommands) {
      expect(screen.getByRole('button', { name: `/${command.name}` })).toBeInTheDocument()
    }
  })

  it('el chip ejecuta su comando', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)

    await user.click(screen.getByRole('button', { name: '/status' }))

    // El tipeo es animado: esperamos a que la salida aparezca.
    expect(await screen.findByText(profile.location, undefined, { timeout: 3000 })).toBeInTheDocument()
  })

  it('un click en el cuerpo enfoca el input, como cualquier terminal', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)

    await user.click(screen.getByText(profile.name))

    expect(getInput()).toHaveFocus()
  })

  it('los links de contacto apuntan a los canales reales', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)

    await user.type(getInput(), 'contact{Enter}')

    const links = within(getOutput()).getAllByRole('link')
    const hrefs = links.map((a) => a.getAttribute('href'))

    expect(hrefs).toContain(profile.github)
    expect(hrefs).toContain(profile.linkedin)
    expect(hrefs).toContain(`mailto:${profile.email}`)
  })

  it('los links externos se abren en pestaña nueva con rel seguro', async () => {
    const user = userEvent.setup()
    render(<TerminalShell seedCommand="whoami" />)

    await user.type(getInput(), 'source{Enter}')

    const link = screen.getByRole('link', { name: /github\.com/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})
