import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactTerminal } from './ContactTerminal'
import { profile } from '@/data/profile'
import { CONTACT_LIMITS } from '@/lib/contact'

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/"name"/), 'Ana Pérez')
  await user.type(screen.getByLabelText(/"email"/), 'ana@empresa.com')
  await user.type(
    screen.getByLabelText(/"message"/),
    'Hola Cristian, te escribo por una posición backend con NestJS.',
  )
}

const send = () => screen.getByRole('button', { name: /send request/i })

/** Respuesta mínima de fetch con el status pedido. */
const respond = (status: number, body: unknown = {}) =>
  vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
    headers: new Headers(),
  } as unknown as Response)

beforeEach(() => {
  vi.stubGlobal('fetch', respond(201, { status: 'created', id: 'abc' }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ContactTerminal — formulario', () => {
  it('usa los campos del brief con labels reales, no placeholders', () => {
    render(<ContactTerminal />)
    expect(screen.getByLabelText(/"name"/)).toBeInTheDocument()
    expect(screen.getByLabelText(/"email"/)).toBeInTheDocument()
    expect(screen.getByLabelText(/"message"/)).toBeInTheDocument()
  })

  it('el mensaje es un textarea, no un input de una línea', () => {
    render(<ContactTerminal />)
    expect(screen.getByLabelText(/"message"/).tagName).toBe('TEXTAREA')
  })

  it('muestra el contador de caracteres del mensaje', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await user.type(screen.getByLabelText(/"message"/), 'hola')

    expect(screen.getByText(`4/${CONTACT_LIMITS.message.max}`)).toBeInTheDocument()
  })
})

describe('ContactTerminal — validación de cliente', () => {
  it('no llama al servidor con el formulario vacío', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await user.click(send())

    expect(fetch).not.toHaveBeenCalled()
  })

  it('reporta los tres campos a la vez, no de a uno', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await user.click(send())

    expect(await screen.findAllByRole('alert')).toHaveLength(3)
  })

  it('marca los campos inválidos con aria-invalid', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await user.click(send())

    expect(screen.getByLabelText(/"email"/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('asocia el error al campo con aria-describedby', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await user.click(send())

    const email = screen.getByLabelText(/"email"/)
    const errorId = email.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId!)).toHaveTextContent(/email/i)
  })

  it('limpia el error del campo al corregirlo', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await user.click(send())
    expect(screen.getByLabelText(/"name"/)).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText(/"name"/), 'Ana')

    expect(screen.getByLabelText(/"name"/)).not.toHaveAttribute('aria-invalid')
  })

  it('rechaza un email mal formado sin tocar el servidor', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await user.type(screen.getByLabelText(/"name"/), 'Ana')
    await user.type(screen.getByLabelText(/"email"/), 'ana@empresa')
    await user.type(screen.getByLabelText(/"message"/), 'Un mensaje suficientemente largo.')
    await user.click(send())

    expect(fetch).not.toHaveBeenCalled()
    expect(screen.getByText(/no parece válido/i)).toBeInTheDocument()
  })
})

describe('ContactTerminal — envío exitoso', () => {
  it('postea al endpoint con el cuerpo saneado', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    expect(fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' }),
    )
    const body = JSON.parse(vi.mocked(fetch).mock.calls[0]![1]!.body as string)
    expect(body).toEqual({
      name: 'Ana Pérez',
      email: 'ana@empresa.com',
      message: 'Hola Cristian, te escribo por una posición backend con NestJS.',
    })
  })

  it('muestra 201 CREATED sólo cuando el servidor lo confirma', async () => {
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    expect(await screen.findByText('201 CREATED')).toBeInTheDocument()
    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
  })
})

describe('ContactTerminal — honestidad cuando no se puede entregar', () => {
  it('con 501 NO dice "enviado": lo declara y ofrece el mailto', async () => {
    vi.stubGlobal('fetch', respond(501, { error: 'mailer_unconfigured' }))
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    // Esto es lo que evita que un reclutador crea que escribió y nunca
    // reciba respuesta.
    expect(await screen.findByText(/no se envió/i)).toBeInTheDocument()
    expect(screen.queryByText('201 CREATED')).not.toBeInTheDocument()

    const mailto = screen.getByRole('link', { name: /abrir en mi cliente de mail/i })
    expect(mailto.getAttribute('href')).toMatch(new RegExp(`^mailto:${profile.email}\\?`))
  })

  it('el mailto de respaldo lleva el mensaje ya escrito', async () => {
    vi.stubGlobal('fetch', respond(501, {}))
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    const href = (await screen.findByRole('link', { name: /abrir en mi cliente/i })).getAttribute(
      'href',
    )!
    const decoded = decodeURIComponent(href)
    expect(decoded).toContain('Ana Pérez')
    expect(decoded).toContain('posición backend con NestJS')
    expect(decoded).toContain('ana@empresa.com')
  })

  it('con 502 avisa que el envío falló, sin 201', async () => {
    vi.stubGlobal('fetch', respond(502, { error: 'send_failed' }))
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    expect(await screen.findByText(/el envío falló/i)).toBeInTheDocument()
    expect(screen.getByText(/tu mensaje no llegó/i)).toBeInTheDocument()
  })

  it('con 429 ofrece el email directo', async () => {
    vi.stubGlobal('fetch', respond(429, { error: 'rate_limited' }))
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/demasiados envíos/i)
    expect(alert).toHaveTextContent(profile.email)
  })

  it('con 422 muestra los errores que devolvió el servidor', async () => {
    vi.stubGlobal('fetch', respond(422, { fields: { email: 'Dominio no permitido.' } }))
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    expect(await screen.findByText('Dominio no permitido.')).toBeInTheDocument()
  })

  it('si la red falla no finge éxito', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const user = userEvent.setup()
    render(<ContactTerminal />)

    await fill(user)
    await user.click(send())

    expect(await screen.findByText(/el envío falló/i)).toBeInTheDocument()
  })
})
