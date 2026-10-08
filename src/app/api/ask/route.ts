import { NextResponse } from 'next/server'
import { LocalAgent } from '@/lib/agent/LocalAgent'
import { createRateLimiter } from '@/lib/rateLimit'
import type { AgentAnswer, AgentPort } from '@/lib/agent/types'

export const dynamic = 'force-dynamic'

const MAX_QUESTION_LENGTH = 500

/**
 * El adaptador que sirve el endpoint.
 *
 * Esta es la única línea que cambia el día que haya una API de IA real: se
 * instancia otro `AgentPort` y ni la UI ni el contrato de la ruta se tocan.
 * Y la credencial de ese modelo vive acá, en el servidor — nunca en el bundle.
 */
const agent: AgentPort = new LocalAgent()

const checkRateLimit = createRateLimiter({ limit: 20, windowMs: 60_000 })

/**
 * Identifica al cliente para el rate limit.
 * Se confía en los headers de la plataforma; en local no hay ninguno y todo
 * cae en la misma clave, que es exactamente lo que queremos para probarlo.
 */
function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: Request) {
  const limit = checkRateLimit(clientKey(request))

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000) },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      },
    )
  }

  let question: unknown
  try {
    const body: unknown = await request.json()
    question = (body as { question?: unknown } | null)?.question
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    return NextResponse.json({ error: 'question_required' }, { status: 400 })
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ error: 'question_too_long' }, { status: 413 })
  }

  const answer: AgentAnswer = await agent.ask(question)

  return NextResponse.json(answer, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Agent-Adapter': agent.name,
      'X-RateLimit-Remaining': String(limit.remaining),
    },
  })
}

/** Un GET al endpoint describe el contrato en lugar de devolver 405 a secas. */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: 'POST /api/ask',
      body: { question: 'string (1..500)' },
      adapter: agent.name,
      rateLimit: '20 req/min por IP',
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
