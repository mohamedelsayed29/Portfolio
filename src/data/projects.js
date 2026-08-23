/**
 * Portfolio entries. `image` is a real screenshot when we have one; `cover`
 * holds a CSS gradient and is what renders when we do not, so entries without
 * artwork still look deliberate rather than broken.
 */
export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All work' },
  { id: 'ai', label: 'AI & LLM' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'backend', label: 'Backend' },
]

export const PROJECTS = [
  {
    slug: 'bioreza-cosmetics',
    title: 'Bioreza',
    subtitle: 'Bilingual beauty storefront',
    category: 'web',
    year: 2026,
    client: 'Bioreza Cosmetics',
    featured: true,
    image: '/work/bioreza.jpg',
    cover: 'linear-gradient(135deg, #8a6a4f 0%, #c9a227 55%, #f3e7d8 100%)',
    summary:
      'A cosmetics storefront for the Egyptian market — 70 brands across 48 categories, in English and full right-to-left Arabic.',
    problem:
      'Beauty shopping in Egypt happens across scattered social pages and resellers, where prices move, ingredient lists are missing and authenticity is a guess. Bioreza needed a storefront of its own — one that reads as naturally in Arabic as it does in English, rather than an English site with translated labels bolted on.',
    approach:
      'A React storefront on Vite in front of a versioned REST API that owns the catalogue, brands, campaigns, cart and accounts, with product media served from S3-compatible object storage behind Cloudflare. Language is part of the URL: switching to Arabic flips the document to RTL and swaps the page titles and metadata, not just the body copy. Banners, categories and offers are content, so merchandising changes ship without a deploy.',
    outcome:
      'The catalogue runs 70 brands across 48 categories with offers, wishlists, customer accounts and secure checkout, and the team edits the storefront — banners, campaigns, arrivals — without touching the code.',
    metrics: [
      { value: '70', label: 'Brands in catalogue' },
      { value: '48', label: 'Product categories' },
      { value: 'EN / AR', label: 'Bilingual, full RTL' },
    ],
    stack: ['React', 'Vite', 'REST API', 'Cloudflare', 'S3 storage'],
    services: ['frontend', 'backend'],
    href: 'https://bioreza.com',
  },
  {
    slug: 'bright-smile-smart',
    title: 'Bright Smile',
    subtitle: 'Dental clinic & patient app',
    category: 'mobile',
    year: 2025,
    client: 'Bright Smile Smart System',
    featured: true,
    image: '/work/bright-smile.jpg',
    cover: 'linear-gradient(135deg, #2db2a8 0%, #14766f 55%, #588cff 100%)',
    summary:
      'A dental practice system in two halves: patients book, pay and follow their treatment plan, while the clinic runs the schedule and the files — with a model assisting diagnosis.',
    problem:
      'The practice needed one system for both sides of the counter: patients who want to book, pay and follow a treatment plan from their phone, and a clinic whose appointments, patient records and billing lived in separate places.',
    approach:
      'A single Python service owns the domain — scheduling, patient records, invoicing and the diagnosis model — and both sides of the app talk to it through one REST API. Roles decide what each account sees: a patient gets their own appointments, plan and invoices, a clinician gets the day and the full file. The model runs server-side behind the same API, which keeps the mobile client thin and the model updatable without shipping a new build.',
    outcome:
      'Delivered in 2025 as one product with two faces — booking and reminders, patient records, invoicing and model-assisted review — all served by a single backend the clinic can keep extending.',
    metrics: [
      { value: '2', label: 'Apps: patient & clinic' },
      { value: '4', label: 'Modules on one API' },
      { value: 'AI', label: 'Model-assisted diagnosis' },
    ],
    stack: ['Python', 'REST API', 'AI model', 'Cross-platform mobile'],
    services: ['mobile', 'ai', 'backend'],
  },
  {
    slug: 'atlas-rag-platform',
    title: 'Atlas',
    subtitle: 'Retrieval platform for legal teams',
    category: 'ai',
    year: 2026,
    client: 'Atlas Legal',
    featured: true,
    cover: 'linear-gradient(135deg, #0071e3 0%, #7f5af0 55%, #22d3ee 100%)',
    summary:
      'A retrieval layer over 4M contract pages, answering in under two seconds with citations lawyers actually trust.',
    problem:
      'Associates were spending nine hours a week searching precedent across three disconnected document stores, and the first vendor pilot hallucinated clause numbers.',
    approach:
      'We built a hybrid retrieval pipeline — BM25 alongside pgvector embeddings, reranked by a fine-tuned cross-encoder — and made every answer refuse to render without a verifiable span citation. An eval suite of 1,200 labelled questions gates every deploy.',
    outcome:
      'Search time dropped from nine hours to under one per associate per week, with a 94% citation-accuracy score held across six months of model updates.',
    metrics: [
      { value: '1.8s', label: 'Median answer time' },
      { value: '94%', label: 'Citation accuracy' },
      { value: '4M', label: 'Pages indexed' },
    ],
    stack: ['Python', 'FastAPI', 'pgvector', 'Claude', 'Next.js'],
    services: ['ai', 'backend'],
    href: 'https://example.com',
  },
  {
    slug: 'mkank',
    title: 'Mkank',
    subtitle: 'Compound management platform',
    category: 'mobile',
    year: 2026,
    client: 'Mkank',
    cardLabel: 'Residential compounds',
    featured: true,
    image: '/work/mkank.jpg',
    cover: 'linear-gradient(135deg, #10251b 0%, #274334 58%, #b89a55 100%)',
    summary:
      'One platform for residents, compound management and gate security, covering permits, payments, support, community services and real-time access control.',
    problem:
      'Resident services, management operations and gate decisions are tightly connected, but each role needs a different interface. Mkank brings permits, dues, documents, support, community activity and access records into one compound-aware system without exposing one role\'s data to another.',
    approach:
      'Three role-specific surfaces share the same live domain: an offline-friendly resident app, an administration dashboard, and a focused gate interface for QR scanning, visitor registration and entry decisions. Arabic RTL, English and Russian are supported alongside light and dark modes, with per-compound permissions and audit trails.',
    outcome:
      'Residents can handle access, payments and services from one app while management and security see the same updates in real time. The platform keeps buildings, units, people and operations isolated by compound and usable across connectivity conditions.',
    metrics: [
      { value: '3', label: 'Role-specific interfaces' },
      { value: 'AR / EN / RU', label: 'Languages with full RTL' },
      { value: 'Online / offline', label: 'Resident experience' },
    ],
    stack: ['Realtime', 'QR access', 'Offline-first', 'Arabic RTL'],
    stackLabel: 'Platform capabilities',
    services: ['frontend', 'mobile', 'backend'],
  },
  {
    slug: 'fitway',
    title: 'FitWay',
    subtitle: 'Multi-branch gym platform',
    category: 'mobile',
    year: 2026,
    client: 'FitWay',
    cardLabel: 'Multi-branch gyms',
    featured: true,
    image: '/work/fitway.jpg',
    cover: 'linear-gradient(135deg, #15161a 0%, #22262f 62%, #b7ff36 100%)',
    summary:
      'A multi-branch gym platform combining QR access, memberships, live occupancy, CRM, trainer bookings and real-time communication across web and mobile.',
    problem:
      'Multi-branch gyms need access control, memberships, CRM, coaching and member communication to agree in real time. FitWay unifies those workflows so a check-in, subscription state or booking is visible to the right role across every branch.',
    approach:
      'Django and DRF manage core workflows in PostgreSQL, MongoDB stores chat and comments, Redis supports caching and occupancy, and WebSockets carry live messages. React and TypeScript power web operations while Flutter serves members on mobile, all shipped with Docker and Swagger documentation.',
    outcome:
      'Owners and managers can run multiple branches, trainers can manage availability and conversations, and members can check in, see occupancy, book sessions and chat from the mobile app. Arabic RTL, English, and light and dark modes carry across web and mobile.',
    metrics: [
      { value: 'Multi-branch', label: 'Organization model' },
      { value: '4', label: 'Role-specific experiences' },
      { value: 'Web / mobile', label: 'Connected applications' },
    ],
    stack: [
      'Django',
      'WebSockets',
      'React',
      'Flutter',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'TypeScript',
      'Docker',
      'Swagger',
    ],
    services: ['frontend', 'mobile', 'backend'],
  },
  {
    slug: 'northwind-commerce',
    title: 'Northwind',
    subtitle: 'Headless commerce replatform',
    category: 'web',
    year: 2025,
    client: 'Northwind Supply',
    featured: false,
    cover: 'linear-gradient(135deg, #1d1d1f 0%, #3a3a3f 45%, #0071e3 100%)',
    summary:
      'Moved a 40k-SKU retailer off a decade-old monolith without a single hour of downtime.',
    problem:
      'Page loads averaged 6.4 seconds on mobile and the checkout abandoned 71% of carts. Every merchandising change needed an engineer.',
    approach:
      'A strangler-fig migration: we put Next.js in front of the legacy system, moved routes across one category at a time, and handed merchandising to the business through a headless CMS.',
    outcome:
      'Largest Contentful Paint fell to 1.1s, checkout abandonment dropped 23 points, and the merchandising team now ships changes without engineering.',
    metrics: [
      { value: '1.1s', label: 'LCP on mobile' },
      { value: '+38%', label: 'Mobile conversion' },
      { value: '0h', label: 'Downtime migrating' },
    ],
    stack: ['Next.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Vercel'],
    services: ['frontend', 'backend'],
    href: 'https://example.com',
  },
  {
    slug: 'pulse-health',
    title: 'Pulse',
    subtitle: 'Clinical companion app',
    category: 'mobile',
    year: 2025,
    client: 'Pulse Health',
    featured: false,
    cover: 'linear-gradient(135deg, #ff5c8a 0%, #ff9f0a 100%)',
    summary:
      'An offline-first iOS and Android app used on ward rounds where the wifi does not reach.',
    problem:
      'Clinicians were writing observations on paper because the existing app lost data whenever it dropped signal in the building basement.',
    approach:
      'React Native with a local-first CRDT store that syncs opportunistically, plus biometric lock and a strict audit trail for HIPAA compliance.',
    outcome:
      'Zero data-loss incidents in eighteen months, and a 4.8 rating across both stores from 12,000 clinical users.',
    metrics: [
      { value: '4.8★', label: 'Store rating' },
      { value: '12k', label: 'Daily clinicians' },
      { value: '0', label: 'Data-loss incidents' },
    ],
    stack: ['React Native', 'Expo', 'SQLite', 'Node.js', 'AWS'],
    services: ['mobile', 'backend'],
    href: 'https://example.com',
  },
  {
    slug: 'vertex-ledger',
    title: 'Vertex',
    subtitle: 'Real-time settlement engine',
    category: 'backend',
    year: 2024,
    client: 'Vertex Payments',
    featured: false,
    cover: 'linear-gradient(135deg, #30d158 0%, #0071e3 100%)',
    summary:
      'A double-entry ledger clearing 40,000 transactions a second without losing a cent.',
    problem:
      'Nightly batch settlement meant merchants waited up to 36 hours for funds, and reconciliation errors took days to trace.',
    approach:
      'Event-sourced ledger on Kafka with deterministic replay, idempotent writes, and a reconciliation service that proves the books balance on every commit.',
    outcome:
      'Settlement moved from 36 hours to near-instant, and reconciliation disputes fell by 91%.',
    metrics: [
      { value: '40k/s', label: 'Peak throughput' },
      { value: '99.99%', label: 'Uptime' },
      { value: '−91%', label: 'Reconciliation disputes' },
    ],
    stack: ['Go', 'Kafka', 'PostgreSQL', 'Kubernetes', 'Grafana'],
    services: ['backend'],
    href: 'https://example.com',
  },
  {
    slug: 'lumen-studio',
    title: 'Lumen',
    subtitle: 'Generative design tool',
    category: 'ai',
    year: 2024,
    client: 'Lumen Labs',
    featured: false,
    cover: 'linear-gradient(135deg, #7f5af0 0%, #ff5c8a 100%)',
    summary:
      'A canvas where designers direct a fine-tuned diffusion model instead of fighting a prompt box.',
    problem:
      'Their existing tool produced striking one-off images that never matched the brand, so nothing reached production.',
    approach:
      'We distilled a brand-specific LoRA from 3,000 approved assets and built a layered canvas where every generation is constrained by the designer, not the prompt.',
    outcome:
      'Concept-to-approval dropped from four days to six hours, with 80% of output passing brand review first time.',
    metrics: [
      { value: '6h', label: 'Concept to approval' },
      { value: '80%', label: 'First-pass approval' },
      { value: '3k', label: 'Training assets' },
    ],
    stack: ['PyTorch', 'Diffusers', 'React', 'WebGL', 'Modal'],
    services: ['ai', 'frontend'],
    href: 'https://example.com',
  },
  {
    slug: 'harbor-rescue',
    title: 'Harbor',
    subtitle: 'Production rescue engagement',
    category: 'web',
    year: 2024,
    client: 'Harbor Logistics',
    featured: false,
    cover: 'linear-gradient(135deg, #ff9f0a 0%, #d70015 100%)',
    summary:
      'Nine weeks of outages, traced to one unindexed join. Then eleven more fixes nobody had found.',
    problem:
      'A logistics dashboard collapsed under load every Monday morning, and the original team had left no tests and no documentation.',
    approach:
      'We reproduced the failure under load, profiled it to a missing composite index, then spent the remaining sprint writing the regression suite that caught eleven further latent bugs.',
    outcome:
      'p99 latency fell from 14 seconds to 340ms, and the Monday incident has not recurred in two years.',
    metrics: [
      { value: '340ms', label: 'p99 latency' },
      { value: '12', label: 'Root causes fixed' },
      { value: '4 days', label: 'To first fix' },
    ],
    stack: ['PostgreSQL', 'Node.js', 'Playwright', 'Sentry'],
    services: ['bugfix', 'backend'],
    href: 'https://example.com',
  },
]

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured)

export const getProjectBySlug = (slug) => PROJECTS.find((project) => project.slug === slug) ?? null

export const getRelatedProjects = (slug, limit = 2) =>
  PROJECTS.filter((project) => project.slug !== slug).slice(0, limit)
