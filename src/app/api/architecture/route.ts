import { NextResponse } from 'next/server'
import {
  architectureConcepts,
  architectureLayers,
  architectureStatement,
} from '@/data/architecture'
import { serializeConcept, serializeLayer } from '@/lib/api/serialize'

/** `GET /api/architecture` — el endpoint que exhibe la sección de arquitectura. */
const CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'

export async function GET() {
  return NextResponse.json(
    {
      style: 'hexagonal',
      statement: architectureStatement,
      // Las capas van de adentro hacia afuera y cada una declara su `depth`:
      // las dependencias apuntan hacia el 0.
      dependency_direction: 'inward',
      layers: architectureLayers.map(serializeLayer),
      concepts: architectureConcepts.map(serializeConcept),
    },
    { headers: { 'Cache-Control': CACHE } },
  )
}
