import { describe, it, expect, vi, afterEach } from 'vitest'

/**
 * `SITE_URL` define el `metadataBase`, y con eso el og:image, la canonical y
 * el sitemap. `layout.tsx` hace `new URL(SITE_URL)`, que LANZA con string
 * vacío: una variable declarada en blanco en el dashboard tiraba el sitio
 * entero, no un dato feo.
 *
 * Se lee en tiempo de módulo, así que cada caso necesita reimportar.
 */
const load = async (value?: string) => {
  vi.resetModules()
  if (value === undefined) vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
  else vi.stubEnv('NEXT_PUBLIC_SITE_URL', value)
  return (await import('./site')).SITE_URL
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('SITE_URL', () => {
  it('usa la variable cuando está definida', async () => {
    expect(await load('https://midominio.dev')).toBe('https://midominio.dev')
  })

  it('le saca la barra final', async () => {
    expect(await load('https://midominio.dev/')).toBe('https://midominio.dev')
  })

  it('cae al default cuando la variable está en blanco', async () => {
    expect(await load('')).toMatch(/^https:\/\/\S+$/)
  })

  it('cae al default cuando la variable es sólo espacios', async () => {
    expect(await load('   ')).toMatch(/^https:\/\/\S+$/)
  })

  it('nunca devuelve algo que haga lanzar a new URL()', async () => {
    for (const value of ['', '   ', 'https://ok.dev/', 'https://ok.dev']) {
      const url = await load(value)
      expect(() => new URL(url), `con ${JSON.stringify(value)}`).not.toThrow()
    }
  })
})
