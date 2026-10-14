import { describe, it, expect } from 'vitest'
import { POST, GET } from './route'

/**
 * `POST /api/ask` — el agente detrás del puerto.
 *
 * Lo que se protege no es QUÉ responde el agente —eso ya lo cubre
 * `lib/agent/LocalAgent.test.ts`— sino el contrato HTTP alrededor: que el
 * límite de longitud exista, que el rate limit corte, y que la respuesta
 * declare qué adaptador la produjo.
 *
 * Ese header es el que hace que el puerto no sea decorativo: el día que
 * `LocalAgent` se reemplace por un modelo real, el contrato de esta ruta no
 * cambia y este archivo lo sigue probando igual.
 *
 * El rate limiter vive en el módulo (20 req/min por IP), así que cada test usa
 * su propia IP. Si las compartieran, el orden de ejecución decidiría quién
 * recibe 429.
 */
let ip = 0
const ask = (body: unknown, from = `172.16.0.${++ip}`) =>
  POST(
    new Request('http://localhost/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': from },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

describe('POST /api/ask — respuesta', () => {
  it('responde con las líneas que el agente produce', async () => {
    const response = await ask({ question: '/whoami' })
    const body = (await response.json()) as { lines: unknown[] }

    expect(response.status).toBe(200)
    expect(Array.isArray(body.lines)).toBe(true)
    expect(body.lines.length).toBeGreaterThan(0)
  })

  it('declara qué adaptador contestó: el puerto no es decorativo', async () => {
    expect((await ask({ question: 'hola' })).headers.get('X-Agent-Adapter')).toBeTruthy()
  })

  it('no cachea: la pregunta cambia en cada request', async () => {
    expect((await ask({ question: 'hola' })).headers.get('Cache-Control')).toBe('no-store')
  })

  it('informa cuántos intentos le quedan al cliente', async () => {
    const remaining = (await ask({ question: 'hola' })).headers.get('X-RateLimit-Remaining')

    expect(Number(remaining)).toBeGreaterThanOrEqual(0)
  })

  it('responde siempre algo: una pregunta sin match no devuelve vacío', async () => {
    const body = (await (await ask({ question: 'asdkjhasd qwe zxc' })).json()) as {
      lines: unknown[]
    }

    expect(body.lines.length).toBeGreaterThan(0)
  })
})

describe('POST /api/ask — entrada inválida', () => {
  it('rechaza JSON roto con 400', async () => {
    expect((await ask('{ roto')).status).toBe(400)
  })

  it('exige la pregunta', async () => {
    const response = await ask({})

    expect(response.status).toBe(400)
    expect(((await response.json()) as { error: string }).error).toBe('question_required')
  })

  it('rechaza una pregunta vacía o de puros espacios', async () => {
    expect((await ask({ question: '' })).status).toBe(400)
    expect((await ask({ question: '    ' })).status).toBe(400)
  })

  it('rechaza un tipo que no sea string', async () => {
    expect((await ask({ question: 42 })).status).toBe(400)
    expect((await ask({ question: { a: 1 } })).status).toBe(400)
  })

  it('corta en 500 caracteres con 413, no procesa un payload arbitrario', async () => {
    const response = await ask({ question: 'a'.repeat(501) })

    expect(response.status).toBe(413)
    expect(((await response.json()) as { error: string }).error).toBe('question_too_long')
  })

  it('acepta justo en el límite', async () => {
    expect((await ask({ question: 'a'.repeat(500) })).status).toBe(200)
  })
})

describe('POST /api/ask — rate limit', () => {
  it('corta a los 21 intentos de la misma IP y dice cuándo reintentar', async () => {
    const attacker = '192.0.2.77'

    for (let i = 0; i < 20; i++) await ask({ question: 'hola' }, attacker)
    const blocked = await ask({ question: 'hola' }, attacker)

    expect(blocked.status).toBe(429)
    expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0)
    expect(blocked.headers.get('X-RateLimit-Remaining')).toBe('0')
  })

  it('no castiga a otra IP por el abuso de la primera', async () => {
    expect((await ask({ question: 'hola' }, '192.0.2.200')).status).toBe(200)
  })
})

describe('GET /api/ask', () => {
  it('describe el contrato en lugar de un 405 seco', async () => {
    const body = (await (await GET()).json()) as Record<string, unknown>

    expect(body.endpoint).toBe('POST /api/ask')
    expect(body.adapter).toBeTruthy()
    expect(body.rateLimit).toBeTruthy()
  })
})
