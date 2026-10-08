import { profile } from '@/data/profile'
import { featuredProjects } from '@/data/projects'
import { moduleGroups } from '@/data/stack'
import { architectureLayers } from '@/data/architecture'
import { stripProtocol } from '@/lib/format'
import { blank, error, group, link, pair, strong, text } from './lines'
import type { Command, CommandResult } from './types'

/* -------------------------------------------------------------------------- */
/*                                  PARSING                                   */
/* -------------------------------------------------------------------------- */

/**
 * Normaliza la entrada a un nombre de comando.
 *
 * Acepta la forma unix (`whoami`) y la forma de agente (`/whoami`) a propósito:
 * los chips muestran la segunda porque es el lenguaje de Claude Code / Cursor
 * que el concepto evoca, pero quien escribe en una terminal espera la primera.
 * Soportar las dos cuesta una línea y elimina la ambigüedad.
 */
export function normalizeInput(raw: string): string {
  const trimmed = raw.trim().toLowerCase()
  const withoutSlash = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return withoutSlash.split(/\s+/)[0] ?? ''
}

/* -------------------------------------------------------------------------- */
/*                                  COMANDOS                                  */
/* -------------------------------------------------------------------------- */

const AVAILABILITY_LABEL = {
  available: 'Available for opportunities',
  open: 'Open to conversations',
  unavailable: 'Not available',
} as const

const whoami: Command = {
  name: 'whoami',
  aliases: ['about', 'id'],
  description: 'identidad y rol',
  suggested: true,
  run: (): CommandResult => ({
    type: 'output',
    lines: [
      strong(profile.name),
      text(profile.role),
      text(profile.specialization, 'accent'),
      blank(),
      text(profile.summary),
    ],
  }),
}

const status: Command = {
  name: 'status',
  description: 'disponibilidad actual',
  suggested: true,
  run: (): CommandResult => ({
    type: 'output',
    lines: [
      pair('availability', AVAILABILITY_LABEL[profile.availability]),
      pair('location', profile.location),
      pair('focus', 'Backend · APIs · Arquitectura'),
      pair('open to', 'Full-time · Freelance'),
    ],
  }),
}

const stack: Command = {
  name: 'stack',
  aliases: ['modules', 'tech'],
  description: 'tecnologías cargadas',
  suggested: true,
  run: (): CommandResult => ({
    type: 'navigate',
    sectionId: 'stack',
    lines: moduleGroups.flatMap((g, i) => [
      ...(i > 0 ? [blank()] : []),
      group(g.label),
      ...g.modules.map((m) => pair(m.name, m.status)),
    ]),
  }),
}

const projects: Command = {
  name: 'projects',
  aliases: ['ls', 'work'],
  description: 'proyectos destacados',
  suggested: true,
  run: (): CommandResult => ({
    type: 'navigate',
    sectionId: 'projects',
    lines: [
      text(`${featuredProjects.length} destacados · ver sección para el detalle`),
      blank(),
      ...featuredProjects.flatMap((p) => [
        strong(p.name),
        text(`  ${p.stack.slice(0, 4).join(' · ')}`),
      ]),
    ],
  }),
}

const arch: Command = {
  name: 'arch',
  aliases: ['architecture'],
  description: 'capas de arquitectura',
  suggested: true,
  run: (): CommandResult => ({
    type: 'navigate',
    sectionId: 'architecture',
    lines: [
      ...architectureLayers.flatMap((layer, i) => [
        strong(layer.name),
        text(`  ${layer.description}`),
        ...(i < architectureLayers.length - 1 ? [text('  ↓', 'accent')] : []),
      ]),
    ],
  }),
}

const contact: Command = {
  name: 'contact',
  aliases: ['mail'],
  description: 'canales de contacto',
  suggested: true,
  run: (): CommandResult => ({
    type: 'navigate',
    sectionId: 'contact',
    lines: [
      link(profile.email, `mailto:${profile.email}`),
      link(stripProtocol(profile.github), profile.github),
      link(stripProtocol(profile.linkedin), profile.linkedin),
    ],
  }),
}

const source: Command = {
  name: 'source',
  aliases: ['repo'],
  description: 'código de este portfolio',
  run: (): CommandResult => ({
    type: 'output',
    lines: [
      text('Este sitio es uno de los proyectos. Next.js 16, TypeScript strict,'),
      text('telemetría real y el agente detrás de un puerto con adaptadores.'),
      blank(),
      link(stripProtocol(profile.sourceRepo), profile.sourceRepo),
    ],
  }),
}

const clear: Command = {
  name: 'clear',
  aliases: ['cls'],
  description: 'limpiar la consola',
  run: (): CommandResult => ({ type: 'clear' }),
}

const help: Command = {
  name: 'help',
  aliases: ['?'],
  description: 'listar comandos',
  run: (): CommandResult => ({
    type: 'output',
    lines: [
      text('Comandos disponibles:'),
      blank(),
      ...commands.map((c) => pair(c.name, c.description)),
      blank(),
      text('↑ ↓ historial · Tab autocompletar · Ctrl+L limpiar'),
    ],
  }),
}

/** El orden es el de `help` y el de los chips. */
export const commands: readonly Command[] = [
  whoami,
  status,
  stack,
  projects,
  arch,
  contact,
  source,
  help,
  clear,
]

export const suggestedCommands = commands.filter((c) => c.suggested)

/* -------------------------------------------------------------------------- */
/*                                 EJECUCIÓN                                  */
/* -------------------------------------------------------------------------- */

export function resolveCommand(raw: string): Command | undefined {
  const name = normalizeInput(raw)
  if (!name) return undefined
  return commands.find((c) => c.name === name || c.aliases?.includes(name))
}

export function executeCommand(raw: string): CommandResult {
  const name = normalizeInput(raw)

  // Enter en vacío: avanza una línea y no pasa nada más. No es un error.
  if (!name) return { type: 'output', lines: [] }

  const command = resolveCommand(name)
  if (command) return command.run()

  return {
    type: 'output',
    lines: [
      error(`command not found: ${name}`),
      text('Escribí `help` para ver los comandos disponibles.'),
    ],
  }
}

/**
 * Autocompletado por Tab.
 * Con un solo candidato completa; con varios devuelve el prefijo común más
 * largo, que es el comportamiento que espera cualquiera que use una shell.
 */
export function completeCommand(raw: string): string {
  const hasSlash = raw.trimStart().startsWith('/')
  const prefix = normalizeInput(raw)
  if (!prefix) return raw

  const matches = commands.map((c) => c.name).filter((n) => n.startsWith(prefix))
  if (matches.length === 0) return raw

  const completion =
    matches.length === 1 ? matches[0]! : matches.reduce(longestCommonPrefix)

  return hasSlash ? `/${completion}` : completion
}

function longestCommonPrefix(a: string, b: string): string {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return a.slice(0, i)
}
