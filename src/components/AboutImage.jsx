

function AboutImage({ src, alt, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      {/* Contenedor circular con borde de marca */}
      <div className="relative overflow-hidden rounded-full w-64 h-64 mx-auto">
        {/* Borde exterior de marca sutil */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-soft/80 via-brand/70 to-brand-dim/80 p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-surface">
            {/* Imagen */}
            {src ? (
              <img 
                src={src} 
                alt={alt || "Foto de perfil"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 filter grayscale hover:grayscale-0"
              />
            ) : (
              // Placeholder circular si no hay imagen
              <div className="w-full h-full bg-gradient-to-br from-surface-raised to-surface-high flex items-center justify-center">
                <div className="text-center text-ink-muted">
                  <svg className="w-20 h-20 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-xs opacity-80">Foto de perfil</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
      
      {/* Sombra de marca muy sutil */}
      <div className="absolute inset-0 rounded-full shadow-xl shadow-brand/10 opacity-40 group-hover:opacity-60 group-hover:shadow-brand/15 transition-all duration-300"></div>
    </div>
  )
}

export default AboutImage