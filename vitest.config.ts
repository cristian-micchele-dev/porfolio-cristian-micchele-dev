import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { fileURLToPath } from 'node:url'

const IMAGE_RE = /\.(png|jpe?g|webp|avif|gif)(\?.*)?$/i

/**
 * Los imports estáticos de imagen los resuelve el loader de Next.js a un
 * `StaticImageData` con `src`, `width` y `height`. Vite los resuelve a un
 * string, y `next/image` entonces falla con "missing required width".
 *
 * Este plugin replica la forma de producción para que los tests ejerciten el
 * `next/image` real (alt, sizes, clases) en lugar de un mock que no prueba nada.
 */
function staticImageData(): Plugin {
  return {
    name: 'static-image-data',
    enforce: 'pre',
    load(id) {
      if (!IMAGE_RE.test(id)) return null
      const src = id.split('?')[0] ?? id
      return `export default ${JSON.stringify({
        src,
        width: 1200,
        height: 800,
        blurDataURL: '',
        blurWidth: 0,
        blurHeight: 0,
      })}`
    },
  }
}

export default defineConfig({
  plugins: [staticImageData(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
