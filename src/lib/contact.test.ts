import { describe, it, expect } from 'vitest'
import {
  CONTACT_LIMITS,
  EMPTY_DRAFT,
  buildMailto,
  isValidContact,
  sanitizeContact,
  validateContact,
  type ContactDraft,
} from './contact'

const valid: ContactDraft = {
  name: 'Ana Pérez',
  email: 'ana@empresa.com',
  message: 'Hola Cristian, quería contactarte por una posición backend.',
}

const long = (n: number) => 'a'.repeat(n)

describe('validateContact — nombre', () => {
  it('acepta un nombre válido', () => {
    expect(validateContact(valid).name).toBeUndefined()
  })

  it('rechaza vacío', () => {
    expect(validateContact({ ...valid, name: '' }).name).toBeDefined()
  })

  it('rechaza sólo espacios', () => {
    expect(validateContact({ ...valid, name: '   ' }).name).toBeDefined()
  })

  it('rechaza por debajo del mínimo', () => {
    expect(validateContact({ ...valid, name: 'A' }).name).toContain('Mínimo')
  })

  it('acepta justo en el mínimo', () => {
    expect(validateContact({ ...valid, name: long(CONTACT_LIMITS.name.min) }).name).toBeUndefined()
  })

  it('acepta justo en el máximo y rechaza uno más', () => {
    expect(validateContact({ ...valid, name: long(CONTACT_LIMITS.name.max) }).name).toBeUndefined()
    expect(
      validateContact({ ...valid, name: long(CONTACT_LIMITS.name.max + 1) }).name,
    ).toContain('Máximo')
  })
})

describe('validateContact — email', () => {
  it.each([
    'ana@empresa.com',
    'ana.perez@sub.empresa.com.ar',
    'ana+trabajo@empresa.io',
    'a@b.co',
  ])('acepta %s', (email) => {
    expect(validateContact({ ...valid, email }).email).toBeUndefined()
  })

  it.each([
    '',
    '   ',
    'ana',
    'ana@',
    '@empresa.com',
    'ana@empresa',
    'ana empresa.com',
    'ana@@empresa.com',
    'ana@empresa.c',
  ])('rechaza %s', (email) => {
    expect(validateContact({ ...valid, email }).email).toBeDefined()
  })

  it('rechaza por longitud antes que por formato', () => {
    const huge = `${long(CONTACT_LIMITS.email.max)}@empresa.com`
    expect(validateContact({ ...valid, email: huge }).email).toContain('Máximo')
  })
})

describe('validateContact — mensaje', () => {
  it('acepta un mensaje válido', () => {
    expect(validateContact(valid).message).toBeUndefined()
  })

  it('rechaza vacío', () => {
    expect(validateContact({ ...valid, message: '' }).message).toBeDefined()
  })

  it('rechaza demasiado corto', () => {
    expect(validateContact({ ...valid, message: 'hola' }).message).toContain('mínimo')
  })

  it('acepta justo en el mínimo', () => {
    expect(
      validateContact({ ...valid, message: long(CONTACT_LIMITS.message.min) }).message,
    ).toBeUndefined()
  })

  it('rechaza por encima del máximo', () => {
    expect(
      validateContact({ ...valid, message: long(CONTACT_LIMITS.message.max + 1) }).message,
    ).toContain('Máximo')
  })

  it('no cuenta los espacios de los extremos para el mínimo', () => {
    const padded = `   ${long(CONTACT_LIMITS.message.min - 1)}   `
    expect(validateContact({ ...valid, message: padded }).message).toBeDefined()
  })
})

describe('validateContact — conjunto', () => {
  it('reporta todos los campos inválidos a la vez, no de a uno', () => {
    // Un formulario que revela un error por vez obliga a enviar tres veces.
    const errors = validateContact(EMPTY_DRAFT)
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('no devuelve errores cuando todo es válido', () => {
    expect(validateContact(valid)).toEqual({})
  })
})

describe('isValidContact', () => {
  it('es true sólo cuando no hay errores', () => {
    expect(isValidContact(valid)).toBe(true)
    expect(isValidContact(EMPTY_DRAFT)).toBe(false)
  })
})

describe('sanitizeContact', () => {
  it('recorta los tres campos', () => {
    expect(sanitizeContact({ name: ' Ana ', email: ' a@b.co ', message: ' hola ' })).toEqual({
      name: 'Ana',
      email: 'a@b.co',
      message: 'hola',
    })
  })

  it('no muta la entrada', () => {
    const draft = { name: ' Ana ', email: ' a@b.co ', message: ' hola ' }
    sanitizeContact(draft)
    expect(draft.name).toBe(' Ana ')
  })
})

describe('buildMailto', () => {
  it('apunta al destinatario indicado', () => {
    expect(buildMailto('c@micchele.dev', valid)).toMatch(/^mailto:c@micchele\.dev\?/)
  })

  it('incluye el nombre en el asunto', () => {
    const url = buildMailto('c@micchele.dev', valid)
    expect(decodeURIComponent(url)).toContain('Contacto desde el portfolio — Ana Pérez')
  })

  it('incluye el mensaje y la firma con el email de contacto', () => {
    const body = decodeURIComponent(buildMailto('c@micchele.dev', valid))
    expect(body).toContain(valid.message)
    expect(body).toContain(valid.email)
  })

  it('escapa saltos de línea y caracteres especiales', () => {
    const url = buildMailto('c@micchele.dev', {
      ...valid,
      message: 'línea 1\nlínea 2 & más ?query=1',
    })
    // Sin escapar, el & cortaría el mailto y perdería el resto del mensaje.
    expect(url).not.toContain('línea 1\n')
    expect(url).toContain('%0A')
    expect(url).toContain('%26')
  })

  it('recorta antes de componer', () => {
    const url = decodeURIComponent(buildMailto('c@micchele.dev', { ...valid, name: '  Ana  ' }))
    expect(url).toContain('portfolio — Ana')
    expect(url).not.toContain('portfolio —   Ana')
  })
})
