import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'
import { profile } from '@/data/profile'

describe('Footer', () => {
  it('es un landmark de footer', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('identifica el perfil', () => {
    render(<Footer />)
    expect(screen.getByText(/cristian/)).toBeInTheDocument()
    expect(
      screen.getByText(`${profile.name} — ${profile.role}, ${profile.specialization}`),
    ).toBeInTheDocument()
  })

  it('no muestra telemetría: el pie no es lugar para logs del sistema', () => {
    const { container } = render(<Footer />)
    const text = container.textContent ?? ''

    expect(text).not.toMatch(/\[system\]|\[api\]|\[ui\]/)
    expect(text).not.toMatch(/uptime|runtime|node \d/i)
  })

  it('se mantiene en dos líneas', () => {
    const { container } = render(<Footer />)
    expect(container.querySelectorAll('p')).toHaveLength(2)
  })
})
