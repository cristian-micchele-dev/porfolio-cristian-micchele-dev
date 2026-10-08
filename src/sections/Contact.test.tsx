import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Contact } from './Contact'
import { profile } from '@/data/profile'
import { stripProtocol } from '@/lib/format'

describe('Contact', () => {
  it('monta el formulario como request', () => {
    render(<Contact />)
    expect(screen.getByText('POST /api/contact')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send request/i })).toBeInTheDocument()
  })

  it('expone los canales directos además del formulario', () => {
    // Un formulario es cómodo, pero nadie debería quedar obligado a confiar
    // en él para poder escribir.
    render(<Contact />)
    const panel = screen.getByText('direct channels').closest('header')!.parentElement!

    expect(within(panel).getByRole('link', { name: new RegExp(profile.email, 'i') })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    )
    expect(
      within(panel).getByRole('link', { name: new RegExp(stripProtocol(profile.linkedin), 'i') }),
    ).toHaveAttribute('href', profile.linkedin)
    expect(
      within(panel).getByRole('link', { name: new RegExp(stripProtocol(profile.github), 'i') }),
    ).toHaveAttribute('href', profile.github)
  })

  it('los canales externos abren en pestaña nueva, el mailto no', () => {
    render(<Contact />)
    const panel = screen.getByText('direct channels').closest('header')!.parentElement!

    const mailto = within(panel).getByRole('link', { name: new RegExp(profile.email, 'i') })
    expect(mailto).not.toHaveAttribute('target')

    const github = within(panel).getByRole('link', {
      name: new RegExp(stripProtocol(profile.github), 'i'),
    })
    expect(github).toHaveAttribute('target', '_blank')
  })

  it('declara la disponibilidad con texto, no sólo con color', () => {
    render(<Contact />)
    expect(screen.getByText('available')).toBeInTheDocument()
  })
})
