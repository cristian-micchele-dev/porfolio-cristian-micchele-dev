/**
 * Cursor de bloque parpadeante.
 *
 * El parpadeo es por `steps(2)`, no por fade: un caret que se desvanece
 * suavemente no es un caret de terminal, es un pulso decorativo.
 */
export function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] animate-[caret_1.06s_steps(2,jump-none)_infinite] bg-accent"
    />
  )
}
