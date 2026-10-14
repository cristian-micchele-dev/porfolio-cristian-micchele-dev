import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

/**
 * La dirección de las dependencias, como test.
 *
 * `lib/`, `data/` y `types/` son las capas de adentro: lógica y contenido que
 * no deberían saber que existe una UI. `components/`, `sections/`, `hooks/` y
 * `app/` son las de afuera. La flecha va siempre hacia adentro.
 *
 * Esto ya se rompió una vez: `DotTone` vivía dentro de `StatusDot.tsx` y las
 * dos capas internas lo importaban desde ahí. Era `import type`, así que ni el
 * typecheck ni el lint ni el bundle se quejaron — el import se borra al
 * compilar. El acoplamiento era invisible para toda la cadena de herramientas.
 *
 * Por eso existe este test y no un comentario en el README: una regla que
 * ninguna herramienta verifica es una regla que ya se rompió, solo que todavía
 * no te enteraste.
 */
const SRC = resolve(process.cwd(), 'src')

const INNER = ['lib', 'data', 'types']
const OUTER = ['components', 'sections', 'hooks', 'app']

/**
 * Sólo código de producción.
 *
 * Los tests quedan afuera a propósito: la regla habla del grafo de
 * dependencias que se despacha, y un test es herramienta, no arquitectura.
 * Además este mismo archivo contiene, como fixture, el import que la regla
 * prohíbe — incluirlo haría que el test se delatara a sí mismo.
 */
const collect = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return collect(path)
    if (/\.test\.tsx?$/.test(entry.name)) return []
    return /\.tsx?$/.test(entry.name) ? [path] : []
  })

/** Importa sólo lo que el módulo trae de verdad: ignora texto en comentarios. */
const importedAliases = (source: string): string[] =>
  [...source.matchAll(/(?:from|import)\s*\(?\s*['"]@\/([a-z]+)/g)].map((m) => m[1] ?? '')

describe('dirección de las dependencias', () => {
  const innerFiles = INNER.flatMap((layer) => collect(join(SRC, layer)))

  it('hay archivos que revisar (si esto falla, el collector se rompió)', () => {
    expect(innerFiles.length).toBeGreaterThan(20)
  })

  it('ninguna capa interna importa de una capa externa', () => {
    const violations: string[] = []

    for (const file of innerFiles) {
      const source = readFileSync(file, 'utf8')
      for (const alias of importedAliases(source)) {
        if (OUTER.includes(alias)) {
          violations.push(`${relative(SRC, file)} → @/${alias}`)
        }
      }
    }

    expect(violations, `la flecha apunta al revés:\n  ${violations.join('\n  ')}`).toEqual([])
  })

  it('detecta una violación cuando existe (el test se testea a sí mismo)', () => {
    const fake = `import type { DotTone } from '@/components/primitives/StatusDot'`
    expect(importedAliases(fake)).toContain('components')
  })

  it('no confunde un import legítimo entre capas internas con una violación', () => {
    const fake = `import { projects } from '@/data/projects'\nimport type { Project } from '@/types/content'`
    expect(importedAliases(fake).some((alias) => OUTER.includes(alias))).toBe(false)
  })
})
