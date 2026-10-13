import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Stack } from './Stack'
import { moduleGroups } from '@/data/stack'
import { certificates } from '@/data/certificates'
import { countModules } from '@/lib/stack'

const counts = countModules(moduleGroups)

/** El Panel que tiene `label` en su header. */
const getPanel = (label: string): HTMLElement =>
  screen.getByText(label).closest('header')!.parentElement!

describe('Stack', () => {
  it('renderiza un panel por grupo de módulos', () => {
    render(<Stack />)
    for (const group of moduleGroups) {
      expect(screen.getByText(group.label)).toBeInTheDocument()
    }
  })

  it('renderiza todos los módulos dentro de su grupo', () => {
    render(<Stack />)

    // Se consulta dentro de cada panel a propósito: "Node.js" existe como
    // módulo Y como título de certificado, así que una búsqueda global sería
    // ambigua y además no verificaría que el módulo está en el grupo correcto.
    for (const group of moduleGroups) {
      const panel = getPanel(group.label)
      for (const tech of group.modules) {
        expect(within(panel).getByText(tech.name), `${group.label}/${tech.name}`).toBeInTheDocument()
      }
    }
  })

  it('no usa barras de porcentaje: muestra estados', () => {
    render(<Stack />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    expect(screen.getAllByText('active').length).toBe(counts.active)
  })

  it('distingue los módulos en aprendizaje', () => {
    render(<Stack />)
    expect(screen.getAllByText('learning')).toHaveLength(counts.learning)
  })

  it('el response block refleja los conteos reales', () => {
    render(<Stack />)
    const block = screen.getByText('/api/modules').closest('div')!.parentElement!
    expect(block.textContent).toContain(String(counts.modules))
    expect(block.textContent).toContain(String(counts.active))
  })

  it('muestra el count de módulos en el header de cada grupo', () => {
    render(<Stack />)
    const backend = moduleGroups.find((g) => g.id === 'backend')!
    const header = screen.getByText(backend.label).closest('header')!
    expect(header).toHaveTextContent(String(backend.modules.length))
  })

  it('embute los certificados como módulos verificados', () => {
    render(<Stack />)
    const panel = getPanel('verified')

    for (const certificate of certificates) {
      expect(within(panel).getByText(certificate.title)).toBeInTheDocument()
    }
  })

  it('cada certificado linkea a su credencial verificable', () => {
    render(<Stack />)
    const panel = getPanel('verified')

    for (const certificate of certificates) {
      const link = within(panel).getByText(certificate.title).closest('a')!
      expect(link).toHaveAttribute('href', certificate.credentialUrl)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    }
  })

  it('ordena los certificados del más reciente al más antiguo', () => {
    render(<Stack />)
    const panel = getPanel('verified')
    const years = within(panel)
      .getAllByText(/^20\d{2}$/)
      .map((el) => Number(el.textContent))

    expect([...years].sort().reverse()).toEqual(years)
  })

  it('muestra la miniatura de cada certificado, con alt descriptivo', () => {
    render(<Stack />)
    for (const certificate of certificates) {
      expect(
        screen.getByAltText(
          `Certificado de ${certificate.title}, emitido por ${certificate.issuer}`,
        ),
        certificate.id,
      ).toBeInTheDocument()
    }
  })

  it('la miniatura no reemplaza al link: la prueba sigue siendo la credencial', () => {
    render(<Stack />)
    const panel = getPanel('verified')
    for (const certificate of certificates) {
      const link = within(panel).getByText(certificate.title).closest('a')!
      expect(link).toHaveAttribute('href', certificate.credentialUrl)
    }
  })
})
