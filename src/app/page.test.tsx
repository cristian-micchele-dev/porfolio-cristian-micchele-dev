import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'
import { SECTION_IDS } from '@/types/content'
import { sections } from '@/data/sections'

/**
 * Verificación del checklist de DESIGN.md §9 sobre la página completa.
 *
 * Esto no reemplaza mirar el sitio, pero atrapa las regresiones que un ojo
 * humano pasa por alto: una sección que pierde su ancla, un segundo h1, una
 * imagen sin alt, un link externo sin rel.
 */

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok', runtime: 'node 24', uptime: 1, commit: null, region: null, env: 'test', timestamp: '' }),
      headers: new Headers(),
    } as unknown as Response),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('HomePage — estructura', () => {
  it('monta cada sección declarada con su ancla', () => {
    const { container } = render(<HomePage />)

    for (const id of SECTION_IDS) {
      expect(container.querySelector(`#${id}`), `falta la sección ${id}`).toBeInTheDocument()
    }
  })

  it('renderiza las secciones en el orden declarado en los datos', () => {
    const { container } = render(<HomePage />)
    const rendered = [...container.querySelectorAll('section[id]')].map((el) => el.id)

    expect(rendered).toEqual(sections.map((s) => s.id))
  })

  it('no deja placeholders de fase pendiente', () => {
    render(<HomePage />)
    expect(screen.queryByText(/^Fase \d/)).not.toBeInTheDocument()
    expect(screen.queryByText('pending')).not.toBeInTheDocument()
  })
})

describe('HomePage — jerarquía de encabezados', () => {
  it('tiene exactamente un h1, y es el nombre', () => {
    const { container } = render(<HomePage />)
    const h1s = container.querySelectorAll('h1')

    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent('Cristian Micchele')
  })

  it('usa h2 para los títulos de sección', () => {
    const { container } = render(<HomePage />)
    const h2s = [...container.querySelectorAll('h2')].map((el) => el.textContent)

    // El hero no usa SectionHeader: su título es el h1.
    for (const section of sections.filter((s) => s.id !== 'identity')) {
      expect(h2s, `falta el h2 de ${section.id}`).toContain(section.title)
    }
  })

  it('no salta niveles: no hay h4+ sin h3', () => {
    const { container } = render(<HomePage />)
    const levels = [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) =>
      Number(el.tagName[1]),
    )

    let previous = 0
    for (const level of levels) {
      expect(level - previous, `salto de h${previous} a h${level}`).toBeLessThanOrEqual(1)
      previous = level
    }
  })
})

describe('HomePage — accesibilidad', () => {
  it('toda imagen tiene alt no vacío', () => {
    render(<HomePage />)

    for (const img of screen.getAllByRole('img')) {
      expect(img.getAttribute('alt'), `imagen sin alt: ${img.getAttribute('src')}`).toBeTruthy()
    }
  })

  it('todo link externo abre con rel seguro', () => {
    render(<HomePage />)

    for (const link of screen.getAllByRole('link')) {
      if (link.getAttribute('target') !== '_blank') continue
      expect(link.getAttribute('rel'), link.getAttribute('href') ?? '').toContain('noreferrer')
    }
  })

  it('ningún link queda sin texto accesible', () => {
    render(<HomePage />)

    for (const link of screen.getAllByRole('link')) {
      const label = link.textContent?.trim() || link.getAttribute('aria-label')
      expect(label, `link sin nombre: ${link.getAttribute('href')}`).toBeTruthy()
    }
  })

  it('ningún botón queda sin texto accesible', () => {
    render(<HomePage />)

    for (const button of screen.getAllByRole('button')) {
      const label = button.textContent?.trim() || button.getAttribute('aria-label')
      expect(label, 'botón sin nombre accesible').toBeTruthy()
    }
  })

  it('los campos del formulario están etiquetados', () => {
    render(<HomePage />)

    for (const field of [...screen.getAllByRole('textbox')]) {
      const label = field.getAttribute('aria-label') ?? field.getAttribute('id')
      expect(label, 'campo sin etiqueta').toBeTruthy()
    }
  })

  it('las dos consolas tienen nombres accesibles distintos', () => {
    render(<HomePage />)

    expect(screen.getByRole('list', { name: /salida de la consola/i })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: /respuestas del agente/i })).toBeInTheDocument()
  })
})

describe('HomePage — contrato de diseño', () => {
  it('no usa barras de progreso en lugar de estados', () => {
    render(<HomePage />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('no muestra porcentajes de dominio de tecnología', () => {
    const { container } = render(<HomePage />)
    const text = container.textContent ?? ''

    // El antipatrón prohibido es "Node.js 90%", no cualquier `%`: el +40% de
    // visitas orgánicas del panel de clientes es una métrica real.
    expect(text).not.toMatch(/(Node\.js|React|NestJS|TypeScript|PostgreSQL|Docker)\s*[:·-]?\s*\d+\s?%/i)
  })

  it('no deja clases de la blacklist visual', () => {
    const { container } = render(<HomePage />)
    // `getAttribute` y no `className`: en SVG (los iconos de lucide)
    // `className` es un SVGAnimatedString, no un string.
    const classes = [...container.querySelectorAll('[class]')].flatMap((el) =>
      (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean),
    )
    const has = (pattern: RegExp) => classes.filter((cls) => pattern.test(cls))

    // DESIGN.md §2 — se evalúa clase por clase, no sobre el string unido:
    // un regex con `.*` sobre todas las clases juntas matchea cualquier cosa.
    expect(has(/^(from|via|to)-(purple|violet|fuchsia|indigo)-/)).toEqual([])
    expect(has(/^shadow-(purple|violet|fuchsia|indigo|cyan|blue)-/)).toEqual([])
    expect(has(/^blur-(xl|2xl|3xl)$/)).toEqual([])

    // Radios gigantes. `rounded-full` queda permitido: un status dot tiene que
    // ser un círculo, y eso no es un "borde redondeado gigante".
    expect(has(/^rounded-(2xl|3xl|4xl)$/)).toEqual([])

    // Bordes de 2px o más: el sistema es de 1px (DESIGN.md §5).
    expect(has(/^border-[2-9]$/)).toEqual([])
  })
})
