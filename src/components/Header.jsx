import { useState } from 'react'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollToSection } = useSmoothScroll()

  const navigation = [
    { name: 'Inicio', href: 'inicio' },
    { name: 'Sobre Mí', href: 'sobre-mi' },
    { name: 'Habilidades', href: 'habilidades' }, // ← Nueva navegación
    { name: 'Proyectos', href: 'proyectos' },
    { name: 'Certificados', href: 'certificados' },
    { name: 'Contacto', href: 'contacto' },
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()
    scrollToSection(href)
    setIsMenuOpen(false) // Cerrar menú móvil
  }

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm shadow-2xl border-b border-slate-700/50 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Título */}
          <div className="flex-shrink-0">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-100">
                Cristian Micchele
              </h1>
              <p className="text-xs text-blue-400 -mt-1 font-medium">
                Desarrollador Full Stack
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-blue-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50 rounded-b-lg">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-slate-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-slate-700/50 cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header