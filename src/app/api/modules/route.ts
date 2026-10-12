import { NextResponse } from 'next/server'
import { moduleGroups } from '@/data/stack'
import { certificates } from '@/data/certificates'
import { countModules } from '@/lib/stack'
import { serializeModuleGroup } from '@/lib/api/serialize'

/** `GET /api/modules` — el endpoint que exhibe la sección System Modules. */
const CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'

export async function GET() {
  const counts = countModules(moduleGroups)

  return NextResponse.json(
    {
      ...counts,
      groups_detail: moduleGroups.map(serializeModuleGroup),
      certifications: certificates.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        year: c.year,
        credential: c.credentialUrl,
      })),
    },
    { headers: { 'Cache-Control': CACHE } },
  )
}
