import { describe, it, expect } from 'vitest'
import { LocalAgent } from './LocalAgent'
import { knowledgeBase, suggestedPrompts } from '@/data/knowledge'
import { profile } from '@/data/profile'
import { featuredProjects, projects } from '@/data/projects'

const agent = new LocalAgent()
const flatten = (lines: { text: string; value?: string }[]) =>
  lines.map((l) => `${l.text} ${l.value ?? ''}`).join('\n')

describe('LocalAgent — contrato del puerto', () => {
  it('declara un nombre identificable', () => {
    expect(agent.name).toBe('local-knowledge-base')
  })

  it('siempre resuelve: nunca rechaza ni tira', async () => {
    const answer = await agent.ask('cualquier cosa sin sentido zxcv')
    expect(answer.lines.length).toBeGreaterThan(0)
  })

  it('declara qué adaptador respondió', async () => {
    const answer = await agent.ask('¿qué proyectos hizo?')
    expect(answer.source).toBe('local')
  })
})

describe('LocalAgent — matching', () => {
  it('responde la pregunta sugerida de cada entrada destacada', async () => {
    for (const entry of suggestedPrompts) {
      const answer = await agent.ask(entry.prompt)
      expect(answer.confidence, `"${entry.prompt}" cayó al fallback`).toBe('high')
      expect(answer.matchedId, entry.prompt).toBe(entry.id)
    }
  })

  it('responde el prompt canónico de TODA entrada de la base', async () => {
    // Si una entrada no puede responder su propia pregunta, sus keywords
    // están mal y nunca va a dispararse.
    for (const entry of knowledgeBase) {
      const answer = await agent.ask(entry.prompt)
      expect(answer.confidence, `"${entry.prompt}" cayó al fallback`).toBe('high')
    }
  })

  it('entiende preguntas en inglés aunque el contenido esté en español', async () => {
    expect((await agent.ask('What architecture does he use?')).matchedId).toBe('architecture')
    expect((await agent.ask('What is his backend stack?')).matchedId).toBe('stack-backend')
    expect((await agent.ask('How can I contact him?')).matchedId).toBe('contact')
    expect((await agent.ask('Does he work with NestJS?')).matchedId).toBe('nestjs')
  })

  it('tolera la falta de tildes y de signos', async () => {
    expect((await agent.ask('que arquitectura usa')).matchedId).toBe('architecture')
    expect((await agent.ask('COMO LO CONTACTO')).matchedId).toBe('contact')
  })

  it('resuelve preguntas sobre seguridad hacia la entrada correcta', async () => {
    expect((await agent.ask('¿usa JWT?')).matchedId).toBe('security')
    expect((await agent.ask('maneja RBAC y permisos?')).matchedId).toBe('security')
  })

  it('resuelve bases de datos', async () => {
    expect((await agent.ask('trabaja con PostgreSQL?')).matchedId).toBe('databases')
    expect((await agent.ask('usa mongodb')).matchedId).toBe('databases')
  })
})

