'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Github } from 'lucide-react'
import { Panel } from '@/components/primitives/Panel'
import { StatusDot } from '@/components/primitives/StatusDot'
import { DataRow } from '@/components/primitives/DataRow'
import { STATUS_META } from '@/lib/projects'
import { cn } from '@/lib/cn'
import type { Project } from '@/types/content'

interface ProjectModuleProps {
  project: Project
}

const ACTION_BASE =
  'inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1.5 font-mono text-[13px] transition-colors duration-150'

/**
 * Un proyecto como módulo técnico, no como card de marketing.
 *
 * Bordes de 1px, fondo plano, tipografía mono para los datos. La captura va en
 * blanco y negro y recupera algo de color en hover: mantiene la página
 * monocroma y premium sin que las imágenes peleen entre sí.
 */
export function ProjectModule({ project }: ProjectModuleProps) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const detailsId = useId()
  const status = STATUS_META[project.status]
  const hasDetails = (project.highlights?.length ?? 0) > 0

  return (
    <Panel
      as="article"
      label="project"
      interactive
      className="group flex h-full flex-col overflow-hidden"
      headerRight={
        <StatusDot
          tone={status.tone}
          label={status.label}
          visuallyHidden={false}
          labelClassName="label-mono text-fg-muted"
        />
      }
    >
      <div className="relative border-b border-line bg-canvas">
        <Image
          src={project.image}
          alt={`Captura de ${project.name}`}
          sizes="(max-width: 1024px) 100vw, 560px"
          className="aspect-16/10 w-full object-cover object-top grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-[0.35]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-medium tracking-tight text-fg">{project.name}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{project.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-[3px] border border-line px-1.5 py-0.5 font-mono text-[11px] text-fg-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1.5 border-t border-line pt-4">
          {project.architecture && <DataRow label="architecture">{project.architecture}</DataRow>}
          <DataRow label="deployment">{project.deployment}</DataRow>
        </dl>

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
              className={cn(ACTION_BASE, 'border-line text-fg-muted hover:border-line-hi hover:text-fg')}
            >
              <Github size={14} aria-hidden="true" />
              GitHub
            </a>
          )}

          {hasDetails && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={detailsId}
              className={cn(
                ACTION_BASE,
                'ml-auto border-line text-fg-muted hover:border-line-hi hover:text-fg',
              )}
            >
              Details
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={cn('transition-transform duration-200', open && 'rotate-180')}
              />
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={detailsId}
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0.01 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-5 space-y-1.5 border-t border-line pt-4 font-mono text-[13px] text-fg-muted">
                {project.highlights?.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span aria-hidden="true" className="select-none text-accent">
                      ·
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  )
}
