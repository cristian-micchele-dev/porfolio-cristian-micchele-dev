import { knowledgeBase, suggestedPrompts } from '@/data/knowledge'
import { blank, text } from '@/lib/terminal/lines'
import { matchEntry } from './matcher'
import type { AgentAnswer, AgentPort, KnowledgeEntry } from './types'

/**
 * Adaptador local: responde desde la base de conocimiento, sin red ni modelo.
 *
 * Corre en el servidor detrás de `POST /api/ask`. Cuando haya una API de IA
 * real se escribe otro adaptador que cumpla `AgentPort` y se cambia el que usa
 * el route handler — la UI no se entera.
 */
export class LocalAgent implements AgentPort {
  readonly name = 'local-knowledge-base'

  constructor(private readonly entries: readonly KnowledgeEntry[] = knowledgeBase) {}

  async ask(question: string): Promise<AgentAnswer> {
    const entry = matchEntry(question, this.entries)

    if (!entry) return this.fallback()

    return {
      lines: entry.answer(),
      sectionId: entry.sectionId,
      confidence: 'high',
      source: 'local',
      matchedId: entry.id,
    }
  }

  /**
   * El fallback no se disculpa: ofrece salidas.
   * Un "no entendí" a secas deja al visitante sin nada que hacer.
   */
  private fallback(): AgentAnswer {
    return {
      lines: [
        text('No tengo una respuesta precisa para eso.'),
        blank(),
        text('Podés preguntarme por:'),
        ...suggestedPrompts.map((entry) => text(`· ${entry.prompt}`)),
        blank(),
        text('O usar la terminal del inicio para consultar el perfil directo.'),
      ],
      confidence: 'low',
      source: 'local',
    }
  }
}
