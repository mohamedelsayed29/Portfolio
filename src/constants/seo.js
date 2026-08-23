import { PROJECTS } from '../data/projects.js'
import { SITE } from './site.js'

const baseRoutes = [
  {
    path: '/',
    title: 'Software Development Company in Egypt',
    description:
      'HammerLoad is a software development company in Egypt building web apps, mobile apps, backend systems and AI solutions for ambitious teams.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/services',
    title: 'Web, Mobile, Backend and AI Development Services',
    description:
      'Explore HammerLoad services for frontend development, backend systems, mobile apps, AI/LLM solutions, bug fixing and technical discovery.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/work',
    title: 'Software Development Portfolio',
    description:
      'See HammerLoad case studies across web platforms, mobile apps, backend systems, realtime products and AI-assisted software.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/about',
    title: 'About HammerLoad',
    description:
      'Meet HammerLoad, a senior software studio in Cairo building reliable web, mobile, backend and AI products since 2017.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/book',
    title: 'Book a Software Development Call',
    description:
      'Book a call with HammerLoad to scope a web app, mobile app, backend system, AI solution or software rescue project.',
    priority: '0.6',
    changefreq: 'monthly',
  },
]

const projectRoutes = PROJECTS.map((project) => ({
  path: `/work/${project.slug}`,
  title: `${project.title} ${project.subtitle}`,
  description: project.summary,
  image: project.image,
  priority: '0.7',
  changefreq: 'monthly',
}))

export const SEO_ROUTES = [...baseRoutes, ...projectRoutes]

export const SEO_ROUTES_BY_PATH = Object.fromEntries(SEO_ROUTES.map((route) => [route.path, route]))

export function absoluteUrl(path = '/') {
  return `${SITE.url}${path === '/' ? '' : path}`
}

export function getSeoForPath(path = '/') {
  return SEO_ROUTES_BY_PATH[path] ?? SEO_ROUTES_BY_PATH['/']
}

export function formatSeoTitle(title) {
  return title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/favicon.svg`,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cairo',
      addressCountry: 'EG',
    },
    areaServed: ['Egypt', 'Middle East', 'Worldwide'],
    serviceType: [
      'Software development',
      'Web application development',
      'Mobile application development',
      'Backend development',
      'AI solutions',
    ],
    sameAs: SITE.socials.map((social) => social.href),
  }
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  }
}

export function buildRouteJsonLd(route) {
  if (route.path === '/') return [buildOrganizationJsonLd(), buildWebsiteJsonLd()]

  if (route.path === '/services') {
    return [
      buildOrganizationJsonLd(),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Software development services',
        provider: {
          '@type': 'Organization',
          name: SITE.name,
          url: SITE.url,
        },
        areaServed: ['Egypt', 'Middle East', 'Worldwide'],
        serviceType: 'Web, mobile, backend and AI software development',
      },
    ]
  }

  const project = PROJECTS.find((item) => route.path === `/work/${item.slug}`)
  if (project) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: `${project.title} - ${project.subtitle}`,
      description: project.summary,
      creator: {
        '@type': 'Organization',
        name: SITE.name,
        url: SITE.url,
      },
      url: absoluteUrl(route.path),
      image: project.image ? `${SITE.url}${project.image}` : undefined,
    }
  }

  return null
}
