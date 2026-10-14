import { describe, it, expect, vi, afterEach } from 'vitest'
import { ResendMailer } from './ResendMailer'
import type { ContactDraft } from '@/lib/contact'

/**
 * El adaptador de correo.
 *
 * Lo que se verifica acá no es "que llame a Resend" —eso es trivial— sino las
 * tres cosas que, si se rompen, rompen el canal de contacto sin avisar:
 * que el `reply_to` sea el visitante, que un fallo del proveedor LANCE en
 * lugar de devolver un id falso, y que el detalle crudo del proveedor no
 * viaje entero hacia arriba.
 */
const DRAFT: ContactDraft = {
  name: 'Ana Pérez',
  email: 'ana@empresa.com',
  message: 'Hola, vi tu portfolio.',
}

const mailer = () =>
  new ResendMailer({ apiKey: 're_test', from: 'hola@dominio.dev', to: 'cristian@dominio.dev' })

afterEach(() => {
  vi.unstubAllGlobals()
})

// Tipado con la firma de `fetch` en vez de con parámetros sin usar: así
// `mock.calls` hereda los argumentos reales y no quedan `_url`/`_init` que
// el lint tenga que perdonar.
const stubFetch = (response: Response) => {
  const spy = vi.fn<typeof fetch>()
  spy.mockResolvedValue(response)
  vi.stubGlobal('fetch', spy)
  return spy
}

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 })

const sentBody = (spy: ReturnType<typeof stubFetch>) => {
  const init = spy.mock.calls[0]?.[1] as RequestInit | undefined
  return JSON.parse(String(init?.body)) as Record<string, unknown>
}

const sentInit = (spy: ReturnType<typeof stubFetch>) =>
  spy.mock.calls[0]?.[1] as RequestInit | undefined

describe('ResendMailer — envío', () => {
  it('cumple el puerto declarando su nombre', () => {
    expect(mailer().name).toBe('resend')
  })

  it('postea a la API de Resend', async () => {
    const spy = stubFetch(ok({ id: 'msg_1' }))

    await mailer().send(DRAFT)

    expect(spy.mock.calls[0]?.[0]).toBe('https://api.resend.com/emails')
    expect(sentInit(spy)?.method).toBe('POST')
  })

  it('autentica con la API key como Bearer', async () => {
    const spy = stubFetch(ok({ id: 'msg_1' }))

    await mailer().send(DRAFT)

    const headers = sentInit(spy)?.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer re_test')
  })

  it('responde al visitante, no al remitente: reply_to es su email', async () => {
    const spy = stubFetch(ok({ id: 'msg_1' }))

    await mailer().send(DRAFT)

    expect(sentBody(spy).reply_to).toBe('ana@empresa.com')
    expect(sentBody(spy).from).toBe('hola@dominio.dev')
    expect(sentBody(spy).to).toEqual(['cristian@dominio.dev'])
  })

  it('el asunto identifica a quién escribe', async () => {
    const spy = stubFetch(ok({ id: 'msg_1' }))

    await mailer().send(DRAFT)

    expect(sentBody(spy).subject).toContain('Ana Pérez')
  })

  it('el cuerpo lleva el mensaje y la firma de contacto', async () => {
    const spy = stubFetch(ok({ id: 'msg_1' }))

    await mailer().send(DRAFT)

    const text = String(sentBody(spy).text)
    expect(text).toContain('Hola, vi tu portfolio.')
    expect(text).toContain('ana@empresa.com')
  })

  it('devuelve el id que da el proveedor', async () => {
    stubFetch(ok({ id: 'msg_42' }))

    await expect(mailer().send(DRAFT)).resolves.toEqual({ id: 'msg_42' })
  })

  it('no inventa un id si el proveedor no lo manda', async () => {
    stubFetch(ok({}))

    await expect(mailer().send(DRAFT)).resolves.toEqual({ id: 'unknown' })
  })
})

describe('ResendMailer — fallos', () => {
  it('LANZA si el proveedor rechaza: nunca devuelve un éxito falso', async () => {
    stubFetch(new Response('dominio no verificado', { status: 403 }))

    await expect(mailer().send(DRAFT)).rejects.toThrow(/^resend_failed:403/)
  })

  it('lanza también ante un 500 del proveedor', async () => {
    stubFetch(new Response('boom', { status: 500 }))

    await expect(mailer().send(DRAFT)).rejects.toThrow(/^resend_failed:500/)
  })

  it('recorta el detalle del proveedor: no viaja un cuerpo de error entero', async () => {
    stubFetch(new Response('x'.repeat(5000), { status: 422 }))

    await expect(mailer().send(DRAFT)).rejects.toThrow(
      // prefijo + status + 200 caracteres de detalle, nada más
      /^resend_failed:422:x{200}$/,
    )
  })
})
