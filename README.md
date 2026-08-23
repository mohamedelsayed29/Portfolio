# ELRAYAN — Portfolio & Booking Frontend

A React + Vite portfolio for a software studio: displays project case studies, presents
services (frontend, backend, mobile, AI/LLM, bug fixing, technical discovery), and lets
visitors **book a project or a meeting** through a three-step flow.

Design language is Apple-inspired — one accent colour, hairline borders, generous
whitespace, and motion that decelerates rather than bounces.

## Stack

| Concern    | Choice                                   |
| ---------- | ---------------------------------------- |
| Build      | Vite 8                                   |
| UI         | React 19 (native `<title>`/`<meta>` hoisting) |
| Routing    | React Router 7 (lazy routes)             |
| Styling    | Tailwind CSS 4 (`@theme` tokens, no config file) |
| Motion     | Motion (`motion/react`)                  |
| Icons      | lucide-react                             |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

Copy `.env.example` to `.env`, configure the server-only Resend credentials, and run the
site with `npm run dev`. Booking submissions use the same-origin `/api/bookings` endpoint
and only show success after email delivery is confirmed. `VITE_API_URL` is optional and
only replaces the deterministic local availability data.

## Folder structure

```
src/
├── app/                       Application shell — composition root only
│   ├── App.jsx                ErrorBoundary → providers → router
│   ├── providers/             Cross-cutting context
│   │   ├── AppProviders.jsx   Composes router + theme + booking
│   │   ├── ThemeProvider.jsx  light | dark | system → <html data-theme>
│   │   └── BookingProvider.jsx  Lets any component open the booking dialog pre-filled
│   └── router/
│       ├── AppRouter.jsx      Route table; home eager, everything else lazy
│       ├── RouteFallback.jsx  Suspense fallback
│       └── paths.js           Central path table — import instead of hardcoding
│
├── components/                Presentational, feature-agnostic
│   ├── ui/                    Primitives: Button, Card, Badge, Field, Input,
│   │                          Textarea, Select, Modal, Spinner
│   ├── layout/                Chrome: RootLayout, Navbar, MobileMenu, Footer,
│   │                          Container, Section, Logo, ThemeToggle
│   └── common/                Reveal, SectionHeading, Seo, ScrollToTop,
│                              PageTransition, ErrorBoundary, TechLogo
│
├── features/                  Self-contained verticals; each owns its components,
│   │                          hooks, and API calls
│   ├── hero/                  Animated landing section (see below)
│   ├── services/              Service grid + icon map
│   ├── projects/              Card, grid, filter, useProjectFilter
│   ├── booking/               The main interactive feature
│   │   ├── api/               bookingApi — real fetch or deterministic mock
│   │   ├── components/        Type toggle, step indicator, slot picker,
│   │   │                      project/contact steps, success screen, form
│   │   ├── hooks/             useBookingForm (steps + validation + submit),
│   │   │                      useAvailability
│   │   ├── validation.js      Per-step rules and payload shaping
│   │   ├── BookingDialog.jsx  Globally mounted modal
│   │   └── BookingSection.jsx Full-page version used by /book
│   ├── process/               Scroll-drawn four-step timeline
│   ├── testimonials/
│   └── contact/               Closing CTA band + FAQ accordion
│
├── pages/                     Route components — layout and composition only
│   HomePage, ProjectsPage, ProjectDetailPage, ServicesPage,
│   BookingPage, AboutPage, NotFoundPage
│
├── data/                      Content as data: projects, services, process,
│                              testimonials, faqs, booking options, tech logos
├── constants/                 site.js (identity, stats, tech list), navigation.js
├── hooks/                     useMediaQuery, usePrefersReducedMotion,
│                              useScrollPosition, useLockBodyScroll,
│                              useLocalStorage, useEscapeKey
├── lib/                       cn, format, animations (shared variants), api client
├── styles/                    index.css (Tailwind theme + keyframes), theme.css (tokens)
└── main.jsx
```

### Import aliases

Configured in `vite.config.js` and mirrored in `jsconfig.json` for editor support:

`@/` `@app/` `@components/` `@features/` `@hooks/` `@lib/` `@data/` `@constants/` `@styles/`

The bare `@` alias is listed **last** — alias entries match as prefixes in order, so a
leading `@` would otherwise swallow `@app`, `@lib`, and the rest.

## Hero animation

The hero is a **full-bleed dark panel**, inset from the viewport edges, rounded, and slid
up under the fixed nav (`-mt-[var(--nav-h)]`) so the nav pill floats inside it.

