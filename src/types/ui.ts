/**
 * Vocabulario visual compartido entre capas.
 *
 * `DotTone` vivía dentro de `components/primitives/StatusDot.tsx`, y eso
 * obligaba a `lib/projects.ts` y `lib/stack.ts` —lógica pura, la capa de
 * adentro— a importar de `components/`, la capa de afuera. La flecha de
 * dependencia apuntaba al revés: justo lo que la arquitectura que este
 * portfolio exhibe prohíbe.
 *
 * El import era `import type`, así que desaparecía al compilar y no costaba
 * un byte en runtime. Pero el acoplamiento conceptual era real: tocar un
 * primitivo de UI podía romper la lógica de negocio.
 *
 * `types/` no importa de ninguna otra capa, así que ahora `lib/` y
 * `components/` apuntan los dos hacia adentro.
 */

/** Tonos semánticos de estado. Nunca comunican solos: siempre con label (DESIGN.md §7). */
export type DotTone = 'ok' | 'warn' | 'err' | 'accent' | 'muted'
