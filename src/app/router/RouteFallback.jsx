import { Spinner } from '@components/ui'
import { useStrings } from '@/i18n'

const STRINGS = {
  en: { loading: 'Loading page' },
  ar: { loading: 'جارٍ تحميل الصفحة' },
}

export function RouteFallback() {
  const s = useStrings(STRINGS)

  return (
    <div className="grid min-h-[70vh] place-items-center">
      <Spinner size={26} label={s.loading} />
    </div>
  )
}