- The panel is dark in **both themes** — it is a brand surface, not a themed one.
- The background is a custom raw-WebGL fragment shader rendered as one fullscreen quad.
  Multi-octave FBM, two-stage domain warping, procedural refraction, and aspect-aware
  light masses create a slow cobalt liquid field without textures or scene dependencies.
- Pointer input is damped outside React and becomes a localized magnetic force with a
  short velocity memory. Reduced-motion mode renders one static premium frame; mobile
  compiles fewer FBM octaves and uses a lower effective resolution.
- A matching CSS composition remains underneath the canvas for first paint, WebGL
  failure, and context loss. The canvas is sized from the panel via `ResizeObserver`,
  clipped by the existing rounded container, and paused when hidden or off-screen.
- Content: display headline, a monospace strapline, centred CTAs, and a right-aligned
  monospace meta rail (availability / location / contact). The rail is deliberately
  qualitative — the reference it is modelled on shows live download counters, and
  inventing equivalents here would just be fabricated proof again.

The logo ticker sits **below** the panel, on the page background. It cannot go on the
panel: `TechLogo` colours each mark against the *page* theme, so black marks like Vercel
and Next.js would vanish on the dark surface.

### The nav pill has two independent states

`Navbar` is a floating pill with two states that deliberately change at different moments:

| State    | Driver                          | Effect                                            |
| -------- | ------------------------------- | ------------------------------------------------- |
| `raised` | `useScrollPosition(48)`         | At rest on `/` the pill sits low inside the hero panel, then glides up and docks the moment you scroll. |
| `onDark` | `useScrolledPastViewport(0.85)` | Light-on-dark styling for as long as the pill is over the dark panel — roughly a full viewport of scrolling. |

Both can be true at once: docked at the top but still over the panel. Splitting them is the
point — docking has to feel immediate, while the colour must not flip until the brand
surface has actually gone, or the pill turns invisible against it.

The travel is a `translate-y`, not a padding change, so it stays on the compositor.
`raised` is scoped to `/` only; on inner pages the pill is always docked, because there is
no panel to sit inside and it would overlap the page's first content. The `<header>` is
`pointer-events-none` with the pill `pointer-events-auto`, so the empty band beside the
pill does not swallow clicks on the hero. `Logo` and `ThemeToggle` take an `onDark` prop.

## Technology ticker

`HeroMarquee` renders 26 pills, each with the real brand mark in its official colour.

Logo paths and hexes come from [Simple Icons](https://simpleicons.org) (CC0) but are
**inlined into `src/data/tech.js`** rather than imported at runtime — the package ships
3,400+ icons, and vendoring the 26 we use keeps the dependency list and the bundle small.
Each entry is a single monochrome 24×24 outline, so one `fill` colours the whole mark.

`readableBrandColor()` guards legibility: marks that are near-black (Next.js, Vercel,
Expo, Kafka, Ollama) would disappear on a dark page, and near-white ones on a light page,
so those swap to the theme's text colour by WCAG relative luminance. Every other brand
keeps its exact specified colour. This is why `ThemeProvider` holds the resolved theme in
state — logos colour themselves in JS and must re-render when the OS flips appearance.

AWS and OpenAI are deliberately absent: Simple Icons removed both at the trademark
holders' request, and shipping redrawn substitutes would be worse than omitting them.

## Booking flow

Three steps — **Engagement → Details → Contact** — then a server-confirmed success screen
with a reference.

- **Project branch**: service, budget range, timeline, description, optional repo link.
- **Meeting branch**: day strip (weekdays only, live slot counts), time grid with
  unavailable slots disabled, duration.

Validation is per-step and only surfaces after a field is touched or after an attempt to
advance. Dependent resets (picking a new day clears the time) go through `clearField`, so
the form never shows an error for something the user has not had the chance to fill in.

Deep links pre-fill and skip ahead: `/book?type=project&service=ai`.

## Theming

Tokens live as raw CSS custom properties in `styles/theme.css` and are mapped into
Tailwind through `@theme inline`, so utilities like `bg-surface` and `text-text-muted`
follow `<html data-theme>` at runtime with no rebuild and no flash.

## Accessibility notes

- Dialogs trap nothing they should not: focus moves in on open, returns to the trigger on
  close, Escape closes, and body scroll locks with scrollbar-width compensation.
- Segmented controls, slot pickers and the consent control expose proper
  `role`/`aria-checked` semantics.
- Errors are `role="alert"` and wired to their control via `aria-describedby`.
- Motion is suppressed under `prefers-reduced-motion`.
