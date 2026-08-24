import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SEO_ROUTES,
  buildRouteJsonLd,
  formatSeoTitle,
  getLanguageAlternates,
  localizedAbsoluteUrl,
} from '../src/constants/seo.js'
import { localize } from '../src/i18n/localize.js'
import { LANGUAGES, localizedPath } from '../src/i18n/routes.js'
import { SITE } from '../src/constants/site.js'

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const dist = join(root, 'dist')
const indexPath = join(dist, 'index.html')
const today = new Date().toISOString().slice(0, 10)

const template = await readFile(indexPath, 'utf8')

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const removeExistingSeo = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+name="robots"[^>]*>\s*/gi, '\n')
    .replace(/\s*<link\s+rel="canonical"[^>]*>\s*/gi, '\n')
    .replace(/\s*<link\s+rel="alternate"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, '\n')
    .replace(/\s*<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, '\n')
    .replace(/\s*<!-- static-seo:start -->[\s\S]*?<!-- static-seo:end -->\s*/gi, '\n')
    .replace(/\s*<noscript data-static-seo>[\s\S]*?<\/noscript>\s*/gi, '\n')

function staticSeoBlock(route, lang) {
  const title = formatSeoTitle(route.title, lang)
  const description = localize(route.description, lang)
  const canonical = localizedAbsoluteUrl(route.path, lang)
  const alternates = getLanguageAlternates(route.path)
  const image = route.image ? `${SITE.url}${route.image}` : `${SITE.url}/favicon.svg`
  const jsonLd = buildRouteJsonLd(route, lang)

  const tags = [
    '<!-- static-seo:start -->',
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="en" href="${alternates.en}" />`,
    `<link rel="alternate" hreflang="ar" href="${alternates.ar}" />`,
    `<link rel="alternate" hreflang="x-default" href="${alternates.xDefault}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:locale" content="${lang === 'ar' ? 'ar_EG' : 'en_US'}" />`,
    `<meta property="og:locale:alternate" content="${lang === 'ar' ? 'en_US' : 'ar_EG'}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ]

  if (jsonLd) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>`,
    )
  }

  tags.push('<!-- static-seo:end -->')
  return tags.map((tag) => `    ${tag}`).join('\n')
}

function noscriptBlock(route, lang) {
  const links = SEO_ROUTES.filter((item) => item.path !== route.path)
    .slice(0, 6)
    .map(
      (item) =>
        `<li><a href="${localizedPath(item.path, lang)}">${escapeHtml(localize(item.title, lang))}</a></li>`,
    )
    .join('')

  return `<noscript data-static-seo>
      <main>
        <h1>${escapeHtml(localize(route.title, lang))}</h1>
        <p>${escapeHtml(localize(route.description, lang))}</p>
        <nav aria-label="Main pages"><ul>${links}</ul></nav>
      </main>
    </noscript>`
}

function renderRoute(route, lang) {
  const cleaned = removeExistingSeo(template)
  return cleaned
    .replace(/<html\s+lang="[^"]*"(?:\s+dir="[^"]*")?>/i, `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace('</head>', `${staticSeoBlock(route, lang)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscriptBlock(route, lang)}`)
}

function outputPathForRoute(path, lang) {
  const localized = localizedPath(path, lang)
  if (localized === '/') return indexPath
  return join(dist, localized, 'index.html')
}

for (const lang of LANGUAGES) {
  for (const route of SEO_ROUTES) {
    const outputPath = outputPathForRoute(route.path, lang)
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, renderRoute(route, lang))
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGUAGES.flatMap((lang) =>
  SEO_ROUTES.map((route) => {
    const alternates = getLanguageAlternates(route.path)
    return `  <url>
    <loc>${localizedAbsoluteUrl(route.path, lang)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${alternates.en}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${alternates.ar}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${alternates.xDefault}" />
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  }),
).join('\n')}
</urlset>
`

await writeFile(join(dist, 'sitemap.xml'), sitemap)
console.log(`Prerendered ${SEO_ROUTES.length * LANGUAGES.length} SEO HTML routes.`)
