const CallToAction = ({ onEmailClick, onLinkedInClick }) => {
  return (
    <div className="bg-surface p-8 rounded-2xl border border-white/[0.06] text-center">
      <h3 className="text-2xl font-bold text-ink mb-4">
        ¿Listo para crear algo increíble?
      </h3>
      <p className="text-ink-muted mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
        Estoy disponible para proyectos freelance, colaboraciones o oportunidades de trabajo full-time.
        ¡Hablemos sobre tu próxima gran idea!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onEmailClick}
          className="bg-brand hover:bg-brand-dim text-canvas px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-brand/20 font-semibold text-sm"
        >
          Enviar Email
        </button>
        <button
          onClick={onLinkedInClick}
          className="border border-brand/40 text-brand hover:bg-brand hover:text-canvas px-8 py-3 rounded-lg transition-all duration-200 font-medium text-sm"
        >
          Conectar en LinkedIn
        </button>
      </div>
    </div>
  )
}

export default CallToAction
