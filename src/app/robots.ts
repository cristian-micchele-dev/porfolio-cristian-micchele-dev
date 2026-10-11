import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Los endpoints quedan fuera del índice: son datos para la UI, no contenido.
 * Indexarlos sólo gastaría presupuesto de crawl en JSON.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
