import { PROJECTS } from '../data/projects.js'
import { localize } from '../i18n/localize.js'
import { SITE } from './site.js'

/**
 * Route `title`/`description` follow the site-wide i18n convention:
 * `{ en, ar }` locale objects, collapsed with `localize(value, lang)`.
 * This module runs in Node (scripts/prerender-seo.mjs) — keep it pure.
 */
const baseRoutes = [
  {
    path: '/',
    title: {
      en: 'Software Development Company in Egypt',
      ar: 'شركة تطوير برمجيات في مصر',
    },
    description: {
      en: 'HammerLoad is a software development company in Egypt building web apps, mobile apps, backend systems and AI solutions for ambitious teams.',
      ar: 'HammerLoad شركة تطوير برمجيات في مصر تبني تطبيقات الويب والموبايل والأنظمة الخلفية وحلول الذكاء الاصطناعي للفرق الطموحة.',
    },
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/services',
    title: {
      en: 'Web, Mobile, Backend and AI Development Services',
      ar: 'خدمات تطوير الويب والموبايل والأنظمة الخلفية والذكاء الاصطناعي',
    },
    description: {
      en: 'Explore HammerLoad services for frontend development, backend systems, mobile apps, AI/LLM solutions, bug fixing and technical discovery.',
      ar: 'استكشف خدمات HammerLoad في هندسة الواجهات الأمامية والأنظمة الخلفية وتطبيقات الموبايل وحلول الذكاء الاصطناعي والنماذج اللغوية وإصلاح الأخطاء والاستكشاف التقني.',
    },
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/work',
    title: {
      en: 'Software Development Portfolio',
      ar: 'أعمالنا في تطوير البرمجيات',
    },
    description: {
      en: 'See HammerLoad case studies across web platforms, mobile apps, backend systems, realtime products and AI-assisted software.',
      ar: 'اطّلع على دراسات حالة HammerLoad عبر منصات الويب وتطبيقات الموبايل والأنظمة الخلفية والمنتجات اللحظية والبرمجيات المدعومة بالذكاء الاصطناعي.',
    },
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/about',
    title: {
      en: 'About HammerLoad',
      ar: 'من نحن',
    },
    description: {
      en: 'Meet HammerLoad, a senior software studio in Cairo building reliable web, mobile, backend and AI products since 2017.',
      ar: 'تعرّف على HammerLoad، استوديو برمجيات بخبرات رفيعة في القاهرة يبني منتجات ويب وموبايل وأنظمة خلفية وذكاء اصطناعي موثوقة منذ 2017.',
    },
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/book',
    title: {
      en: 'Book a Software Development Call',
      ar: 'احجز مكالمة لمشروعك البرمجي',
    },
    description: {
      en: 'Book a call with HammerLoad to scope a web app, mobile app, backend system, AI solution or software rescue project.',
      ar: 'احجز مكالمة مع HammerLoad لتحديد نطاق تطبيق ويب أو تطبيق موبايل أو نظام خلفي أو حلّ ذكاء اصطناعي أو مشروع إنقاذ برمجي.',
    },
    priority: '0.6',
    changefreq: 'monthly',
  },
]

const projectRoutes = PROJECTS.map((project) => ({
  path: `/work/${project.slug}`,
  title: {
    en: `${project.title} ${localize(project.subtitle, 'en')}`,
    ar: `${project.title} ${localize(project.subtitle, 'ar')}`,
  },
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

export function formatSeoTitle(title, lang = 'en') {
  const localizedTitle = localize(title, lang)
  return localizedTitle
    ? `${localizedTitle} | ${SITE.name}`
    : `${SITE.name} | ${localize(SITE.tagline, lang)}`
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

export function buildWebsiteJsonLd(lang = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: localize(SITE.description, lang),
  }
}

export function buildRouteJsonLd(route, lang = 'en') {
  if (route.path === '/') return [buildOrganizationJsonLd(), buildWebsiteJsonLd(lang)]

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
      name: `${project.title} - ${localize(project.subtitle, lang)}`,
      description: localize(project.summary, lang),
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
