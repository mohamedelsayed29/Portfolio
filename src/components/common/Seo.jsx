import { SITE } from '@constants/site'

/**
 * React 19 hoists <title>/<meta> rendered anywhere in the tree into <head>,
 * so no helmet dependency is needed.
 */
export function Seo({ title, description = SITE.description, image }) {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