describe('LocalAgent — preguntas reales de un visitante', () => {
  // Esta tanda salió de probar el agente con preguntas de reclutador: siete
  // de dieciséis caían al fallback y una respondía MAL con confianza.

  it('reconoce cada proyecto por su nombre', async () => {
    for (const project of projects) {
      const answer = await agent.ask(`¿Qué es ${project.name}?`)
      expect(answer.matchedId, project.name).toBe(`project:${project.id}`)
    }
  })

  it('reconoce los proyectos por su nombre corto, que es como se los nombra', async () => {
    expect((await agent.ask('que es Pulso')).matchedId).toBe('project:pulso')
    expect((await agent.ask('contame de EchoVerse')).matchedId).toBe('project:echoverse')
    expect((await agent.ask('que hace Derinator')).matchedId).toBe('project:derinator')
  })

  it('NO devuelve la biografía cuando se pregunta por un proyecto', async () => {
    // Responder mal con confianza es peor que caer al fallback: el visitante
    // cree que obtuvo respuesta.
    const answer = await agent.ask('me contas sobre EchoVerse')
    expect(answer.matchedId).not.toBe('about')
    expect(answer.matchedId).toBe('project:echoverse')
  })

  it('la ficha de un proyecto trae stack, estado y links', async () => {
    const answer = await agent.ask('que es Pulso')
    const body = flatten(answer.lines)
    const pulso = projects.find((p) => p.id === 'pulso')!

    expect(body).toContain('NestJS')
    expect(body).toContain(pulso.status)
    expect(answer.lines.some((l) => l.href === pulso.repoUrl)).toBe(true)
  })

  it('responde dónde vive y en qué huso', async () => {
    const answer = await agent.ask('donde vive')
    expect(answer.matchedId).toBe('location')
    expect(flatten(answer.lines)).toContain(profile.location)
  })

  it('responde un saludo en lugar de disculparse', async () => {
    for (const greeting of ['hola', 'buenas', 'hey', 'hi', 'hello']) {
      expect((await agent.ask(greeting)).matchedId, greeting).toBe('greeting')
    }
  })

  it('responde a un agradecimiento', async () => {
    expect((await agent.ask('gracias')).matchedId).toBe('thanks')
  })

  it('dice que NO a lo que no está en el stack, en vez de callarse', async () => {
    for (const tech of ['aws', 'kubernetes', 'java', 'python', 'angular']) {
      const answer = await agent.ask(`sabe ${tech}?`)
      expect(answer.matchedId, tech).toBe('not-in-stack')
      expect(flatten(answer.lines)).toContain('No está en su stack actual')
    }
  })

  it('una pregunta general sobre APIs no cae en la ficha de Parking Admin API', async () => {
    const answer = await agent.ask('que APIs construyo?')
    expect(answer.matchedId).not.toBe('project:parking-admin-api')
  })
})

describe('LocalAgent — respuestas', () => {
  it('las respuestas salen de los datos, no de prosa duplicada', async () => {
    const answer = await agent.ask('¿qué proyectos construyó?')
    const body = flatten(answer.lines)

    for (const project of featuredProjects) {
      expect(body, `falta ${project.id}`).toContain(project.name)
    }
  })

  it('la respuesta de contacto expone los canales reales como links', async () => {
    const answer = await agent.ask('¿cómo lo contacto?')
    const hrefs = answer.lines.map((l) => l.href).filter(Boolean)

    expect(hrefs).toContain(`mailto:${profile.email}`)
    expect(hrefs).toContain(profile.linkedin)
    expect(hrefs).toContain(profile.github)
  })

  it('ofrece saltar a la sección cuando corresponde', async () => {
    expect((await agent.ask('¿qué proyectos hizo?')).sectionId).toBe('projects')
    // Ya no hay sección Architecture: hexagonal se demuestra en el caso de
    // Pulso, dentro de Projects. Un diagrama del patrón es conocimiento
    // genérico; la decisión con su costo es lo propio.
    expect((await agent.ask('¿qué arquitectura usa?')).sectionId).toBe('projects')
  })

  it('no fuerza una sección cuando la respuesta se sostiene sola', async () => {
    expect((await agent.ask('¿está disponible para trabajar?')).sectionId).toBeUndefined()
  })
})

describe('LocalAgent — fallback', () => {
  it('marca confianza baja y no inventa un match', async () => {
    const answer = await agent.ask('cuál es la capital de Francia')
    expect(answer.confidence).toBe('low')
    expect(answer.matchedId).toBeUndefined()
  })

  it('el fallback ofrece salidas, no se disculpa y corta', async () => {
    const body = flatten((await agent.ask('zxcvbnm')).lines)
    for (const entry of suggestedPrompts) {
      expect(body).toContain(entry.prompt)
    }
  })

  it('una pregunta vacía cae al fallback sin romperse', async () => {
    expect((await agent.ask('')).confidence).toBe('low')
    expect((await agent.ask('   ')).confidence).toBe('low')
  })
})

describe('LocalAgent — inyección de entradas', () => {
  it('acepta una base distinta: el adaptador no está acoplado a los datos', async () => {
    const custom = new LocalAgent([
      {
        id: 'solo',
        prompt: 'ping',
        keywords: ['ping'],
        answer: () => [{ kind: 'text', text: 'pong' }],
      },
    ])

    const answer = await custom.ask('ping')
    expect(answer.matchedId).toBe('solo')
    expect(answer.lines[0]?.text).toBe('pong')
  })
})
