import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Projects } from './Projects'
import { projects } from '@/data/projects'
import { countProjectsByKind } from '@/lib/projects'

const counts = countProjectsByKind(projects)
const getGrid = () => screen.getByRole('list', { name: 'Proyectos' })
const getCards = () => within(getGrid()).getAllByRole('article')

describe('Projects', () => {
  it('renderiza todos los proyectos por defecto', () => {
    render(<Projects />)
    expect(getCards()).toHaveLength(counts.all)
  })

  it('arranca con el filtro "all" presionado', () => {
    render(<Projects />)
    expect(screen.getByRole('button', { name: /^all/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('muestra el count real en cada filtro', () => {
    render(<Projects />)
    expect(screen.getByRole('button', { name: /^all/ })).toHaveTextContent(String(counts.all))
    expect(screen.getByRole('button', { name: /^backend/ })).toHaveTextContent(
      String(counts.backend),
    )
    expect(screen.getByRole('button', { name: /^frontend/ })).toHaveTextContent(
      String(counts.frontend),
    )
  })

  it('filtra la grilla al elegir un kind', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(screen.getByRole('button', { name: /^frontend/ }))

    expect(getCards()).toHaveLength(counts.frontend)
  })

  it('el filtro cambia la request exhibida, no solo la grilla', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    expect(screen.getByText('/api/projects')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^backend/ }))

    expect(screen.getByText('/api/projects?kind=backend')).toBeInTheDocument()
  })

  it('el count del response block refleja el filtro activo', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(screen.getByRole('button', { name: /^fullstack/ }))

    const block = screen.getByText('200 OK').closest('div')?.parentElement
    expect(block?.textContent).toContain(String(counts.fullstack))
  })

  it('vuelve a mostrar todo al reelegir "all"', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(screen.getByRole('button', { name: /^backend/ }))
    await user.click(screen.getByRole('button', { name: /^all/ }))

    expect(getCards()).toHaveLength(counts.all)
  })

  it('cada módulo expone su stack y su deployment', () => {
    render(<Projects />)
    const pulso = projects.find((p) => p.id === 'pulso')!
    const card = screen.getByText(pulso.name).closest('article')!

    for (const tech of pulso.stack) {
      expect(within(card).getByText(tech)).toBeInTheDocument()
    }
    expect(within(card).getByText(pulso.deployment)).toBeInTheDocument()
  })

  it('los links de cada módulo apuntan a los reales y abren en pestaña nueva', () => {
    render(<Projects />)
    const pulso = projects.find((p) => p.id === 'pulso')!
    const card = screen.getByText(pulso.name).closest('article')!

    const demo = within(card).getByRole('link', { name: /view project/i })
    expect(demo).toHaveAttribute('href', pulso.demoUrl)
    expect(demo).toHaveAttribute('target', '_blank')
    expect(demo).toHaveAttribute('rel', 'noreferrer')

    expect(within(card).getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      pulso.repoUrl,
    )
  })

  it('Details arranca colapsado y despliega los highlights', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    const pulso = projects.find((p) => p.id === 'pulso')!
    const card = screen.getByText(pulso.name).closest('article')!

    const toggle = within(card).getByRole('button', { name: /details/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(card).queryByText(pulso.highlights![0]!)).not.toBeInTheDocument()

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(card).getByText(pulso.highlights![0]!)).toBeInTheDocument()
  })

  it('no ofrece Details en los proyectos sin highlights', () => {
    render(<Projects />)
    const seishin = projects.find((p) => p.id === 'seishin-dojo')!
    const card = screen.getByText(seishin.name).closest('article')!

    expect(within(card).queryByRole('button', { name: /details/i })).not.toBeInTheDocument()
  })

  it('cada captura tiene alt descriptivo', () => {
    render(<Projects />)
    for (const project of projects) {
      expect(screen.getByAltText(`Captura de ${project.name}`)).toBeInTheDocument()
    }
  })
})
