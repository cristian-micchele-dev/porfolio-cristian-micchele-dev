import { describe, it, expect } from 'vitest'
import {
  commands,
  suggestedCommands,
  resolveCommand,
  executeCommand,
  completeCommand,
  normalizeInput,
} from './registry'
import { profile } from '@/data/profile'
import { featuredProjects } from '@/data/projects'

describe('normalizeInput', () => {
  it('baja a minúsculas y recorta', () => {
    expect(normalizeInput('  WhoAmI  ')).toBe('whoami')
  })

  it('acepta la forma con slash del brief', () => {
    expect(normalizeInput('/projects')).toBe('projects')
  })

  it('acepta un solo slash inicial, no varios', () => {
    expect(normalizeInput('//projects')).toBe('/projects')
  })

  it('devuelve string vacío para entrada vacía o solo espacios', () => {
    expect(normalizeInput('   ')).toBe('')
    expect(normalizeInput('')).toBe('')
  })

  it('descarta argumentos: el primer token es el comando', () => {
    expect(normalizeInput('stack --all')).toBe('stack')
  })
})

describe('resolveCommand', () => {
  it('resuelve por nombre', () => {
    expect(resolveCommand('whoami')?.name).toBe('whoami')
  })

  it('resuelve con slash', () => {
    expect(resolveCommand('/stack')?.name).toBe('stack')
  })

  it('resuelve por alias', () => {
    expect(resolveCommand('architecture')?.name).toBe('arch')
    expect(resolveCommand('ls')?.name).toBe('projects')
  })

  it('es case-insensitive', () => {
    expect(resolveCommand('WHOAMI')?.name).toBe('whoami')
  })

  it('devuelve undefined para un comando inexistente', () => {
    expect(resolveCommand('rm -rf /')).toBeUndefined()
    expect(resolveCommand('')).toBeUndefined()
  })
})

