import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Hero } from './Hero'
import { profile } from '@/data/profile'
import { profileStats } from '@/lib/profileStats'
import { about } from '@/data/about'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok', runtime: 'node 24', uptime: 1, env: 'test' }),
      headers: new Headers(),
    } as unknown as Response),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Hero — identidad', () => {
  it('el nombre es el único h1', () => {
    const { container } = render(<Hero />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(profile.name)
  })

  it('declara rol y especialización', () => {
    render(<Hero />)
    // Aparecen dos veces en la misma pantalla: en la línea tipográfica y en
    // la tarjeta de identidad. Es la repetición propia de una credencial,
    // pero vale tenerlo registrado por si se decide unificar.
    expect(screen.getAllByText(profile.role).length).toBeGreaterThan(0)
    expect(screen.getAllByText(profile.specialization).length).toBeGreaterThan(0)
  })
})

describe('Hero — números para calibrar', () => {
  it('muestra cada métrica derivada de los datos', () => {
    render(<Hero />)
    for (const stat of profileStats()) {
      expect(screen.getByText(stat.label), stat.label).toBeInTheDocument()
      expect(screen.getAllByText(String(stat.value)).length, stat.label).toBeGreaterThan(0)
    }
  })

  it('NO inventa años de experiencia ni seniority', () => {
    const { container } = render(<Hero />)
    // Sin estos datos en el perfil, inventarlos sería lo que el resto del
    // sitio evita. Es mejor no decir nada que decir algo que no se sostiene.
    expect(container.textContent).not.toMatch(/\d+\s*años|\d+\s*years|senior|junior/i)
  })
})

describe('Hero — sobre mí', () => {
  it('incluye el párrafo arriba de la terminal', () => {
    render(<Hero />)
    expect(screen.getByText(about)).toBeInTheDocument()
  })

  it('aparece ANTES de la consola', () => {
    const { container } = render(<Hero />)
    const text = container.textContent ?? ''
    expect(text.indexOf(about)).toBeLessThan(text.indexOf('cristian@dev:~'))
  })

  it('es UN solo párrafo: dos empujaban la terminal abajo del fold', () => {
    expect(about).not.toContain('\n')
    expect(about.length).toBeLessThan(400)
  })

  it('no usa los adjetivos de relleno típicos', () => {
    expect(about).not.toMatch(/apasionad|proactiv|autodidacta|siempre aprendiendo/i)
  })

  it('no regala el punto débil en el texto más visible del sitio', () => {
    // No afirmar lo que no se puede sostener es obligatorio. Confesar la
    // propia limitación en el hero no es honestidad: es mala estrategia, y el
    // hero lo lee tanto un tech lead como un reclutador apurado.
    expect(about).not.toMatch(
      /no entiendo|no sé por qué|no siempre coinciden|sin entender|no puedo explicar/i,
    )
  })

  it('nombra la IA marcando control, no dependencia', () => {
    expect(about).toMatch(/\bia\b/i)
    expect(about).toMatch(/no decide|no reemplaza|herramienta/i)
  })
})

describe('Hero — accesos directos', () => {
  it('la primera pantalla expone GitHub y LinkedIn', () => {
    // Antes no había un solo link saliente: para llegar al GitHub había que
    // scrollear cinco secciones. Un reclutador no lo hace.
    render(<Hero />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', profile.github)
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      profile.linkedin,
    )
  })

  it('los links salientes abren en pestaña nueva con rel seguro', () => {
    render(<Hero />)
    for (const link of screen.getAllByRole('link')) {
      if (!link.getAttribute('href')?.startsWith('http')) continue
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    }
  })

  it('el CV sólo se ofrece si el archivo existe', () => {
    render(<Hero />)
    const cv = screen.queryByRole('link', { name: /^cv$/i })

    if (profile.cvUrl) {
      expect(cv).toHaveAttribute('href', profile.cvUrl)
    } else {
      // Un botón "descargar CV" que da 404 es peor que no tenerlo: el
      // visitante ya invirtió el click. Misma regla que DESIGN.md §8.
      expect(cv).not.toBeInTheDocument()
    }
  })
})

describe('Hero — terminal', () => {
  it('monta la consola con la salida ya sembrada', () => {
    render(<Hero />)
    const output = screen.getByRole('list', { name: /salida de la consola/i })
    expect(within(output).getByText(profile.name)).toBeInTheDocument()
  })
})
