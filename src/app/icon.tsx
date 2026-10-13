import { ImageResponse } from 'next/og'
import { palette } from '@/lib/palette'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * Favicon generado en código: el prompt de la terminal.
 *
 * Sin archivo binario en el repo y usando los mismos tokens que el sitio, así
 * que si cambia el accent cambia el ícono. La pestaña del navegador es el
 * primer pixel que alguien ve del portfolio; dejarla con el ícono genérico de
 * Next se nota.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: palette.canvas,
          color: palette.accent,
          fontSize: 22,
          fontWeight: 600,
          // Compensa el peso visual del glifo, que tira a la izquierda.
          paddingLeft: 2,
        }}
      >
        &gt;
      </div>
    ),
    size,
  )
}
