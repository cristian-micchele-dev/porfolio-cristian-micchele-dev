import { ImageResponse } from 'next/og'
import { palette } from '@/lib/palette'
import { profile } from '@/data/profile'
import { allModuleNames } from '@/data/stack'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${profile.name} — ${profile.role}, ${profile.specialization}`

/**
 * Imagen de previsualización al compartir el link.
 *
 * La metadata declaraba `summary_large_image` sin imagen: eso hace que
 * LinkedIn y Twitter rendericen una card grande VACÍA, que es peor que no
 * declarar nada. Es la primera impresión cuando mandás el portfolio a un
 * reclutador.
 *
 * Se genera en código, con los mismos tokens y la misma estructura de panel
 * que el sitio, así que no puede quedar desactualizada respecto del diseño.
 * Usa la fuente que trae `next/og` — sin fetch externo, sin modo de falla.
 */
export default function OpenGraphImage() {
  const highlights = ['NestJS', 'TypeScript', 'PostgreSQL', 'React', 'Next.js'].filter((tech) =>
    allModuleNames.includes(tech),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: palette.canvas,
          color: palette.fg,
          padding: 64,
        }}
      >
        {/* Barra de sistema */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: palette.fgMuted,
          }}
        >
          <div style={{ display: 'flex' }}>
            <span style={{ color: palette.fg }}>cristian</span>
            <span style={{ color: palette.fgFaint }}>.dev</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: palette.ok,
              }}
            />
            <span style={{ letterSpacing: 3, fontSize: 18 }}>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Identidad */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: palette.accent, fontSize: 20, letterSpacing: 4 }}>
            GET /IDENTITY
          </span>

          <span
            style={{
              marginTop: 18,
              fontSize: 84,
              lineHeight: 1,
              letterSpacing: -2,
              color: palette.fg,
            }}
          >
            {profile.name}
          </span>

          <div style={{ display: 'flex', marginTop: 22, fontSize: 30 }}>
            <span style={{ color: palette.fgMuted }}>{profile.role}</span>
            <span style={{ color: palette.fgFaint, margin: '0 14px' }}>·</span>
            <span style={{ color: palette.accent }}>{profile.specialization}</span>
          </div>
        </div>

        {/* Stack, como chips delineados */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {highlights.map((tech) => (
            <div
              key={tech}
              style={{
                display: 'flex',
                border: `1px solid ${palette.line}`,
                borderRadius: 6,
                padding: '10px 16px',
                fontSize: 22,
                color: palette.fgMuted,
                background: palette.surface,
              }}
            >
              {tech}
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
              fontSize: 22,
              color: palette.ok,
              letterSpacing: 2,
            }}
          >
            200 OK
          </div>
        </div>
      </div>
    ),
    size,
  )
}
