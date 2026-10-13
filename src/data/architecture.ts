import type { ArchitectureConcept, ArchitectureLayer } from '@/types/content'

/**
 * Lo que respondé el agente cuando le preguntan por arquitectura.
 *
 * Decía "Mantengo la lógica de negocio independiente del framework" — presente
 * habitual, o sea: así trabajo siempre. No es cierto. Hexagonal se aplicó en
 * Pulso y en Parking Admin API, deliberadamente, para aprender el patrón.
 *
 * Afirmar una práctica constante que no existe es el mismo error que
 * inventarle razones a una decisión.
 */
export const architectureStatement =
  'En Pulso y en Parking Admin API trabajé con el dominio aislado del framework y de la base: la lógica de negocio no sabe que existe NestJS ni PostgreSQL. Lo apliqué para aprender el patrón, no porque lo use en todo.'

/** De adentro hacia afuera. El orden importa: es la dirección de las dependencias. */
export const architectureLayers: readonly ArchitectureLayer[] = [
  {
    id: 'domain',
    name: 'domain',
    description: 'Entidades y reglas de negocio. Cero dependencias hacia afuera.',
    examples: ['Entities', 'Value Objects', 'Domain Errors'],
  },
  {
    id: 'application',
    name: 'application',
    description: 'Casos de uso. Orquesta el dominio y define los puertos que necesita.',
    examples: ['Use Cases', 'Ports', 'DTOs'],
  },
  {
    id: 'adapters',
    name: 'adapters',
    description: 'Traduce el mundo exterior a los puertos. Entra y sale por acá.',
    examples: ['Controllers', 'Repositories', 'Guards', 'Mappers'],
  },
  {
    id: 'infrastructure',
    name: 'infrastructure',
    description: 'Lo concreto y reemplazable: framework, driver de base, transporte.',
    examples: ['NestJS', 'TypeORM', 'PostgreSQL', 'Socket.IO'],
  },
] as const

export const architectureConcepts: readonly ArchitectureConcept[] = [
  {
    name: 'Clean Architecture',
    description: 'Dependencias apuntando siempre hacia el dominio, nunca al revés.',
  },
  {
    name: 'Hexagonal Architecture',
    description: 'Puertos y adaptadores: el core define la interface, la infra la implementa.',
  },
  {
    name: 'REST APIs',
    description: 'Recursos, verbos y códigos de estado correctos. Contratos documentados.',
  },
  {
    name: 'Authentication',
    description: 'JWT con refresh rotativo, cookies httpOnly, CSRF y hashing con Argon2.',
  },
  {
    name: 'RBAC',
    description: 'Roles evaluados en el borde, antes de que la petición toque el dominio.',
  },
  {
    name: 'Database Design',
    description: 'Normalización, índices por patrón de acceso y migraciones versionadas.',
  },
] as const
