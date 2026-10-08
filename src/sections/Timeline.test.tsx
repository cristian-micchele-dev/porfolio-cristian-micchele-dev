import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Timeline } from './Timeline'
import { timeline } from '@/data/timeline'
import { formatMonthYear } from '@/lib/format'

describe('Timeline', () => {
  it('renderiza una entrada por registro', () => {
    render(<Timeline />)
    expect(screen.getAllByRole('listitem')).toHaveLength(timeline.length)
  })

  it('muestra fecha, organización, rol y descripción de cada entrada', () => {
    render(<Timeline />)

    for (const entry of timeline) {
      expect(screen.getByText(formatMonthYear(entry.date)), entry.id).toBeInTheDocument()
      expect(screen.getByText(entry.org), entry.id).toBeInTheDocument()
      expect(screen.getByText(entry.title), entry.id).toBeInTheDocument()
      expect(screen.getByText(entry.role), entry.id).toBeInTheDocument()
      expect(screen.getByText(entry.description), entry.id).toBeInTheDocument()
    }
  })

  it('formatea las fechas en lugar de mostrar el ISO crudo', () => {
    render(<Timeline />)
    const first = timeline[0]!
    expect(screen.queryByText(first.date)).not.toBeInTheDocument()
    expect(screen.getByText(formatMonthYear(first.date))).toBeInTheDocument()
  })

  it('respeta el orden cronológico inverso de los datos', () => {
    render(<Timeline />)
    const items = screen.getAllByRole('listitem')

    timeline.forEach((entry, index) => {
      expect(items[index]).toHaveTextContent(entry.org)
    })
  })

  it('linkea al sitio de cada cliente en pestaña nueva', () => {
    render(<Timeline />)

    for (const entry of timeline) {
      if (!entry.url) continue
      const item = screen.getByText(entry.title).closest('li')!
      const link = within(item).getByRole('link', { name: /ver sitio/i })
      expect(link).toHaveAttribute('href', entry.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    }
  })

  it('cada captura tiene alt descriptivo', () => {
    render(<Timeline />)

    for (const entry of timeline) {
      if (!entry.image) continue
      expect(screen.getByAltText(`Captura de ${entry.org}`)).toBeInTheDocument()
    }
  })

  it('usa una lista ordenada: es un log, no una grilla', () => {
    render(<Timeline />)
    expect(screen.getByRole('list').tagName).toBe('OL')
  })
})
