import { blank, text } from '@/lib/terminal/lines'
import type { AgentAnswer, AgentPort } from './types'

/**
 * Adaptador del lado del cliente: habla con `POST /api/ask`.
 *
 * La consola usa este adaptador y no `LocalAgent` directo a propósito. Podría
 * resolver todo en el browser y ahorrarse el round-trip, pero entonces el
 * puerto sería decorativo: el día que haya un modelo real habría que reescribir
 * la UI. Con el salto por HTTP ya hecho, ese día sólo cambia el servidor.
 *
 * De paso, la credencial de ese modelo nunca va a poder filtrarse al bundle.
 */
export class HttpAgent implements AgentPort {
  readonly name = 'http'

  constructor(private readonly endpoint = '/api/ask') {}

  async ask(question: string): Promise<AgentAnswer> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') ?? '60'
        return this.errorAnswer([
          text(`429 Too Many Requests · reintentá en ${retryAfter}s`, 'warn'),
          blank(),
          text('El endpoint tiene rate limiting real: 20 consultas por minuto.'),
        ])
      }

      if (!response.ok) {
        return this.errorAnswer([
          text(`${response.status} · el agente no pudo responder`, 'err'),
        ])
      }

      return (await response.json()) as AgentAnswer
    } catch {
      return this.errorAnswer([
        text('No se pudo alcanzar el agente.', 'err'),
        blank(),
        text('Mientras tanto, la terminal del inicio funciona sin red.'),
      ])
    }
  }

  private errorAnswer(lines: AgentAnswer['lines']): AgentAnswer {
    return { lines, confidence: 'low', source: 'remote' }
  }
}
