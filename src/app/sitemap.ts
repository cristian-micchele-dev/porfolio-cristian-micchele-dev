import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Una sola URL: el sitio es una página con anclas, no rutas.
 * Listar `/#projects` y compañía sería inventar URLs que no existen como
 * documentos — los buscadores no las tratan como páginas separadas.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
