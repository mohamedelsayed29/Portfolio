/**
 * Portfolio entries. `image` is a real screenshot when we have one; `cover`
 * holds a CSS gradient and is what renders when we do not, so entries without
 * artwork still look deliberate rather than broken.
 */
export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All work' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
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
    resources: {
      video: {
        label: 'Product walkthrough',
        href: 'https://youtu.be/wsxRj9YJRJM',
        embed: 'https://www.youtube-nocookie.com/embed/wsxRj9YJRJM',
      },
      pdf: {
        label: 'Feature deck',
        href: '/mkank_assets/mkank-features.pdf',
      },
    },
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
    resources: {
      video: {
        label: 'Product walkthrough',
        href: 'https://youtu.be/3k7gGTS5akY',
        embed: 'https://www.youtube-nocookie.com/embed/3k7gGTS5akY',
      },
      pdf: {
        label: 'Feature deck',
        href: '/fitway_assets/fitway_features_ar.pdf',
      },
    },
  },
]

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured)

export const getProjectBySlug = (slug) => PROJECTS.find((project) => project.slug === slug) ?? null

export const getRelatedProjects = (slug, limit = 2) =>
  PROJECTS.filter((project) => project.slug !== slug).slice(0, limit)
