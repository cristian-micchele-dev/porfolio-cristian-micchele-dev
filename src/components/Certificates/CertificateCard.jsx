import CertificateIcon from './CertificateIcon'

const CertificateCard = ({ certificate, onClick, config = {} }) => {
  const { 
    id, 
    title, 
    issuer, 
    image, 
    credentialUrl, 
    category, 
    year, 
    skills 
  } = certificate

  const { showYear, showSkills, showCategory } = config

  return (
    <div 
      key={id} 
      className="group cursor-pointer"
      onClick={() => onClick(credentialUrl)}
    >
      {/* Card simplificada - SOLO IMAGEN */}
      <div className="relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 border border-slate-700 hover:border-blue-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
        {image ? (
          // Imagen real del certificado
          <img 
            src={image} 
            alt={`Certificado ${title}`}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          // Placeholder con diseño azul-violeta
          <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border-2 border-dashed border-blue-500/30">
            <div className="text-center text-slate-300">
              {/* Icono de certificado con colores azul-violeta */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CertificateIcon />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-1">{title}</p>
              <p className="text-xs text-blue-400">{issuer}</p>
              
              {/* Información adicional opcional */}
              {showYear && year && (
                <p className="text-xs text-slate-400 mt-1">{year}</p>
              )}
              
              {showCategory && category && (
                <span className="inline-block bg-blue-600/20 text-blue-300 px-2 py-1 rounded-md text-xs mt-2">
                  {category}
                </span>
              )}
              
              {showSkills && skills && (
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {skills.slice(0, 2).map((skill, index) => (
                    <span key={index} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Overlay sutil SIN BOTÓN - Solo efecto visual */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      </div>
    </div>
  )
}

export default CertificateCard