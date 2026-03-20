const CertificatesHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-ink mb-4">
        {title}
      </h2>
      <div className="w-16 h-px bg-brand mx-auto mb-6" />
      <p className="text-ink-dim max-w-2xl mx-auto text-sm">
        {subtitle}
      </p>
    </div>
  )
}

export default CertificatesHeader
