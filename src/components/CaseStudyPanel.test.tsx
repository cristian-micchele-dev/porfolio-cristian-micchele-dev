import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { CaseStudyPanel } from './CaseStudyPanel'
import { caseStudy } from '@/data/caseStudy'
import { findProject } from '@/data/projects'

const project = findProject(caseStudy.projectId)!
const getPanel = () => screen.getByRole('article')

describe('CaseStudyPanel', () => {
  it('apunta a un proyecto que existe en los datos', () => {
    // El caso no duplica datos: si el slug no resuelve, no renderiza nada.
    expect(project).toBeDefined()
  })

  it('expone el problema antes que la solución', () => {
    render(<CaseStudyPanel />)
    const panel = getPanel()

    const problemIndex = panel.textContent!.indexOf(caseStudy.problem)
    const decisionsIndex = panel.textContent!.indexOf(caseStudy.decisions[0]!.title)

    expect(problemIndex).toBeGreaterThanOrEqual(0)
    expect(problemIndex).toBeLessThan(decisionsIndex)
  })

  it('declara el costo de CADA decisión', () => {
    render(<CaseStudyPanel />)
    const panel = getPanel()

    // Es la razón de ser del componente: una decisión sin costo es marketing.
    for (const decision of caseStudy.decisions) {
      expect(within(panel).getByText(decision.title)).toBeInTheDocument()
      expect(within(panel).getByText(decision.rationale)).toBeInTheDocument()
      expect(within(panel).getByText(decision.tradeoff), `${decision.title} sin costo`)
        .toBeInTheDocument()
    }
    expect(screen.getAllByText('costo')).toHaveLength(caseStudy.decisions.length)
  })

  it('numera las decisiones en orden', () => {
    render(<CaseStudyPanel />)
    const items = within(getPanel()).getAllByRole('listitem')

    caseStudy.decisions.forEach((decision, index) => {
      expect(items[index]).toHaveTextContent(String(index + 1).padStart(2, '0'))
      expect(items[index]).toHaveTextContent(decision.title)
    })
  })

  it('muestra el alcance del dominio', () => {
    render(<CaseStudyPanel />)
    const panel = getPanel()

    for (const row of caseStudy.scope) {
      expect(within(panel).getByText(row.label)).toBeInTheDocument()
      expect(within(panel).getByText(row.value)).toBeInTheDocument()
    }
  })

  it('lee el stack y los links del proyecto, no de una copia', () => {
    render(<CaseStudyPanel />)
    const panel = getPanel()

    for (const tech of project.stack) {
      expect(within(panel).getByText(tech), tech).toBeInTheDocument()
    }
    expect(within(panel).getByRole('link', { name: /view project/i })).toHaveAttribute(
      'href',
      project.demoUrl,
    )
    expect(within(panel).getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      project.repoUrl,
    )
  })

  it('usa h3 para el proyecto y h4 para los bloques: no rompe la jerarquía', () => {
    const { container } = render(<CaseStudyPanel />)

    // Vive dentro de la sección Projects, cuyo título es un h2.
    expect(container.querySelector('h3')).toHaveTextContent(project.name)
    expect(container.querySelectorAll('h1, h2')).toHaveLength(0)
    expect(container.querySelectorAll('h4').length).toBeGreaterThan(0)
  })

  it('la captura tiene alt descriptivo', () => {
    render(<CaseStudyPanel />)
    expect(screen.getByAltText(`Captura de ${project.name}`)).toBeInTheDocument()
  })

  it('exhibe la request del caso, no la de la lista', () => {
    render(<CaseStudyPanel />)
    expect(screen.getByText(`/api/projects/${project.id}`)).toBeInTheDocument()
  })
})
