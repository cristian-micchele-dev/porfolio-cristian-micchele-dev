import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from './MobileNav'
import { navSections } from '@/data/sections'

const getToggle = () => screen.getByRole('button', { name: /secciones/i })
const getMenu = () => screen.getByRole('navigation', { name: 'Secciones' })

describe('MobileNav', () => {
  it('arranca cerrado y fuera del árbol de accesibilidad', () => {
    render(<MobileNav />)
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    // `hidden` lo excluye del árbol: un lector de pantalla no debería
    // encontrar cinco links de navegación en un menú que está cerrado.
    expect(screen.queryByRole('navigation', { name: 'Secciones' })).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('el disparador declara cuál es la sección actual', () => {
    render(<MobileNav />)
    // Doble función: decir dónde estás —que en mobile no se sabía— y permitir
    // saltar a otra sección.
    expect(getToggle()).toHaveAccessibleName(/actual:/i)
  })

  it('abre y cierra con el disparador', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)

    await user.click(getToggle())
    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
    expect(getMenu()).toBeVisible()

    await user.click(getToggle())
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('lista todas las secciones navegables con su ancla', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    await user.click(getToggle())

    const links = within(getMenu()).getAllByRole('link')
    expect(links).toHaveLength(navSections.length)

    navSections.forEach((section, index) => {
      expect(links[index]).toHaveAttribute('href', `#${section.id}`)
    })
  })

  it('se cierra al elegir una sección', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    await user.click(getToggle())

    await user.click(within(getMenu()).getAllByRole('link')[0]!)

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('se cierra con Escape y devuelve el foco al disparador', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    await user.click(getToggle())

    await user.keyboard('{Escape}')

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    // Si el foco quedara en el body, quien navega con teclado volvería al
    // principio del tab order.
    expect(getToggle()).toHaveFocus()
  })

  it('se cierra al tocar fuera', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <MobileNav />
        <button type="button">afuera</button>
      </div>,
    )
    await user.click(getToggle())

    await user.click(screen.getByRole('button', { name: 'afuera' }))

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('conecta el disparador con el menú por aria-controls', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)

    const controls = getToggle().getAttribute('aria-controls')
    expect(controls).toBeTruthy()

    await user.click(getToggle())
    expect(document.getElementById(controls!)).toBe(getMenu())
  })

  it('sólo existe por debajo de md: en desktop ya está la nav de la barra', () => {
    const { container } = render(<MobileNav />)
    expect(container.firstElementChild).toHaveClass('md:hidden')
  })
})
