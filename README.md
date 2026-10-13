# Cristian AI Console

Portfolio personal de **Cristian Micchele** — Full Stack Developer, Backend Specialized.

![CI](https://github.com/cristian-micchele-dev/porfolio-cristian-micchele-dev/actions/workflows/ci.yml/badge.svg)

No es un portfolio con una terminal de adorno: es un **dashboard técnico** donde el
visitante consulta el perfil como consultaría un sistema. La forma comunica el mensaje.

---

## Tres decisiones que lo definen

### 0. Los endpoints que el sitio muestra existen

Cada sección exhibe su request (`GET /api/projects → 200 OK`). No es una ilustración:

```bash
curl https://cristianmicchele.dev/api            # el mapa
curl https://cristianmicchele.dev/api/projects?kind=backend
curl https://cristianmicchele.dev/api/projects/pulso   # detalle + caso de estudio
curl https://cristianmicchele.dev/api/architecture
```

Devuelven la misma data que ves en pantalla, con errores accionables: un `?kind=`
inválido responde `400` con los valores permitidos, y un slug inexistente responde
`404` con la lista de los que sí existen.

Un `200 OK` dibujado que en realidad es un 404 es la misma mentira que una métrica
inventada — sólo que más fácil de desmentir, porque esta audiencia curlea.

### 1. La telemetría es real

La barra superior muestra `SYSTEM ONLINE` y una latencia. Esa latencia es el round-trip
medido contra `GET /api/health`, que devuelve uptime, versión de Node, commit SHA y
región reales.

No hay `DATABASE: CONNECTED`, porque no hay base de datos. **Si un dato no se puede
obtener de verdad, no se muestra.** Un backend specialist que inventa métricas pierde
credibilidad en cuanto alguien abre devtools.

### 2. El agente está detrás de un puerto, no de un `if`

```
AgentPort (interface)
 ├── LocalAgent   base de conocimiento, corre en el servidor
 └── HttpAgent    POST /api/ask, corre en el cliente
```

La consola usa `HttpAgent` y no `LocalAgent` directo, aunque eso agregue un round-trip
para una respuesta local. Si resolviera en el browser, el puerto sería decorativo y el
día que haya un modelo real habría que reescribir la UI. Con el salto HTTP ya hecho,
ese día cambia **una línea** del route handler — y la credencial nunca puede filtrarse
al bundle.

Es la misma arquitectura hexagonal que declara la sección Architecture, aplicada al
propio sitio.

### 3. El formulario de contacto no miente

Sin `RESEND_API_KEY` configurada, `POST /api/contact` responde **501, no 201**. El
cliente lo declara y entrega el mensaje ya escrito en un `mailto`.

Un formulario que dice "enviado" y tira el mensaje hace que alguien escriba, crea que
llegó y nunca reciba respuesta. Es el peor bug posible en un portfolio, y es invisible.

---

## Stack

**Next.js 16** (App Router) · **TypeScript** strict · **Tailwind CSS v4** ·
**Framer Motion** · **Vitest**

TypeScript corre con `strict` más `noUncheckedIndexedAccess`, `noUnusedLocals`,
`noUnusedParameters` y `verbatimModuleSyntax`.

## Comandos

```bash
npm run dev        # Dev server
npm run build      # Build de producción
npm start          # Servir el build
npm run lint       # ESLint 9 (flat config)
npm run typecheck  # tsc --noEmit
npm test           # Vitest
```

CI corre `lint → typecheck → test` y después `build`.

## Estructura

```
src/
├─ app/           App Router + los tres endpoints (health, ask, contact)
├─ components/
│  ├─ primitives/ Panel, SectionHeader, DataRow, Reveal, ResponseBlock…
│  ├─ terminal/   TerminalShell presentacional + sus dos contenedores
│  └─ shell/      StatusBar, SectionRail, LogFooter, providers
├─ sections/      una sección = un componente
├─ lib/           lógica pura + tests co-locados (terminal, agent, mailer)
├─ data/          TODO el contenido, tipado
└─ types/         los tipos del contenido
```

**`src/data/` es fuente única.** La sección, el comando de la terminal y la base de
conocimiento del agente leen del mismo archivo — si pudieran divergir, divergirían, y
un portfolio que se contradice consigo mismo es peor que uno aburrido.

Para cambiar algo del sitio se edita el dato, nunca el componente.

## Diseño

Las reglas están en [`DESIGN.md`](./DESIGN.md): tokens, blacklist visual, reglas de
movimiento y accesibilidad. No es documentación aspiracional — si un componente lo
viola, el componente está mal.

Todo el texto de contenido cumple **WCAG AA** sobre el fondo del sitio.

## Configuración

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica. Define el `metadataBase`, la imagen OG y el sitemap |
| `RESEND_API_KEY` | Activa el envío real del formulario de contacto |
| `CONTACT_FROM` | Remitente de un dominio verificado en Resend |
| `CONTACT_TO` | Destinatario. Por defecto, el email del perfil |

Sin las de correo el sitio funciona igual: el formulario responde 501 y ofrece el
`mailto` de respaldo.

## Licencia

El código es de consulta libre. El contenido, los textos y las imágenes son personales.
