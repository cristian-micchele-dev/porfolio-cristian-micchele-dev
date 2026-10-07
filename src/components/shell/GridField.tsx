/**
 * Fondo estructural: grid de hairlines a baja opacidad, con un desvanecido
 * radial para que no compita con el contenido en el centro.
 *
 * Esto es lo que reemplaza las partículas y los orbes animados que el brief
 * prohíbe (DESIGN.md §2). Es estático: cero costo de runtime, cero batería.
 */
export function GridField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="grid-field absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 75%)',
        }}
      />
    </div>
  )
}
