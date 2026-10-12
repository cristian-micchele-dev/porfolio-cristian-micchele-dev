import { NextResponse } from 'next/server'
import { findProject, projects } from '@/data/projects'
import { caseStudy } from '@/data/caseStudy'
import { serializeCase, serializeProject } from '@/lib/api/serialize'

/**
 * `GET /api/projects/{id}` — el detalle, con el caso de estudio si lo tiene.
 *
 * Es el endpoint que exhibe el panel del caso destacado.
 */
const CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = findProject(id)

  if (!project) {
    // El 404 lista los slugs válidos: un 404 que no ayuda a corregir la
    // llamada es un 404 a medias.
    return NextResponse.json(
      { error: 'project_not_found', id, available: projects.map((p) => p.id) },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  return NextResponse.json(
    {
      project: serializeProject(project),
      case: project.id === caseStudy.projectId ? serializeCase(caseStudy) : null,
    },
    { headers: { 'Cache-Control': CACHE } },
  )
}
