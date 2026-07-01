import { useState } from 'react'
import { sortCertificatesByYear, filterCertificatesByCategory } from '../utils/certificates'

export const useCertificates = () => {
  const [loading, setLoading] = useState(false)

  const handleCertificateClick = (url) => {
    if (url && url !== '#') {
      setLoading(true)
      window.open(url, '_blank')
      // Simular loading para UX
      setTimeout(() => setLoading(false), 1000)
    } else {
      alert('¡Certificado en proceso de verificación!')
    }
  }

  return {
    handleCertificateClick,
    filterCertificatesByCategory,
    sortCertificatesByYear,
    loading
  }
}