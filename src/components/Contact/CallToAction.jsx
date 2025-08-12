const CallToAction = ({ onEmailClick, onLinkedInClick }) => {
  return (
    <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 p-8 rounded-2xl border border-slate-700/50 text-center backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-slate-100 mb-4">
        ¿Listo para crear algo increíble?
      </h3>
      <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
        Estoy disponible para proyectos freelance, colaboraciones o oportunidades de trabajo full-time. 
        ¡Hablemos sobre tu próxima gran idea!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onEmailClick}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          📧 Enviar Email
        </button>
        <button 
          onClick={onLinkedInClick}
          className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
        >
          💼 Conectar en LinkedIn
        </button>
      </div>
    </div>
  )
}

export default CallToAction