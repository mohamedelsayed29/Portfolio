import { useTheme } from '@app/providers'
import { readableBrandColor } from '@data/tech'
import { cn } from '@lib/cn'

/**
 * Renders one brand mark in its official colour, falling back to the theme's
 * text colour for marks that would otherwise disappear into the background.
 * Paths are 24x24 monochrome outlines, so a single `fill` colours the whole mark.
 */
export function TechLogo({ tech, size = 18, className, title }) {
  const { theme } = useTheme()
  const color = readableBrandColor(tech.hex, theme)

  return (
    <svg
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      className={cn('shrink-0 transition-colors duration-300', className)}
    >
      {title && <title>{title}</title>}
      <path d={tech.path} />
    </svg>
  )
}
