import { useState } from 'react'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

const NAVIGATION = [
  { name: 'Inicio',      href: 'inicio' },
  { name: 'Sobre Mí',   href: 'sobre-mi' },
  { name: 'Habilidades', href: 'habilidades' },
  { name: 'Proyectos',  href: 'proyectos' },
  { name: 'Certificados', href: 'certificados' },
  { name: 'Contacto',   href: 'contacto' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollToSection } = useSmoothScroll()

  const handleNavClick = (e, href) => {
    e.preventDefault()
    scrollToSection(href)
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-surface/95 backdrop-blur-sm border-b border-white/[0.06] sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col">
            <h1 className="text-xl font-bold text-ink">Cristian Micchele</h1>
            <p className="text-xs text-brand -mt-1 font-medium">Desarrollador Full Stack</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 items-baseline space-x-1">
            {NAVIGATION.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-ink-muted hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-surface-raised cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden bg-surface-raised inline-flex items-center justify-center p-2 rounded-md text-ink-muted hover:text-brand hover:bg-surface-high focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand transition-all duration-200"
            onClick={() => setIsMenuOpen(prev => !prev)}
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-surface/95 border-t border-white/[0.06] rounded-b-lg">
            {NAVIGATION.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-ink-muted hover:text-brand block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-surface-raised cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
