import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { about } from '@/data/about'

/**
 * Sobre mí, inmediatamente después del hero.
 *
 * Va antes de los proyectos a propósito: el texto dice qué hace cuando algo
 * no lo entiende, y eso funciona como lente. Quien lo lee primero lee el
 * resto del sitio con más confianza en lo que afirma. Contexto antes que
 * evidencia.
 *
 * Sin ResponseBlock: no hay endpoint `/api/about` y no se exhibe uno que no
 * exista (DESIGN.md §8). El prefijo del header es la firma tipográfica del
 * sitio, no una promesa de ruta.
 */
export function About() {
  return (
    <Section id="about">
      <SectionHeader endpoint="GET /about" title="About" />

      <Reveal>
        <Panel label="perfil">
          <div className="space-y-4 p-5 md:p-6">
            {about.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[38rem] text-[17px] leading-relaxed text-fg-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Panel>
      </Reveal>
    </Section>
  )
}
