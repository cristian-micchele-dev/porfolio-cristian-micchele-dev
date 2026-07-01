import { describe, it, expect } from 'vitest'
import { sortCertificatesByYear, filterCertificatesByCategory } from './certificates'

describe('sortCertificatesByYear', () => {
  const certs = [
    { id: 1, title: 'A', year: 2021 },
    { id: 2, title: 'B', year: 2023 },
    { id: 3, title: 'C', year: 2022 },
  ]

  it('ordena descendente por defecto (recientes primero)', () => {
    const sorted = sortCertificatesByYear(certs)
    expect(sorted.map(c => c.year)).toEqual([2023, 2022, 2021])
  })

  it('ordena ascendente cuando ascending=true', () => {
    const sorted = sortCertificatesByYear(certs, true)
    expect(sorted.map(c => c.year)).toEqual([2021, 2022, 2023])
  })

  it('no muta el array original', () => {
    const original = certs.map(c => ({ ...c }))
    sortCertificatesByYear(certs)
    expect(certs).toEqual(original)
  })

  it('devuelve una nueva instancia de array', () => {
    const sorted = sortCertificatesByYear(certs)
    expect(sorted).not.toBe(certs)
  })

  it('trata años faltantes como 0 (va al final en descendente)', () => {
    const withMissing = [
      { id: 1, year: 2023 },
      { id: 2, year: undefined },
      { id: 3, year: 2020 },
    ]
    const sorted = sortCertificatesByYear(withMissing)
    expect(sorted.map(c => c.year)).toEqual([2023, 2020, undefined])
  })

  it('trata años no parseables (NaN) como 0', () => {
    const weird = [
      { id: 1, year: 'no-numero' },
      { id: 2, year: 2024 },
      { id: 3, year: null },
    ]
    const sorted = sortCertificatesByYear(weird)
    // 2024 va primero, los demás (0) mantienen orden relativo
    expect(sorted[0].year).toBe(2024)
  })

  it('acepta años como string numérico ("2022")', () => {
    const stringCerts = [
      { id: 1, year: '2021' },
      { id: 2, year: '2023' },
    ]
    const sorted = sortCertificatesByYear(stringCerts)
    expect(sorted.map(c => c.year)).toEqual(['2023', '2021'])
  })

  it('preserva los otros campos de cada certificado', () => {
    const certs = [{ id: 99, title: 'X', issuer: 'Y', year: 2020 }]
    const sorted = sortCertificatesByYear(certs)
    expect(sorted[0]).toMatchObject({ id: 99, title: 'X', issuer: 'Y' })
  })

  it('maneja array vacío', () => {
    expect(sortCertificatesByYear([])).toEqual([])
  })
})

describe('filterCertificatesByCategory', () => {
  const certs = [
    { id: 1, category: 'frontend' },
    { id: 2, category: 'backend' },
    { id: 3, category: 'frontend' },
  ]

  it('filtra por categoría existente', () => {
    expect(filterCertificatesByCategory(certs, 'frontend')).toHaveLength(2)
  })

  it('devuelve todos los certificados cuando no hay categoría', () => {
    expect(filterCertificatesByCategory(certs)).toBe(certs)
  })

  it('devuelve array vacío para categoría inexistente', () => {
    expect(filterCertificatesByCategory(certs, 'devops')).toEqual([])
  })
})