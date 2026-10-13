import { BootSkip } from './BootSkip'

const STEPS = [
  { tag: 'init', detail: 'cristian.dev' },
  { tag: 'load', detail: 'profile' },
  { tag: 'load', detail: 'projects' },
  { tag: 'load', detail: 'system modules' },
  { tag: 'ready', detail: 'ai agent' },
] as const

/**
 * Boot sequence: 1.35s, omitible, una vez por sesión.
 *
 * Tres decisiones deliberadas:
 *
 * 1. La animación es CSS puro. Si dependiera de la hidratación habría un
 *    flash — el contenido se vería, después aparecería el overlay y después
 *    se iría. Así el overlay está en el HTML del servidor y se desvanece solo,
 *    con o sin JavaScript.
 *
 * 2. Es un OVERLAY sobre contenido YA renderizado, y va `aria-hidden`. Los
 *    crawlers y los lectores de pantalla nunca lo ven: el HTML completo del
 *    portfolio existe desde el primer byte.
 *
 * 3. Con `prefers-reduced-motion` no se muestra nunca. No se "acorta": se
 *    elimina.
 */
export function BootSequence() {
  return (
    <div id="boot" aria-hidden="true" className="boot-overlay">
      <div className="boot-panel">
        <ol className="boot-steps">
          {STEPS.map((step, index) => (
            <li key={`${step.tag}-${step.detail}`} style={{ animationDelay: `${index * 0.13}s` }}>
              <span className="boot-tag">{step.tag}</span>
              <span className="boot-detail">{step.detail}</span>
              <span className="boot-ok">ok</span>
            </li>
          ))}
        </ol>

        <p className="boot-online" style={{ animationDelay: `${STEPS.length * 0.13}s` }}>
          SYSTEM ONLINE
        </p>
      </div>

      <BootSkip />
    </div>
  )
}
