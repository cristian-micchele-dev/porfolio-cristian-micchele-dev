import { NextResponse } from 'next/server'
import { projects } from '@/data/projects'
import { KIND_FILTERS, filterProjectsByKind, type KindFilter } from '@/lib/projects'
import { serializeProject } from '@/lib/api/serialize'

/**
 * `GET /api/projects` — el endpoint que la sección exhibe.
 *
 * Existe de verdad a propósito. El sitio muestra `GET /api/projects → 200 OK`
 * y declara que no se muestra lo que no se puede obtener; un visitante que lo
 * curlea tiene que encontrar la misma data que ve en pantalla, no un 404.
 *
 * Acepta el mismo `?kind=` que el filtro de la UI.
 */
const CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'

function isKindFilter(value: string): value is KindFilter {
  return (KIND_FILTERS as readonly string[]).includes(value)
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('kind')

  if (raw !== null && !isKindFilter(raw)) {
    return NextResponse.json(
      { error: 'invalid_kind', allowed: KIND_FILTERS },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const kind: KindFilter = raw ?? 'all'
  const selected = filterProjectsByKind(projects, kind)

  return NextResponse.json(
    {
      kind,
      count: selected.length,
      total: projects.length,
      projects: selected.map(serializeProject),
    },
    { headers: { 'Cache-Control': CACHE, 'X-Total-Count': String(selected.length) } },
  )
}
