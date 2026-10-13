import { profile } from '@/data/profile'
import { allModuleNames } from '@/data/stack'
import { SITE_URL } from './site'

/**
 * Structured data `Person` para buscadores.
 *
 * Se genera desde `src/data` y no a mano: un JSON-LD escrito aparte se
 * desactualiza en el primer cambio de stack y termina declarando a Google
 * algo distinto de lo que dice la página.
 *
 * Todas las URLs son absolutas: una ruta relativa en JSON-LD no resuelve.
 */
export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: `${profile.role}, ${profile.specialization}`,
    description: profile.summary,
    url: SITE_URL,
    // La imagen OG, que es una ruta real del sitio y siempre existe.
    image: `${SITE_URL}/opengraph-image`,
    email: profile.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
      addressLocality: profile.location,
    },
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: [...allModuleNames],
    knowsLanguage: ['es', 'en'],
  }
}

/** Serializado para inyectar en un `<script type="application/ld+json">`. */
export function personSchemaJson(): string {
  // `</script>` dentro de un string rompería la etiqueta y permitiría
  // inyectar markup. Escaparlo es obligatorio aunque el contenido sea propio.
  return JSON.stringify(buildPersonSchema()).replace(/</g, '\\u003c')
}
