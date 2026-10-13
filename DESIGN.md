# DESIGN.md — Contrato de diseño

> Reglas duras del rediseño **CRISTIAN AI CONSOLE**.
> Esto no es documentación aspiracional: es el contrato. Si un componente lo viola, el componente está mal.
> Toda fase de construcción se lee este archivo antes de escribir una línea de UI.

---

## 1. Concepto

El sitio es un **dashboard técnico con un widget de terminal adentro**.

NO es un emulador de terminal con contenido adentro. NO es un clon de VS Code.

La metáfora (terminal + agente de IA + documentación de API) refuerza el posicionamiento:
Full Stack Developer especializado en Backend. La forma comunica el mensaje.

**Prioridad, en este orden exacto:**

1. Legibilidad
2. Diseño
3. Experiencia
4. Personalidad

Si un efecto gana en personalidad y pierde en legibilidad, el efecto se cae.

---

## 2. Blacklist — prohibido sin excepción

Estos son los patrones que delatan un template generado por IA. No se usan:

| ❌ Prohibido | Por qué |
|---|---|
| Gradientes violetas / púrpura | Firma visual de portfolio-IA genérico |
| Glassmorphism (`backdrop-blur` sobre contenido) | Único uso permitido: la status bar fija |
| Cards flotantes con sombra por todas partes | Los paneles se apoyan en el plano, no flotan |
| Neón / colores saturados al máximo | El accent es desaturado y escaso |
| Partículas, estrellas, orbes animados | Se reemplazan por un grid de hairlines estático |
| Glow excesivo (`box-shadow` de color difuso) | Máx. 1px de ring en accent, y solo en `:hover`/`:focus` |
| Bordes redondeados gigantes (`rounded-2xl`+) | Radio máximo: **6px**. Es un sistema, no una app de wellness |
| Verde hacker / estética Matrix | Explícitamente rechazado |
| Cyberpunk, scanlines, glitch, CRT | Explícitamente rechazado |
| Emojis en la UI | Rompe el registro técnico |
| Texto sobre imagen sin capa de contraste | Falla de legibilidad |

---

## 3. Tokens

**Nunca** usar hex literal en un componente. Siempre el token semántico.
Definidos en `src/app/globals.css` dentro de `@theme`.

### Superficies

| Token | Valor | Uso |
|---|---|---|
| `canvas` | `#08090C` | Fondo de página. Único. (Se llama `canvas` y no `base` para no colisionar con la utilidad `text-base` de font-size de Tailwind v4) |
| `surface` | `#111318` | Paneles |
| `surface-hi` | `#171A21` | Panel en hover, filas alternas, headers de panel |

### Líneas

| Token | Valor | Uso |
|---|---|---|
| `line` | `#232630` | Borde por defecto (1px, siempre 1px) |
| `line-hi` | `#333848` | Borde en hover / panel activo |

### Texto

| Token | Valor | Contraste s/ canvas | Uso permitido |
|---|---|---|---|
| `fg` | `#E5E7EB` | 15.8:1 | Títulos, body |
| `fg-muted` | `#8B949E` | 6.5:1 | Secundario, labels, descripciones. **AA ✓** |
| `fg-faint` | `#6E7681` | 4.3:1 | ⚠️ **Solo decorativo o ≥18px bold.** Nunca body copy |

### Accent y estado

| Token | Valor | Uso |
|---|---|---|
| `accent` | `#4FB8D9` | Cyan desaturado, 8.7:1. Status, links, caret, indicador activo |
| `accent-dim` | `#1E5F73` | Rings, fills al 10-20%, bordes sutiles |
| `ok` | `#3FB950` | `status: active`, `200 OK`, `CONNECTED` |
| `warn` | `#D29922` | `status: learning`, `WIP` |
| `err` | `#F85149` | Errores de formulario, `4xx/5xx` |

### Presupuesto de accent — regla dura

> El accent ocupa **menos del 5% de la superficie visible** en cualquier viewport.

Permitido en: status dots, links, caret de terminal, indicador de sección activa,
códigos de respuesta HTTP, ring de focus, 1px de borde en hover.

Prohibido en: fondos de bloque, textos de párrafo, botones rellenos grandes, títulos.

---

## 4. Tipografía

| Rol | Familia | Reglas |
|---|---|---|
| Títulos, body, prosa | **Inter** (`font-sans`) | `tracking-tight` en ≥24px |
| Datos, status, paths, código, labels | **JetBrains Mono** (`font-mono`) | `tracking-normal`, uppercase solo en labels ≤12px |

Ambas self-hosted vía `next/font`. **Cero `<link>` a Google Fonts** — evita CLS y una
request de terceros.

### Tamaños mínimos — no negociable

- Body / prosa: **16px**
- Mono en contenido (terminal, datos): **14px**
- Mono en labels decorativos: **11px**, siempre con `tracking-wider` y `uppercase`

