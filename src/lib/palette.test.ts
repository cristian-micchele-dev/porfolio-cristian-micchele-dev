import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PALETTE_TOKEN_NAMES, palette } from './palette'

/**
 * La paleta está duplicada a la fuerza: ImageResponse no puede leer CSS vars.
 * Este test es lo que impide que la duplicación se desincronice en silencio.
 */
// Desde cwd y no desde import.meta.url: dentro del módulo transformado por
// Vitest, import.meta.url no es una URL file://.
const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')

const readToken = (token: string): string | null => {
  const match = new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`).exec(css)
  return match?.[1]?.toLowerCase() ?? null
}

describe('palette', () => {
  it('cada token existe en el @theme de globals.css', () => {
    for (const token of Object.values(PALETTE_TOKEN_NAMES)) {
      expect(readToken(token), `${token} no está en globals.css`).not.toBeNull()
    }
  })

  it('cada valor coincide con el de globals.css', () => {
    for (const [key, token] of Object.entries(PALETTE_TOKEN_NAMES)) {
      expect(readToken(token), `${token} divergió de palette.${key}`).toBe(
        palette[key as keyof typeof palette],
      )
    }
  })

  it('cubre todas las claves de la paleta, sin faltantes', () => {
    expect(Object.keys(PALETTE_TOKEN_NAMES).sort()).toEqual(Object.keys(palette).sort())
  })

  it('usa hex de 6 dígitos en minúscula, para comparar sin ambigüedad', () => {
    for (const [key, value] of Object.entries(palette)) {
      expect(value, key).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
})
