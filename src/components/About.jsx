import { useState } from 'react'
import AboutImage from './AboutImage'
import profileImage from '../assets/images/projects/yoavatar.png'

function About() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadCV = () => {
    setIsDownloading(true)
    
    // URL de descarga directa desde Google Drive (ahora público)
    const cvUrl = 'https://drive.google.com/uc?export=download&id=1WmDn2pZDVGE8EmlEoYrq1uQuoMGIszpO'
    
    // Abrir en nueva pestaña para descargar
    window.open(cvUrl, '_blank')
    
    // Resetear estado después de 2 segundos
    setTimeout(() => {
      setIsDownloading(false)
    }, 2000)
  }

  return (
    <section id="sobre-mi" className="py-16 bg-slate-800/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">
          Sobre Mí
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-1 flex justify-center">
            <AboutImage 
              src={profileImage}
              alt="Cristian - Desarrollador Full Stack"
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-6">
              <p className="text-slate-300 text-lg leading-relaxed">
                ¡Hola! Soy Cristian, un desarrollador Full Stack especializado en Backend con una pasión genuina por 
                construir soluciones tecnológicas robustas y escalables. Mi expertise se centra en el ecosistema de 
                JavaScript del lado del servidor, dominando tecnologías como Node.js, Express, NestJS, TypeORM, junto 
                con bases de datos como MongoDB y MySQL.
              </p>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                Complemento estas habilidades con conocimientos sólidos en frontend utilizando React y Tailwind CSS, lo 
                que me permite desarrollar aplicaciones completas con una visión integral del producto.
              </p>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                Mi filosofía de desarrollo se basa en código limpio, arquitecturas mantenibles y la implementación 
                constante de las mejores prácticas de la industria.
              </p>
            </div>
            
            <div className="pt-8">
              <button 
                onClick={handleDownloadCV}
                disabled={isDownloading}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold ${
                  isDownloading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isDownloading ? 'Descargando...' : 'Descargar CV'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About