import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'
import { about } from '@/data/about'
import { profile } from '@/data/profile'
import { allModuleNames } from '@/data/stack'

describe('About', () => {
  it('renderiza cada párrafo', () => {
    render(<About />)
    for (const paragraph of about) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })

  it('usa h2, como toda sección', () => {
    const { container } = render(<About />)
    expect(container.querySelector('h2')).toHaveTextContent('About')
    expect(container.querySelectorAll('h1')).toHaveLength(0)
  })

  it('NO repite el blurb del hero', () => {
    // Un "sobre mí" que repite el resto del sitio no agrega, ocupa.
    const { container } = render(<About />)
    expect(container.textContent).not.toContain(profile.summary)
  })

  it('NO vuelve a listar el stack: para eso está la sección Stack', () => {
    const { container } = render(<About />)
    const text = container.textContent ?? ''
    const repetidos = allModuleNames.filter((tech) => text.includes(tech))
    expect(repetidos).toEqual([])
  })

  it('no exhibe un ResponseBlock: no existe /api/about', () => {
    // DESIGN.md §8 — no se muestra un 200 OK de una ruta que no responde.
    render(<About />)
    expect(screen.queryByText('200 OK')).not.toBeInTheDocument()
    expect(screen.queryByText('/api/about')).not.toBeInTheDocument()
  })

  it('se mantiene breve: dos párrafos, sin relleno', () => {
    // Dos párrafos dichos en serio pesan más que seis de relleno.
    expect(about.length).toBeLessThanOrEqual(3)
  })

  it('no usa los adjetivos de relleno típicos', () => {
    const { container } = render(<About />)
    expect(container.textContent).not.toMatch(
      /apasionad|proactiv|autodidacta|siempre aprendiendo|ganas de sumar/i,
    )
  })
})
