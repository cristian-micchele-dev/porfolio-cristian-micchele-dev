import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CurlInvite } from './CurlInvite'
import { SITE_URL } from '@/lib/site'
import { stripProtocol } from '@/lib/format'

const EXPECTED = `curl ${stripProtocol(SITE_URL)}/api`

/** Se llama DESPUES de userEvent.setup(): esa funcion instala su propio stub. */
const stubClipboard = (writeText = vi.fn().mockResolvedValue(undefined)) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
  return writeText
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CurlInvite', () => {
  it('muestra el comando contra el dominio del sitio', () => {
    render(<CurlInvite />)
    expect(screen.getByText(EXPECTED)).toBeInTheDocument()
  })

  it('explica que los endpoints responden de verdad', () => {
    // El sitio exhibe "200 OK" en cada sección y esos endpoints existen, pero
    // el visitante no tenía forma de enterarse salvo probándolos.
    render(<CurlInvite />)
    expect(screen.getByText(/los endpoints responden/i)).toBeInTheDocument()
  })

  it('copia el comando al portapapeles', async () => {
    const user = userEvent.setup()
    const writeText = stubClipboard()
    render(<CurlInvite />)

    await user.click(screen.getByRole('button', { name: /copiar comando/i }))

    expect(writeText).toHaveBeenCalledWith(EXPECTED)
  })

  it('confirma la copia con texto, no sólo cambiando el ícono', async () => {
    const user = userEvent.setup()
    stubClipboard()
    render(<CurlInvite />)

    await user.click(screen.getByRole('button', { name: /copiar comando/i }))

    expect(await screen.findByText('copiado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /comando copiado/i })).toBeInTheDocument()
  })

  it('anuncia el cambio de estado en una región aria-live', async () => {
    const user = userEvent.setup()
    stubClipboard()
    render(<CurlInvite />)

    await user.click(screen.getByRole('button', { name: /copiar comando/i }))

    expect(screen.getByText('copiado').getAttribute('aria-live')).toBe('polite')
  })

  it('no se rompe si el portapapeles está bloqueado', async () => {
    const user = userEvent.setup()
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    render(<CurlInvite />)

    await user.click(screen.getByRole('button', { name: /copiar comando/i }))

    // El comando sigue a la vista y se puede seleccionar a mano; no hace
    // falta avisar un fallo que el visitante no puede resolver.
    expect(screen.getByText(EXPECTED)).toBeInTheDocument()
    expect(screen.queryByText('copiado')).not.toBeInTheDocument()
  })
})
