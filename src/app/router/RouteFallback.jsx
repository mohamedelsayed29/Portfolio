import { Spinner } from '@components/ui'

export function RouteFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <Spinner size={26} label="Loading page" />
    </div>
  )
}
