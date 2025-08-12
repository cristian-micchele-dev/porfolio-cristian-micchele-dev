const CertificatesHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">
        {title}
      </h2>
      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
      <p className="text-slate-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  )
}

export default CertificatesHeader