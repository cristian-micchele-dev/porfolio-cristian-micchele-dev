import { describe, it, expect } from 'vitest'
import { createRateLimiter } from './rateLimit'

/** Reloj controlable: testear un limiter con timers reales es pedir flakiness. */
function clock(start = 1_000_000) {
  let current = start
  return {
    now: () => current,
    advance: (ms: number) => {
      current += ms
    },
  }
}

describe('createRateLimiter', () => {
  it('permite hasta el límite y bloquea la siguiente', () => {
    const check = createRateLimiter({ limit: 3, windowMs: 60_000, now: clock().now })

    expect(check('ip').allowed).toBe(true)
    expect(check('ip').allowed).toBe(true)
    expect(check('ip').allowed).toBe(true)
    expect(check('ip').allowed).toBe(false)
  })

  it('decrementa remaining hasta cero', () => {
    const check = createRateLimiter({ limit: 3, windowMs: 60_000, now: clock().now })

    expect(check('ip').remaining).toBe(2)
    expect(check('ip').remaining).toBe(1)
    expect(check('ip').remaining).toBe(0)
    expect(check('ip').remaining).toBe(0)
  })

  it('aísla las claves entre sí', () => {
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, now: clock().now })

    expect(check('a').allowed).toBe(true)
    expect(check('a').allowed).toBe(false)
    expect(check('b').allowed).toBe(true)
  })

  it('reinicia la ventana al vencerse', () => {
    const time = clock()
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, now: time.now })

    expect(check('ip').allowed).toBe(true)
    expect(check('ip').allowed).toBe(false)

    time.advance(60_000)
    expect(check('ip').allowed).toBe(true)
  })

  it('no reinicia un milisegundo antes de tiempo', () => {
    const time = clock()
    const check = createRateLimiter({ limit: 1, windowMs: 60_000, now: time.now })

    check('ip')
    time.advance(59_999)
    expect(check('ip').allowed).toBe(false)
  })

  it('informa resetAt como el fin de la ventana vigente', () => {
    const time = clock(1_000)
    const check = createRateLimiter({ limit: 5, windowMs: 60_000, now: time.now })

    const first = check('ip')
    expect(first.resetAt).toBe(61_000)

    time.advance(10_000)
    // Dentro de la misma ventana el reset NO se corre hacia adelante.
    expect(check('ip').resetAt).toBe(61_000)
  })

  it('con limit 0 bloquea todo', () => {
    const check = createRateLimiter({ limit: 0, windowMs: 60_000, now: clock().now })
    // La primera entra por la rama de bucket nuevo pero ya sin cupo.
    expect(check('ip').remaining).toBe(-1)
    expect(check('ip').allowed).toBe(false)
  })

  it('poda las claves vencidas al cruzar el techo', () => {
    const time = clock()
    const check = createRateLimiter({ limit: 1, windowMs: 1_000, now: time.now, maxKeys: 2 })

    check('a')
    check('b')
    time.advance(1_000)

    // `a` y `b` vencieron: la clave nueva entra y las vencidas se descartan.
    expect(check('c').allowed).toBe(true)
    expect(check('a').allowed).toBe(true)
  })
})
