import { describe, it, expect } from 'vitest'
import { sortCertificatesByYear, filterCertificatesByCategory } from './certificates'

describe('sortCertificatesByYear', () => {
  const certs = [
    { id: 1, title: 'A', year: 2021 },
    { id: 2, title: 'B', year: 2023 },
    { id: 3, title: 'C', year: 2022 },
  ]

  it('ordena descendente por defecto (recientes primero)', () => {
    expect(sortCertificatesByYear(certs).map((c) => c.year)).toEqual([2023, 2022, 2021])
  })

  it('ordena ascendente cuando ascending=true', () => {
    expect(sortCertificatesByYear(certs, true).map((c) => c.year)).toEqual([2021, 2022, 2023])
  })

  it('no muta el array original', () => {
    const original = certs.map((c) => ({ ...c }))
    sortCertificatesByYear(certs)
    expect(certs).toEqual(original)
  })

  it('devuelve una nueva instancia de array', () => {
    expect(sortCertificatesByYear(certs)).not.toBe(certs)
  })

  it('trata años faltantes como 0 (van al final en descendente)', () => {
    const withMissing = [{ year: 2023 }, { year: undefined }, { year: 2020 }]
    expect(sortCertificatesByYear(withMissing).map((c) => c.year)).toEqual([2023, 2020, undefined])
  })

  it('trata años no parseables como 0', () => {
    const weird = [{ year: 'no-numero' }, { year: 2024 }, { year: null }]
    expect(sortCertificatesByYear(weird)[0]?.year).toBe(2024)
  })

  it('acepta años como string numérico', () => {
    const stringCerts = [{ year: '2021' }, { year: '2023' }]
    expect(sortCertificatesByYear(stringCerts).map((c) => c.year)).toEqual(['2023', '2021'])
  })

  it('preserva los otros campos de cada certificado', () => {
    const one = [{ id: 99, title: 'X', issuer: 'Y', year: 2020 }]
    expect(sortCertificatesByYear(one)[0]).toMatchObject({ id: 99, title: 'X', issuer: 'Y' })
  })

  it('maneja array vacío', () => {
    expect(sortCertificatesByYear([])).toEqual([])
  })
})

describe('filterCertificatesByCategory', () => {
  const certs = [
    { id: 1, category: 'Backend' },
    { id: 2, category: 'DevOps' },
    { id: 3, category: 'Backend' },
  ]

  it('filtra por categoría existente', () => {
    expect(filterCertificatesByCategory(certs, 'Backend')).toHaveLength(2)
  })

  it('devuelve la referencia original cuando no hay categoría', () => {
    expect(filterCertificatesByCategory(certs)).toBe(certs)
  })

  it('devuelve array vacío para categoría inexistente', () => {
    expect(filterCertificatesByCategory(certs, 'Mobile')).toEqual([])
  })
})
