import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { about } from '@/data/about'

/**
 * Sobre mí, justo antes de Contact.
 *
 * Es el último toque humano antes de que alguien decida escribir: a esta
 * altura ya vio el trabajo y el stack, y lo que falta es con quién estaría
 * hablando.
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
