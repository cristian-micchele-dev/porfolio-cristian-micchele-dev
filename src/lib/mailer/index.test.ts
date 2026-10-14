import { describe, it, expect, vi, afterEach } from 'vitest'
import { resolveMailer } from './index'
import { profile } from '@/data/profile'

/**
 * La garantía de honestidad del sitio, como test.
 *
 * `resolveMailer()` devolviendo `null` es lo que hace que `POST /api/contact`
 * responda 501 y no 201. Tenía diez líneas de comentario explicando por qué y
 * cero tests defendiéndolo: el día que alguien vea ese `return null` y lo
 * "arregle", el formulario va a decir "enviado" y tirar los mensajes a la
 * basura. Alguien escribe, cree que llegó, nunca recibe respuesta.
 *
 * Un comentario no frena ese commit. Un test rojo sí.
 */
afterEach(() => {
  vi.unstubAllEnvs()
})

const configure = (vars: Record<string, string>) => {
  for (const [key, value] of Object.entries(vars)) vi.stubEnv(key, value)
}

describe('resolveMailer — sin configurar', () => {
  it('devuelve null si falta la API key', () => {
    configure({ RESEND_API_KEY: '', CONTACT_FROM: 'hola@dominio.dev' })
    expect(resolveMailer()).toBeNull()
  })

  it('devuelve null si falta el remitente', () => {
    configure({ RESEND_API_KEY: 're_xxx', CONTACT_FROM: '' })
    expect(resolveMailer()).toBeNull()
  })

  it('devuelve null si faltan las dos', () => {
    configure({ RESEND_API_KEY: '', CONTACT_FROM: '' })
    expect(resolveMailer()).toBeNull()
  })

  it('null es la respuesta correcta, no un error: no lanza', () => {
    configure({ RESEND_API_KEY: '', CONTACT_FROM: '' })
    expect(() => resolveMailer()).not.toThrow()
  })
})

describe('resolveMailer — configurado', () => {
  it('devuelve un adaptador que cumple el puerto', () => {
    configure({ RESEND_API_KEY: 're_xxx', CONTACT_FROM: 'hola@dominio.dev' })

    const mailer = resolveMailer()

    expect(mailer).not.toBeNull()
    expect(mailer?.name).toBe('resend')
    expect(typeof mailer?.send).toBe('function')
  })

  it('usa CONTACT_TO cuando está definido', async () => {
    configure({
      RESEND_API_KEY: 're_xxx',
      CONTACT_FROM: 'hola@dominio.dev',
      CONTACT_TO: 'otro@dominio.dev',
    })
    const fetchSpy = stubFetchOk()

    await resolveMailer()?.send({ name: 'Ana', email: 'ana@mail.com', message: 'hola' })

    expect(bodyOf(fetchSpy).to).toEqual(['otro@dominio.dev'])
  })

  it('cae al email del perfil cuando CONTACT_TO no está', async () => {
    configure({ RESEND_API_KEY: 're_xxx', CONTACT_FROM: 'hola@dominio.dev', CONTACT_TO: '' })
    const fetchSpy = stubFetchOk()

    await resolveMailer()?.send({ name: 'Ana', email: 'ana@mail.com', message: 'hola' })

    expect(bodyOf(fetchSpy).to).toEqual([profile.email])
  })
})

/* ---------------------------------------------------------------- helpers */

// Tipado con la firma de `fetch` en vez de con parámetros sin usar: así
// `mock.calls` hereda los argumentos reales y no quedan `_url`/`_init` que
// el lint tenga que perdonar.
function stubFetchOk() {
  const spy = vi.fn<typeof fetch>()
  spy.mockResolvedValue(new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 }))
  vi.stubGlobal('fetch', spy)
  return spy
}

function bodyOf(spy: ReturnType<typeof stubFetchOk>): { to: string[] } {
  const init = spy.mock.calls[0]?.[1] as RequestInit | undefined
  return JSON.parse(String(init?.body)) as { to: string[] }
}
