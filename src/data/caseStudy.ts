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
      title: 'Arquitectura hexagonal desde el día uno',
      rationale:
        'El dominio clínico sobrevive al framework. Las reglas sobre quién puede ver una historia no deberían depender de NestJS ni de TypeORM, porque cambian por motivos distintos y en momentos distintos.',
      tradeoff:
        'Más archivos y más ceremonia por caso de uso. En un CRUD chico no se justifica; acá sí, porque las reglas de acceso cambian más seguido que el transporte.',
    },
    {
      title: 'Refresh rotativo en cookies httpOnly, no JWT en localStorage',
      rationale:
        'Un token en localStorage es legible por cualquier script de la página. Con httpOnly, un XSS deja de ser robo de sesión directo, y la rotación acota la ventana si un refresh igual se filtra.',
      tradeoff:
        'Obliga a montar protección CSRF, que con localStorage no haría falta. Se cambió un vector de ataque por otro — pero por uno que se mitiga con una defensa conocida y verificable.',
    },
    {
      title: 'RBAC con permisos granulares, no roles planos',
      rationale:
        '"Médico" no alcanza como permiso: un médico puede ver la historia de su paciente, no la de todos. El permiso se evalúa contra el recurso concreto, no sólo contra la etiqueta del usuario.',
      tradeoff:
        'Cada endpoint sensible tiene que declarar explícitamente qué permiso exige. Más verboso, pero el error de autorización deja de ser silencioso: si falta la declaración, no pasa.',
    },
    {
      title: 'Auditoría de los accesos a datos sensibles',
      rationale:
        'Un acceso indebido sin registro es indetectable. En un dominio de salud, poder reconstruir quién leyó qué es tan parte del sistema como poder leerlo.',
      tradeoff:
        'Una escritura extra en cada lectura de historia clínica. Se paga en rendimiento sobre el camino más transitado, y se acepta: el costo de no poder auditar es mayor.',
    },
  ],

  scope: [
    { label: 'dominio', value: 'Médicos · Pacientes · Turnos · Historia clínica' },
    { label: 'tiempo real', value: 'Mensajería con Socket.IO' },
    { label: 'seguridad', value: 'JWT + refresh rotativo · CSRF · Argon2 · rate limiting' },
    { label: 'control de acceso', value: 'RBAC granular + auditoría' },
  ],
}
