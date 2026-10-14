import { describe, it, expect, vi, afterEach } from 'vitest'
import { POST, GET } from './route'

/**
 * El contrato de `POST /api/contact`, de punta a punta.
 *
 * El caso que justifica todo el archivo es el 501. Si el correo no está
 * configurado, este endpoint tiene que decirlo: un 201 sin envío haría que un
 * reclutador escriba, crea que llegó y nunca reciba respuesta. Es el peor bug
 * posible en un portfolio, y hasta ahora ningún test lo impedía.
 *
 * El rate limiter vive en el módulo (5 req / 10 min por IP), así que cada test
 * usa una IP propia. Compartirlas haría que el orden de ejecución decidiera
 * quién recibe 429, y un test que depende del orden no es un test.
 */
const VALID = { name: 'Ana Pérez', email: 'ana@empresa.com', message: 'Hola, vi tu portfolio.' }

let ip = 0
const post = (body: unknown, from = `10.0.0.${++ip}`) =>
  POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': from },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

const withMailer = () => {
  vi.stubEnv('RESEND_API_KEY', 're_test')
  vi.stubEnv('CONTACT_FROM', 'hola@dominio.dev')
}

const withoutMailer = () => {
  vi.stubEnv('RESEND_API_KEY', '')
  vi.stubEnv('CONTACT_FROM', '')
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('POST /api/contact — sin mailer configurado', () => {
  it('responde 501, NO 201', async () => {
    withoutMailer()

    const response = await post(VALID)

    expect(response.status).toBe(501)
    expect(response.status).not.toBe(201)
  })

  it('declara el motivo y ofrece el respaldo de mailto', async () => {
    withoutMailer()

    const body = (await (await post(VALID)).json()) as Record<string, string>

    expect(body.error).toBe('mailer_unconfigured')
    expect(body.fallback).toBe('mailto')
  })

  it('no dice en ningún lado que el mensaje fue enviado', async () => {
    withoutMailer()

    const raw = await (await post(VALID)).text()

    expect(raw).not.toMatch(/created|sent|enviado/i)
  })

  it('no cachea la respuesta: configurar el mailer la cambia', async () => {
    withoutMailer()

    expect((await post(VALID)).headers.get('Cache-Control')).toBe('no-store')
  })
})

describe('POST /api/contact — con mailer configurado', () => {
  it('responde 201 con el id del proveedor', async () => {
    withMailer()
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ id: 'msg_7' }), { status: 200 }))

    const response = await post(VALID)
    const body = (await response.json()) as Record<string, string>

    expect(response.status).toBe(201)
    expect(body.status).toBe('created')
    expect(body.id).toBe('msg_7')
  })

  it('declara qué adaptador despachó', async () => {
    withMailer()
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ id: 'msg_7' }), { status: 200 }))

    expect((await post(VALID)).headers.get('X-Mailer-Adapter')).toBe('resend')
  })

  it('responde 502 si el proveedor falla, y nunca 201', async () => {
    withMailer()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', async () => new Response('rechazado', { status: 403 }))

    const response = await post(VALID)
    const body = (await response.json()) as Record<string, string>

    expect(response.status).toBe(502)
    expect(body.fallback).toBe('mailto')
  })

  it('no filtra la respuesta cruda del proveedor al cliente', async () => {
    withMailer()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', async () => new Response('API key inválida: re_secreta', { status: 401 }))

    const raw = await (await post(VALID)).text()

    expect(raw).not.toContain('re_secreta')
    expect(raw).not.toContain('API key')
  })
})

describe('POST /api/contact — entrada inválida', () => {
  it('rechaza JSON roto con 400', async () => {
    withoutMailer()

    expect((await post('{ roto', undefined)).status).toBe(400)
  })

  it('revalida en el servidor aunque el cliente ya haya validado', async () => {
    withMailer()

    const response = await post({ name: 'A', email: 'no-es-mail', message: 'corto' })
    const body = (await response.json()) as { error: string; fields: Record<string, string> }

    expect(response.status).toBe(422)
    expect(body.error).toBe('validation_failed')
    expect(Object.keys(body.fields)).toEqual(expect.arrayContaining(['name', 'email', 'message']))
  })

  it('valida antes de resolver el mailer: no intenta enviar basura', async () => {
    withMailer()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    await post({ name: '', email: '', message: '' })

    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe('POST /api/contact — rate limit', () => {
  it('corta al sexto intento de la misma IP y dice cuándo reintentar', async () => {
    withoutMailer()
    const attacker = '203.0.113.9'

    for (let i = 0; i < 5; i++) await post(VALID, attacker)
    const blocked = await post(VALID, attacker)

    expect(blocked.status).toBe(429)
    expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0)
  })

  it('no castiga a otra IP por el abuso de la primera', async () => {
    withoutMailer()

    expect((await post(VALID, '198.51.100.4')).status).toBe(501)
  })
})

describe('GET /api/contact', () => {
  it('describe el contrato en lugar de un 405 seco', async () => {
    withoutMailer()

    const body = (await (await GET()).json()) as Record<string, unknown>

    expect(body.endpoint).toBe('POST /api/contact')
    expect(body.body).toBeTruthy()
    expect(body.rateLimit).toBeTruthy()
  })

  it('admite que no hay mailer cuando no lo hay', async () => {
    withoutMailer()

    const body = (await (await GET()).json()) as Record<string, unknown>

    expect(body.mailer).toBeNull()
  })

  it('nombra el adaptador cuando sí lo hay', async () => {
    withMailer()

    const body = (await (await GET()).json()) as Record<string, unknown>

    expect(body.mailer).toBe('resend')
  })
})