Nada por debajo de 11px. Nunca.

### El patrón de título de sección

Es la firma tipográfica del sitio y se repite en todas las secciones:

```
GET /projects          ← mono 11px, uppercase, accent, tracking-wider
Projects               ← Inter 32-40px, fg, tracking-tight
```

El contraste sans/mono ES la identidad visual. No lo rompas usando un solo tipo.

---

## 5. Layout

### Cuatro capas, ninguna encerrada en una "ventana"

1. **Status bar** — `fixed top`, 48px, `border-b line`, `backdrop-blur`.
   No es una nav: es una barra de sistema. El único glassmorphism del sitio.
2. **Section rail** — `fixed left`, solo ≥1280px. Índice vertical `01..0N` estilo
   gutter de números de línea. Marca la sección activa.
3. **Canvas** — grid de 12 columnas, `max-width: 1200px`, fondo con grid de hairlines
   a ~2% de opacidad. Esto reemplaza las partículas.
4. **Log footer** — stream de líneas `[system]` / `[api]` / `[db]`.

### Panel: el átomo de diseño

Un solo primitivo compone todas las secciones:

```
bg-surface · border border-line · rounded-[6px] · label mono uppercase en el header
```

Sin sombra. Sin blur. Sin gradiente. El panel **se apoya**, no flota.

### Espaciado

Escala de 4px. Separación entre secciones: `py-24` (96px) desktop, `py-16` mobile.
Padding interno de panel: 20px (`p-5`); 16px en mobile.

---

## 6. Movimiento

| Regla | Valor |
|---|---|
| Duración máxima | **450ms** (excepto pulso de status y boot) |
| Easing por defecto | `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out-expo`) |
| Desplazamiento de entrada | `y: 12-16px`. Nunca más. Nunca `x`, nunca `scale` |
| Repetición | `whileInView` **siempre** con `once: true` |
| `prefers-reduced-motion` | Apaga typewriter, boot, stagger y pulso. Los fades quedan |

**Prohibido:** parallax, scroll-jacking, animaciones atadas al progreso del scroll,
`animate` en loop infinito salvo el status dot, cualquier cosa que impida leer mientras se mueve.

---

## 7. Accesibilidad — condición de entrada, no pulido final

- El input de la terminal es un `<input>` real. Nunca un `div contenteditable`.
- El output de la terminal vive en un contenedor con `aria-live="polite"`.
- Focus ring visible en todo lo interactivo: `ring-1 ring-accent` + `ring-offset-2 ring-offset-canvas`.
- Todo texto de contenido cumple **WCAG AA** (4.5:1). Ver tabla de tokens.
- La boot sequence es un **overlay** sobre contenido ya renderizado en el HTML:
  los crawlers y los lectores de pantalla nunca la ven. Es `aria-hidden`.
- Navegación completa por teclado. `Cmd/Ctrl+K` abre la terminal desde cualquier scroll.
- Ningún estado se comunica **solo** por color: el status dot va con texto al lado.

---

## 8. Honestidad del sistema

> La telemetría que se muestra es **real**, nunca decorativa.

`API STATUS`, `LATENCY`, `DATABASE`, `DEPLOYMENT` salen de `GET /api/health`, y la latencia
se mide como round-trip real en el cliente.

Razón: un backend specialist que muestra métricas inventadas pierde toda credibilidad en
cuanto alguien abre devtools. La métrica real cuesta lo mismo y **prueba** el posicionamiento
en lugar de decorarlo.

Si un dato no se puede obtener de verdad, no se muestra.

### Los endpoints exhibidos existen

Cada `ResponseBlock` que muestra `GET /api/algo → 200 OK` corresponde a una ruta real
que devuelve esa misma data. La audiencia de este sitio curlea.

**Al agregar un `ResponseBlock` con una ruta nueva, se crea el route handler.** Un
`200 OK` en pantalla que en realidad es un 404 es la misma mentira que una métrica
inventada, sólo que más fácil de desmentir.

Hoy existen: `/api`, `/api/health`, `/api/projects`, `/api/projects/{id}`,
`/api/modules`, `/api/architecture`, `/api/ask`, `/api/contact`.

---

## 9. Checklist antes de cerrar cualquier fase

- [ ] Cero hex literales en componentes — solo tokens
- [ ] Cero elementos de la blacklist (§2)
- [ ] Accent por debajo del 5% de superficie
- [ ] Ninguna animación supera 450ms
- [ ] Todo `whileInView` tiene `once: true`
- [ ] `prefers-reduced-motion` verificado
- [ ] Radio ≤ 6px en todo
- [ ] Bordes de 1px, nunca 2px+
- [ ] Mono ≥ 14px en contenido, ≥ 11px en labels
- [ ] Focus visible en cada elemento interactivo
- [ ] Legible y usable a 360px de ancho
- [ ] Todo endpoint exhibido en un `ResponseBlock` responde de verdad (§8)
