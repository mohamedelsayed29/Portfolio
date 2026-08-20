/**
 * Single source of truth for services. Consumed by the services section, the
 * booking form's service picker, and the footer links — so `id` values are
 * stable and used as anchors (/services#backend) and query params (?service=ai).
 */
export const SERVICES = [
  {
    id: 'frontend',
    icon: 'Layers',
    title: 'Frontend Engineering',
    summary:
      'Interfaces that feel instant. Design systems, complex state, and animation that respects the user.',
    description:
      'We build production frontends in React and Next.js — accessible, fast on mid-range hardware, and typed end to end. Every project ships with a component library your team can keep building on.',
    deliverables: [
      'React / Next.js applications',
      'Design systems & component libraries',
      'Accessibility (WCAG 2.2 AA)',
      'Core Web Vitals optimisation',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Motion'],
    startingAt: 6000,
    timeline: '3–8 weeks',
    accent: '#55d6ff',
    art: {
      primary: '#55d6ff',
      secondary: '#4169ff',
      primaryRgb: '85 214 255',
      secondaryRgb: '65 105 255',
    },
  },
  {
    id: 'backend',
    icon: 'Server',
    title: 'Backend & APIs',
    summary:
      'Services that stay up. Clean data models, boring reliability, and infrastructure you can reason about.',
    description:
      'From the first schema to autoscaling in production: REST and GraphQL APIs, event pipelines, auth, payments, and the observability to know it all works at 3am.',
    deliverables: [
      'REST & GraphQL APIs',
      'Database design & migrations',
      'Auth, billing & integrations',
      'CI/CD, monitoring & alerting',
    ],
    stack: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    startingAt: 7500,
    timeline: '4–10 weeks',
    accent: '#8090ff',
    art: {
      primary: '#8090ff',
      secondary: '#3957d9',
      primaryRgb: '128 144 255',
      secondaryRgb: '57 87 217',
    },
  },
  {
    id: 'mobile',
    icon: 'Smartphone',
    title: 'Mobile Applications',
    summary:
      'iOS and Android apps that feel native because they behave like the platform, not like a website.',
    description:
      'Cross-platform with React Native when speed matters, fully native Swift or Kotlin when it does not. We handle the parts teams underestimate: offline state, push, deep links, and store review.',
    deliverables: [
      'React Native & native builds',
      'Offline-first data sync',
      'Push notifications & deep links',
      'App Store / Play submission',
    ],
    stack: ['React Native', 'Expo', 'Swift', 'Kotlin', 'Firebase'],
    startingAt: 9000,
    timeline: '6–14 weeks',
    accent: '#c383ff',
    art: {
      primary: '#c383ff',
      secondary: '#695cff',
      primaryRgb: '195 131 255',
      secondaryRgb: '105 92 255',
    },
  },
  {
    id: 'ai',
    icon: 'BrainCircuit',
    title: 'AI, LLM & Models',
    summary:
      'Agents, RAG and fine-tuned models wired into real products, with evals that prove they work.',
    description:
      'We ship AI features that survive contact with users: retrieval pipelines over your own data, tool-using agents, fine-tuned and distilled models, and the evaluation harness that keeps quality from drifting.',
    deliverables: [
      'RAG & semantic search',
      'Tool-using agents & workflows',
      'Fine-tuning & model distillation',
      'Eval suites, guardrails & cost control',
    ],
    stack: ['Claude', 'OpenAI', 'LangChain', 'PyTorch', 'pgvector', 'vLLM'],
    startingAt: 12000,
    timeline: '4–12 weeks',
    accent: '#5be9ff',
    art: {
      primary: '#5be9ff',
      secondary: '#936cff',
      primaryRgb: '91 233 255',
      secondaryRgb: '147 108 255',
    },
  },
  {
    id: 'bugfix',
    icon: 'Bug',
    title: 'Bug Fixing & Rescue',
    summary:
      'The build is broken, the release is Friday. We find the root cause, not the nearest symptom.',
    description:
      'Drop us into an unfamiliar codebase and we will reproduce, isolate and fix — then leave behind the regression test so it stays fixed. Also available as an ongoing retainer.',
    deliverables: [
      'Root-cause diagnosis',
      'Performance & memory profiling',
      'Regression test coverage',
      'Legacy refactors & upgrades',
    ],
    stack: ['Any stack', 'Profilers', 'Playwright', 'Sentry'],
    startingAt: 1500,
    timeline: '2 days – 3 weeks',
    accent: '#ff806f',
    art: {
      primary: '#ff806f',
      secondary: '#ffb055',
      primaryRgb: '255 128 111',
      secondaryRgb: '255 176 85',
    },
  },
  {
    id: 'solutions',
    icon: 'Compass',
    title: 'Software Solutions',
    summary:
      'Not sure what to build yet? We scope it, cost it, and hand you a plan you could give to anyone.',
    description:
      'Technical discovery, architecture review and delivery planning for teams at a fork in the road — replatform or refactor, build or buy, hire or outsource.',
    deliverables: [
      'Discovery & technical scoping',
      'Architecture review',
      'Build-vs-buy analysis',
      'Delivery roadmap & estimates',
    ],
    stack: ['Workshops', 'ADRs', 'Roadmaps', 'Prototypes'],
    startingAt: 2500,
    timeline: '1–3 weeks',
    accent: '#5ce2bd',
    art: {
      primary: '#5ce2bd',
      secondary: '#35a9e8',
      primaryRgb: '92 226 189',
      secondaryRgb: '53 169 232',
    },
  },
]

export const SERVICE_OPTIONS = SERVICES.map((service) => ({
  value: service.id,
  label: service.title,
}))

export const getServiceById = (id) => SERVICES.find((service) => service.id === id) ?? null
