/**
 * URL canónica del sitio.
 *
 * ⚠️ Define el `metadataBase`, y con eso las URLs absolutas de la imagen OG,
 * del sitemap y de la canonical. Si no coincide con el dominio real, las
 * previsualizaciones al compartir el link quedan rotas.
 *
 * Se puede sobreescribir con `NEXT_PUBLIC_SITE_URL` en Vercel sin tocar código
 * — necesario mientras el dominio propio no esté conectado y el deploy viva en
 * una URL `*.vercel.app`.
 */
// `||` y no `??`: una variable declarada en blanco en el dashboard llega como
// string vacío y `??` la dejaría pasar. SITE_URL quedaría en '' y el
// `new URL(SITE_URL)` de layout.tsx lanzaría — el sitio entero sin renderizar
// por un campo vacío. El default feo es mejor que la caída.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://cristianmicchele.dev'
).replace(/\/$/, '')
