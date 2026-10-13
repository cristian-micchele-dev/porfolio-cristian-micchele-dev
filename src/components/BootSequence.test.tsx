import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BootSequence } from './BootSequence'
import { BOOT_STORAGE_KEY } from '@/lib/boot'

beforeEach(() => {
  sessionStorage.clear()
  delete document.documentElement.dataset.booted
})

afterEach(() => {
  sessionStorage.clear()
  delete document.documentElement.dataset.booted
})

describe('BootSequence', () => {
  it('es invisible para lectores de pantalla y crawlers', () => {
    const { container } = render(<BootSequence />)
    // El HTML del portfolio existe desde el primer byte; esto es sólo un
    // overlay encima. Nunca debe formar parte del árbol de accesibilidad.
    expect(container.querySelector('#boot')).toHaveAttribute('aria-hidden', 'true')
  })

  it('no aporta roles al árbol de accesibilidad', () => {
    const { container } = render(<BootSequence />)

    // El overlay renderiza un <ol> con <li>. Las queries por rol SÍ respetan
    // aria-hidden (las de texto no), así que esto prueba que el subárbol
    // quedó fuera del árbol accesible.
    expect(container.querySelector('#boot ol')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('muestra los pasos del arranque y el estado final', () => {
    const { container } = render(<BootSequence />)
    const boot = container.querySelector('#boot')!

    expect(boot.textContent).toContain('cristian.dev')
    expect(boot.textContent).toContain('profile')
    expect(boot.textContent).toContain('projects')
    expect(boot.textContent).toContain('system modules')
    expect(boot.textContent).toContain('ai agent')
    expect(boot.textContent).toContain('SYSTEM ONLINE')
  })

  it('escalona los pasos sin pasar de 1.5s en total', () => {
    const { container } = render(<BootSequence />)
    const delays = [...container.querySelectorAll<HTMLElement>('.boot-steps li, .boot-online')].map(
      (el) => Number.parseFloat(el.style.animationDelay),
    )

    expect(delays[0]).toBe(0)
    // El último paso arranca con margen para que el overlay cierre en 1.35s.
    expect(Math.max(...delays)).toBeLessThan(0.9)
  })
})

describe('BootSequence — omisión', () => {
  it('se omite con un click y queda marcado en la sesión', async () => {
    const user = userEvent.setup()
    render(<BootSequence />)

    await user.click(document.body)

    expect(document.documentElement.dataset.booted).toBe('true')
    expect(sessionStorage.getItem(BOOT_STORAGE_KEY)).toBe('1')
  })

  it('se omite con Escape', async () => {
    const user = userEvent.setup()
    render(<BootSequence />)

    await user.keyboard('{Escape}')

    expect(document.documentElement.dataset.booted).toBe('true')
  })

  it('NO se omite al tipear: alguien puede estar usando la terminal', async () => {
    const user = userEvent.setup()
    render(<BootSequence />)

    await user.keyboard('whoami')

    expect(document.documentElement.dataset.booted).toBeUndefined()
  })

  it('si ya se vio en la sesión, no vuelve a engancharse', async () => {
    sessionStorage.setItem(BOOT_STORAGE_KEY, '1')
    document.documentElement.dataset.booted = 'true'

    const user = userEvent.setup()
    render(<BootSequence />)
    await user.keyboard('{Escape}')

    // Sigue marcado y no hubo trabajo extra: el script inline ya lo resolvió.
    expect(document.documentElement.dataset.booted).toBe('true')
  })

  it('no explota si sessionStorage no está disponible', async () => {
    const original = Object.getOwnPropertyDescriptor(window, 'sessionStorage')
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('bloqueado')
      },
    })

    const user = userEvent.setup()
    render(<BootSequence />)
    await user.click(document.body)

    // El overlay se va igual; sólo se pierde el "una vez por sesión".
    expect(document.documentElement.dataset.booted).toBe('true')

    if (original) Object.defineProperty(window, 'sessionStorage', original)
  })
})