describe('registry — invariantes', () => {
  it('no tiene nombres ni alias duplicados', () => {
    const keys = commands.flatMap((c) => [c.name, ...(c.aliases ?? [])])
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('usa nombres en minúscula sin espacios', () => {
    for (const c of commands) {
      expect(c.name, c.name).toMatch(/^[a-z]+$/)
    }
  })

  it('describe todos los comandos (son la ayuda visible)', () => {
    for (const c of commands) {
      expect(c.description.length, c.name).toBeGreaterThan(0)
    }
  })

  it('expone entre 4 y 6 chips sugeridos', () => {
    // Menos de 4 no invita a interactuar; más de 6 satura el hero.
    expect(suggestedCommands.length).toBeGreaterThanOrEqual(4)
    expect(suggestedCommands.length).toBeLessThanOrEqual(6)
  })

  it('todo comando produce un resultado no vacío', () => {
    for (const c of commands) {
      const result = c.run()
      if (result.type === 'clear') continue
      expect(result.lines.length, c.name).toBeGreaterThan(0)
    }
  })
})

describe('registry — el CV es condicional', () => {
  it('sólo registra /cv si existe el archivo', () => {
    // Un comando que responde "todavía no está publicado" es peor que no
    // estar: deja al visitante con una acción muerta en la mano.
    const hasCv = commands.some((c) => c.name === 'cv')
    expect(hasCv).toBe(Boolean(profile.cvUrl))
  })

  it('cuando existe, apunta al archivo real', () => {
    const cv = resolveCommand('cv')
    if (!profile.cvUrl) {
      expect(cv).toBeUndefined()
      return
    }
    const result = cv!.run()
    if (result.type !== 'output') throw new Error('se esperaba output')
    expect(result.lines.some((l) => l.href === profile.cvUrl)).toBe(true)
  })
})

describe('executeCommand', () => {
  it('whoami devuelve la identidad del perfil', () => {
    const result = executeCommand('whoami')
    expect(result.type).toBe('output')
    if (result.type !== 'output') return
    const text = result.lines.map((l) => `${l.text} ${l.value ?? ''}`).join('\n')
    expect(text).toContain(profile.name)
    expect(text).toContain(profile.role)
  })

  it('status refleja disponibilidad y ubicación del perfil', () => {
    const result = executeCommand('status')
    if (result.type !== 'output') throw new Error('se esperaba output')
    const values = result.lines.map((l) => l.value ?? '')
    expect(values.join(' ')).toContain(profile.location)
  })

  it('projects lista los destacados y navega a la sección', () => {
    const result = executeCommand('projects')
    expect(result.type).toBe('navigate')
    if (result.type !== 'navigate') return
    expect(result.sectionId).toBe('projects')
    const text = result.lines.map((l) => l.text).join('\n')
    for (const p of featuredProjects) {
      expect(text, `falta ${p.id}`).toContain(p.name)
    }
  })

  it('stack no inventa tecnologías: sale de los datos', () => {
    const result = executeCommand('stack')
    if (result.type !== 'navigate') throw new Error('se esperaba navigate')
    const text = result.lines.map((l) => `${l.text} ${l.value ?? ''}`).join('\n')
    expect(text).toContain('NestJS')
    expect(text).toContain('PostgreSQL')
  })

  it('arch imprime las capas en orden dominio → infraestructura', () => {
    const result = executeCommand('arch')
    if (result.type !== 'navigate') throw new Error('se esperaba navigate')
    const text = result.lines.map((l) => l.text).join('\n')
    expect(text.indexOf('domain')).toBeLessThan(text.indexOf('application'))
    expect(text.indexOf('application')).toBeLessThan(text.indexOf('adapters'))
    expect(text.indexOf('adapters')).toBeLessThan(text.indexOf('infrastructure'))
  })

  it('contact expone los canales reales como links', () => {
    const result = executeCommand('contact')
    if (result.type !== 'navigate') throw new Error('se esperaba navigate')
    const hrefs = result.lines.map((l) => l.href).filter(Boolean)
    expect(hrefs).toContain(profile.github)
    expect(hrefs).toContain(profile.linkedin)
  })

  it('source apunta al repo de este mismo portfolio', () => {
    const result = executeCommand('source')
    if (result.type !== 'output') throw new Error('se esperaba output')
    expect(result.lines.some((l) => l.href === profile.sourceRepo)).toBe(true)
  })

  it('help lista todos los comandos disponibles', () => {
    const result = executeCommand('help')
    if (result.type !== 'output') throw new Error('se esperaba output')
    const text = result.lines.map((l) => l.text).join(' ')
    for (const c of commands) {
      expect(text, `help no menciona ${c.name}`).toContain(c.name)
    }
  })

  it('clear devuelve la acción de limpiar', () => {
    expect(executeCommand('clear').type).toBe('clear')
  })

  it('un comando desconocido devuelve error accionable, no un crash', () => {
    const result = executeCommand('sudo make me a sandwich')
    if (result.type !== 'output') throw new Error('se esperaba output')
    expect(result.lines[0]?.kind).toBe('error')
    expect(result.lines.map((l) => l.text).join(' ')).toContain('help')
  })

  it('entrada vacía devuelve salida vacía sin error', () => {
    const result = executeCommand('   ')
    if (result.type !== 'output') throw new Error('se esperaba output')
    expect(result.lines).toHaveLength(0)
  })
})

describe('completeCommand', () => {
  it('completa un prefijo único', () => {
    expect(completeCommand('who')).toBe('whoami')
  })

  it('respeta el slash del prefijo al completar', () => {
    expect(completeCommand('/who')).toBe('/whoami')
  })

  it('devuelve el prefijo común ante varios candidatos', () => {
    // `stack` y `status` comparten `sta`
    expect(completeCommand('st')).toBe('sta')
  })

  it('devuelve el prefijo intacto si no hay candidatos', () => {
    expect(completeCommand('zzz')).toBe('zzz')
  })

  it('no completa desde string vacío', () => {
    expect(completeCommand('')).toBe('')
  })
})
