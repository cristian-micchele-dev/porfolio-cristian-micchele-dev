import { NextResponse } from 'next/server'
import { sanitizeContact, validateContact, type ContactDraft } from '@/lib/contact'
import { resolveMailer } from '@/lib/mailer'
import { createRateLimiter } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** Más agresivo que /api/ask: un formulario de contacto es blanco de spam. */
const checkRateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 })

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: Request) {
  const limit = checkRateLimit(clientKey(request))

  if (!limit.allowed) {
    const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'rate_limited', retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const raw = body as Partial<ContactDraft> | null
  const draft = sanitizeContact({
    name: typeof raw?.name === 'string' ? raw.name : '',
    email: typeof raw?.email === 'string' ? raw.email : '',
    message: typeof raw?.message === 'string' ? raw.message : '',
  })

  // Se revalida en el servidor aunque el cliente ya validó: la validación de
  // cliente es para la experiencia, la de servidor es la que cuenta.
  const errors = validateContact(draft)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'validation_failed', fields: errors }, { status: 422 })
  }

  const mailer = resolveMailer()

  if (!mailer) {
    // 501 Not Implemented, no 201. El cliente ofrece el mailto de respaldo.
    // Decir "enviado" sin enviar nada haría que un reclutador escriba, crea
    // que llegó y nunca reciba respuesta. Ver src/lib/mailer/index.ts
    return NextResponse.json(
      { error: 'mailer_unconfigured', fallback: 'mailto' },
      { status: 501, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  try {
    const { id } = await mailer.send(draft)
    return NextResponse.json(
      { status: 'created', id },
      { status: 201, headers: { 'Cache-Control': 'no-store', 'X-Mailer-Adapter': mailer.name } },
    )
  } catch (error) {
    // El detalle queda en el log del servidor; al cliente sólo le llega que
    // falló el envío, nunca la respuesta cruda del proveedor.
    console.error('[contact] envío fallido', error)
    return NextResponse.json({ error: 'send_failed', fallback: 'mailto' }, { status: 502 })
  }
}

/** Describe el contrato en lugar de devolver 405 a secas. */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: 'POST /api/contact',
      body: { name: 'string (2..80)', email: 'string', message: 'string (10..2000)' },
      mailer: resolveMailer()?.name ?? null,
      rateLimit: '5 req / 10 min por IP',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
