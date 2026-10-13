'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { ResponseBlock } from '@/components/primitives/ResponseBlock'
import { Reveal } from '@/components/primitives/Reveal'
import { ProjectModule } from '@/components/ProjectModule'
import { ClientWorkPanel } from '@/components/ClientWorkPanel'
import { CaseStudyPanel } from '@/components/CaseStudyPanel'
import { gridProjects } from '@/data/projects'
import { caseStudy } from '@/data/caseStudy'
import {
  KIND_FILTERS,
  KIND_LABEL,
  buildQueryPath,
  countProjectsByKind,
  filterProjectsByKind,
  type KindFilter,
} from '@/lib/projects'
import { cn } from '@/lib/cn'

/**
 * GET /projects.
 *
 * El filtro NO es un tab decorativo: cambia la request que exhibe el
 * ResponseBlock (`?kind=backend`) y su count. La metáfora de API funciona
 * en lugar de solo ilustrar.
 */
export function Projects() {
  const [kind, setKind] = useState<KindFilter>('all')

  // La grilla excluye el caso destacado: ya se exhibe completo arriba.
  const rest = useMemo(() => gridProjects(caseStudy.projectId), [])
  const counts = useMemo(() => countProjectsByKind(rest), [rest])
  const visible = useMemo(() => filterProjectsByKind(rest, kind), [rest, kind])

  return (
    <Section id="projects">
      <SectionHeader
        endpoint="GET /projects"
        title="Projects"
        description="Cada módulo declara su stack, su arquitectura y dónde está desplegado. Los primeros son los de mayor peso backend."
      />

      <CaseStudyPanel />

      <Reveal>
        <div
          role="group"
          aria-label="Filtrar proyectos por tipo"
          className="mb-4 flex flex-wrap gap-2"
        >
          {KIND_FILTERS.map((filter) => {
            const active = kind === filter
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setKind(filter)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[4px] border px-2.5 py-1.5 font-mono text-[13px] transition-colors duration-150',
                  active
                    ? 'border-accent-dim bg-accent/5 text-accent'
                    : 'border-line bg-surface text-fg-muted hover:border-line-hi hover:text-fg',
                )}
              >
                {KIND_LABEL[filter]}
                <span className={cn('tabular-nums', active ? 'text-accent' : 'text-fg-faint')}>
                  {counts[filter]}
                </span>
              </button>
            )
          })}
        </div>
      </Reveal>

      <ResponseBlock
        method="GET"
        path={buildQueryPath(kind)}
        status={200}
        statusText="OK"
        body={{ projects: visible.length, kind, status: 'success' }}
      />

      {/* El key remonta la grilla al cambiar de filtro: se lee como una
          respuesta nueva renderizándose, no como items reordenándose. */}
      <motion.ul
        key={kind}
        aria-label="Proyectos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="mt-6 grid gap-5 lg:grid-cols-2"
      >
        {visible.map((project, index) => (
          <Reveal as="li" key={project.id} delay={Math.min(index, 4) * 0.07} className="h-full">
            <ProjectModule project={project} />
          </Reveal>
        ))}
      </motion.ul>

      <Reveal delay={0.1} className="mt-5 block">
        <ClientWorkPanel />
      </Reveal>
    </Section>
  )
}
