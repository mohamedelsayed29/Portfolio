import { ArrowRight } from 'lucide-react'
import { Container } from '@components/layout'
import { Seo, PageTransition } from '@components/common'
import { Button } from '@components/ui'
import { localizedPath, useLanguage, useStrings } from '@/i18n'

const STRINGS = {
  en: {
    seoTitle: 'Page not found',
    heading: 'This page moved on.',
    body: 'The link is broken or the page never existed. The work is still where you left it.',
    home: 'Back home',
    browse: 'Browse work',
  },
  ar: {
    seoTitle: 'الصفحة غير موجودة',
    heading: 'هذه الصفحة لم تعد هنا.',
    body: 'الرابط معطّل، أو أن الصفحة لم تكن موجودة أصلًا. أعمالنا ما زالت في مكانها.',
    home: 'العودة إلى الرئيسية',
    browse: 'تصفّح الأعمال',
  },
}

/** Button spreads its own props onto the icon; this wrapper only adds the RTL mirror. */
function HomeArrow(props) {
  return <ArrowRight {...props} className="rtl-flip" />
}

export default function NotFoundPage() {
  const { language } = useLanguage()
  const s = useStrings(STRINGS)

  return (
    <PageTransition>
      <Seo title={s.seoTitle} noIndex />

      <Container className="grid min-h-[70vh] place-items-center text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-mono text-[13px] tracking-[0.1em] text-text-subtle">404</p>
          <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] leading-tight font-semibold">
            {s.heading}
          </h1>
          <p className="max-w-[44ch] text-[17px] text-text-muted">{s.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to={localizedPath('/', language)} icon={HomeArrow}>
              {s.home}
            </Button>
            <Button to={localizedPath('/work', language)} variant="secondary">
              {s.browse}
            </Button>
          </div>
        </div>
      </Container>
    </PageTransition>
  )
}
