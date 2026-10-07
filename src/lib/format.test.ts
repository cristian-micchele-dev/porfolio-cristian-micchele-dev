import { describe, it, expect } from 'vitest'
import { formatMonthYear, formatLatency, stripProtocol } from './format'

describe('formatMonthYear', () => {
  it('formatea un ISO mes-año válido', () => {
    expect(formatMonthYear('2026-02')).toBe('feb 2026')
  })

  it('formatea enero y diciembre (bordes del array)', () => {
    expect(formatMonthYear('2025-01')).toBe('ene 2025')
    expect(formatMonthYear('2025-12')).toBe('dic 2025')
  })

  it('devuelve el crudo si el formato no coincide', () => {
    expect(formatMonthYear('2026')).toBe('2026')
    expect(formatMonthYear('')).toBe('')
    expect(formatMonthYear('feb 2026')).toBe('feb 2026')
  })

  it('devuelve el crudo si el mes está fuera de rango', () => {
    expect(formatMonthYear('2026-00')).toBe('2026-00')
    expect(formatMonthYear('2026-13')).toBe('2026-13')
  })
})

describe('formatLatency', () => {
  it('redondea a entero y agrega la unidad', () => {
    expect(formatLatency(23.4)).toBe('23ms')
    expect(formatLatency(23.6)).toBe('24ms')
  })

  it('devuelve placeholder cuando no hay medición', () => {
    expect(formatLatency(null)).toBe('--')
  })

  it('rechaza valores no finitos y negativos', () => {
    expect(formatLatency(Number.NaN)).toBe('--')
    expect(formatLatency(Number.POSITIVE_INFINITY)).toBe('--')
    expect(formatLatency(-5)).toBe('--')
  })

  it('acota el techo para no romper el ancho de la status bar', () => {
    expect(formatLatency(123456)).toBe('9999ms')
  })

  it('acepta cero', () => {
    expect(formatLatency(0)).toBe('0ms')
  })
})

describe('stripProtocol', () => {
  it('quita https y la barra final', () => {
    expect(stripProtocol('https://github.com/user/repo/')).toBe('github.com/user/repo')
  })

  it('quita http', () => {
    expect(stripProtocol('http://example.com')).toBe('example.com')
  })

  it('deja intacta una URL sin protocolo', () => {
    expect(stripProtocol('example.com/path')).toBe('example.com/path')
  })
})
