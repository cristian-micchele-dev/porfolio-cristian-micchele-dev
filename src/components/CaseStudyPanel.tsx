import Image from 'next/image'
import { ArrowUpRight, Github } from 'lucide-react'
import { Panel } from '@/components/primitives/Panel'
import { DataRow } from '@/components/primitives/DataRow'
import { StatusDot } from '@/components/primitives/StatusDot'
import { ResponseBlock } from '@/components/primitives/ResponseBlock'
import { Reveal } from '@/components/primitives/Reveal'
import { caseStudy } from '@/data/caseStudy'
import { findProject } from '@/data/projects'
import { STATUS_META } from '@/lib/projects'
import { cn } from '@/lib/cn'

const ACTION_BASE =
  'inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1.5 font-mono text-[13px] transition-colors duration-150'

/**
 * El caso destacado, arriba de la grilla.
 *
 * Pulso sale del grid y vive acá: un sistema hospitalario con hexagonal, RBAC
 * granular y auditoría no puede ocupar el mismo rectángulo que un embed de
 * Spline. Es la prueba de todo lo que el resto del sitio afirma, y tiene que
 * encontrarse ANTES de la grilla, no después.
 *
 * No duplica datos del proyecto: los lee de `projects.ts` por su slug.
 */
export function CaseStudyPanel() {
  const project = findProject(caseStudy.projectId)
  if (!project) return null

  const status = STATUS_META[project.status]

  return (
    <div className="mb-14">
      <ResponseBlock
        method="GET"
        path={`/api/projects/${project.id}`}
        status={200}
        statusText="OK"
        body={{ case: 'study', decisions: caseStudy.decisions.length, status: project.status }}
      />

      <Reveal delay={0.06} className="mt-6 block">
        <Panel
          as="article"
          label="case study"
          headerRight={
            <StatusDot
              tone={status.tone}
              label={status.label}
              visuallyHidden={false}
              labelClassName="label-mono text-fg-muted"
            />
          }
        >
          <div className="grid lg:grid-cols-12">
            {/* ------------------------------------------------------------ */}
            {/* Captura + alcance                                            */}
            {/* ------------------------------------------------------------ */}
            <div className="border-line lg:col-span-5 lg:border-r">
              <Image
                src={project.image}
                alt={`Captura de ${project.name}`}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="aspect-16/10 w-full border-b border-line object-cover object-top"
              />

              <dl className="space-y-2 p-5">
                {caseStudy.scope.map((row) => (
                  <DataRow key={row.label} label={row.label}>
                    <span className="text-right">{row.value}</span>
                  </DataRow>
                ))}
              </dl>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Problema, decisiones y acciones                              */}
            {/* ------------------------------------------------------------ */}
            <div className="p-5 lg:col-span-7">
              <h3 className="text-2xl font-semibold tracking-tight text-fg">{project.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
                {caseStudy.headline}
              </p>

              <section className="mt-6">
                <h4 className="label-mono text-accent">el problema</h4>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-fg-muted">
                  {caseStudy.problem}
                </p>
              </section>

              <section className="mt-6">
                <h4 className="label-mono text-accent">decisiones</h4>

                <ol className="mt-3 space-y-4">
                  {caseStudy.decisions.map((decision, index) => (
                    <li key={decision.title} className="flex gap-3">
                      <span className="label-mono shrink-0 tabular-nums text-fg-faint">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className="min-w-0">
                        <p className="font-mono text-[15px] text-fg">{decision.title}</p>
                        <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-fg-muted">
                          {decision.rationale}
                        </p>
                        {/* El costo, marcado aparte: es el dato que importa */}
                        <p className="mt-2 flex max-w-[62ch] gap-2 border-l border-line pl-3 text-[15px] leading-relaxed text-fg-muted">
                          <span className="label-mono shrink-0 pt-1 text-warn">costo</span>
                          <span>{decision.tradeoff}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-[3px] border border-line px-1.5 py-0.5 font-mono text-[11px] text-fg-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      ACTION_BASE,
                      'border-accent-dim text-accent hover:border-accent hover:bg-accent/5',
                    )}
                  >
                    View project
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      ACTION_BASE,
                      'border-line text-fg-muted hover:border-line-hi hover:text-fg',
                    )}
                  >
                    <Github size={14} aria-hidden="true" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </Panel>
      </Reveal>
    </div>
  )
}
