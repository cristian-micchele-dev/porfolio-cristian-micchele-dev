import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Architecture } from './Architecture'
import {
  architectureConcepts,
  architectureLayers,
  architectureStatement,
} from '@/data/architecture'

const getPanel = (label: string): HTMLElement =>
  screen.getByText(label).closest('header')!.parentElement!

describe('Architecture', () => {
  it('abre con el statement de arquitectura', () => {
    render(<Architecture />)
    expect(screen.getByText(architectureStatement)).toBeInTheDocument()
  })

  it('nombra las cuatro capas en el diagrama', () => {
    render(<Architecture />)
    const diagram = getPanel('layers')

    for (const layer of architectureLayers) {
      expect(within(diagram).getByText(layer.name), layer.id).toBeInTheDocument()
    }
  })

  it('anida las capas: domain queda dentro de infrastructure', () => {
    render(<Architecture />)
    const diagram = getPanel('layers')

    const infrastructure = within(diagram).getByText('infrastructure')
    const domain = within(diagram).getByText('domain')

    // El anidamiento ES el mensaje: en Clean/Hexagonal las capas no son una
    // pila, infrastructure CONTIENE a domain.
    const infraRing = infrastructure.closest('div')!.parentElement!
    expect(infraRing.contains(domain)).toBe(true)
  })

  it('explicita que las dependencias apuntan hacia adentro', () => {
    render(<Architecture />)
    expect(screen.getByText(/dependencias apuntan hacia adentro/i)).toBeInTheDocument()
  })

  it('muestra los ejemplos concretos de cada capa', () => {
    render(<Architecture />)
    const diagram = getPanel('layers')

    for (const layer of architectureLayers) {
      expect(within(diagram).getByText(layer.examples.join(' · ')), layer.id).toBeInTheDocument()
    }
  })

  it('lista la responsabilidad de cada capa, numerada y en orden', () => {
    render(<Architecture />)
    const panel = getPanel('responsibilities')
    const items = within(panel).getAllByRole('listitem')

    expect(items).toHaveLength(architectureLayers.length)
    architectureLayers.forEach((layer, index) => {
      expect(items[index]).toHaveTextContent(layer.description)
      expect(items[index]).toHaveTextContent(String(index + 1).padStart(2, '0'))
    })
  })

  it('renderiza los seis conceptos con su descripción', () => {
    render(<Architecture />)
    for (const concept of architectureConcepts) {
      expect(screen.getByText(concept.name)).toBeInTheDocument()
      expect(screen.getByText(concept.description)).toBeInTheDocument()
    }
  })

  it('el response block declara el estilo y los conteos reales', () => {
    render(<Architecture />)
    const block = screen.getByText('/api/architecture').closest('div')!.parentElement!

    expect(block.textContent).toContain(String(architectureLayers.length))
    expect(block.textContent).toContain(String(architectureConcepts.length))
    expect(block.textContent).toContain('hexagonal')
  })
})
