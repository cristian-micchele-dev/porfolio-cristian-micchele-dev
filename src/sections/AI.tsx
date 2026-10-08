import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { DataRow } from '@/components/primitives/DataRow'
import { AgentConsole } from '@/components/terminal/AgentConsole'
import { knowledgeBase } from '@/data/knowledge'

/**
 * ASK CRISTIAN AI.
 *
 * La sección donde el interés por IA se vuelve concreto sin fingir que hay un
 * modelo detrás. El panel de la derecha dice exactamente cómo funciona: base
 * de conocimiento local detrás de un puerto, lista para que el adaptador se
 * reemplace por una API real sin tocar la UI.
 */
export function AI() {
  return (
    <Section id="ai">
      <SectionHeader
        endpoint="POST /ask"
        title="Ask Cristian AI"
        description="Un agente que responde sobre el perfil. Hoy sin modelo: base de conocimiento local, respuestas deterministas y cero alucinaciones."
      />

      <div className="grid items-start gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <AgentConsole />
        </Reveal>

        <Reveal delay={0.08} className="space-y-5 lg:col-span-5">
          <Panel label="how it works">
            <dl className="space-y-2 border-b border-line p-4">
              <DataRow label="port">AgentPort</DataRow>
              <DataRow label="adapter">LocalAgent</DataRow>
              <DataRow label="endpoint">POST /api/ask</DataRow>
              <DataRow label="rate limit">20 req/min</DataRow>
              <DataRow label="entries">{String(knowledgeBase.length)}</DataRow>
            </dl>

            <div className="space-y-3 p-4 text-[15px] leading-relaxed text-fg-muted">
              <p>
                La consola no habla con la base de conocimiento: habla con{' '}
                <code className="font-mono text-[13px] text-fg">AgentPort</code>, una interface.
                Hoy la cumple un adaptador local; mañana la puede cumplir una API de IA sin que
                la UI cambie una línea.
              </p>
              <p>
                Podría resolverse todo en el navegador y ahorrarse el salto por HTTP. No se hizo:
                con el endpoint ya en el medio, el día que haya un modelo real la credencial vive
                en el servidor y nunca puede filtrarse al bundle.
              </p>
              <p className="text-fg">
                Es la misma arquitectura hexagonal que declara la sección anterior, aplicada acá.
              </p>
            </div>
          </Panel>
        </Reveal>
      </div>
    </Section>
  )
}
