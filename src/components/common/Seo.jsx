import { SITE } from '@constants/site'
import { buildRouteJsonLd, formatSeoTitle, getSeoForPath } from '@constants/seo'
import { useLocation } from 'react-router-dom'

/**
 * React 19 hoists <title>/<meta> rendered anywhere in the tree into <head>,
 * so no helmet dependency is needed.
 */
export function Seo({ title, description = SITE.description, image, jsonLd, noIndex = false }) {
  const location = useLocation()
  const routeSeo = getSeoForPath(location.pathname)
  const seoTitle = title ?? routeSeo.title
  const seoDescription = description === SITE.description ? routeSeo.description : description
  const fullTitle = formatSeoTitle(seoTitle)
  const canonicalUrl = `${SITE.url}${location.pathname === '/' ? '' : location.pathname}`
  const imageUrl = image?.startsWith('http') ? image : image ? `${SITE.url}${image}` : undefined
  const structuredData = jsonLd ?? buildRouteJsonLd(routeSeo)

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, '\\u003c')}
        </script>
      )}
    </>
  )
}
