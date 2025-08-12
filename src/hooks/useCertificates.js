import { useState } from 'react'

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

  const filterCertificatesByCategory = (certificates, category) => {
    if (!category) return certificates
    return certificates.filter(cert => cert.category === category)
  }

  const sortCertificatesByYear = (certificates, ascending = false) => {
    return [...certificates].sort((a, b) => {
      const yearA = parseInt(a.year) || 0
      const yearB = parseInt(b.year) || 0
      return ascending ? yearA - yearB : yearB - yearA
    })
  }

  return {
    handleCertificateClick,
    filterCertificatesByCategory,
    sortCertificatesByYear,
    loading
  }
}