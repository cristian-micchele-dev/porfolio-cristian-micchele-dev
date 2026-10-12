import { profile } from './profile'
import { featuredProjects, projects } from './projects'
import { moduleGroups } from './stack'
import { architectureConcepts, architectureLayers, architectureStatement } from './architecture'
import { clientWork } from './clients'
import { blank, group, link, pair, strong, text } from '@/lib/terminal/lines'
import { formatMonthYear, stripProtocol } from '@/lib/format'
import type { KnowledgeEntry } from '@/lib/agent/types'

const byId = (id: string) => projects.find((p) => p.id === id)

/**
 * Base de conocimiento del agente.
 *
 * Las respuestas se componen leyendo `src/data` en el momento, nunca con texto
 * duplicado: si cambia un proyecto, cambia la respuesta del agente. Si acá
 * hubiera prosa copiada, el agente terminaría contradiciendo a las secciones.
 *
 * Los prompts están en español porque toda la prosa del sitio lo está, pero
 * las keywords son bilingües: un reclutador que escribe "what architecture
 * does he use?" tiene que recibir respuesta igual.
 */
export const knowledgeBase: readonly KnowledgeEntry[] = [
  {
    id: 'projects',
    prompt: '¿Qué proyectos construyó Cristian?',
    suggested: true,
    keywords: [
      'proyecto',
      'projects',
      'project',
      'trabajos',
      'built',
      'construyo',
      'hizo',
      'portfolio',
      'que hizo',
    ],
    sectionId: 'projects',
    answer: () => [
      text(
        `${projects.length} proyectos publicados, ${featuredProjects.length} destacados por peso backend.`,
      ),
      blank(),
      ...featuredProjects.flatMap((p) => [
        strong(p.name),
        text(`  ${p.stack.slice(0, 4).join(' · ')}`),
      ]),
      blank(),
      text('Preguntá por uno en particular, o mirá la sección Projects.'),
    ],
  },

  {
    id: 'stack-backend',
    prompt: '¿Cuál es su stack de backend?',
    suggested: true,
    keywords: [
      'stack',
      'backend',
      'tecnologia',
      'technologies',
      'technology',
      'tech',
      'lenguaje',
      'language',
      'herramientas',
      'stack de backend',
    ],
    sectionId: 'stack',
    answer: () => {
      const backend = moduleGroups.find((g) => g.id === 'backend')
      const databases = moduleGroups.find((g) => g.id === 'databases')
      return [
        text('El núcleo es Node.js con TypeScript, y NestJS cuando el proyecto'),
        text('pide estructura y modularidad desde el día uno.'),
        blank(),
        group('backend'),
        ...(backend?.modules.map((m) => pair(m.name, m.status)) ?? []),
        blank(),
        group('databases'),
        ...(databases?.modules.map((m) => pair(m.name, m.status)) ?? []),
      ]
    },
  },

  {
    id: 'nestjs',
    prompt: '¿Trabaja con NestJS?',
    suggested: true,
    keywords: ['nestjs', 'nest', 'typeorm'],
    sectionId: 'projects',
    answer: () => {
      const pulso = byId('pulso')
      const parking = byId('parking-admin-api')
      return [
        strong('Sí, es su framework de backend principal.'),
        blank(),
        text('Dos sistemas en producción construidos con NestJS:'),
        blank(),
        ...(pulso ? [strong(pulso.name), text(`  ${pulso.architecture ?? ''}`)] : []),
        ...(parking ? [strong(parking.name), text(`  ${parking.architecture ?? ''}`)] : []),
        blank(),
        text('Más una certificación de NestJS de Udemy, verificable en la sección Stack.'),
      ]
    },
  },

  {
    id: 'architecture',
    prompt: '¿Qué arquitectura usa?',
    suggested: true,
    keywords: [
      'arquitectura',
      'architecture',
      'hexagonal',
      'clean',
      'arquitectura hexagonal',
      'clean architecture',
      'capas',
      'layers',
      'patrones',
      'patterns',
      'ddd',
    ],
    sectionId: 'architecture',
    answer: () => [
      text(architectureStatement),
      blank(),
      ...architectureLayers.map((layer) => pair(layer.name, layer.examples.join(' · '))),
      blank(),
      text('Las dependencias apuntan hacia adentro: el dominio no conoce a nadie.'),
    ],
  },

  {
    id: 'contact',
    prompt: '¿Cómo lo contacto?',
    suggested: true,
    keywords: [
      'contacto',
      'contact',
      'contactar',
      'email',
      'mail',
      'correo',
      'linkedin',
      'github',
      'hire',
      'contratar',
      'reach',
      'escribir',
    ],
    sectionId: 'contact',
    answer: () => [
      text('Por cualquiera de estos canales:'),
      blank(),
      link(profile.email, `mailto:${profile.email}`),
      link(stripProtocol(profile.linkedin), profile.linkedin),
      link(stripProtocol(profile.github), profile.github),
      blank(),
      text('O el formulario de la sección Contact.'),
    ],
  },

  {
    id: 'availability',
    prompt: '¿Está disponible para trabajar?',
    keywords: [
      'disponible',
      'available',
      'disponibilidad',
      'availability',
      'busca trabajo',
      'looking for',
      'open to work',
      'vacante',
      'full time',
      'freelance',
      'remoto',
      'remote',
    ],
    answer: () => [
      pair('status', profile.availability === 'available' ? 'Available' : 'Not available'),
      pair('location', profile.location),
      pair('open to', 'Full-time · Freelance'),
      blank(),
      text('Abierto a posiciones backend o full stack, remotas o híbridas.'),
    ],
  },

  {
    id: 'security',
    prompt: '¿Cómo maneja autenticación y seguridad?',
    keywords: [
      'seguridad',
      'security',
      'auth',
      'autenticacion',
      'authentication',
      'jwt',
      'rbac',
      'permisos',
      'permissions',
      'roles',
      'csrf',
      'cookies',
      'login',
      'argon2',
    ],
    sectionId: 'architecture',
    answer: () => {
      const pulso = byId('pulso')
      return [
        text('Es una de las áreas donde más trabajó. En Pulso, el sistema hospitalario:'),
        blank(),
        ...(pulso?.highlights?.map((h) => text(`· ${h}`)) ?? []),
        blank(),
        text('La autorización se evalúa en el borde y los accesos a datos sensibles'),
        text('quedan auditados.'),
      ]
    },
  },

  {
    id: 'databases',
    prompt: '¿Con qué bases de datos trabaja?',
    keywords: [
      'base de datos',
      'bases de datos',
      'database',
      'databases',
      'postgres',
      'postgresql',
      'mongo',
      'mongodb',
      'mysql',
      'sql',
      'supabase',
      'redis',
    ],
    sectionId: 'stack',
    answer: () => {
      const databases = moduleGroups.find((g) => g.id === 'databases')
      return [
        text('PostgreSQL es la opción por defecto; Mongo cuando el modelo es documental.'),
        blank(),
        ...(databases?.modules.map((m) => pair(m.name, m.status)) ?? []),
        blank(),
        text('En La Página Perdida hay una capa de cache en PostgreSQL sobre'),
        text('Google Books API para recortar llamadas externas.'),
      ]
    },
  },

  {
    id: 'frontend',
    prompt: '¿Qué hace del lado del frontend?',
    keywords: [
      'frontend',
      'front',
      'react',
      'next',
      'next.js',
      'nextjs',
      'tailwind',
      'ui',
      'interfaz',
      'cliente',
    ],
    sectionId: 'stack',
    answer: () => {
      const frontend = moduleGroups.find((g) => g.id === 'frontend')
      return [
        text('Full stack: el frontend no es un agregado, es parte del mismo criterio.'),
        blank(),
        ...(frontend?.modules.map((m) => pair(m.name, m.status)) ?? []),
        blank(),
        text('Este mismo sitio está hecho con Next.js 16, TypeScript strict y Tailwind v4.'),
      ]
    },
  },

  {
    id: 'experience',
    prompt: '¿Qué experiencia laboral tiene?',
    keywords: [
      'experiencia',
      'experience',
      'trabajo',
      'empleo',
      'worked',
      'laboral',
      'cliente',
      'clients',
      'freelance',
      'curriculum',
      'cv',
    ],
    sectionId: 'projects',
    answer: () => [
      text('Proyectos freelance con clientes reales:'),
      blank(),
      ...clientWork.flatMap((entry) => [
        strong(`${formatMonthYear(entry.date)} · ${entry.org}`),
        text(`  ${entry.role}`),
      ]),
      blank(),
      text('Están al final de la sección Projects, con link al sitio de cada uno.'),
    ],
  },

  {
    id: 'about',
    prompt: '¿Quién es Cristian?',
    keywords: ['quien es', 'who is', 'sobre', 'about', 'presentate', 'cristian', 'micchele'],
    answer: () => [
      strong(profile.name),
      text(profile.role),
      text(profile.specialization, 'accent'),
      blank(),
      text(profile.summary),
      blank(),
      pair('location', profile.location),
    ],
  },

  {
    id: 'this-site',
    prompt: '¿Cómo está hecho este sitio?',
    keywords: [
      'este sitio',
      'this site',
      'esta web',
      'this website',
      'portfolio code',
      'codigo del sitio',
      'como esta hecho',
      'source',
      'repo',
    ],
    answer: () => [
      text('Next.js 16 App Router, TypeScript strict y Tailwind v4.'),
      blank(),
      text('Dos detalles que no son decorativos:'),
      text('· La telemetría de la barra superior sale de GET /api/health. Es real.'),
      text('· Este agente está detrás de un puerto con adaptadores: hoy responde'),
      text('  una base de conocimiento local, mañana una API de IA, sin tocar la UI.'),
      blank(),
      link(stripProtocol(profile.sourceRepo), profile.sourceRepo),
    ],
  },

  {
    id: 'concepts',
    prompt: '¿Qué conceptos técnicos domina?',
    keywords: ['conceptos', 'concepts', 'rest', 'api', 'apis', 'testing', 'tests', 'docker'],
    sectionId: 'architecture',
    answer: () => [
      text('Los que sostienen los proyectos, no una lista de buzzwords:'),
      blank(),
      ...architectureConcepts.map((c) => pair(c.name, c.description)),
    ],
  },
] as const

export const suggestedPrompts = knowledgeBase.filter((entry) => entry.suggested)
