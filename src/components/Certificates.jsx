import CertificateCard from './Certificates/CertificateCard'
import CertificatesHeader from './Certificates/CertificatesHeader'
import { certificates, certificatesConfig } from '../data/certificatesData'
import { useCertificates } from '../hooks/useCertificates'

function Certificates() {
  const { handleCertificateClick, sortCertificatesByYear } = useCertificates()
  
  // Ordenar certificados por año (más recientes primero)
  const sortedCertificates = sortCertificatesByYear(certificates)

  return (
    <section className="py-16">
      {/* Header */}
      <CertificatesHeader 
        title={certificatesConfig.title}
        subtitle={certificatesConfig.subtitle}
      />
      
      {/* Grid de certificados */}
      <div className={`grid ${certificatesConfig.gridCols} gap-6`}>
        {sortedCertificates.map((certificate) => (
          <CertificateCard 
            key={certificate.id}
            certificate={certificate}
            onClick={handleCertificateClick}
            config={certificatesConfig}
          />
        ))}
      </div>
    </section>
  )
}

export default Certificates