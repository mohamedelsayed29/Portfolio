import { cn } from '@lib/cn'

const WIDTHS = {
  narrow: 'max-w-[720px]',
  default: 'max-w-[1120px]',
  wide: 'max-w-[1320px]',
}

export function Container({ width = 'default', className, children, ...props }) {
  return (
    <div className={cn('mx-auto w-full px-6 sm:px-8', WIDTHS[width], className)} {...props}>
      {children}
    </div>
  )
}
