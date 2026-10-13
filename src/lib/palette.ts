/**
 * La paleta en TypeScript.
 *
 * `ImageResponse` (el ícono y la imagen OG) renderiza fuera del pipeline de
 * CSS: no puede leer las custom properties de `@theme`. Esta es la única razón
 * por la que los hex viven en dos lugares.
 *
 * `src/lib/palette.test.ts` parsea `globals.css` y falla si divergen, así que
 * la duplicación no puede quedar desincronizada en silencio.
 *
 * Fuente de verdad: `src/app/globals.css` → `@theme`. Ver DESIGN.md §3.
 */
export const palette = {
  canvas: '#08090c',
  surface: '#111318',
  surfaceHi: '#171a21',
  line: '#232630',
  lineHi: '#333848',
  fg: '#e5e7eb',
  fgMuted: '#8b949e',
  fgFaint: '#6e7681',
  accent: '#4fb8d9',
  accentDim: '#1e5f73',
  ok: '#3fb950',
  warn: '#d29922',
  err: '#f85149',
} as const

/** Mapea cada clave al nombre del token en `@theme`, para el test de sincronía. */
export const PALETTE_TOKEN_NAMES: Record<keyof typeof palette, string> = {
  canvas: '--color-canvas',
  surface: '--color-surface',
  surfaceHi: '--color-surface-hi',
  line: '--color-line',
  lineHi: '--color-line-hi',
  fg: '--color-fg',
  fgMuted: '--color-fg-muted',
  fgFaint: '--color-fg-faint',
  accent: '--color-accent',
  accentDim: '--color-accent-dim',
  ok: '--color-ok',
  warn: '--color-warn',
  err: '--color-err',
}
