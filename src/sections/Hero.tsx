import { Reveal } from '@/components/primitives/Reveal'
import { CommandTerminal } from '@/components/terminal/CommandTerminal'
import { IdentityPanel } from '@/components/IdentityPanel'
import { profile } from '@/data/profile'
import { profileStats } from '@/lib/profileStats'
import { about } from '@/data/about'

const stats = profileStats()

/**
 * Hero. Ocupa casi toda la primera pantalla, partido en dos áreas.
 *
 * Izquierda: identidad tipográfica, números para calibrar, el párrafo de
 * "sobre mí" y la terminal.
 * Derecha: la tarjeta de identidad con los accesos directos.
 *
 * No usa SectionHeader: es la única sección donde el nombre es el h1 y el
 * endpoint va como etiqueta suelta. Las demás sí comparten el patrón.
 */
export function Hero() {
  return (
    <section
      id="identity"
      className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-[1200px] scroll-mt-20 flex-col justify-center px-4 py-16 sm:px-6"
    >
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* ---------------------------------------------------------------- */}
        {/* Identidad + terminal                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label-mono mb-5 text-accent">GET /identity</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-fg">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-4 font-mono text-[15px] text-fg-muted">
              {profile.role}
              <span className="mx-2 text-fg-faint" aria-hidden="true">
                ·
              </span>
              <span className="text-accent">{profile.specialization}</span>
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-6 max-w-[52ch] text-fg-muted">{profile.summary}</p>
          </Reveal>

          {/* ------------------------------------------------------------ */}
          {/* Números para calibrar                                        */}
          {/*                                                              */}
          {/* Sin esto, "Full Stack Developer" se lee como junior por      */}
          {/* defecto. No hay años ni seniority porque no están en los     */}
          {/* datos: sólo cosas que el visitante puede comprobar con un    */}
          {/* click. Ver src/lib/profileStats.ts                           */}
          {/* ------------------------------------------------------------ */}
          <Reveal delay={0.22}>
            <dl className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <dt className="font-mono text-lg tabular-nums text-fg">{stat.value}</dt>
                  <dd className="label-mono text-fg-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* ------------------------------------------------------------ */}
          {/* Sobre mí, arriba de la terminal                              */}
          {/*                                                              */}
          {/* Funciona como lente: dice qué hace cuando algo no lo entiende, */}
          {/* y quien lo lee acá recorre el resto del sitio con más contexto. */}
          {/* Un párrafo y no dos: el hero llena la pantalla justo y el     */}
          {/* segundo empujaba la terminal abajo del fold.                  */}
          {/* ------------------------------------------------------------ */}
          <Reveal delay={0.26}>
            <p className="mt-8 max-w-[52ch] border-l border-line pl-4 text-[15px] leading-relaxed text-fg-muted">
              {about}
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <CommandTerminal className="mt-8" seedCommand="whoami" />
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Identidad verificada                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4 lg:col-span-5">
          <Reveal delay={0.1}>
            <IdentityPanel />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
