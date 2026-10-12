import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Projects } from './Projects'
import { gridProjects } from '@/data/projects'
import { clientWork } from '@/data/clients'
import { countProjectsByKind } from '@/lib/projects'
import { caseStudy } from '@/data/caseStudy'
import { formatMonthYear } from '@/lib/format'

const rest = gridProjects(caseStudy.projectId)
const counts = countProjectsByKind(rest)
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

    const block = screen.getByText('/api/projects?kind=fullstack').closest('div')?.parentElement
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
    const sample = rest.find((p) => p.id === 'parking-admin-api')!
    const card = screen.getByText(sample.name).closest('article')!

    for (const tech of sample.stack) {
      expect(within(card).getByText(tech)).toBeInTheDocument()
    }
    expect(within(card).getByText(sample.deployment)).toBeInTheDocument()
  })

  it('los links de cada módulo apuntan a los reales y abren en pestaña nueva', () => {
    render(<Projects />)
    const sample = rest.find((p) => p.id === 'parking-admin-api')!
    const card = screen.getByText(sample.name).closest('article')!

    const demo = within(card).getByRole('link', { name: /view project/i })
    expect(demo).toHaveAttribute('href', sample.demoUrl)
    expect(demo).toHaveAttribute('target', '_blank')
    expect(demo).toHaveAttribute('rel', 'noreferrer')

    expect(within(card).getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      sample.repoUrl,
    )
  })

  it('Details arranca colapsado y despliega los highlights', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    const sample = rest.find((p) => p.id === 'parking-admin-api')!
    const card = screen.getByText(sample.name).closest('article')!

    const toggle = within(card).getByRole('button', { name: /details/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(card).queryByText(sample.highlights![0]!)).not.toBeInTheDocument()

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(card).getByText(sample.highlights![0]!)).toBeInTheDocument()
  })

  it('no ofrece Details en los proyectos sin highlights', () => {
    render(<Projects />)
    const seishin = rest.find((p) => p.id === 'seishin-dojo')!
    const card = screen.getByText(seishin.name).closest('article')!

    expect(within(card).queryByRole('button', { name: /details/i })).not.toBeInTheDocument()
  })

  it('cada captura tiene alt descriptivo', () => {
    render(<Projects />)
    for (const project of rest) {
      expect(screen.getByAltText(`Captura de ${project.name}`)).toBeInTheDocument()
    }
  })
})

describe('Projects — trabajo con clientes', () => {
  const getPanel = () =>
    screen.getByText('freelance · clientes').closest('header')!.parentElement!

  it('cierra la sección con el panel de clientes', () => {
    render(<Projects />)
    expect(getPanel()).toBeInTheDocument()
  })

  it('lista cada cliente con su fecha, organización y rol', () => {
    render(<Projects />)
    const panel = getPanel()

    for (const client of clientWork) {
      expect(within(panel).getByText(formatMonthYear(client.date)), client.id).toBeInTheDocument()
      expect(within(panel).getByText(client.org), client.id).toBeInTheDocument()
      expect(within(panel).getByText(client.role), client.id).toBeInTheDocument()
    }
  })

  it('cada cliente linkea a su sitio en pestaña nueva', () => {
    render(<Projects />)
    const panel = getPanel()

    for (const client of clientWork) {
      const link = within(panel).getByText(client.org).closest('a')!
      expect(link).toHaveAttribute('href', client.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    }
  })

  it('NO usa la forma de ProjectModule: un SEO no tiene stack ni deployment', () => {
    render(<Projects />)
    const panel = getPanel()

    // Forzar el trabajo de cliente a la card técnica dejaría campos vacíos
    // al lado de Pulso. Por eso es un panel aparte y no un artículo más.
    expect(within(panel).queryAllByRole('article')).toHaveLength(0)
    expect(within(panel).queryByText('deployment')).not.toBeInTheDocument()
  })

  it('el filtro de kind no lo afecta: no son proyectos', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(screen.getByRole('button', { name: /^backend/ }))

    expect(getPanel()).toBeInTheDocument()
  })
})
