import type { CaseStudy } from '@/types/content'

/**
 * El caso destacado: el proyecto que sostiene todo lo que el sitio afirma.
 *
 * No es una card más larga. Una card enumera features; un caso expone
 * DECISIONES, y una decisión sin su costo declarado es marketing. Por eso el
 * tipo exige `tradeoff` en cada una: es el campo que separa "usé arquitectura
 * hexagonal" de "sé cuándo NO usarla".
 *
 * Eso es lo que un tech lead lee antes de decidir si te llama.
 */
export const caseStudy: CaseStudy = {
  projectId: 'pulso',

  headline:
    'Sistema interno de gestión hospitalaria. El caso donde las reglas de acceso importaban más que las features.',

  problem:
    'Una historia clínica no es un recurso más: quién la lee, cuándo y por qué es parte del requisito, no un extra. El sistema tenía que coordinar médicos, pacientes, turnos y mensajería sin que una regla de negocio clínica terminara escrita dentro de un controller.',

  decisions: [
    {
      title: 'Arquitectura hexagonal, por aprendizaje deliberado',
      rationale:
        'No lo pedía el proyecto: quería aprender el patrón construyendo algo real y no un to-do list. Entender por qué existe la separación entre dominio e infraestructura me importaba más que terminar rápido.',
      tradeoff:
        'Más archivos e indirección de la que el proyecto estrictamente necesitaba. En un CRUD de tres tablas no estoy seguro de que lo repetiría: la ceremonia se nota mucho más cuando el dominio es chico.',
    },
  ],

  scope: [
    { label: 'dominio', value: 'Médicos · Pacientes · Turnos · Historia clínica' },
    { label: 'tiempo real', value: 'Mensajería con Socket.IO' },
    { label: 'seguridad', value: 'JWT + refresh rotativo · CSRF · Argon2 · rate limiting' },
    { label: 'control de acceso', value: 'RBAC por roles' },
  ],
}
