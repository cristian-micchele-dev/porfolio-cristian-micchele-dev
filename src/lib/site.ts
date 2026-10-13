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
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cristianmicchele.dev'
).replace(/\/$/, '')
