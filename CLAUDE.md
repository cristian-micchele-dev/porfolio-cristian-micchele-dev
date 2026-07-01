# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint (v9 flat config)
```

No test suite is configured.

## Architecture

Single-page portfolio (SPA) with smooth-scroll navigation — React Router is installed but **not used for routing**; sections are scrolled into view via `useSmoothScroll`.

### Data-driven content

All visible content lives in `src/data/`. To add or modify anything shown on the site, edit the relevant data file rather than the component:

| File | Content |
|------|---------|
| `projectsData.js` | Project list with title, description, tech, image, links |
| `sectionsData.js` | Project category tabs (Backend / Frontend / FullStack) |
| `skillsData.js` | Skills grouped by category |
| `experienceData.js` | Work experience entries |
| `certificatesData.js` | Certifications |
| `contactData.js` | Contact info |

### Component structure

`App.jsx` renders `<AnimatedBackground> → <Header> → <Home> → <Footer>` (with `Header`/`Home`/`Footer` wrapped in a z-indexed `div` that sits above the fixed canvas). `Home.jsx` (in `src/pages/`) composes all section components in order. There is no global state — components use local `useState` and three custom hooks in `src/hooks/`:

- `useSmoothScroll.js` — smooth-scroll to section IDs; used by Header nav links
- `useCertificates.js` — certificate display logic
- `useEmailHandler.js` — email CTA handler

Components live in `src/components/`. Two conventions coexist:

- **Single-file sections** (`About`, `Hero`, `Skills`, `Experience`, `ProjectsSection`, `ProjectCard`, `Header`, `Footer`, `AboutImage`, `AnimatedBackground`) — one `.jsx` file per section at the root of `components/`.
- **Feature folders** (`Certificates/`, `Contact/`) — the container is `index.jsx` and its sub-components (`CertificateCard`, `CertificatesHeader`, `CertificateIcon` / `CallToAction`, `ContactCard`, `ContactIcons`) sit alongside it. Imports from `Home.jsx` resolve by folder name (e.g. `../components/Certificates` → `Certificates/index.jsx`), so the container file inside the folder must stay named `index.jsx`.

### ProjectCard type detection

`ProjectCard.jsx` auto-classifies a project as Backend, Frontend, or FullStack by checking its `technologies` array against a predefined list. No explicit `type` prop is needed in `projectsData.js`.

### Animations

Framer Motion (`motion.*` components + `whileInView` / `variants`) is used across most components. Animations trigger on scroll via Intersection Observer. Staggered children use `staggerChildren` in the parent `variants` object.

### Path alias

`@` maps to `/src` (configured in `vite.config.js`).

### Deployment

Configured for Vercel (`vercel.json`). Build output is `dist/`.
