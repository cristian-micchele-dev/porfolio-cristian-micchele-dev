import { NextResponse } from 'next/server'
import { profile } from '@/data/profile'

/**
 * `GET /api` — índice de la API.
 *
 * Si alguien se toma el trabajo de curlear el sitio, merece encontrar el mapa
 * en lugar de tener que adivinar rutas. Es el mismo criterio que hace que
 * cada endpoint responda a un GET describiendo su contrato.
 */
export async function GET() {
  return NextResponse.json(
    {
      service: 'cristian.dev',
      description: `API pública del portfolio de ${profile.name}.`,
      endpoints: {
        'GET /api/health': 'telemetría real del runtime',
        'GET /api/projects': 'lista de proyectos · acepta ?kind=backend|fullstack|frontend',
        'GET /api/projects/{id}': 'detalle, con el caso de estudio si lo tiene',
        'GET /api/modules': 'stack por grupos, con estado y certificaciones',
        'GET /api/architecture': 'capas, dirección de dependencias y conceptos',
        'POST /api/ask': 'el agente · body { question: string }',
        'POST /api/contact': 'mensaje de contacto · body { name, email, message }',
      },
      source: profile.sourceRepo,
    },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600' } },
  )
}
