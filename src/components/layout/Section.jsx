import { cn } from '@lib/cn'
import { Container } from './Container'

const SPACING = {
  sm: 'py-16 sm:py-20',
  md: 'py-24 sm:py-32',
  lg: 'py-32 sm:py-44',
}

/** Vertical rhythm lives here so every section breathes identically. */
export function Section({
  id,
  spacing = 'md',
  width = 'default',
  bleed = false,
  className,
  containerClassName,
  children,
  ...props
}) {
  return (
    <section id={id} className={cn(SPACING[spacing], 'scroll-mt-24', className)} {...props}>
      {bleed ? children : <Container width={width} className={containerClassName}>{children}</Container>}
    </section>
  )
}
