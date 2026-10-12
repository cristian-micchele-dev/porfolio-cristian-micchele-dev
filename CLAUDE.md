# CLAUDE.md

Guía para Claude Code (claude.ai/code) al trabajar en este repositorio.

> **Antes de escribir una línea de UI, leé `DESIGN.md`.** Es el contrato de diseño:
> tokens, blacklist visual, reglas de movimiento y accesibilidad. No es documentación
> aspiracional — si un componente lo viola, el componente está mal.

## Qué es esto

Portfolio personal de Cristian Micchele — Full Stack Developer, Backend Specialized.

Concepto: **CRISTIAN AI CONSOLE**. Un dashboard técnico con un widget de terminal
adentro, que mezcla terminal moderna + agente de IA + documentación de API. NO es un
emulador de terminal con contenido adentro, NO es un clon de VS Code.

## Comandos

```bash
npm run dev        # Dev server (Next.js)
npm run build      # Build de producción
npm start          # Servir el build
npm run lint       # ESLint 9 (flat config, eslint-config-next nativo)
npm run typecheck  # tsc --noEmit
npm test           # Vitest (sin watch)
npm run test:watch # Vitest en watch

npx vitest run src/lib/format.test.ts   # un archivo de test
```

CI corre `lint → typecheck → test` y después `build`, en push a `master` y a
`redesign/**` (`.github/workflows/ci.yml`).

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · Framer Motion · Vitest.

TypeScript está en `strict` **más** `noUncheckedIndexedAccess`, `noUnusedLocals`,
`noUnusedParameters` y `verbatimModuleSyntax`. Los type-only imports son obligatorios
(`import type { ... }`) — lo fuerza ESLint.

## Arquitectura

### Página única con scroll

Una sola ruta (`src/app/page.tsx`). Las secciones son anclas; se navega por hash y el
scroll-spy (`useActiveSection`) marca la activa. No hay router de cliente.

### Capas

```
src/
├─ app/                  # App Router: layout, page, route handlers
│  └─ api/
│     ├─ health/         # telemetría REAL del sistema (ver DESIGN.md §8)
│     ├─ ask/            # el agente, detrás de AgentPort
│     └─ contact/        # envío de mensajes, detrás de MailerPort
├─ components/
│  ├─ primitives/        # Panel, SectionHeader, StatusDot, DataRow, Reveal,
│  │                     # ResponseBlock, Section
│  ├─ terminal/          # TerminalShell (presentacional) + sus dos contenedores
│  └─ shell/             # StatusBar, SectionRail, GridField, SystemPanel
├─ sections/             # una sección = un componente
├─ hooks/                # useActiveSection, useSystemHealth, useTerminal, useAgent
├─ lib/                  # lógica pura + tests co-locados
│  ├─ terminal/          # registry de comandos, constructores de línea
│  ├─ agent/             # AgentPort + LocalAgent + HttpAgent + matcher
│  └─ mailer/            # MailerPort + ResendMailer
├─ data/                 # TODO el contenido, tipado
├─ types/                # content.ts — los tipos del contenido
└─ assets/images/        # importados estáticamente (next/image)
```

### `src/data/` es fuente única — regla crítica

Todo el contenido visible vive en `src/data/`, tipado contra `src/types/content.ts`.
Para cambiar algo del sitio se edita el dato, **nunca** el componente.

| Archivo | Contenido |
|---|---|
| `profile.ts` | identidad, contacto, foto |
| `projects.ts` | proyectos (slug, stack, arquitectura, status, deployment, links) |
| `stack.ts` | módulos por grupo, con `status: active \| learning` |
| `architecture.ts` | capas y conceptos de arquitectura |
| `caseStudy.ts` | el caso destacado: problema, decisiones **con su costo**, alcance |
| `clients.ts` | trabajo freelance con clientes (panel al final de Projects) |
| `certificates.ts` | certificaciones |
| `sections.ts` | orden, endpoint y título de cada sección |
| `knowledge.ts` | base de conocimiento del agente (prompts + keywords) |

**La sección, el comando de la terminal y la base de conocimiento del agente leen del
MISMO archivo.** Si pueden divergir, van a divergir, y un portfolio que se contradice
consigo mismo es peor que uno aburrido.

`src/data/content.test.ts` valida integridad del contenido: slugs únicos en kebab-case,
URLs https, arquitectura declarada en todo proyecto backend, clientes ordenados, etc.
Si agregás contenido y el test falla, el contenido está mal — no el test.

### Primitivos, no componentes ad-hoc

Las secciones se componen de los primitivos de `components/primitives/`:

- `Panel` — el átomo de diseño. Borde 1px, radio 6px, sin sombra, sin blur.
- `SectionHeader` — el patrón `GET /projects` + `Projects`. Idéntico en todas las secciones.
- `Reveal` — entrada en viewport con `once: true` y reduced-motion encapsulados.
- `ResponseBlock` — el bloque `200 OK { ... }` que precede al contenido.
- `StatusDot` — exige `label` accesible: ningún estado se comunica solo por color.
- `Section` — ancla del scroll-spy + canvas de 12 columnas.

No crees un panel a mano con `div + border + bg`. Usá `Panel`.

### Lógica testeable en `src/lib/`

Lógica no trivial se extrae a `src/lib/` con su test co-locado (`*.test.ts`), para
testearla aislada del componente. `cn.ts` es el concatenador de clases (sin clsx:
con tokens semánticos no hay conflictos de utilidades que justifiquen la dependencia).

### Puertos y adaptadores

Dos seams, los dos reales (no interfaces decorativas):

- **`AgentPort`** (`lib/agent/types.ts`) — la consola AI depende sólo de la interface.
  Hoy la cumple `LocalAgent` con una base de conocimiento; el día que haya una API de
  IA se escribe otro adaptador y se cambia **una línea** de `api/ask/route.ts`.
  La consola usa `HttpAgent` y no `LocalAgent` directo a propósito: sin el salto por
  HTTP el puerto sería decorativo, y la credencial del modelo terminaría en el bundle.
- **`MailerPort`** (`lib/mailer/types.ts`) — `resolveMailer()` devuelve `null` si no hay
  `RESEND_API_KEY` + `CONTACT_FROM`, y entonces `POST /api/contact` responde **501, no
  201**. Un formulario que dice "enviado" y tira el mensaje hace que alguien escriba,
  crea que llegó y nunca reciba respuesta. El cliente ofrece un `mailto` con el mensaje
  ya escrito.

Para activar el correo en Vercel: `RESEND_API_KEY`, `CONTACT_FROM` (dominio verificado)
y opcionalmente `CONTACT_TO`.

### Telemetría real, nunca decorativa

`GET /api/health` devuelve uptime, versión de Node, commit SHA y región reales. La
latencia la mide el cliente como round-trip real. **Nada de métricas hardcodeadas**:
un backend specialist que inventa números pierde credibilidad en cuanto alguien abre
devtools. Si un dato no se puede obtener de verdad, no se muestra.

### Alias

`@` → `/src`.

### Assets

Importación estática (`import img from '@/assets/images/projects/pulso.png'`) para que
`next/image` resuelva dimensiones y genere AVIF/WebP.

Nombres en **kebab-case minúscula, siempre**. Las extensiones en mayúscula (`.JPG`)
funcionan en Windows y rompen en Vercel/Linux, además de no estar declaradas como
módulo por Next.

## Deployment

Vercel (`vercel.json`, `framework: nextjs`).
